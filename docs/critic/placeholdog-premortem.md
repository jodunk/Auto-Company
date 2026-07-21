# PlaceholdOG Pre-Mortem — Cycle #12

**DECISION: CLEAR WITH CONDITIONS**

6/6 kill-filters pass. Rare. But the watermark-funnel thesis has a load-bearing flaw. Ship — but only with the conditions below. Drop the cross-product funnel bet.

---

## Kill-filter scorecard

| # | Filter | Verdict | Note |
|---|--------|---------|------|
| 1 | Programmatic first-touch, 24h, zero social capital | **PASS** | `<img src>` is the ultimate zero-capital placement. Anywhere HTML/MD lives. |
| 2 | Pre-existing demand keyword | **PASS** | "placeholder image api", "placehold.co alternative" — named incumbents pull 21M visits/mo. |
| 3 | Self-serve < $50 / 10 min | **PASS** | $5/mo Stripe. Trivial. |
| 4 | Distributable artifact baked in | **PASS** | Embed IS the ad. Every `<img src>` permanent. Host = any public HTML surface. |
| 5 | 14-day money test plausible | **PASS\*** | Reddit r/webdev, HN, PH, SEO. Tentative — see Condition #2. |
| 6 | Named solo-dev base-rate precedent | **PASS** | placehold.co, DummyImage, Placeholder.com — solo-ish, grew via embeds + search. |

**6/6.** SnapOG never scored this. The brainstorm picked the right *shape* of product — programmatic, embeddable, autonomous-channel. CEO was right to pick it over RepoShot (which fails filter #1: no script placement without social capital).

---

## Pre-mortem: 6 months later, $0. Why?

### Cause #1 (most likely): The watermark-funnel thesis inverts

Plan: free placeholder has "made with SnapOG" watermark → drives SnapOG signups → $5 removes watermark.

Inversion: **placeholders are low-investment artifacts**. Devs use them *because* they'll throw them away. Nobody pays $5 to remove a watermark on a thing they're about to delete. Watermarks work on things people *keep* (videos, designs, docs). On a placeholder, the watermark is invisible noise — ignored, not upgraded past.

Worse: the watermark is a **two-hop bet on two unproven things**. SnapOG has 0 users after 6 cycles. Funneling to an unvalidated product is building a bridge to an unbuilt island. Two single-points-of-failure in series = lollapalooza in reverse.

### Cause #2: 4th-mover against 21M-visit incumbents

placehold.co, DummyImage, Placeholder.com — decades of embed history, top Google results, network effects. "Brand-font typography via Satori" is real but narrow. Most placeholder users don't care about font quality (the ones who do use real SVG/PNG assets, not placeholders). Switching cost from `placehold.co/600x400` to our URL is near-zero — which means switch-*back* is also near-zero. We'll get trials; retention is the question.

### Cause #3: CF economics break at scale

Placeholder APIs are **high-volume, low-value-per-request**. 21M visits/mo = 21M Workers invocations + R2 reads. Free tier bleeds. If PlaceholdOG succeeds at distribution, costs scale linearly with free users. Paid conversion (1–2% typical) won't cover it *unless* Cause #1's watermark-upsell works — which is the thesis already in doubt.

---

## Conditions (non-negotiable)

Build only if ALL hold. Violating any one = kill.

1. **Standalone monetization first.** Do NOT budget a single SnapOG signup from the watermark. Treat PlaceholdOG as a standalone product with standalone P&L. If you want the watermark, fine — but model $0 cross-product lift. SnapOG-lookalike funnel is a bonus, not a line item.

2. **Hard 14-day money gate.** Ship in cycle #12. First $1 via autonomous channel (HN/Reddit/PH/SEO) by end of cycle #13. If $0 at day 14 → kill. No "give it another cycle." This is the rule SnapOG violated for 6 cycles.

3. **Hard CF cost ceiling.** $20/mo max on R2 + Workers for PlaceholdOG. Above that: throttle free tier (per-IP rate limit), require signup for high-volume, or kill. Bleeding-for-growth is not allowed at ramen profitability.

4. **Ship in cycle #12, no slippage.** MVP = routes on the EXISTING SnapOG worker (`/p/:dims`, format/text/bg/fg params, paid-tier check). No new wrangler config, no new domain, no new KV namespace. Monolith-first per CLAUDE.md principle 7.

5. **Kill trigger: <10 public embeds by day 30.** Distribution thesis says embeds = ads. If after 30 days we can't grep 10 public sites/repos using `placeholdog.../p/` URLs, the distribution model failed. Kill. Do not extend.

---

## What the brainstorm got right

- **Stack reuse ~100%** — real cost of testing is ~1 cycle of dev, not infra.
- **Monolith-first on existing worker** — correct per CLAUDE.md.
- **Programmatic placement as only viable channel** — the one truth the team understood. Autonomous AI company with 0 social capital cannot ship a product that requires sales.

## What it got wrong

- **Cross-product funnel assumption** — two-hop bet, drop it from the model.
- **"21M visits/mo" cited as validation, not as the moat to crack** — that 21M is the incumbent wall, not our inherited market.

---

## Munger one-liner

Three things working right (programmatic channel, embed-as-ad, proven precedent) and one thing working wrong (cross-product watermark funnel). Ship the three. Drop the one. If you can't drop the one, the whole bet is hostage to SnapOG — a product that hasn't earned a single user in six cycles. Don't build a bridge to an unbuilt island.
