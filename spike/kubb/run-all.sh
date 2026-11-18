#!/bin/sh
# Regenerate -> format -> typecheck -> tests -> semantic diff -> classify. Run from repo root.
set -u
node spike/kubb/generate.mjs && npx oxfmt src/models/custody-types.ts src/models/custody-internal-types.ts >/dev/null 2>&1
npm run typecheck > spike/kubb/typecheck.txt 2>&1; echo "typecheck errors: $(grep -c 'error TS' spike/kubb/typecheck.txt)"
npm test > spike/kubb/test.txt 2>&1; grep -E "Test Files|Tests  " spike/kubb/test.txt
node spike/kubb/gen-semantic-diff.mjs
npx tsc -p spike/kubb/tsconfig.json > spike/kubb/semantic-diff.tsc.txt 2>&1; echo "semantic mismatches: $(grep -c 'error TS' spike/kubb/semantic-diff.tsc.txt)"
node spike/kubb/classify-mismatches.mjs > spike/kubb/mismatch-summary.json
