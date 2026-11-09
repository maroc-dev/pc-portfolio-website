#!/usr/bin/env bash
# Build in a RAM-backed temp dir (node_modules is ~700 MB, more than this server's disk has free),
# then install only the standalone server to /home/ubuntu/portfolio-server and restart it.
set -euo pipefail
export PATH="$HOME/.local/node/bin:$PATH" NEXT_TELEMETRY_DISABLED=1
REPO="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${DEST:-/home/ubuntu/portfolio-server}"
WORK="$(mktemp -d /tmp/portfolio-build.XXXXXX)"
trap 'rm -rf "$WORK"' EXIT

tar -C "$REPO" --exclude=node_modules --exclude=.next --exclude=.git -cf - . | tar -C "$WORK" -xf -
cd "$WORK"
npm ci --cache "$WORK/.npm" --no-audit --no-fund
npx next build

rm -rf "$DEST.new"
cp -a .next/standalone "$DEST.new"
cp -a public "$DEST.new/"
cp -a .next/static "$DEST.new/.next/"
rm -rf "$DEST.old"; [ -d "$DEST" ] && mv "$DEST" "$DEST.old"
mv "$DEST.new" "$DEST" && rm -rf "$DEST.old"
sudo systemctl restart portfolio
