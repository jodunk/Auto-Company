// SnapOG — Main Cloudflare Worker
// Routes: GET /og (image gen), GET / (landing), GET/POST /register, GET /dashboard

import { Hono } from 'hono';
import { generateOGImage, buildCacheKey } from './og/render';
import { placeholderSvg } from './og/templates';
import {
  landingPage,
  registerPage,
  keyCreatedPage,
  dashboardPage,
  errorPage,
  playgroundPage,
  galleryPage,
  placeholderLandingPage,
} from './dashboard/pages';
import type { ApiKey, Env, OGParams, Tier } from './types';
import { TIER_LIMITS } from './types';

const app = new Hono<{ Bindings: Env }>();

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateRawKey(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return 'sk_' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

// Validate an API key from request and return the DB row, or null
async function resolveApiKey(
  db: D1Database,
  rawKey: string | null
): Promise<ApiKey | null> {
  if (!rawKey) return null;
  const hash = await sha256(rawKey);
  const row = await db
    .prepare('SELECT * FROM api_keys WHERE key_hash = ?')
    .bind(hash)
    .first<ApiKey>();
  return row ?? null;
}

// Reset monthly usage if billing month rolled over
async function maybeResetUsage(db: D1Database, key: ApiKey): Promise<ApiKey> {
  const resetAt = new Date(key.usage_reset_at);
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  if (resetAt < thisMonth) {
    const newResetAt = thisMonth.toISOString();
    await db
      .prepare(
        'UPDATE api_keys SET usage_count = 0, usage_reset_at = ? WHERE id = ?'
      )
      .bind(newResetAt, key.id)
      .run();
    return { ...key, usage_count: 0, usage_reset_at: newResetAt };
  }
  return key;
}

// Increment usage counter and record event
async function recordUsage(
  db: D1Database,
  key: ApiKey,
  template: string,
  cacheHit: boolean
): Promise<void> {
  const eventId = crypto.randomUUID();
  await db.batch([
    db
      .prepare('UPDATE api_keys SET usage_count = usage_count + 1 WHERE id = ?')
      .bind(key.id),
    db
      .prepare(
        'INSERT INTO usage_events (id, api_key_id, template, cache_hit) VALUES (?, ?, ?, ?)'
      )
      .bind(eventId, key.id, template, cacheHit ? 1 : 0),
  ]);
}

// Render an OG image, serving from R2 cache on hit, storing on miss.
// Shared by /og (keyed, usage-counted) and /preview (keyless playground).
// ponytail: one render+cache path = one thing to fix; /og adds usage tracking on top.
async function renderOrCache(
  ogCache: R2Bucket,
  ctx: ExecutionContext,
  params: OGParams,
  watermark: boolean,
  prefix: 'og' | 'preview' | 'p'
): Promise<{ body: ArrayBuffer; hit: boolean }> {
  const cacheKey = await buildCacheKey(params, watermark);
  const r2Key = `${prefix}/${cacheKey}.png`;
  const cached = await ogCache.get(r2Key);
  if (cached) {
    return { body: await cached.arrayBuffer(), hit: true };
  }
  const imageResponse = await generateOGImage(params, watermark);
  const body = await imageResponse.arrayBuffer();
  ctx.waitUntil(
    ogCache.put(r2Key, body.slice(0), {
      httpMetadata: { contentType: 'image/png' },
      customMetadata: { template: params.template ?? 'default' },
    })
  );
  return { body, hit: false };
}

// Lightweight visit analytics on content pages. Fire-and-forget via waitUntil so
// the page render is never blocked on a DB write. Skips our own smoke UA
// (snapog-smoke) so deploy verification doesn't drown the "did a real user
// arrive" signal.
// ponytail: one D1 row per visit — fine at low volume; if write rate on a hot
// path ever matters, swap to CF Analytics Engine (writeDataPoint) without
// touching call sites.
async function recordVisit(db: D1Database, path: string, raw: Request): Promise<void> {
  const ua = raw.headers.get('user-agent') ?? '';
  if (ua.includes('snapog-smoke')) return;
  const referrer = raw.headers.get('referer');
  await db
    .prepare('INSERT INTO visits (id, path, country, referrer) VALUES (?, ?, ?, ?)')
    .bind(
      crypto.randomUUID(),
      path,
      raw.cf?.country ?? null,
      referrer ? referrer.slice(0, 200) : null
    )
    .run();
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// Landing page
app.get('/', c => {
  const host = new URL(c.req.url).host;
  c.executionCtx.waitUntil(recordVisit(c.env.DB, '/', c.req.raw));
  return htmlResponse(landingPage(host));
});

// Playground — keyless live preview; converts visitors to signups
app.get('/play', c => {
  const host = new URL(c.req.url).host;
  c.executionCtx.waitUntil(recordVisit(c.env.DB, '/play', c.req.raw));
  return htmlResponse(playgroundPage(host));
});

// Gallery — wall of live-rendered preset OG images; each deep-links into /play.
app.get('/gallery', c => {
  const host = new URL(c.req.url).host;
  c.executionCtx.waitUntil(recordVisit(c.env.DB, '/gallery', c.req.raw));
  return htmlResponse(galleryPage(host));
});

// ── Demo image (keyless showcase for landing hero; not usage-counted, R2-cached) ─
// ponytail: abuse = someone hotlinks ONE fixed PNG. Acceptable; Cache-Control keeps it cheap.
const DEMO_PARAMS: OGParams = {
  title: 'Ship OG images without the infra',
  description: 'One GET request. Instant PNG. Cached at the edge.',
  domain: 'indieblog.dev',
  author: 'Sam Builder',
  tag: 'Demo',
  template: 'default',
  theme: 'dark',
};
const DEMO_R2_KEY = 'demo/hero.png';

app.get('/demo-og', async c => {
  const cached = await c.env.OG_CACHE.get(DEMO_R2_KEY);
  if (cached) {
    return new Response(await cached.arrayBuffer(), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
        'X-Cache': 'HIT',
      },
    });
  }
  const resp = await generateOGImage(DEMO_PARAMS, false);
  const buf = await resp.arrayBuffer();
  c.executionCtx.waitUntil(
    c.env.OG_CACHE.put(DEMO_R2_KEY, buf.slice(0), {
      httpMetadata: { contentType: 'image/png' },
    })
  );
  return new Response(buf, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      'X-Cache': 'MISS',
    },
  });
});

// ── Playground preview (keyless, watermarked, R2-cached) ──────────────────────
// ponytail: same render+cache path as /og, no key, no usage counting. Abuse =
// filling R2 with random-title PNGs — bounded by CF per-request CPU limits +
// s-maxage. Add per-IP rate-limit only if combinatorial abuse is observed.
app.get('/preview', async c => {
  const q = c.req.query();
  const title = (q['title'] ?? '').trim().slice(0, 120);
  if (!title) {
    return c.json({ error: 'title parameter is required' }, 400);
  }
  const params: OGParams = {
    title,
    description: (q['description'] ?? '').trim().slice(0, 200) || undefined,
    domain: (q['domain'] ?? '').trim().slice(0, 100) || undefined,
    author: (q['author'] ?? '').trim().slice(0, 80) || undefined,
    tag: (q['tag'] ?? '').trim().slice(0, 40) || undefined,
    theme: (q['theme'] === 'light' ? 'light' : 'dark') as 'dark' | 'light',
    template: (['blog', 'article'].includes(q['template'] ?? '')
      ? q['template']
      : 'default') as OGParams['template'],
  };
  const { body, hit } = await renderOrCache(c.env.OG_CACHE, c.executionCtx, params, true, 'preview');
  return new Response(body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      'X-Cache': hit ? 'HIT' : 'MISS',
    },
  });
});

// ── PlaceholdOG landing page — explains embed syntax + live preset gallery.
// Registered before /p/* so the exact match wins over the wildcard.
app.get('/p', c => {
  const host = new URL(c.req.url).host;
  c.executionCtx.waitUntil(recordVisit(c.env.DB, '/p', c.req.raw));
  return htmlResponse(placeholderLandingPage(host));
});

// ── PlaceholdOG — keyless, free, watermarked placeholder images ──────────────
// ponytail: reuses renderOrCache with prefix='p'. NO recordVisit on image hits —
// images are hot-linked, not page views; per-render D1 writes would drown analytics.
// CFO cache-defense: W/H quantized to multiples of 10, clamped to [40,2000],
// text capped at 60 chars — bounds combinatorial cache cardinality.
function parseDims(raw: string): { w: number; h: number } | null {
  const m = raw.match(/^(\d+)[xX](\d+)$/);
  let w: number, h: number;
  if (m) {
    w = parseInt(m[1], 10);
    h = parseInt(m[2], 10);
  } else if (/^\d+$/.test(raw)) {
    w = h = parseInt(raw, 10);
  } else {
    return null;
  }
  // Quantize to multiple of 10, then clamp to [40, 2000].
  const clamp = (n: number) => Math.max(40, Math.min(2000, Math.round(n / 10) * 10));
  return { w: clamp(w), h: clamp(h) };
}

// Matches /p/600x400, /p/600x400/png, /p/600x400.png, /p/600x400.svg,
// /p/600x400/svg, /p/200 (square). SVG skips R2 (string build is ~0.1ms; edge
// Cache-Control distributes). PNG goes through renderOrCache as before.
app.get('/p/*', async c => {
  const rest = c.req.path.replace(/^\/p\//, '');
  const segments = rest.split('/');
  const format = segments.length > 1 ? segments[1] : undefined;
  if (format && !['png', 'svg'].includes(format)) {
    return c.json({ error: `format '${format}' not supported — MVP supports png | svg` }, 400);
  }
  // Strip optional .png/.svg suffix on :dims (e.g. /p/600x400.svg).
  const dimsRaw = segments[0].replace(/\.(png|svg)$/i, '');
  const isSvg = format === 'svg' || /\.svg$/i.test(segments[0]);
  const parsed = parseDims(dimsRaw);
  if (!parsed) {
    return c.json({ error: 'dims must be WxH (e.g. 600x400) or N (square)' }, 400);
  }
  const { w, h } = parsed;
  const q = c.req.query();
  const defaultText = `${w}×${h}`;
  const text = (q['text'] ?? '').trim().slice(0, 60) || defaultText;
  const params: OGParams = {
    title: text, // ponytail: title is required by OGParams type; text is the canonical field.
    template: 'placeholder',
    w,
    h,
    text,
    bg: (q['bg'] ?? '').trim() || undefined,
    fg: (q['fg'] ?? '').trim() || undefined,
  };
  if (isSvg) {
    const svg = placeholderSvg(params, true);
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
        'X-Cache': 'BYPASS',
      },
    });
  }
  const { body, hit } = await renderOrCache(
    c.env.OG_CACHE,
    c.executionCtx,
    params,
    true,
    'p'
  );
  return new Response(body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      'X-Cache': hit ? 'HIT' : 'MISS',
    },
  });
});

// ── OG image generation ────────────────────────────────────────────────────────
app.get('/og', async c => {
  const q = c.req.query();
  const rawKey = q['key'] ?? null;

  // Validate required param
  const title = (q['title'] ?? '').trim().slice(0, 120);
  if (!title) {
    return c.json({ error: 'title parameter is required' }, 400);
  }

  // Resolve API key (required)
  if (!rawKey) {
    return c.json({ error: 'key parameter is required. Get a free key at /register' }, 401);
  }
  let apiKey = await resolveApiKey(c.env.DB, rawKey);
  if (!apiKey) {
    return c.json({ error: 'Invalid API key' }, 401);
  }

  // Reset usage if month rolled
  apiKey = await maybeResetUsage(c.env.DB, apiKey);

  // Check rate limit
  if (apiKey.usage_count >= apiKey.monthly_limit) {
    return c.json(
      {
        error: 'Monthly image limit reached',
        tier: apiKey.tier,
        limit: apiKey.monthly_limit,
        upgrade_url: '/#pricing',
      },
      429
    );
  }

  const params: OGParams = {
    title,
    description: (q['description'] ?? '').trim().slice(0, 200) || undefined,
    domain: (q['domain'] ?? '').trim().slice(0, 100) || undefined,
    author: (q['author'] ?? '').trim().slice(0, 80) || undefined,
    tag: (q['tag'] ?? '').trim().slice(0, 40) || undefined,
    theme: (q['theme'] === 'light' ? 'light' : 'dark') as 'dark' | 'light',
    template: (['blog', 'article'].includes(q['template'] ?? '')
      ? q['template']
      : 'default') as OGParams['template'],
  };

  const watermark = apiKey.tier === 'free';
  const { body, hit } = await renderOrCache(
    c.env.OG_CACHE,
    c.executionCtx,
    params,
    watermark,
    'og'
  );

  // Track usage (counts toward limit) — awaited on hit, fire-and-forget on miss
  if (hit) {
    await recordUsage(c.env.DB, apiKey, params.template ?? 'default', true);
  } else {
    c.executionCtx.waitUntil(
      recordUsage(c.env.DB, apiKey, params.template ?? 'default', false)
    );
  }

  return new Response(body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      'X-Cache': hit ? 'HIT' : 'MISS',
      'X-SnapOG-Tier': apiKey.tier,
    },
  });
});

// ── Registration ──────────────────────────────────────────────────────────────
app.get('/register', c => {
  const tier = c.req.query('tier');
  return htmlResponse(registerPage(undefined, tier));
});

app.post('/register', async c => {
  let email: string, keyname: string, tier: string;
  try {
    const form = await c.req.formData();
    email = (form.get('email') as string ?? '').trim().toLowerCase();
    keyname = (form.get('keyname') as string ?? '').trim() || 'default';
    tier = (form.get('tier') as string ?? 'free').trim();
  } catch {
    return htmlResponse(registerPage('Invalid form data'), 400);
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return htmlResponse(registerPage('Please enter a valid email address', tier), 400);
  }

  // ponytail: no billing exists → never issue paid tiers via self-registration.
  // Paid plans are waitlist-only until Stripe lands. One guard at the root, not per-route.
  const safeTier: Tier = 'free';

  // Upsert user
  const userId = crypto.randomUUID();
  await c.env.DB
    .prepare(
      'INSERT INTO users (id, email) VALUES (?, ?) ON CONFLICT(email) DO NOTHING'
    )
    .bind(userId, email)
    .run();

  const user = await c.env.DB
    .prepare('SELECT id FROM users WHERE email = ?')
    .bind(email)
    .first<{ id: string }>();
  if (!user) {
    return htmlResponse(registerPage('Database error — please try again'), 500);
  }

  // Generate API key
  const rawKey = generateRawKey();
  const keyHash = await sha256(rawKey);
  const keyPrefix = rawKey.slice(0, 12);
  const keyId = crypto.randomUUID();
  const resetAt = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const monthlyLimit = TIER_LIMITS[safeTier];

  await c.env.DB
    .prepare(
      `INSERT INTO api_keys
         (id, user_id, name, key_prefix, key_hash, tier, monthly_limit, usage_reset_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(keyId, user.id, keyname, keyPrefix, keyHash, safeTier, monthlyLimit, resetAt)
    .run();

  const host = new URL(c.req.url).host;
  return htmlResponse(keyCreatedPage(rawKey, email, safeTier, host));
});

// ── Dashboard ─────────────────────────────────────────────────────────────────
app.get('/dashboard', async c => {
  const rawKey = c.req.query('key');
  if (!rawKey) {
    return htmlResponse(registerPage('Enter your API key or create a new one below'), 400);
  }

  const apiKey = await resolveApiKey(c.env.DB, rawKey);
  if (!apiKey) {
    return htmlResponse(errorPage(404, 'API key not found'), 404);
  }

  const refreshed = await maybeResetUsage(c.env.DB, apiKey);

  // Count recent events (last 24h)
  const yesterday = new Date(Date.now() - 86_400_000).toISOString();
  const recent = await c.env.DB
    .prepare(
      'SELECT COUNT(*) as cnt FROM usage_events WHERE api_key_id = ? AND generated_at > ?'
    )
    .bind(refreshed.id, yesterday)
    .first<{ cnt: number }>();

  const host = new URL(c.req.url).host;
  return htmlResponse(dashboardPage(refreshed, recent?.cnt ?? 0, host));
});

// ── Stats / ops ───────────────────────────────────────────────────────────────
// ponytail: unauth aggregate counts — fine while traffic volume isn't sensitive.
// Add an admin token (AUTH_SECRET) the moment counts carry commercial meaning.
app.get('/stats', async c => {
  const { results } = await c.env.DB.prepare(
    `SELECT path,
            COUNT(*) AS visits,
            SUM(CASE WHEN created_at > datetime('now','-1 day') THEN 1 ELSE 0 END) AS visits_24h
       FROM visits
       GROUP BY path
       ORDER BY visits DESC`
  ).all<{ path: string; visits: number; visits_24h: number }>();
  return c.json({ generated_at: new Date().toISOString(), paths: results });
});

app.get('/health', c => c.json({ ok: true, ts: new Date().toISOString() }));

// 404 fallback
app.notFound(_c => htmlResponse(errorPage(404, 'Page not found'), 404));
app.onError((err, _c) => {
  console.error('Unhandled error:', err);
  return htmlResponse(errorPage(500, 'Internal server error'), 500);
});

export default app;
