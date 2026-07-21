#!/usr/bin/env bash
# SnapOG pre-deploy brand + PII hygiene checks.
# Auto-runs via the npm `predeploy` lifecycle hook before `wrangler deploy`,
# and is chained into `staging:deploy`. Catches the drift this project got
# burned by: old brand tokens (Imog) and stranger-inbox mailto: links sitting
# live on served pages for multiple cycles because nobody grepped.
set -euo pipefail

echo "=== pre-deploy hygiene checks ==="
fail=0

# 1. Old/typo brand tokens must not appear in served source or paste-ready assets.
#    Imog = retired brand; mixnosity = dead worker subdomain typo (live = mixnology).
if grep -rniE "imog|mixnosity" src/ docs/ sample/ README.md 2>/dev/null; then
  echo "✗ FAIL: old/typo brand token found above — fix before deploying."
  fail=1
fi

# 2. No personal-inbox mailto: or known PII on served pages. Contact surface is
#    GitHub issues only (no company inbox exists). Regression-catches the
#    stranger-gmail-on-CTA defect from cycle #15.
if grep -rniE "mailto:|ekachai" src/ 2>/dev/null; then
  echo "✗ FAIL: personal mailto:/PII found in served source — fix before deploying."
  fail=1
fi

if [ "$fail" -eq 1 ]; then
  exit 1
fi

echo "✓ pre-deploy hygiene clean"
