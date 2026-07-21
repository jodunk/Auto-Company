# SnapOG — Positioning

> Source of truth for how we describe SnapOG. If copy anywhere disagrees with this, this wins. Update when positioning actually shifts, not per campaign.

## One-line positioning

**For** indie hackers, dev-blog authors, and OSS maintainers **who** want per-page OG images without standing up Puppeteer or hand-coding JSX templates, **SnapOG is** an OG image API **that** returns a 1200×630 PNG from a single GET request, rendered at the edge and cached globally — **unlike** anything else, your OG image is just a URL.

## The hook (one sentence, repeat it until you're sick of it)

> **Your OG image is a URL.**

Everything else flows from this. If a piece of copy doesn't ultimately ladder back to "it's a URL, not a pipeline," cut it.

## Differentiation pillars

### 1. vs Vercel OG (`@vercel/og`)
- **Their model:** Write JSX, ship a function, lock into Vercel's runtime.
- **Our model:** Write a URL. Any stack, any host, any framework.
- **One-liner:** "Vercel OG is a component. SnapOG is a URL."
- **Where we lose honestly:** If you're already all-in on Next.js + Vercel, `@vercel/og` is more flexible for dynamic layouts. We're not chasing that.

### 2. vs Puppeteer / headless-browser services
- **Their model:** Boot Chromium in a lambda, screenshot HTML, pay for cold starts (~500–1000ms, $$ memory).
- **Our model:** Satori (layout) + resvg-wasm (render) at the edge, R2-cached after first hit.
- **One-liner:** "Puppeteer is a browser. SnapOG is a function."
- **Where we lose honestly:** Arbitrary HTML/CSS won't render pixel-perfect. We support the OG-card subset well. Don't pitch us as a general HTML-to-image tool.

### 3. vs Placid / Robolly / Cloudinary OG
- **Their model:** Visual template designer, monthly subscription ($29–$99+), built for marketing teams.
- **Our model:** URL-driven, developer-first, free tier covers most personal blogs.
- **One-liner:** "Placid is a designer. SnapOG is an API."
- **Where we lose honestly:** No drag-and-drop editor, limited template customization. Marketing teams should pick Placid.

## Alternate taglines (5)

1. **Your OG image is a URL.** ← current primary
2. One GET. One image. Globally cached.
3. OG images without the Puppeteer tax.
4. Stop hand-coding OG templates. Call a URL.
5. From `<meta>` tag to PNG in one request.

## Anti-positioning (what SnapOG is NOT)

- **Not a visual template designer.** No drag-and-drop, no WYSIWYG. This is an API.
- **Not a general HTML-to-image API.** It renders OG cards, not arbitrary web pages.
- **Not framework-specific.** Next.js, Astro, SvelteKit, Hugo, plain HTML — all work, none required.
- **Not an enterprise branding platform.** No brand kits, no approval workflows, no SSO. (Yet. Maybe never.)
- **Not a Vercel-OG replacement for React teams.** If you love JSX composition, stay there.
- **Not free forever for high-volume users.** Free tier has a watermark and a 100-image cap. Paid is the path for production scale — we just haven't built billing yet.

## Smallest Viable Audience (SVA)

Not "every developer with a blog." That's a market, not a tribe.

The SnapOG tribe is: **indie hackers shipping side projects on Cloudflare/Vercel/Netlify who have manually written an OG template once and swore while doing it.** They've felt the specific pain. They get the joke when you say "Puppeteer cold start." They tell other indie hackers.

Win this group first. They're the ones who'll post it on HN, not the marketing team at a Series B.

## What "remarkable" means here (the Purple Cow)

The remarkable thing is not the tech (Satori + resvg is a known recipe). It's the **URL-as-product** contract:

- No SDK to install.
- No function to deploy.
- No framework to adopt.
- No browser to boot.
- Just `https://snapog.mixnology.workers.dev/og?title=...&key=...` in your `<meta>`.

That's worth talking about because it removes a class of problem, not a feature. People share things that make old problems feel stupid. OG templates now feel stupid.

## Permission asset (what we're really building)

The free tier isn't a freemium funnel. It's a **permission asset**.

Every developer who signs up and drops our URL into their meta tag has given us:
1. Permission to email them about templates, updates, pricing.
2. A public artifact (their OG image) that other developers will see, inspect, and trace back to us.

This is why the watermark on free matters: it turns every free user into a distributed billboard, but only if the image still looks good enough that they're proud to ship it. The watermark is a feature, not a punishment — it's the cost of permission.

## Pricing signal (when billing ships)

| Tier | Price | Signal |
|------|-------|--------|
| Free | $0, 100/mo, watermark | "Try it, ship it, no risk." |
| Pro | $19/mo, 5k/mo, no watermark | "I run a real blog and want clean images." |
| Business | $49/mo, 25k/mo, custom templates | "This is infrastructure, not a toy." |

The gaps are deliberate. $19 is "indie no-brainer." $49 is "team line item." Anyone needing more should email us — that's a signal worth catching manually.

## What NOT to optimize

- **Not SEO.** We're an API. Developers don't google "OG image API" — they ask on HN, Discord, X.
- **Not viral growth hacks.** No referral loops, no gamification. The product spreads because the artifact spreads.
- **Not enterprise sales.** No SDR pipeline. If a big company wants this, they'll find it.

## Messaging do's and don'ts

| Do | Don't |
|----|-------|
| Say "URL" | Say "solution" |
| Say "GET request" | Say "API endpoint" |
| Say "edge" | Say "cloud-native" |
| Say "no Puppeteer" | Say "modern rendering" |
| Show the curl | Describe the curl |
| Name the stack (Workers, D1, R2) | Hide the stack |
| Mention watermark upfront | Bury the watermark in fine print |
| Say "waitlist" for paid | Imply paid is buyable today |

## Banned words

Revolutionary, game-changing, cutting-edge, next-gen, robust, scalable, enterprise-grade, seamless, leverage (as a verb), empower, unlock, supercharge.

If a word could appear in a parody of a B2B SaaS landing page, it doesn't belong here.

---

*Last updated: 2026-07-21. Owner: marketing-godin. Review when paid tiers ship or a competitor shifts.*
