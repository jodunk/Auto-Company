// Imog — Dashboard & landing page HTML
// Aesthetic: "Carbon Terminal" — dark developer tool, amber accent, monospace-first

import type { ApiKey } from '../types';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #0A0A0A;
    --surface: #141414;
    --border:  #1F1F1F;
    --divider: #2A2A2A;
    --text-1:  #F5F5F5;
    --text-2:  #A3A3A3;
    --text-3:  #525252;
    --accent:  #F59E0B;
    --accent-dim: #92400E;
    --teal:    #14B8A6;
    --red:     #EF4444;
    --font-mono: 'JetBrains Mono', 'Consolas', monospace;
    --font-sans: 'DM Sans', system-ui, sans-serif;
    --r: 6px;
    --r-lg: 12px;
    --shadow: 0 0 0 1px var(--border);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text-1);
    font-family: var(--font-sans);
    font-size: 16px;
    line-height: 1.6;
    min-height: 100vh;
    /* Dot-grid background */
    background-image: radial-gradient(circle, #1F1F1F 1px, transparent 1px);
    background-size: 32px 32px;
  }

  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }

  /* Nav */
  .nav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 32px;
    background: rgba(10,10,10,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 18px;
    color: var(--text-1);
    letter-spacing: -0.02em;
  }
  .nav-logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 24px; align-items: center; }
  .nav-links a { color: var(--text-2); font-size: 14px; }
  .nav-links a:hover { color: var(--text-1); text-decoration: none; }
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    font-family: var(--font-mono); font-size: 13px; font-weight: 500;
    padding: 8px 20px; border-radius: var(--r);
    border: none; cursor: pointer; transition: all 0.15s;
    text-decoration: none;
  }
  .btn-primary { background: var(--accent); color: #000; }
  .btn-primary:hover { background: #FBBF24; text-decoration: none; }
  .btn-ghost { background: transparent; color: var(--text-2); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); text-decoration: none; }

  /* Container */
  .container { max-width: 900px; margin: 0 auto; padding: 0 24px; }
  .container-wide { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

  /* Hero */
  .hero { padding: 100px 0 72px; text-align: center; position: relative; }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-mono); font-size: 12px; color: var(--accent);
    letter-spacing: 0.1em; text-transform: uppercase;
    border: 1px solid var(--accent-dim); border-radius: 100px;
    padding: 4px 14px; margin-bottom: 28px;
  }
  .hero-eyebrow::before {
    content: ''; width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent); animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }
  .hero h1 {
    font-size: clamp(42px, 6vw, 72px);
    font-weight: 700; letter-spacing: -0.04em;
    line-height: 1.05;
    background: linear-gradient(135deg, #F5F5F5 0%, #A3A3A3 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 24px;
  }
  .hero h1 em {
    font-style: normal;
    background: linear-gradient(135deg, var(--accent), #FCD34D);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero-sub {
    font-size: 18px; color: var(--text-2); max-width: 560px; margin: 0 auto 40px;
    line-height: 1.65;
  }
  .hero-cta { display: flex; gap: 12px; justify-content: center; }

  /* OG Preview */
  .og-preview-wrap {
    position: relative; margin: 72px auto 0; max-width: 720px;
    border-radius: var(--r-lg); overflow: hidden;
    box-shadow: 0 0 0 1px var(--border), 0 40px 80px rgba(0,0,0,0.6);
  }
  .og-preview-wrap img {
    width: 100%; display: block;
    border-radius: var(--r-lg);
  }
  .og-preview-label {
    position: absolute; top: 12px; left: 12px;
    font-family: var(--font-mono); font-size: 11px; color: var(--text-3);
    background: var(--surface); border: 1px solid var(--border);
    padding: 4px 10px; border-radius: var(--r);
  }

  /* Section */
  .section { padding: 80px 0; }
  .section-title {
    font-family: var(--font-mono); font-size: 11px; font-weight: 500;
    color: var(--accent); letter-spacing: 0.12em; text-transform: uppercase;
    margin-bottom: 12px;
  }
  .section-h2 {
    font-size: 36px; font-weight: 700; letter-spacing: -0.025em;
    margin-bottom: 16px; line-height: 1.15;
  }
  .section-sub { font-size: 17px; color: var(--text-2); max-width: 480px; line-height: 1.6; }

  /* Code block */
  .code-block {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); overflow: hidden; margin-top: 32px;
  }
  .code-block-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 20px; border-bottom: 1px solid var(--border);
  }
  .code-block-lang {
    font-family: var(--font-mono); font-size: 12px; color: var(--text-3);
    letter-spacing: 0.06em;
  }
  .code-block-dots { display: flex; gap: 6px; }
  .dot { width: 10px; height: 10px; border-radius: 50%; }
  .dot-red { background: #FF5F57; }
  .dot-yellow { background: #FEBC2E; }
  .dot-green { background: #28C840; }
  .code-block pre {
    padding: 24px 20px; font-family: var(--font-mono); font-size: 13px;
    line-height: 1.7; color: var(--text-1); overflow-x: auto;
    white-space: pre;
  }
  .c-comment { color: var(--text-3); }
  .c-key { color: var(--teal); }
  .c-val { color: #86EFAC; }
  .c-str { color: #FCD34D; }
  .c-url { color: var(--accent); }

  /* API params table */
  .params-table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  .params-table th, .params-table td {
    padding: 12px 16px; text-align: left;
    border-bottom: 1px solid var(--border); font-size: 14px;
  }
  .params-table th {
    font-family: var(--font-mono); font-size: 11px; color: var(--text-3);
    letter-spacing: 0.08em; text-transform: uppercase;
  }
  .params-table td:first-child { font-family: var(--font-mono); color: var(--teal); }
  .params-table .required {
    font-family: var(--font-mono); font-size: 10px; color: var(--accent);
    border: 1px solid var(--accent-dim); border-radius: 3px; padding: 1px 6px;
  }
  .params-table .optional {
    font-family: var(--font-mono); font-size: 10px; color: var(--text-3);
    border: 1px solid var(--border); border-radius: 3px; padding: 1px 6px;
  }

  /* Pricing */
  .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 48px; }
  .pricing-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 32px;
    display: flex; flex-direction: column;
    transition: border-color 0.2s;
  }
  .pricing-card:hover { border-color: var(--accent); }
  .pricing-card.featured {
    border-color: var(--accent);
    background: linear-gradient(180deg, #1C1400 0%, var(--surface) 100%);
  }
  .pricing-tier {
    font-family: var(--font-mono); font-size: 11px; color: var(--text-3);
    letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 16px;
  }
  .pricing-tier-featured { color: var(--accent); }
  .pricing-price {
    font-size: 40px; font-weight: 700; letter-spacing: -0.03em;
    margin-bottom: 4px; line-height: 1;
  }
  .pricing-period { font-size: 14px; color: var(--text-2); margin-bottom: 24px; }
  .pricing-limit {
    font-family: var(--font-mono); font-size: 13px; color: var(--text-2);
    margin-bottom: 20px; padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }
  .pricing-features { list-style: none; flex: 1; }
  .pricing-features li {
    font-size: 14px; color: var(--text-2); padding: 6px 0;
    display: flex; gap: 8px; align-items: flex-start;
  }
  .pricing-features li::before { content: '→'; color: var(--accent); flex-shrink: 0; }
  .pricing-features li.dim::before { color: var(--text-3); }
  .pricing-features li.dim { color: var(--text-3); }
  .pricing-cta { margin-top: 28px; }

  /* Features grid */
  .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-top: 48px; }
  .feature-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 28px;
  }
  .feature-icon {
    font-family: var(--font-mono); font-size: 20px; color: var(--accent);
    margin-bottom: 16px; display: block;
  }
  .feature-card h3 { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
  .feature-card p { font-size: 14px; color: var(--text-2); line-height: 1.6; }

  /* Dashboard */
  .dash-layout { padding: 40px 0 80px; }
  .dash-header { margin-bottom: 40px; }
  .dash-header h1 { font-size: 26px; font-weight: 700; margin-bottom: 4px; letter-spacing: -0.02em; }
  .dash-header p { font-size: 14px; color: var(--text-2); }

  .dash-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
  .dash-grid-full { grid-column: 1 / -1; }

  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 28px;
  }
  .card-title {
    font-family: var(--font-mono); font-size: 11px; font-weight: 500;
    color: var(--text-3); letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 20px;
  }

  /* API key display */
  .api-key-display {
    display: flex; align-items: center; gap: 8px;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--r); padding: 12px 16px;
    font-family: var(--font-mono); font-size: 13px; color: var(--text-2);
    flex: 1;
  }
  .api-key-display .key-val { flex: 1; word-break: break-all; }
  .api-key-row { display: flex; gap: 8px; align-items: stretch; }

  /* Usage meter */
  .usage-bar-wrap {
    background: var(--bg); border-radius: 100px;
    height: 6px; margin: 12px 0 8px; overflow: hidden;
  }
  .usage-bar {
    height: 100%; border-radius: 100px;
    background: var(--accent);
    transition: width 0.6s ease;
  }
  .usage-bar.warn { background: #F97316; }
  .usage-bar.full { background: var(--red); }
  .usage-meta { display: flex; justify-content: space-between; font-size: 13px; }
  .usage-count { font-family: var(--font-mono); font-size: 28px; font-weight: 700; }
  .usage-limit { font-size: 13px; color: var(--text-3); }

  /* Tier badge */
  .tier-badge {
    display: inline-flex; align-items: center;
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em;
    text-transform: uppercase; padding: 3px 10px; border-radius: 100px;
  }
  .tier-free { background: #1C1C1C; color: var(--text-3); border: 1px solid var(--border); }
  .tier-pro { background: #1C1400; color: var(--accent); border: 1px solid var(--accent-dim); }
  .tier-business { background: #0A2A2A; color: var(--teal); border: 1px solid #115E59; }

  /* Register form */
  .form-group { margin-bottom: 20px; }
  .form-label { display: block; font-family: var(--font-mono); font-size: 12px; color: var(--text-2); margin-bottom: 8px; letter-spacing: 0.06em; }
  .form-input {
    width: 100%; padding: 12px 16px;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--r); font-family: var(--font-mono);
    font-size: 14px; color: var(--text-1);
    outline: none; transition: border-color 0.15s;
  }
  .form-input:focus { border-color: var(--accent); }
  .form-hint { font-size: 12px; color: var(--text-3); margin-top: 6px; }

  /* Alert */
  .alert { padding: 14px 18px; border-radius: var(--r); font-size: 14px; margin-bottom: 20px; }
  .alert-error { background: #1C0A0A; border: 1px solid #7F1D1D; color: #FCA5A5; }
  .alert-success { background: #052E16; border: 1px solid #14532D; color: #86EFAC; }

  /* Footer */
  .footer {
    border-top: 1px solid var(--border); padding: 32px 0;
    text-align: center; font-size: 13px; color: var(--text-3);
    font-family: var(--font-mono);
  }

  /* Playground */
  .play-hero { padding: 64px 0 28px; text-align: center; }
  .play-hero h1 {
    font-size: clamp(30px, 4vw, 46px); font-weight: 700;
    letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 14px;
  }
  .play-hero h1 em {
    font-style: normal;
    background: linear-gradient(135deg, var(--accent), #FCD34D);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .play-hero p { color: var(--text-2); max-width: 580px; margin: 0 auto; font-size: 16px; }
  .play-layout {
    display: grid; grid-template-columns: 5fr 7fr; gap: 28px;
    align-items: start; padding-bottom: 80px;
  }
  .play-controls .card { padding: 24px; }
  .play-field { margin-bottom: 16px; }
  .play-field label {
    display: block; font-family: var(--font-mono); font-size: 11px;
    color: var(--text-3); letter-spacing: 0.08em; text-transform: uppercase;
    margin-bottom: 8px;
  }
  .play-field input, .play-field textarea {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--r); font-family: var(--font-sans); font-size: 14px;
    color: var(--text-1); padding: 10px 14px; outline: none;
    transition: border-color 0.15s;
  }
  .play-field input:focus, .play-field textarea:focus { border-color: var(--accent); }
  .play-field textarea { resize: vertical; min-height: 60px; font-family: var(--font-mono); font-size: 13px; }
  .play-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .play-row .play-field { margin-bottom: 0; }
  .seg {
    display: flex; gap: 4px; background: var(--bg);
    border: 1px solid var(--border); border-radius: var(--r); padding: 4px;
  }
  .seg button {
    flex: 1; background: transparent; border: none; color: var(--text-2);
    font-family: var(--font-mono); font-size: 12px; padding: 8px 6px;
    border-radius: 4px; cursor: pointer; transition: all 0.15s;
    text-transform: capitalize;
  }
  .seg button:hover { color: var(--text-1); }
  .seg button.active { background: var(--accent); color: #000; }
  .preset-row { display: flex; flex-wrap: wrap; gap: 8px; }
  .preset-chip {
    font-family: var(--font-mono); font-size: 11px; color: var(--text-2);
    background: var(--bg); border: 1px solid var(--border); border-radius: 100px;
    padding: 6px 12px; cursor: pointer; transition: all 0.15s;
  }
  .preset-chip:hover { border-color: var(--accent); color: var(--accent); }
  .play-preview { position: sticky; top: 88px; }
  .play-preview .og-preview-wrap { margin-top: 0; }
  .url-box { margin-top: 16px; display: flex; gap: 8px; align-items: stretch; }
  .url-box input {
    flex: 1; background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--r); font-family: var(--font-mono); font-size: 12px;
    color: var(--text-2); padding: 10px 14px; outline: none;
  }
  .play-note {
    font-size: 12px; color: var(--text-3); margin-top: 14px;
    font-family: var(--font-mono);
  }

  @media (max-width: 768px) {
    .pricing-grid { grid-template-columns: 1fr; }
    .features-grid { grid-template-columns: 1fr; }
    .dash-grid { grid-template-columns: 1fr; }
    .play-layout { grid-template-columns: 1fr; }
    .play-preview { position: static; }
    .play-row { grid-template-columns: 1fr; }
    .hero h1 { font-size: 36px; }
  }
`;

function layout(title: string, body: string, extraHead = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — Imog</title>
  <meta name="description" content="Generate stunning Open Graph images via API. Hosted on Cloudflare edge, cached globally, delivered in milliseconds." />
  <style>${CSS}</style>
  ${extraHead}
</head>
<body>
  ${body}
</body>
</html>`;
}

function nav(_activePath = '/'): string {
  return `
  <nav class="nav">
    <a class="nav-logo" href="/">Snap<span>OG</span></a>
    <div class="nav-links">
      <a href="/play">Playground</a>
      <a href="/gallery">Gallery</a>
      <a href="/#how-it-works">Docs</a>
      <a href="/#pricing">Pricing</a>
      <a href="/register" class="btn btn-primary">Get API Key →</a>
    </div>
  </nav>`;
}

function footer(): string {
  return `
  <footer class="footer">
    <div class="container">
      Imog — OG images at the edge. Built on Cloudflare Workers.
    </div>
  </footer>`;
}

// Open Graph + Twitter card meta. /play points og:image at a /preview URL
// (eat our own dogfood): the playground's own share card IS a Imog render.
// ponytail: static titles only — no user content — so no HTML-escape needed;
// upgrade path = escape attributes if dynamic titles ever land here.
function ogMeta(opts: {
  host: string;
  path: string;
  title: string;
  description: string;
  image: string; // absolute URL
}): string {
  const url = `https://${opts.host}${opts.path}`;
  return [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${opts.title}" />`,
    `<meta property="og:description" content="${opts.description}" />`,
    `<meta property="og:image" content="${opts.image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${opts.title}" />`,
    `<meta name="twitter:description" content="${opts.description}" />`,
    `<meta name="twitter:image" content="${opts.image}" />`,
  ].join('\n  ');
}

export function landingPage(host: string): string {
  void host; // used in template strings below

  const body = `
  ${nav('/')}

  <!-- Hero -->
  <section class="hero">
    <div class="container">
      <div class="hero-eyebrow">Open Graph Images API</div>
      <h1>OG images for every URL,<br/><em>delivered at the edge</em></h1>
      <p class="hero-sub">
        One API call. Instant PNG. Cached globally on Cloudflare CDN.
        Stop hand-coding OG templates — let Imog generate them dynamically.
      </p>
      <div class="hero-cta">
        <a href="/play" class="btn btn-primary" style="font-size:15px;padding:12px 28px;">Try the live playground →</a>
        <a href="/register" class="btn btn-ghost" style="font-size:15px;padding:12px 28px;">Get Free API Key</a>
      </div>

      <!-- Live OG preview -->
      <div class="og-preview-wrap" style="margin-top:56px;">
        <div class="og-preview-label">1200 × 630 PNG — rendered live</div>
        <img
          src="/demo-og"
          alt="Live OG image example"
          style="width:100%;border-radius:8px;"
        />
      </div>
    </div>
  </section>

  <!-- How it works -->
  <section class="section" id="how-it-works">
    <div class="container">
      <p class="section-title">API Reference</p>
      <h2 class="section-h2">One endpoint, infinite images</h2>
      <p class="section-sub">
        Send a GET request. Get a PNG back. Cache it in your CDN. Done.
      </p>

      <div class="code-block" style="margin-top:36px;">
        <div class="code-block-header">
          <div class="code-block-dots">
            <div class="dot dot-red"></div>
            <div class="dot dot-yellow"></div>
            <div class="dot dot-green"></div>
          </div>
          <span class="code-block-lang">HTTP GET</span>
        </div>
        <pre><span class="c-url">GET https://${host}/og</span>
  <span class="c-comment">  ?title=</span><span class="c-str">Your Page Title Here</span>
  <span class="c-comment">  &amp;description=</span><span class="c-str">Optional subtitle or excerpt</span>
  <span class="c-comment">  &amp;domain=</span><span class="c-str">yourdomain.com</span>
  <span class="c-comment">  &amp;author=</span><span class="c-str">Jane Doe</span>
  <span class="c-comment">  &amp;template=</span><span class="c-str">default</span>  <span class="c-comment"># default | blog | article</span>
  <span class="c-comment">  &amp;theme=</span><span class="c-str">dark</span>      <span class="c-comment"># dark | light</span>
  <span class="c-comment">  &amp;tag=</span><span class="c-str">Tutorial</span>
  <span class="c-comment">  &amp;key=</span><span class="c-str">sk_your_api_key</span>

<span class="c-comment">← 200 OK  Content-Type: image/png  X-Cache: MISS</span></pre>
      </div>

      <h3 style="font-size:18px;font-weight:600;margin:48px 0 0;letter-spacing:-0.01em;">Parameters</h3>
      <table class="params-table">
        <thead>
          <tr>
            <th>Param</th><th>Type</th><th>Required</th><th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>title</td><td>string</td><td><span class="required">required</span></td><td>Page title — the main headline (max 120 chars)</td></tr>
          <tr><td>key</td><td>string</td><td><span class="required">required</span></td><td>Your API key (free tier = 100 images/month)</td></tr>
          <tr><td>description</td><td>string</td><td><span class="optional">optional</span></td><td>Subtitle or page excerpt (max 200 chars)</td></tr>
          <tr><td>domain</td><td>string</td><td><span class="optional">optional</span></td><td>Your domain shown as source label</td></tr>
          <tr><td>author</td><td>string</td><td><span class="optional">optional</span></td><td>Author name shown in footer</td></tr>
          <tr><td>template</td><td>enum</td><td><span class="optional">optional</span></td><td><code>default</code> | <code>blog</code> | <code>article</code></td></tr>
          <tr><td>theme</td><td>enum</td><td><span class="optional">optional</span></td><td><code>dark</code> (default) | <code>light</code></td></tr>
          <tr><td>tag</td><td>string</td><td><span class="optional">optional</span></td><td>Category label shown as pill (e.g. "Tutorial")</td></tr>
        </tbody>
      </table>

      <h3 style="font-size:18px;font-weight:600;margin:48px 0 20px;letter-spacing:-0.01em;">Use in HTML</h3>
      <div class="code-block">
        <div class="code-block-header">
          <div class="code-block-dots">
            <div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div>
          </div>
          <span class="code-block-lang">HTML meta tags</span>
        </div>
        <pre><span class="c-comment">&lt;!-- Drop in &lt;head&gt; --&gt;</span>
<span class="c-key">&lt;meta</span> <span class="c-val">property=</span><span class="c-str">"og:image"</span>
      <span class="c-val">content=</span><span class="c-str">"https://${host}/og?title=My+Post+Title&amp;key=YOUR_KEY"</span> <span class="c-key">/&gt;</span>
<span class="c-key">&lt;meta</span> <span class="c-val">property=</span><span class="c-str">"og:image:width"</span>  <span class="c-val">content=</span><span class="c-str">"1200"</span> <span class="c-key">/&gt;</span>
<span class="c-key">&lt;meta</span> <span class="c-val">property=</span><span class="c-str">"og:image:height"</span> <span class="c-val">content=</span><span class="c-str">"630"</span>  <span class="c-key">/&gt;</span>
<span class="c-key">&lt;meta</span> <span class="c-val">name=</span><span class="c-str">"twitter:card"</span>    <span class="c-val">content=</span><span class="c-str">"summary_large_image"</span> <span class="c-key">/&gt;</span>
<span class="c-key">&lt;meta</span> <span class="c-val">name=</span><span class="c-str">"twitter:image"</span>   <span class="c-val">content=</span><span class="c-str">"https://${host}/og?title=My+Post+Title&amp;key=YOUR_KEY"</span> <span class="c-key">/&gt;</span></pre>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="section" style="padding-top:0;">
    <div class="container">
      <p class="section-title">Why Imog</p>
      <h2 class="section-h2">Built for production, priced for teams</h2>
      <div class="features-grid">
        <div class="feature-card">
          <span class="feature-icon">⚡</span>
          <h3>Edge-cached globally</h3>
          <p>Images are generated once and stored on Cloudflare R2. Subsequent requests hit the cache in under 50ms worldwide.</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🎨</span>
          <h3>3 templates out of the box</h3>
          <p>Default, Blog, and Article templates — dark and light variants. No design work needed.</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🔑</span>
          <h3>Instant API key</h3>
          <p>Sign up with email, get a key immediately. 100 images free, no credit card required.</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">📊</span>
          <h3>Usage dashboard</h3>
          <p>Track how many images you've generated, reset date, and tier status in a clean developer dashboard.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing -->
  <section class="section" id="pricing">
    <div class="container">
      <p class="section-title">Pricing</p>
      <h2 class="section-h2">Start free. Scale as you publish.</h2>
      <p class="section-sub" style="margin-bottom:0;">Free tier is live today. Paid tiers open soon — join the waitlist and we'll email you when billing launches.</p>
      <div class="pricing-grid">

        <div class="pricing-card">
          <p class="pricing-tier">Free</p>
          <p class="pricing-price">$0</p>
          <p class="pricing-period">forever</p>
          <p class="pricing-limit">100 images / month</p>
          <ul class="pricing-features">
            <li>3 templates (dark + light)</li>
            <li>R2 global cache</li>
            <li>API key + dashboard</li>
            <li class="dim">Imog watermark</li>
            <li class="dim">No custom fonts</li>
          </ul>
          <div class="pricing-cta">
            <a href="/register" class="btn btn-ghost" style="width:100%;">Get started →</a>
          </div>
        </div>

        <div class="pricing-card featured">
          <p class="pricing-tier pricing-tier-featured">⚡ Pro — most popular</p>
          <p class="pricing-price" style="color:var(--accent);">$19</p>
          <p class="pricing-period">per month</p>
          <p class="pricing-limit" style="color:var(--accent);">10,000 images / month</p>
          <ul class="pricing-features">
            <li>Everything in Free</li>
            <li>No watermark</li>
            <li>Custom font upload</li>
            <li>Usage analytics</li>
            <li>Priority support</li>
          </ul>
          <div class="pricing-cta">
            <a href="mailto:ekachai.w@gmail.com?subject=Imog%20Pro%20waitlist" class="btn btn-primary" style="width:100%;">Join waitlist →</a>
          </div>
        </div>

        <div class="pricing-card">
          <p class="pricing-tier">Business</p>
          <p class="pricing-price">$49</p>
          <p class="pricing-period">per month</p>
          <p class="pricing-limit">100,000 images / month</p>
          <ul class="pricing-features">
            <li>Everything in Pro</li>
            <li>Custom domain (CNAME)</li>
            <li>Team access (3 seats)</li>
            <li>White-label (no branding)</li>
            <li>SLA + priority queue</li>
          </ul>
          <div class="pricing-cta">
            <a href="mailto:ekachai.w@gmail.com?subject=Imog%20Business" class="btn btn-ghost" style="width:100%;">Contact us →</a>
          </div>
        </div>

      </div>
    </div>
  </section>

  ${footer()}

  <script>
    // Copy to clipboard helper
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.copy || '');
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = orig; }, 1500);
      });
    });
  </script>`;

  const head = ogMeta({
    host,
    path: '/',
    title: 'Imog — OG images at the edge',
    description: 'One API call. Instant PNG. Cached globally on Cloudflare CDN.',
    image: `https://${host}/demo-og`,
  });
  return layout('Generate OG images at the edge', body, head);
}

export function registerPage(error?: string, tier?: string): string {
  const body = `
  ${nav()}
  <section class="section">
    <div class="container" style="max-width:480px;">
      <p class="section-title">Get API Key</p>
      <h1 class="section-h2">Start generating</h1>
      <p class="section-sub" style="margin-bottom:32px;">Enter your email to receive your API key instantly. No password. No credit card for free tier.</p>

      ${error ? `<div class="alert alert-error">${error}</div>` : ''}

      <div class="card">
        <form method="POST" action="/register">
          <input type="hidden" name="tier" value="${tier ?? 'free'}" />
          <div class="form-group">
            <label class="form-label" for="email">EMAIL ADDRESS</label>
            <input class="form-input" type="email" name="email" id="email" placeholder="you@example.com" required autocomplete="email" />
            <p class="form-hint">Your API key will be displayed immediately after registration.</p>
          </div>
          <div class="form-group">
            <label class="form-label" for="keyname">KEY NAME (optional)</label>
            <input class="form-input" type="text" name="keyname" id="keyname" placeholder="production" />
            <p class="form-hint">Give this key a label to identify it later.</p>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;padding:14px;font-size:15px;">
            Create API Key →
          </button>
        </form>
      </div>

      <p style="font-size:13px;color:var(--text-3);margin-top:20px;text-align:center;">
        Already have a key? <a href="/dashboard">View your dashboard</a>
      </p>
    </div>
  </section>
  ${footer()}`;

  return layout('Get API Key', body);
}

export function keyCreatedPage(rawKey: string, email: string, tier: string, host: string): string {
  const body = `
  ${nav()}
  <section class="section">
    <div class="container" style="max-width:600px;">
      <div class="alert alert-success">
        ✓ API key created for ${email}
      </div>
      <p class="section-title">Your API Key</p>
      <h1 class="section-h2">Save this key now</h1>
      <p class="section-sub" style="margin-bottom:32px;">
        This is the only time you'll see the full key. Copy it and store it securely.
      </p>

      <div class="card">
        <p class="card-title">API KEY — ${tier.toUpperCase()}</p>
        <div class="api-key-row">
          <div class="api-key-display">
            <span class="key-val" id="api-key">${rawKey}</span>
          </div>
          <button class="btn btn-primary" data-copy="${rawKey}" style="white-space:nowrap;">Copy</button>
        </div>
        <p style="font-size:12px;color:var(--text-3);margin-top:12px;font-family:var(--font-mono);">
          Free tier: 100 images/month · Resets monthly · ${tier === 'pro' ? '10,000 images' : 'upgrade anytime'}
        </p>
      </div>

      <div class="code-block" style="margin-top:32px;">
        <div class="code-block-header">
          <div class="code-block-dots">
            <div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div>
          </div>
          <span class="code-block-lang">Quick start</span>
        </div>
        <pre><span class="c-comment"># Test your key</span>
<span class="c-key">curl</span> <span class="c-str">"https://${host}/og?title=Hello+World&amp;key=${rawKey}"</span> \
  <span class="c-val">--output</span> og.png && <span class="c-key">open</span> og.png</pre>
      </div>

      <div style="margin-top:32px;display:flex;gap:12px;">
        <a href="/dashboard?key=${rawKey}" class="btn btn-primary">Open Dashboard →</a>
        <a href="/#how-it-works" class="btn btn-ghost">Read the docs</a>
      </div>
    </div>
  </section>
  ${footer()}
  <script>
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.copy || '');
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = orig; }, 1500);
      });
    });
  </script>`;

  return layout('API Key Created', body);
}

export function dashboardPage(key: ApiKey, recentCount: number, host: string): string {
  const pct = Math.round((key.usage_count / key.monthly_limit) * 100);
  const barClass = pct >= 100 ? 'full' : pct >= 80 ? 'warn' : '';
  const resetDate = new Date(key.usage_reset_at);
  const nextReset = new Date(resetDate.getFullYear(), resetDate.getMonth() + 1, 1)
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const tierBadge = `<span class="tier-badge tier-${key.tier}">${key.tier}</span>`;

  const body = `
  ${nav()}
  <div class="container">
    <div class="dash-layout">
      <div class="dash-header">
        <h1>Dashboard ${tierBadge}</h1>
        <p>API key: <code style="font-family:var(--font-mono);font-size:13px;color:var(--text-2);">${key.key_prefix}••••••••••••••••••••</code></p>
      </div>

      <div class="dash-grid">

        <!-- Usage card -->
        <div class="card">
          <p class="card-title">Usage This Month</p>
          <div class="usage-count">${key.usage_count.toLocaleString()}</div>
          <p class="usage-limit">of ${key.monthly_limit.toLocaleString()} images</p>
          <div class="usage-bar-wrap">
            <div class="usage-bar ${barClass}" style="width:${Math.min(pct, 100)}%"></div>
          </div>
          <div class="usage-meta">
            <span style="color:var(--text-3);font-size:13px;">${pct}% used</span>
            <span style="color:var(--text-3);font-size:13px;">Resets ${nextReset}</span>
          </div>
          ${
            key.tier === 'free'
              ? `<div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border);">
                   <p style="font-size:13px;color:var(--text-2);">Need higher limits?</p>
                   <a href="mailto:ekachai.w@gmail.com?subject=Imog%20Pro%20waitlist" class="btn btn-primary" style="margin-top:10px;">Join Pro waitlist →</a>
                   <p style="font-size:12px;color:var(--text-3);margin-top:10px;">Paid billing launches soon.</p>
                 </div>`
              : ''
          }
        </div>

        <!-- Stats sidebar -->
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="card">
            <p class="card-title">Recent Generations</p>
            <p style="font-size:32px;font-weight:700;font-family:var(--font-mono);">${recentCount}</p>
            <p style="font-size:13px;color:var(--text-3);margin-top:4px;">in last 24h</p>
          </div>
          <div class="card">
            <p class="card-title">Cache Hit Rate</p>
            <p style="font-size:32px;font-weight:700;font-family:var(--font-mono);color:var(--teal);">—</p>
            <p style="font-size:13px;color:var(--text-3);margin-top:4px;">available in Pro</p>
          </div>
        </div>

        <!-- Quick start code -->
        <div class="card dash-grid-full">
          <p class="card-title">Quick Start</p>
          <div class="code-block">
            <div class="code-block-header">
              <div class="code-block-dots">
                <div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div>
              </div>
              <span class="code-block-lang">HTML / meta tags</span>
            </div>
            <pre><span class="c-key">&lt;meta</span> <span class="c-val">property=</span><span class="c-str">"og:image"</span>
      <span class="c-val">content=</span><span class="c-str">"https://${host}/og?title=YOUR_TITLE&amp;key=${key.key_prefix}..."</span> <span class="c-key">/&gt;</span></pre>
          </div>
          <div class="code-block" style="margin-top:12px;">
            <div class="code-block-header">
              <div class="code-block-dots">
                <div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div>
              </div>
              <span class="code-block-lang">cURL test</span>
            </div>
            <pre><span class="c-key">curl</span> <span class="c-str">"https://${host}/og?title=My+Blog+Post&amp;domain=myblog.com&amp;key=${key.key_prefix}..."</span> \
  <span class="c-val">--output</span> og.png && <span class="c-key">open</span> og.png</pre>
          </div>
        </div>

      </div>
    </div>
  </div>
  ${footer()}`;

  return layout('Dashboard', body);
}

export function playgroundPage(host: string): string {
  const body = `
  ${nav('/play')}

  <section class="play-hero">
    <div class="container-wide">
      <div class="hero-eyebrow">Live Playground</div>
      <h1>Design your OG image.<br/><em>Copy the URL. Ship it.</em></h1>
      <p>No signup, no key. Tweak the fields and watch it render live at the edge. Share the link, or grab a free API key for production.</p>
    </div>
  </section>

  <div class="container-wide">
    <div class="play-layout">

      <!-- Controls -->
      <div class="play-controls">
        <div class="card">
          <div class="play-field">
            <label>Presets</label>
            <div class="preset-row">
              <button type="button" class="preset-chip" data-preset="launch">⚡ Product launch</button>
              <button type="button" class="preset-chip" data-preset="blog">✍️ Blog post</button>
              <button type="button" class="preset-chip" data-preset="docs">📖 Docs</button>
            </div>
          </div>

          <div class="play-field">
            <label for="f-title">Title</label>
            <textarea id="f-title" rows="2" maxlength="120" placeholder="Your headline"></textarea>
          </div>

          <div class="play-field">
            <label for="f-desc">Description</label>
            <input id="f-desc" type="text" maxlength="200" placeholder="Optional subtitle" />
          </div>

          <div class="play-row" style="margin-bottom:16px;">
            <div class="play-field"><label for="f-domain">Domain</label><input id="f-domain" type="text" maxlength="100" placeholder="yoursite.com" /></div>
            <div class="play-field"><label for="f-author">Author</label><input id="f-author" type="text" maxlength="80" placeholder="Jane Doe" /></div>
            <div class="play-field"><label for="f-tag">Tag</label><input id="f-tag" type="text" maxlength="40" placeholder="Tutorial" /></div>
          </div>

          <div class="play-field" style="margin-bottom:16px;">
            <label>Template</label>
            <div class="seg" id="seg-template">
              <button type="button" data-val="default" class="active">Default</button>
              <button type="button" data-val="blog">Blog</button>
              <button type="button" data-val="article">Article</button>
            </div>
          </div>

          <div class="play-field">
            <label>Theme</label>
            <div class="seg" id="seg-theme">
              <button type="button" data-val="dark" class="active">Dark</button>
              <button type="button" data-val="light">Light</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="play-preview">
        <div class="og-preview-wrap">
          <div class="og-preview-label" id="cache-label">1200 × 630 — rendering…</div>
          <img id="preview-img" alt="OG image preview" />
        </div>

        <div class="url-box">
          <input id="share-url" type="text" readonly />
          <button class="btn btn-primary" data-copy-share style="white-space:nowrap;">Copy</button>
          <a class="btn btn-ghost" id="open-share" target="_blank" rel="noopener" style="white-space:nowrap;">Open</a>
        </div>
        <p class="play-note">Shareable playground link — anyone can open and edit this exact design.</p>

        <div class="card" style="margin-top:20px;">
          <p class="card-title">Use in production</p>
          <div class="code-block" style="margin-top:0;">
            <div class="code-block-header">
              <div class="code-block-dots"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div>
              <span class="code-block-lang">HTML meta tags</span>
            </div>
            <pre><span class="c-key">&lt;meta</span> <span class="c-val">property=</span><span class="c-str">"og:image"</span>
      <span class="c-val">content=</span><span class="c-str">"https://${host}/og?title=...&amp;template=...&amp;key=YOUR_KEY"</span> <span class="c-key">/&gt;</span></pre>
          </div>
          <div style="margin-top:16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
            <a href="/register" class="btn btn-primary">Get a free API key →</a>
            <span class="play-note" style="margin:0;">100 images/mo · watermark on free tier</span>
          </div>
        </div>
      </div>

    </div>
  </div>

  ${footer()}

  <script>
    (function () {
      const PRESETS = {
        launch: { title: 'Meet Lumen 2.0', description: 'The fastest way to ship beautiful product updates.', domain: 'lumen.app', author: 'Lumen Team', tag: 'Launch', template: 'default', theme: 'dark' },
        blog:   { title: 'Why we rewrote our API in three weeks', description: 'Lessons from a clean-slate rewrite.', domain: 'indieblog.dev', author: 'Sam Builder', tag: 'Engineering', template: 'blog', theme: 'dark' },
        docs:   { title: 'Getting Started with Imog', description: 'Generate your first OG image in 60 seconds.', domain: 'snapog.dev', author: '', tag: 'Docs', template: 'article', theme: 'light' },
      };
      const DEFAULTS = PRESETS.launch;

      const $ = id => document.getElementById(id);
      const img = $('preview-img');
      const share = $('share-url');
      const openBtn = $('open-share');
      const label = $('cache-label');

      // Prefill from URL query (shareable deep links), else defaults
      const qs = new URLSearchParams(location.search);
      const state = {
        title: qs.get('title') ?? DEFAULTS.title,
        description: qs.get('description') ?? DEFAULTS.description,
        domain: qs.get('domain') ?? DEFAULTS.domain,
        author: qs.get('author') ?? DEFAULTS.author,
        tag: qs.get('tag') ?? DEFAULTS.tag,
        template: qs.get('template') ?? DEFAULTS.template,
        theme: qs.get('theme') ?? DEFAULTS.theme,
      };

      function syncInputs() {
        $('f-title').value = state.title;
        $('f-desc').value = state.description;
        $('f-domain').value = state.domain;
        $('f-author').value = state.author;
        $('f-tag').value = state.tag;
        document.querySelectorAll('#seg-template button').forEach(b => b.classList.toggle('active', b.dataset.val === state.template));
        document.querySelectorAll('#seg-theme button').forEach(b => b.classList.toggle('active', b.dataset.val === state.theme));
      }

      function buildQuery() {
        const p = new URLSearchParams();
        p.set('title', state.title);
        if (state.description) p.set('description', state.description);
        if (state.domain) p.set('domain', state.domain);
        if (state.author) p.set('author', state.author);
        if (state.tag) p.set('tag', state.tag);
        p.set('template', state.template);
        p.set('theme', state.theme);
        return p.toString();
      }

      let timer;
      function render() {
        const query = buildQuery();
        const url = location.origin + '/play?' + query;
        share.value = url;
        openBtn.href = url;
        label.textContent = '1200 × 630 — rendering…';
        img.src = '/preview?' + query;
        history.replaceState(null, '', '/play?' + query);
      }
      function schedule() { clearTimeout(timer); timer = setTimeout(render, 200); }

      const map = { 'f-title': 'title', 'f-desc': 'description', 'f-domain': 'domain', 'f-author': 'author', 'f-tag': 'tag' };
      Object.entries(map).forEach(([id, key]) => {
        $(id).addEventListener('input', e => { state[key] = e.target.value; schedule(); });
      });
      document.querySelectorAll('#seg-template button').forEach(b => {
        b.addEventListener('click', () => { state.template = b.dataset.val; syncInputs(); render(); });
      });
      document.querySelectorAll('#seg-theme button').forEach(b => {
        b.addEventListener('click', () => { state.theme = b.dataset.val; syncInputs(); render(); });
      });
      document.querySelectorAll('.preset-chip').forEach(c => {
        c.addEventListener('click', () => { Object.assign(state, PRESETS[c.dataset.preset]); syncInputs(); render(); });
      });
      img.addEventListener('load', () => { label.textContent = '1200 × 630 PNG — live'; });
      img.addEventListener('error', () => { label.textContent = 'Preview failed — enter a title'; });

      document.querySelectorAll('[data-copy-share]').forEach(b => {
        b.addEventListener('click', () => {
          navigator.clipboard.writeText(share.value);
          const o = b.textContent; b.textContent = 'Copied!';
          setTimeout(() => { b.textContent = o; }, 1500);
        });
      });

      syncInputs();
      render();
    })();
  </script>`;

  const playCardParams = new URLSearchParams({
    title: 'Design your OG image. Copy the URL. Ship it.',
    description: 'Live OG image playground — no signup, no key. Render at the edge.',
    domain: host,
    tag: 'Playground',
    template: 'default',
    theme: 'dark',
  });
  const head = ogMeta({
    host,
    path: '/play',
    title: 'Imog Playground — design OG images live',
    description:
      'Tweak the fields, watch it render live at the edge, copy the shareable URL. No signup, no key.',
    image: `https://${host}/preview?${playCardParams}`,
  });
  return layout('Playground', body, head);
}

// ── Gallery ───────────────────────────────────────────────────────────────────
// A wall of live-rendered OG previews. Each card's <img> hits /preview (R2-cached,
// so N fixed presets = N cached PNGs forever — cheap). Each card deep-links into
// /play pre-filled (playground already reads query params). One preset object →
// thumb + play link via presetQuery(). ponytail: reuses /preview + /play + layout.
type Preset = {
  title: string;
  description?: string;
  domain?: string;
  author?: string;
  tag: string;
  template: 'default' | 'blog' | 'article';
  theme: 'dark' | 'light';
};

const GALLERY_PRESETS: Preset[] = [
  { title: 'Meet Lumen 2.0', description: 'The fastest way to ship product updates.', domain: 'lumen.app', author: 'Lumen Team', tag: 'Launch', template: 'default', theme: 'dark' },
  { title: 'Why we rewrote our API in three weeks', description: 'Lessons from a clean-slate rewrite.', domain: 'indieblog.dev', author: 'Sam Builder', tag: 'Engineering', template: 'blog', theme: 'dark' },
  { title: 'Getting Started with Imog', description: 'Your first OG image in 60 seconds.', domain: 'snapog.dev', tag: 'Docs', template: 'article', theme: 'light' },
  { title: 'v2.0 — Edge caching is live', description: 'Images now served from 300+ edge locations.', domain: 'snapog.dev', tag: 'Changelog', template: 'default', theme: 'dark' },
  { title: 'The Edge — Episode 42', description: 'Shipping at the edge with Kelsey Hightower.', domain: 'theedge.fm', author: 'Dev Radio', tag: 'Podcast', template: 'blog', theme: 'dark' },
  { title: 'How Acme cut page TTI by 40%', description: 'A six-week edge migration story.', domain: 'acme.io', author: 'Case Study', tag: 'Customers', template: 'article', theme: 'light' },
  { title: 'The Edge Weekly · Issue 12', description: 'Five links on edge computing and developer DX.', domain: 'edgeweekly.dev', author: 'Jane Doe', tag: 'Newsletter', template: 'default', theme: 'dark' },
  { title: '404 — This page took a day off', description: 'But your OG images never sleep.', domain: 'yoursite.dev', tag: 'Error Page', template: 'default', theme: 'light' },
];

function presetQuery(p: Preset): string {
  const q = new URLSearchParams({ title: p.title });
  if (p.description) q.set('description', p.description);
  if (p.domain) q.set('domain', p.domain);
  if (p.author) q.set('author', p.author);
  q.set('tag', p.tag);
  q.set('template', p.template);
  q.set('theme', p.theme);
  return q.toString();
}

export function galleryPage(host: string): string {
  const cards = GALLERY_PRESETS.map((p, i) => {
    const q = presetQuery(p);
    const shareUrl = `https://${host}/play?${q}`;
    return `
      <div class="gallery-cell" style="--i:${i}">
        <a class="gallery-card" href="/play?${q}">
          <div class="gallery-thumb">
            <img loading="lazy" src="/preview?${q}" alt="${p.title}" />
          </div>
          <div class="gallery-body">
            <div class="gallery-meta">
              <span class="gallery-tag">${p.tag}</span>
              <span class="gallery-spec">${p.template} · ${p.theme}</span>
            </div>
            <div class="gallery-title">${p.title}</div>
          </div>
          <div class="gallery-cta">Open in playground →</div>
        </a>
        <button class="gallery-copy" type="button" data-url="${shareUrl}" aria-label="Copy share link for ${p.title}">Copy link</button>
      </div>`;
  }).join('');

  const body = `
  ${nav('/gallery')}

  <section class="play-hero">
    <div class="container-wide">
      <div class="hero-eyebrow">Gallery</div>
      <h1>Every card here is a <em>real, live render.</em></h1>
      <p>No screenshots. Every image below is generated on-demand at the edge and cached globally. Tap any design to open it in the playground — fully editable, zero signup.</p>
      <div style="margin-top:28px;display:flex;gap:12px;flex-wrap:wrap;">
        <a href="/play" class="btn btn-primary">Open the playground →</a>
        <a href="/register" class="btn btn-ghost">Get a free API key</a>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:24px;padding-bottom:80px;">
    <div class="container-wide">
      <div class="gallery-grid">${cards}</div>
      <p class="play-note" style="text-align:center;margin-top:40px;">8 presets · 3 templates · dark + light themes — all rendered by the same <code style="font-family:var(--font-mono);color:var(--accent);">/og</code> API you can call.</p>
    </div>
  </section>

  <script>
  (function () {
    document.querySelectorAll('.gallery-copy').forEach(function (b) {
      b.addEventListener('click', async function (e) {
        e.preventDefault();
        try { await navigator.clipboard.writeText(b.dataset.url); } catch (_) {}
        var prev = b.textContent; b.textContent = 'Copied!'; b.classList.add('copied');
        setTimeout(function () { b.textContent = prev; b.classList.remove('copied'); }, 1400);
      });
    });
  })();
  </script>

  ${footer()}`;

  // Scoped page CSS. Matches design tokens (amber/teal on dot-grid surface).
  const galleryCss = `<style>
    .gallery-grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); }
    .gallery-cell {
      position: relative;
      opacity: 0; animation: gfade 0.5s ease forwards; animation-delay: calc(var(--i) * 55ms);
    }
    .gallery-card {
      display: flex; flex-direction: column;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--r-lg); overflow: hidden;
      text-decoration: none; color: var(--text-1);
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .gallery-card:hover { transform: translateY(-4px); border-color: var(--accent-dim); box-shadow: 0 12px 40px -12px rgba(245,158,11,0.28); }
    .gallery-card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    /* ponytail: hover-only copy button; secondary control so 40px not 44px. Bump to 44 if it becomes a primary CTA. */
    .gallery-copy {
      position: absolute; top: 12px; right: 12px;
      display: inline-flex; align-items: center; justify-content: center;
      min-height: 40px; padding: 0 14px; gap: 6px;
      font-family: var(--font-mono); font-size: 11px; font-weight: 500;
      color: var(--text-1); background: rgba(10,12,20,0.72);
      backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
      border: 1px solid var(--border); border-radius: 100px; cursor: pointer;
      opacity: 0; transform: translateY(-4px);
      transition: opacity 0.18s ease, transform 0.18s ease, background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    }
    .gallery-cell:hover .gallery-copy, .gallery-cell:focus-within .gallery-copy { opacity: 1; transform: none; }
    .gallery-copy:hover { background: var(--accent); color: #0a0c14; border-color: var(--accent); }
    .gallery-copy.copied { background: var(--teal); color: #04121a; border-color: var(--teal); }
    .gallery-copy:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .gallery-thumb { aspect-ratio: 1200 / 630; background: #000; overflow: hidden; }
    .gallery-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s ease; }
    .gallery-card:hover .gallery-thumb img { transform: scale(1.03); }
    .gallery-body { padding: 18px 20px 16px; }
    .gallery-meta { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
    .gallery-tag {
      font-family: var(--font-mono); font-size: 10px; font-weight: 500; color: var(--teal);
      letter-spacing: 0.08em; text-transform: uppercase;
      border: 1px solid rgba(20,184,166,0.3); border-radius: 100px; padding: 2px 10px;
    }
    .gallery-spec { font-family: var(--font-mono); font-size: 10px; color: var(--text-2); letter-spacing: 0.06em; text-transform: uppercase; }
    .gallery-title { font-size: 16px; font-weight: 500; line-height: 1.4; color: var(--text-1); }
    .gallery-cta {
      font-family: var(--font-mono); font-size: 12px; color: var(--accent);
      padding: 0 20px 18px; margin-top: auto;
      opacity: 0; transform: translateY(4px); transition: opacity 0.2s ease, transform 0.2s ease;
    }
    .gallery-card:hover .gallery-cta, .gallery-card:focus-visible .gallery-cta { opacity: 1; transform: none; }
    @keyframes gfade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) {
      .gallery-cell { animation: none; opacity: 1; }
      .gallery-card:hover .gallery-thumb img { transform: none; }
      .gallery-copy { transition: none; }
    }
  </style>`;

  const head = ogMeta({
    host,
    path: '/gallery',
    title: 'Imog Gallery — real, live-rendered OG images',
    description: 'A wall of OG image presets — every card is a live edge render. Open any design in the playground.',
    image: `https://${host}/preview?${presetQuery(GALLERY_PRESETS[0])}`,
  }) + galleryCss;

  return layout('Gallery', body, head);
}

// ── PlaceholdOG landing ───────────────────────────────────────────────────────
// Sibling product on the same worker. Carbon Terminal tokens (no forked design
// language — cohesive with /, /play, /gallery). The page is itself dogfood: every
// preview <img> is a live /p/... render, and the share card (og:image) is too.
// Distribution thesis: this page exists so the embed-URL channel has a crawlable,
// copy-pasteable entry point — the "gallery hook" that made /gallery convert.
type PhPreset = { dims: string; text: string; bg: string; fg: string; note?: string };

const PH_PRESETS: PhPreset[] = [
  { dims: '1200x630', text: 'OG cover · 1200×630', bg: 'indigo', fg: 'white', note: 'Social card' },
  { dims: '600x400',  text: 'Card thumb',          bg: 'slate',  fg: 'white', note: 'Listings' },
  { dims: '400x400',  text: 'Avatar',              bg: 'emerald',fg: 'white', note: 'Profile' },
  { dims: '800x200',  text: 'Banner 800×200',      bg: 'amber',  fg: 'black', note: 'Hero strip' },
  { dims: '300x250',  text: 'Ad 300×250',          bg: 'rose',   fg: 'white', note: 'Mid rectangle' },
  { dims: '1280x720', text: '16:9 cover',          bg: 'blue',   fg: 'white', note: 'Video thumb' },
  { dims: '728x90',   text: 'Leaderboard 728×90',  bg: '#0f172a',fg: '#fbbf24', note: 'Wide ad' },
  { dims: '200x200',  text: 'icon',                bg: 'black',  fg: 'white', note: 'Square' },
];

function phUrl(host: string, p: PhPreset, svg = false): string {
  const q = new URLSearchParams({ text: p.text, bg: p.bg, fg: p.fg });
  return `https://${host}/p/${p.dims}${svg ? '.svg' : ''}?${q}`;
}

export function placeholderLandingPage(host: string): string {
  const heroUrl = phUrl(host, { dims: '1200x400', text: 'PlaceholdOG — URL is the API', bg: 'indigo', fg: 'white' });

  const cells = PH_PRESETS.map((p, i) => {
    const url = phUrl(host, p);
    return `
      <div class="ph-cell" style="--i:${i}">
        <div class="ph-thumb"><img loading="lazy" src="/p/${p.dims}?${new URLSearchParams({ text: p.text, bg: p.bg, fg: p.fg })}" alt="${p.text}" /></div>
        <div class="ph-body">
          <code class="ph-dims">/p/${p.dims}</code>
          <span class="ph-note">${p.note}</span>
        </div>
        <button class="ph-copy" type="button" data-url="${url}" aria-label="Copy embed URL for ${p.dims}">Copy URL</button>
      </div>`;
  }).join('');

  const body = `
  ${nav('/p')}

  <section class="hero" style="padding-bottom:48px;">
    <div class="container">
      <div class="hero-eyebrow">Placeholder Images · Keyless · Free</div>
      <h1>Drop in a URL.<br/><em>Get a placeholder.</em></h1>
      <p class="hero-sub">
        No key, no signup, no SDK. Just <code style="font-family:var(--font-mono);color:var(--accent);">/p/600x400</code> —
        PNG or crisp SVG, rendered at the Cloudflare edge, cached globally. The URL <em>is</em> the API.
      </p>
      <div class="hero-cta">
        <a href="#presets" class="btn btn-primary" style="font-size:15px;padding:12px 28px;">Copy a preset →</a>
        <a href="/play" class="btn btn-ghost" style="font-size:15px;padding:12px 28px;">Try SnapOG (OG images)</a>
      </div>

      <div class="og-preview-wrap" style="margin-top:56px;">
        <div class="og-preview-label">live render — /p/1200x400</div>
        <img src="${heroUrl}" alt="PlaceholdOG live render" style="width:100%;border-radius:8px;" />
      </div>
    </div>
  </section>

  <!-- Syntax -->
  <section class="section" id="how" style="padding-top:40px;">
    <div class="container">
      <p class="section-title">Embed Syntax</p>
      <h2 class="section-h2">One path. Two formats.</h2>
      <p class="section-sub">PNG by default. Append <code style="font-family:var(--font-mono);color:var(--accent);">.svg</code> for a scalable vector that stays crisp at any size.</p>

      <div class="code-block" style="margin-top:32px;">
        <div class="code-block-header">
          <div class="code-block-dots"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div>
          <span class="code-block-lang">HTML · markdown</span>
        </div>
<pre><span class="c-comment">&lt;!-- PNG (default) --&gt;</span>
<span class="c-key">&lt;img</span> <span class="c-val">src=</span><span class="c-str">"https://${host}/p/600x400?text=Hello&amp;bg=indigo&amp;fg=white"</span> <span class="c-key">/&gt;</span>

<span class="c-comment">&lt;!-- SVG — crisp at any size --&gt;</span>
<span class="c-key">&lt;img</span> <span class="c-val">src=</span><span class="c-str">"https://${host}/p/600x400.svg?text=Hello&amp;bg=indigo"</span> <span class="c-key">/&gt;</span>

<span class="c-comment">![alt](https://${host}/p/800x200?text=Banner&amp;bg=amber&amp;fg=black)</span></pre>
      </div>

      <h3 style="font-size:18px;font-weight:600;margin:48px 0 0;letter-spacing:-0.01em;">Parameters</h3>
      <table class="params-table">
        <thead><tr><th>Param</th><th>Example</th><th>Required</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>dims</td><td><code>600x400</code> · <code>200</code></td><td><span class="required">required</span></td><td>Path segment. <code>WxH</code> or <code>N</code> (square). Quantized ×10, clamped [40,2000].</td></tr>
          <tr><td>format</td><td><code>.png</code> · <code>.svg</code></td><td><span class="optional">optional</span></td><td>Suffix or <code>/png</code>·<code>/svg</code> segment. Default <code>png</code>.</td></tr>
          <tr><td>text</td><td><code>Hello</code></td><td><span class="optional">optional</span></td><td>Label text (max 60). Defaults to <code>W×H</code>.</td></tr>
          <tr><td>bg</td><td><code>indigo</code> · <code>#0f172a</code></td><td><span class="optional">optional</span></td><td>Background. Named: indigo, slate, emerald, amber, rose, white, black, blue — or hex.</td></tr>
          <tr><td>fg</td><td><code>white</code> · <code>#fbbf24</code></td><td><span class="optional">optional</span></td><td>Text color. Same palette as <code>bg</code>.</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- Presets -->
  <section class="section" id="presets" style="padding-top:0;">
    <div class="container-wide">
      <p class="section-title">Live Presets</p>
      <h2 class="section-h2">Every image below is a real render.</h2>
      <p class="section-sub">Tap copy and paste into your HTML or README. Swap <code style="font-family:var(--font-mono);color:var(--accent);">.png</code> for <code style="font-family:var(--font-mono);color:var(--accent);">.svg</code> on any of them.</p>
      <div class="ph-grid">${cells}</div>
    </div>
  </section>

  <!-- Why -->
  <section class="section" style="padding-top:0;">
    <div class="container">
      <div class="features-grid">
        <div class="feature-card">
          <span class="feature-icon">🔓</span>
          <h3>No key, no signup</h3>
          <p>Placeholders are keyless by design. The URL works the first time, every time — nothing to register.</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">📐</span>
          <h3>SVG that stays crisp</h3>
          <p>Vector output scales without pixelation — drop the same URL into a 64px avatar and a 4K hero.</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">⚡</span>
          <h3>Edge-cached</h3>
          <p>Rendered once, cached globally on Cloudflare. Subsequent hits return from the nearest edge POP.</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🆓</span>
          <h3>Free + watermarked</h3>
          <p>Small “PlaceholdOG” label in the corner. Stripe-paid watermark removal ships once embed traction is real.</p>
        </div>
      </div>
    </div>
  </section>

  ${footer()}

  <script>
  (function () {
    document.querySelectorAll('.ph-copy').forEach(function (b) {
      b.addEventListener('click', async function (e) {
        e.preventDefault();
        try { await navigator.clipboard.writeText(b.dataset.url); } catch (_) {}
        var prev = b.textContent; b.textContent = 'Copied!'; b.classList.add('copied');
        setTimeout(function () { b.textContent = prev; b.classList.remove('copied'); }, 1400);
      });
    });
  })();
  </script>`;

  // Scoped CSS — extends the shared token set, no new design language.
  const phCss = `<style>
    .ph-grid { display: grid; gap: 18px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); margin-top: 36px; }
    .ph-cell {
      position: relative; background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--r-lg); padding: 14px; display: flex; flex-direction: column; gap: 12px;
      opacity: 0; animation: gfade 0.5s ease forwards; animation-delay: calc(var(--i) * 50ms);
      transition: border-color 0.2s ease, transform 0.2s ease;
    }
    .ph-cell:hover { border-color: var(--accent-dim); transform: translateY(-3px); }
    .ph-thumb {
      background: #000; border-radius: var(--r); overflow: hidden; min-height: 120px;
      display: flex; align-items: center; justify-content: center;
    }
    .ph-thumb img { max-width: 100%; max-height: 180px; width: auto; height: auto; display: block; }
    .ph-body { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .ph-dims { font-family: var(--font-mono); font-size: 13px; color: var(--accent); letter-spacing: 0.02em; }
    .ph-note { font-family: var(--font-mono); font-size: 10px; color: var(--text-3); letter-spacing: 0.08em; text-transform: uppercase; }
    .ph-copy {
      align-self: stretch; min-height: 44px; padding: 0 16px;
      font-family: var(--font-mono); font-size: 12px; font-weight: 500; color: var(--text-1);
      background: var(--bg); border: 1px solid var(--border); border-radius: var(--r);
      cursor: pointer; transition: all 0.15s ease;
    }
    .ph-copy:hover { background: var(--accent); color: #000; border-color: var(--accent); }
    .ph-copy.copied { background: var(--teal); color: #04121a; border-color: var(--teal); }
    .ph-copy:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    @keyframes gfade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .ph-cell { animation: none; opacity: 1; } .ph-cell:hover { transform: none; } }
  </style>`;

  const head = ogMeta({
    host,
    path: '/p',
    title: 'PlaceholdOG — placeholder images, URL is the API',
    description: 'Keyless placeholder images. /p/600x400 — PNG or crisp SVG, rendered at the edge. No signup.',
    image: heroUrl,
  }) + phCss;

  return layout('PlaceholdOG — placeholder images', body, head);
}

export function errorPage(code: number, message: string): string {
  const body = `
  ${nav()}
  <section class="section">
    <div class="container" style="text-align:center;max-width:480px;">
      <p style="font-family:var(--font-mono);font-size:80px;font-weight:700;color:var(--border);line-height:1;">${code}</p>
      <h1 style="font-size:24px;margin:16px 0 12px;">${message}</h1>
      <p style="color:var(--text-2);margin-bottom:32px;">Something went wrong. Try again or check the docs.</p>
      <a href="/" class="btn btn-ghost">← Back to home</a>
    </div>
  </section>
  ${footer()}`;

  return layout(`${code} Error`, body);
}
