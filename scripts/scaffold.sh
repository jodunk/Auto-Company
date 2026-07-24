#!/bin/bash
# scaffold.sh — scaffold a new product from a template.
# Usage: ./scripts/scaffold.sh <name> <template>
# Templates: api-backend | saas | docs-site
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"   # repo root: where projects/ and templates/ live

NAME="${1:-}"
TEMPLATE="${2:-}"
VALID="api-backend saas docs-site"

if [ -z "$NAME" ] || [ -z "$TEMPLATE" ]; then
  echo "Usage: $0 <name> <template>"
  echo "Templates: $VALID"
  exit 1
fi

if ! echo "$VALID" | grep -qw "$TEMPLATE"; then
  echo "Error: TEMPLATE '$TEMPLATE' invalid. Pick: $VALID"
  exit 1
fi

DEST="$ROOT/projects/$NAME"
if [ -e "$DEST" ]; then
  echo "Error: $DEST already exists"
  exit 1
fi

TMPL="$ROOT/templates/$TEMPLATE"
mkdir -p "$DEST"
cp -R "$TMPL/." "$DEST/"

# Per-template boilerplate, with {{NAME}} substitution.
sub() { sed "s/{{NAME}}/$NAME/g"; }

cat > "$DEST/.gitignore" <<'EOF'
node_modules/
.wrangler/
.next/
dist/
.env
.env.*
!.env.example
EOF

case "$TEMPLATE" in
  api-backend)
    sub "$DEST/package.json" 2>/dev/null || true
    cat > "$DEST/package.json" <<EOF
{
  "name": "$NAME",
  "private": true,
  "scripts": { "dev": "wrangler dev", "deploy": "wrangler deploy" },
  "dependencies": { "hono": "^4" },
  "devDependencies": { "@cloudflare/workers-types": "^4", "wrangler": "^3" }
}
EOF
    cat > "$DEST/wrangler.toml" <<EOF
name = "$NAME"
main = "src/index.ts"
compatibility_date = "2026-07-01"
EOF
    ;;
  saas)
    cat > "$DEST/package.json" <<EOF
{
  "name": "$NAME",
  "private": true,
  "scripts": { "dev": "next dev", "build": "next build", "start": "next start" },
  "dependencies": { "next": "^14", "react": "^18", "react-dom": "^18" }
}
EOF
    ;;
  docs-site)
    cat > "$DEST/package.json" <<EOF
{
  "name": "$NAME",
  "private": true,
  "scripts": { "dev": "next dev", "build": "next build" },
  "dependencies": { "next": "^14", "react": "^18", "react-dom": "^18", "@next/mdx": "^14" }
}
EOF
    ;;
esac

# Substitute {{NAME}} across all files in the new project.
find "$DEST" -type f \( -name '*.md' -o -name '*.ts' -o -name '*.tsx' -o -name '*.mdx' \) -print0 \
  | xargs -0 sed -i '' "s/{{NAME}}/$NAME/g" 2>/dev/null || \
find "$DEST" -type f \( -name '*.md' -o -name '*.ts' -o -name '*.tsx' -o -name '*.mdx' \) -print0 \
  | xargs -0 sed -i "s/{{NAME}}/$NAME/g"

echo "✓ Scaffolded '$NAME' ($TEMPLATE) → projects/$NAME"
echo "  cd projects/$NAME && npm install"
