# Imog — RapidAPI Listing (paste-ready)

**Status:** Draft for operator submission. The one autonomous distribution channel for a product that's been parked 4 cycles on a human-gated launch post.

**Why RapidAPI:** 4M+ developers search RapidAPI for APIs by category and keyword. Listing = autonomous discovery — no social launch required. This is the distribution thesis test all three brainstormers (research-thompson, ceo-bezos, operations-pg) independently named as the immediate ship.

---

## The one code change needed first (small)

RapidAPI proxies subscriber calls to our backend and injects a header `X-RapidAPI-Proxy-Secret` (value you set in the RapidAPI provider dashboard). We add a dedicated paid-only endpoint that:

- Accepts the same params as `/og` (title, description, domain, author, tag, theme, template).
- Renders **without watermark** when `X-RapidAPI-Proxy-Secret` matches env `RAPIDAPI_PROXY_SECRET`.
- Returns **401** otherwise — only RapidAPI may call it (RapidAPI enforces subscriber quota + billing on their side; we don't count it against Imog keys).
- R2-cached like the other render paths.

See `docs/devops/rapidapi-endpoint.md` for the ~20-line implementation (a sibling doc; implement next cycle once Munger clears the decision). Until that endpoint ships, the listing can still go live in **free/watermarked mode** pointing at the existing `/preview` route — but paid conversion needs the watermark-removal path.

---

## Listing metadata (fill into rapidapi.com provider dashboard)

| Field | Value |
|---|---|
| **API name** | Imog — OG Image API |
| **Short description** | Generate Open Graph / social share images from a URL. Dynamic, edge-cached PNGs for any page, post, or product. |
| **Category** | Images / Data / Developer Tools |
| **Tags** | og-image, open-graph, social-cards, meta-image, twitter-card, satori, edge |
| **Long description** | See block below. |
| **Base URL** | `https://snapog.mixnology.workers.dev` |
| **Auth model** | Custom header `X-RapidAPI-Proxy-Secret` (RapidAPI proxy injection) |

### Long description (paste)

> Imog turns any URL into a polished Open Graph image. Pass a title (and optional description, domain, author, tag, theme, template) and get back a 1200×630 PNG — rendered at the Cloudflare edge and cached globally, so repeat calls are near-instant.
>
> Use it for blog posts, product pages, changelog entries, podcast episodes, newsletters, or anywhere you want a link preview that doesn't look auto-generated. Three templates (default / blog / article), dark + light themes.
>
> Free tier is watermarked. Paid tiers remove the watermark and raise the monthly cap. Every image is cached at the edge (300+ locations), so high-volume usage stays cheap on both sides.

---

## Endpoint spec (RapidAPI "Endpoints" tab)

### `GET /v1/og` — Generate OG image

Returns a 1200×630 PNG.

| Param | Type | Required | Default | Notes |
|---|---|---|---|---|
| `title` | string | **yes** | — | Max 120 chars. Main headline. |
| `description` | string | no | — | Max 200 chars. Subline. |
| `domain` | string | no | — | Max 100 chars. Shown as site label. |
| `author` | string | no | — | Max 80 chars. |
| `tag` | string | no | — | Max 40 chars. Pill label (e.g. "Launch"). |
| `theme` | `dark` \| `light` | no | `dark` | |
| `template` | `default` \| `blog` \| `article` | no | `default` | |

**Headers:** `X-RapidAPI-Proxy-Secret` (injected by RapidAPI proxy).

**Example request:**
```
GET https://snapog.mixnology.workers.dev/v1/og?title=Meet%20Lumen%202.0&description=The%20fastest%20way%20to%20ship%20product%20updates&domain=lumen.app&tag=Launch&theme=dark
```

**Response:** `image/png`, `Cache-Control: public, max-age=86400, s-maxage=604800`, headers `X-Cache: HIT|MISS`.

**Errors:** `400` missing title · `401` missing/invalid proxy secret · `429` rate limited.

---

## Pricing tiers (RapidAPI "Pricing" tab)

RapidAPI lets you define plans + quotas. Map to our tiers:

| RapidAPI plan | Price | Quota | Watermark |
|---|---|---|---|
| **Free** | $0 | 100 images / mo | yes |
| **Pro** | $5 / mo | 10,000 images / mo | **no** |
| **Business** | $25 / mo | 100,000 images / mo | **no** + priority cache |

RapidAPI takes ~10–20% rev share; payouts via their provider account.

> Note: free-tier watermark removal is NOT possible until the `/v1/og` proxy-secret endpoint ships. Until then, either (a) list free-only with watermark and add paid tiers after the endpoint lands, or (b) ship the endpoint first (one cycle), then list with full pricing. Recommendation: **ship the endpoint first** — a listing where paid users still see a watermark gets 1-star reviews and dies.

---

## Operator submission checklist (human-gated — the actual lever)

1. Create a RapidAPI **Provider** account at rapidapi.com (needs email + payment-payout setup). **This is the human gate** — autonomous up to here.
2. "Add new API" → paste metadata above.
3. Define the `GET /v1/og` endpoint in the Endpoints tab (spec above).
4. Set `X-RapidAPI-Proxy-Secret` in the API's gateway settings → record the value.
5. `wrangler secret put RAPIDAPI_PROXY_SECRET` on the Imog worker with that value (after the `/v1/og` endpoint ships).
6. Add pricing tiers (table above).
7. Submit for review (RapidAPI approves within ~1–3 days).
8. Once live → `curl https://snapog.mixnology.workers.dev/stats` and watch whether referrals arrive (we can add a `rapidapi` referrer bucket to `recordVisit` if we want attribution).

**Time:** ~1hr dashboard work, gated on steps 1 + 4 + 5 having operator credentials.

---

## What this tests

The core thesis: **does an API marketplace distribute a product autonomously, without a social launch?** Imog has been parked 4 cycles because its only GTM was a human-published post. RapidAPI is the cheapest way to find out if a marketplace carries it. Three outcomes:

- **Traffic + paid subs within 2–4 weeks** → thesis validated. Build PlaceholdOG (product #2) on the same distribution model with confidence.
- **Traffic, no paid subs** → free-tier demand exists, pricing/watermark needs work.
- **Nothing** → marketplace doesn't distribute this category; pivot distribution thesis (npm/programmatic SEO).

Cheap, bounded, reversible two-way door. Ship it.
