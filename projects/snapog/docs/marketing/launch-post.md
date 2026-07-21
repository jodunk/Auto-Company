# Imog — Launch Post

> Ready-to-post variants for Show HN, r/webdev / r/SideProject, and X. The copy below is the source of truth — if you paraphrase, keep the factual claims (free tier, watermark, paid-on-waitlist, prod URL) intact.

## Title (picked, not hedged)

**Show HN: Imog – OG images via a single GET, cached at the edge**

Alternate (if first gets flagged as generic): **Show HN: Imog – Your OG image is a URL, rendered at the edge**

---

## Variant A — Hacker News (Show HN)

> Body ~215 words. Technical, candid, no hype. Include the curl. Be honest about paid being waitlist-only.

Hey HN. I got tired of either hand-coding OG image templates in JSX or running a Puppeteer lambda that cold-started for ~800ms and cost more than it should. So I built Imog.

One GET request returns a 1200×630 PNG, rendered at the edge with Satori + resvg-wasm, cached globally on Cloudflare R2. No SDK, no framework lock-in, no headless browser.

```bash
curl "https://snapog.mixnology.workers.dev/og?title=My+Post&key=sk_YOUR_KEY"
```

Drop the URL straight into your `<meta property="og:image">`. Params: `title` (required), `description`, `domain`, `author`, `tag`, `template` (default|blog|article), `theme` (dark|light). Response headers `X-Cache` (HIT|MISS) and `X-SnapOG-Tier` tell you what happened.

**Free today:** email signup → instant API key → 100 images/month, no credit card. Free images carry a small watermark.

**Coming, not buyable yet:** $19 Pro (5k/mo, no watermark) and $49 Business (25k/mo, custom templates). Billing isn't built. If you want it, say so in a comment and I'll flag you when it lands.

**Try it without signing up — no key, no email:**
- Playground (live render, edit every field): https://snapog.mixnology.workers.dev/play
- Gallery (8 real edge renders): https://snapog.mixnology.workers.dev/gallery

**What's next:** more templates, font uploads, maybe a dashboard. Built in public.

Live: https://snapog.mixnology.workers.dev

Feedback welcome — especially cache hit rate, template quality, and what's actually missing for your stack.

---

## Variant B — r/webdev / r/SideProject (~125 words)

> Shorter, less HN-coded. Same facts.

Built a small API for OG images because I was tired of hand-coding them or running Puppeteer just to make a card.

One GET → 1200×630 PNG, rendered at the edge (Cloudflare Workers + Satori + resvg-wasm), cached globally on R2. Works with any static site, Next.js, Astro, SvelteKit — anywhere you can put a URL in an `og:image` tag.

```bash
curl "https://snapog.mixnology.workers.dev/og?title=Your+Title&key=sk_YOUR_KEY"
```

Params: `title`, `description`, `domain`, `author`, `tag`, `template`, `theme`.

**Free:** 100 images/month, email signup, no card. Small watermark on free tier.

**Paid ($19 / $49) is waitlist only** — billing isn't built yet. If you want it, comment and I'll flag you when it ships.

Try it first, no signup: https://snapog.mixnology.workers.dev/play · gallery: https://snapog.mixnology.workers.dev/gallery

Live: https://snapog.mixnology.workers.dev

What would make this useful for your blog or site?

---

## Variant C — X / tweet-sized lines (3)

> Post one, thread them, or use as replies. Each stands alone.

**1.**
Your OG image is a URL.

One GET request → 1200×630 PNG, rendered at the edge, cached globally on Cloudflare R2.

No Puppeteer. No JSX. No framework lock-in.

Try it live, no signup → https://snapog.mixnology.workers.dev/play

**2.**
Built Imog because I got tired of 800ms Puppeteer cold starts to make one image.

Now it's one curl. Free tier works today — 100 images/mo, no credit card.

Paid ($19/$49) is waitlist only until billing ships.

https://snapog.mixnology.workers.dev

**3.**
OG images as a URL. Drop it in your `<meta property="og:image">`, done.

Stack-agnostic. Edge-rendered. R2-cached.

Free: 100/mo, watermark.
Paid: $19 / $49 — waitlist, not buyable yet.

https://snapog.mixnology.workers.dev

---

## Posting checklist

- [ ] Title picked (not alternate) — commit on publish.
- [ ] Prod URL is `snapog.mixnology.workers.dev`, never `snapog.dev`.
- [ ] Lead with the no-signup try-it link (`/play` or `/gallery`) — HN/reddit converts on "try now," not "sign up." The signup key still works, it's just not the front door.
- [ ] Free tier claim is accurate: 100/mo, email signup, watermark.
- [ ] Paid tiers clearly marked as waitlist / coming soon, not buyable.
- [ ] `sk_YOUR_KEY` placeholder left in the curl — do NOT post a real key.
- [ ] Engage in comments within first 2 hours; every reply, no exceptions.
- [ ] Cross-post X lines 12–24h after HN, not simultaneously (HN algo rewards freshness window without seeming coordinated).

---

## What NOT to say (anywhere)

- "Revolutionary", "game-changing", "next-gen", "cutting-edge"
- "The Vercel OG killer" — we're not, and picking that fight loses
- "Unlimited" anything — there are limits, name them honestly
- "Enterprise" — not now, maybe not ever
- "AI-powered" — it isn't, and even if it were, don't lead with it
- Any claim about pricing that implies billing works today

---

*Last updated: 2026-07-21 (cycle 7: wired all variants to the no-signup `/play` + `/gallery` surfaces — they predate this post). Owner: marketing-godin. Review when: billing ships, new competitor lands, or HN/mod feedback suggests copy drift.*
