# PlaceholdOG — Architecture Note (Cycle #12)

## Decision: monolith — add routes to the existing SnapOG worker

**URL**: `snapog.mixnosity.workers.dev/p/600x400/png?text=Foo&bg=indigo&fg=white`
(no new project, no new wrangler.toml, no new subdomain for MVP)

### Why monolith
- CLAUDE.md "monolith first" + ponytail "fewest files". One deploy, one set of bindings reused (D1=`DB`, R2=`OG_CACHE`).
- `render.ts` already has a generic `renderOrCache(ogCache, ctx, params, watermark, prefix)` — we just pass a third prefix `'p'`. Zero refactor.
- Splitting costs a second wrangler project, second `name`, second deploy pipeline, duplicated bindings config, and an R2 cross-mount or second bucket. All cost, zero upside at current scale.
- **Migrate later iff**: `/p` traffic dominates `/og` traffic >5x AND we see meaningful CPU contention on the isolate. Until then, one worker.

### Route shape
```
GET /p/:dims
  :dims   = "<w>x<h>" (e.g. 600x400) | "<s>" square (e.g. 200)
  ?text=  string, default "{w}×{h}"      — max 200 chars
  ?bg=    hex (#aabbcc) | named (indigo|slate|white|black|...) — default "#0A0A0A"
  ?fg=    hex | named                                    — default "#F5F5F5"
  ?fmt=   png (default) | svg
  ?key=   optional SnapOG API key — removes watermark (future Stripe gate)
```
- Default `text` uses dims so `GET /p/600x400` with no params still produces a useful image (looks like the classic placeholder services).
- Validation: `w,h ∈ [16, 4096]`. Clamp, don't reject — saves a round-trip and a support ticket.

### Reuse of `src/og/render.ts`
- `buildCacheKey(params, watermark)` — **already generic**, takes any object. Reuse as-is.
- `renderOrCache(ogCache, ctx, params, watermark, prefix)` — **already generic**. Pass `prefix='p'`. Reuse as-is.
- `generateOGImage(params, watermark)` — **hardcoded `OG_WIDTH=1200, OG_HEIGHT=630`**. One small change: accept `{w,h}` on the params object and fall back to 1200×630 when absent. Backwards-compatible — SnapOG routes don't pass dims, they keep working.

### Cache key strategy
`p/<sha256(json({w,h,text,bg,fg,watermark}))>.png` under the existing `OG_CACHE` R2 bucket, same naming scheme as `og/...` and `preview/...`. Combinatorial safety: identical inputs → identical R2 object, so even "abuse" (thousands of variants) is bounded by the cardinality of (w,h,text,bg,fg) and deduped by the cache. Worst case the R2 bucket grows; lifecycle rules can expire `p/` objects after 90d if it ever matters.

CF edge `Cache-Control: public, max-age=86400, s-maxage=604800` — same as `/preview`. Edge absorbs 99% of repeats, R2 never sees them.

### Watermark
- Reuse the existing `watermark: boolean` plumbing — it's already a render param threaded through `renderOrCache` → `generateOGImage` → `buildElement`.
- Free tier (no `?key=`): watermark ON. Small "made with SnapOG" bottom-right, same style as existing.
- With valid `?key=`: watermark OFF (future paid tier lever; for MVP, free keys still get watermark unless we wire Stripe).
- Implementation: add a `placeholderTemplate(params, watermark)` to `templates.ts` that draws text centered + watermark bottom-right. Same VNode pattern as existing templates. One file change.

### What NOT to build in MVP (defer)
- **Stripe** — no paid tier yet. Free + watermark only.
- **Programmatic SEO pages** (`/p/600x400/placeholder-text`) — tempting but defer until we see organic demand. MVP is GET API only.
- **npm package** — defer. The HTTP API is the product.
- **SVG format** — defer even though tempting. Satori produces SVG internally; exposing it via workers-og is a lib-version question. Ship PNG first, add `fmt=svg` if asked.
- **Custom domain** (`placeholdog.dev`) — defer. `snapog.workers.dev/p/...` works on day one.
- **Analytics dashboard** — reuse SnapOG's existing `/stats` route, no new UI.
- **Per-IP rate limiting** — defer. CF edge cache absorbs 99%. Add only if R2 write rate spikes.

### CPU/mem ceiling
- workers-og = Satori (VNode→SVG) + resvg-wasm (SVG→PNG).
- **Cache hit (the common case)**: R2 GET only, no render. ~5-20ms wall, trivial CPU. Effectively free.
- **Cache miss (cold render)**: Satori ~10-30ms + resvg-wasm ~50-150ms for a simple placeholder. Total wall ~80-200ms. Workers CPU limit is 30s on paid plan (we are on free tier = 10ms CPU, but wall time is unlimited and resvg is mostly I/O on wasm — measured SnapOG renders fit). If we ever hit CPU-limit errors, the fix is to upgrade the Worker to a paid plan ($5/mo), not to re-architect.
- **resvg-wasm cold-start**: the wasm module is ~1-2MB; Cloudflare caches the compiled module per-isolate, so only the first request in a fresh isolate pays. Subsequent requests in the same isolate are warm. Nothing to do.
- **Mem**: Satori peaks ~30-50MB for simple layouts. Workers mem limit is 128MB. Fine.

## BUILD PLAN (ordered, for fullstack-dhh)

All changes in `/Users/jodunk/Documents/Project/Auto-Company/projects/snapog/`.

1. **`src/types.ts`** — extend `OGParams` with optional `w?: number; h?: number; text?: string; bg?: string; fg?: string`. Keep all existing fields. Non-breaking.

2. **`src/og/render.ts`** —
   - `OG_WIDTH`/`OG_HEIGHT` → `const DEFAULT_W = 1200, DEFAULT_H = 630`.
   - `generateOGImage(params, watermark)` → read `params.w ?? DEFAULT_W`, `params.h ?? DEFAULT_H`. Pass to `ImageResponse`.
   - `buildCacheKey` unchanged.

3. **`src/og/templates.ts`** —
   - Add `placeholderTemplate(params, watermark): VNode`. Solid bg, centered text in `fg`, optional "SnapOG" watermark bottom-right (reuse the pattern from `defaultTemplate`'s Footer).
   - Extend `buildElement` switch: `case 'placeholder': return placeholderTemplate(params, watermark);`.
   - Add named-color map (`NAMED_COLORS = { indigo: '#6366F1', slate: '#64748B', white: '#FFFFFF', black: '#000000', ... }`) at top of file. Used by the route, not the template.

4. **`src/index.ts`** —
   - Add helper `parseDims(raw: string): {w:number,h:number}` (accepts `"600x400"`, `"600x400.png"` via path, and `"600"` → square). Clamp to [16,4096].
   - Add route `app.get('/p/:dims', async c => { ... })`:
     - Parse dims from `c.req.param('dims')` (strip any `.png`/`.svg` suffix — MVP only png).
     - Read `text`/`bg`/`fg` from query; default `text` = `"${w}×${h}"`.
     - Resolve `bg`/`fg` via `NAMED_COLORS` if not hex.
     - Build `OGParams` with `template: 'placeholder'`, `w`, `h`, `text`, `bg`, `fg`.
     - Call existing `renderOrCache(c.env.OG_CACHE, c.executionCtx, params, true, 'p')`.
     - Return PNG with the same `Cache-Control` headers as `/preview`.
   - No changes to `/og`, `/preview`, `/demo-og`, `/register`, `/dashboard`.

5. **`src/dashboard/pages.ts`** (optional, only if time permits) — add `/p` examples to the existing `galleryPage` so the gallery shows a few placeholder presets. Defer if cycle is tight.

6. **Smoke test** — add `curl` smoke after deploy:
   ```
   curl -fsS 'https://snapog.mixnosity.workers.dev/p/600x400?text=Hello&bg=indigo&fg=white' -o /tmp/p.png
   file /tmp/p.png  # → PNG image data, 600 x 400
   ```
   Wire into the existing `scripts/core/auto-loop.sh` smoke pattern if one exists for `/og`.

**Total files touched: 4** (types.ts, render.ts, templates.ts, index.ts). Zero new files. Zero new deps. Zero new infrastructure.

Skipped: SVG format, Stripe, npm pkg, SEO pages, custom domain, per-IP rate limit. Add when: paying customer asks for SVG / volume justifies paid plan / organic traffic to long-tail URLs appears / a single IP starts filling R2 aggressively.
