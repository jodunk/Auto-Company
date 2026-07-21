# PlaceholdOG — Unit Economics

**Date**: 2026-07-21 · **Cycle**: #12 · **Author**: CFO (Campbell)
**Thesis**: placeholder image API on CF Workers (reuses SnapOG stack). Free tier = watermarked placeholders. Paid $5/mo removes watermark. Distribution: embed-as-ad (placehold.co = 21M visits/mo).

## Pricing verified (Jul 2026)

- **Workers Free**: 100k req/day, **10ms CPU/invocation** (hard ceiling — workers-og renders at 50ms fail here).
- **Workers Paid ($5/mo)**: 10M req/mo + 30M CPU-ms/mo included. Overage: $0.30/M req, $0.02/M CPU-ms.
- **R2**: 10GB free storage, 1M Class A writes/mo free, then $4.50/M writes, $0.36/M reads.
- Source: [developers.cloudflare.com/workers/platform/pricing](https://developers.cloudflare.com/workers/platform/pricing/)

## Per-render cost model

- CPU: 50ms/render (workers-og / resvg-wasm baseline)
- Cache policy: `Cache-Control: public, max-age=31536000, immutable` → edge serves ~90% of repeats with zero Worker invocation
- Cache miss path: Worker + R2 write (first time) or R2 read (catalog exists)

## Renders/mo → infra cost (at 90% edge cache hit)

| Renders/mo | Worker invos | Req $ | CPU $ | R2 $ | **Total $/mo** |
|---:|---:|---:|---:|---:|---:|
| 50k | 5k | 0 | 0 | 0 | **5.00** |
| 100k | 10k | 0 | 0 | 0 | **5.00** |
| 500k | 50k | 0 | 0 | 0 | **5.00** |
| 1M | 100k | 0 | 0 | 0 | **5.00** |
| 5M | 500k | 0 | 0 | 0 | **5.00** |
| 10M | 1M | 0 | 0.40 | 0 | **5.40** |
| 50M | 5M | 0 | 4.40 | 18.00 | **27.40** |
| 100M | 10M | 0 | 9.40 | 40.50 | **54.90** |

**Infra stays under $30/mo up to 50M renders.** At placehold.co parity (21M visits) we land ~$15-20/mo. The model is dominated by R2 writes once you cross ~5M unique combos — minimize by aggressively normalizing URLs (canonical WxH+text+color sort).

## Breakeven paid conversion (target: $500/mo ramen)

At $5/mo plan, 100 paid subs = $500 MRR. Conversion needed by render volume:

| Free renders/mo | Conv. to hit $500 MRR |
|---:|---:|
| 100k | 0.100% |
| 500k | 0.020% |
| 1M | 0.010% |
| 5M | 0.002% |

Benchmark: watermarked-free → paid-removal dev tools convert **1-3%** (noip, imgix free tier, Cloudinary). We need **0.01%** at 1M renders. **Conversion bar is trivially low** — any plausible conversion works.

## Worst-case abuse (single bad actor, all cache misses)

- 100k uncached renders = 5M CPU-ms + 100k R2 writes. **All within paid quota. Incremental cost: $0.**
- To exhaust 30M CPU-ms in a month: ~600k uncached renders.
- At 60 req/min/IP (recommended hard limit): 86,400 req/day = 4.3M CPU-ms/day → quota dead in 7 days from a single IP.
- **Rate limit**: enforce 60 req/min/IP at edge (Cloudflare WAF rule). Add signed-URL gating for paid so the watermark-removal path can't be scraped.

## Key risks

1. **CPU per render drift**: if workers-og regresses to 150ms (we saw 50ms in SnapOG), CPU cost 3x. Monitor with `cf.workers.cpu_time` log.
2. **Unique-combo explosion**: `?w=123&h=456&text=...` has near-infinite cardinality. Cache hit could collapse to 30% if text varies per request. Mitigation: quantize W/H to multiples of 10, cap text length.
3. **Free CF tier trap**: 10ms CPU ceiling means we cannot offer a zero-cost dev mode on `workers.dev` — every render errors. Must pay $5/mo from minute one. Not a blocker ($5 is rounding error).

## Decision

**GO — ship free, day 1.**

- Infra cost is effectively flat ($5/mo) up to 5M renders. Even at 50M renders we're at $27/mo — less than two paid subs cover it.
- Breakeven conversion (0.01%) is 100x below industry benchmark (1-3%). We have two orders of magnitude of safety.
- Abuse vector is contained: 100k uncached attacks cost $0; per-IP rate limit + immutable edge caching neutralizes the rest.
- Asymmetric upside: embed-as-ad distribution is the real moat. 21M visits/mo is free marketing we cannot buy.
- The only hard gate: be on Workers **Paid** plan at launch (Free tier's 10ms CPU ceiling breaks workers-og). Budget $5/mo as fixed cost from day 0.

**Next**: sign off on shipping. Marketing-godin to draft the "free, fast, no-bs placeholders" positioning. Devops-hightower to wire the 60-req/min/IP WAF rule before public launch.
