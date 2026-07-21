# SnapOG

![SnapOG](https://snapog.mixnology.workers.dev/demo-og)

Generate stunning Open Graph images via API — hosted on Cloudflare Workers, cached globally on R2, sub-100ms on cache hit.

## Quick Start

```bash
# Get a free API key at https://snapog.mixnology.workers.dev/register, then:
curl "https://snapog.mixnology.workers.dev/og?title=My+Blog+Post&domain=myblog.com&key=sk_YOUR_KEY" \
  --output og.png && open og.png
```

## API

```
GET /og
  ?title=Your Page Title     # required, max 120 chars
  &key=sk_your_key           # required
  &description=Subtitle      # optional, max 200 chars
  &domain=yourdomain.com     # optional
  &author=Jane Doe           # optional
  &tag=Tutorial              # optional, shown as pill badge
  &template=default          # default | blog | article
  &theme=dark                # dark | light
```

Returns `image/png`, 1200×630.

Headers:
- `X-Cache: HIT|MISS` — whether served from R2 cache
- `X-SnapOG-Tier: free|pro|business`

## PlaceholdOG — keyless placeholder images

Same worker, separate route. **No API key, no signup.** The URL is the API.

```
GET /p/:dims          # /p/600x400  ·  /p/200 (square)
  ?text=Hello         # optional label (default: WxH), max 60 chars
  &bg=indigo          # named (indigo,slate,emerald,amber,rose,white,black,blue) or #hex
  &fg=white           # same palette
  &format=.png|.svg   # suffix or /png|/svg segment; default png
```

PNG by default. **Append `.svg` for crisp scalable vectors** (the differentiator vs raster placeholders) — rendered as a string, ~0.1ms, edge-cached, no R2.

```html
<img src="https://snapog.mixnology.workers.dev/p/600x400?text=Card&bg=indigo&fg=white" />
<img src="https://snapog.mixnology.workers.dev/p/600x400.svg?text=Crisp&bg=emerald" />
```

Landing page + live presets: <https://snapog.mixnology.workers.dev/p>

Free-tier placeholders carry a small "PlaceholdOG" watermark. Paid watermark removal ships once embed traction is real.


## HTML Integration

```html
<meta property="og:image"
      content="https://snapog.mixnology.workers.dev/og?title=YOUR_TITLE&key=YOUR_KEY" />
<meta property="og:image:width"  content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card"   content="summary_large_image" />
<meta name="twitter:image"  content="https://snapog.mixnology.workers.dev/og?title=YOUR_TITLE&key=YOUR_KEY" />
```

## Pricing

Free tier is live today. Paid tiers are **planned** — billing is not yet wired up; join the waitlist (see the in-app pricing section) and we'll email you when it launches.

| Tier | Price | Images/month | Status |
|------|-------|-------------|--------|
| Free | $0 | 100 | **Live** |
| Pro | $19/mo (planned) | 10,000 | Waitlist |
| Business | $49/mo (planned) | 100,000 | Waitlist |

Free tier images include a small "SnapOG" watermark.

## Local Development

### Prerequisites
- Node.js 18+, npm
- Wrangler (`npm install -g wrangler`)
- A Cloudflare account with Workers access

### Setup

```bash
cd projects/snapog
npm install

# 1. Create D1 database
wrangler d1 create snapog-db
# Copy the returned database_id into wrangler.toml [d1_databases]

# 2. Apply migrations locally
npm run db:local

# 3. Create R2 bucket (local R2 is simulated)
# No setup needed for local dev — wrangler simulates R2

# 4. Start dev server
npm run dev
```

Open http://127.0.0.1:8787

### Test

```bash
# Register a key via browser at http://127.0.0.1:8787/register
# Then test with:
API_KEY=sk_your_key bash sample/smoke-test.sh

# Or direct curl:
curl "http://127.0.0.1:8787/og?title=Hello+World&key=sk_your_key" --output og.png
```

### Typecheck

```bash
npm run typecheck
```

## Deployment

```bash
# 1. Create remote D1 database
wrangler d1 create snapog-db
# Update wrangler.toml with the database_id

# 2. Apply migrations to remote
npm run db:remote

# 3. Create R2 bucket
wrangler r2 bucket create snapog-og-cache

# 4. Deploy
wrangler deploy
```

## Tech Stack

- [Cloudflare Workers](https://workers.cloudflare.com/) — edge compute
- [Hono](https://hono.dev/) — HTTP framework
- [workers-og](https://github.com/nicholasgasior/workers-og) — OG image generation (Satori-based)
- [Cloudflare D1](https://developers.cloudflare.com/d1/) — SQLite for usage tracking
- [Cloudflare R2](https://developers.cloudflare.com/r2/) — image cache storage
