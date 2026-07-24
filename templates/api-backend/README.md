# {{NAME}} — API Backend (Cloudflare Workers + Hono)

Minimal Hono API on CF Workers. Deploy with `wrangler`.

## Stack
- TypeScript, Hono, Cloudflare Workers
- Optional bindings: D1 (SQL), R2 (objects), KV (config) — add in `wrangler.toml`

## Run
```bash
npm install
npx wrangler dev      # local
npx wrangler deploy   # production → *.workers.dev
```

## Routes
- `GET /` — health JSON

## Next
- Add routes in `src/index.ts`
- Create D1/R2 via wrangler, paste ids into `wrangler.toml`
