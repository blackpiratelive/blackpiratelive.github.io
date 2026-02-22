#!/bin/bash
set -euo pipefail
export PS4='+ [vercel-build] ${BASH_SOURCE##*/}:${LINENO} '
set -x

log() {
  echo "[vercel-build] $*"
}


# 1. Restore resources from cache (if they exist)
if [ -d "node_modules/.cache/hugo_resources" ]; then
  log "Restoring Hugo resources cache"
  mkdir -p resources
  cp -r node_modules/.cache/hugo_resources/* resources/ || true
else
  log "No Hugo resources cache found"
fi

# 2. Run the actual Hugo build
log "Building root Hugo site"
ROOT_BUILD_DIR="/tmp/hugo-build-root"
rm -rf "$ROOT_BUILD_DIR" || true
mkdir -p "$ROOT_BUILD_DIR"
hugo -d "$ROOT_BUILD_DIR"

# 3. Ensure public exists (Hugo default output)
if [ -d "public" ]; then
  log "Hugo output directory ready: public"
else
  log "Hugo output directory missing; creating public"
  mkdir -p public
fi
log "Copying root Hugo output into public"
cp -a "$ROOT_BUILD_DIR/." public/


# 6. Save resources to cache for next time
log "Saving Hugo resources cache"
mkdir -p node_modules/.cache/hugo_resources
cp -r resources/* node_modules/.cache/hugo_resources/ || true

log "Build complete"
