#!/bin/bash
set -euo pipefail

log() {
  echo "[vercel-build] $*"
}

log "cwd=$(pwd)"
log "node=$(command -v node || true)"
log "npm=$(command -v npm || true)"
log "hugo=$(command -v hugo || true)"
log "git=$(command -v git || true)"

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
hugo

# 3. Ensure public exists (Hugo default output)
if [ -d "public" ]; then
  log "Hugo output directory ready: public"
else
  log "Hugo output directory missing; creating public"
  mkdir -p public
fi

# 4. Build Garden submodule
log "Building Garden submodule"
log "Syncing submodule: garden"
git submodule update --init garden
cd garden
log "Garden cwd=$(pwd)"
log "Installing Garden dependencies"
npm install
log "Running Garden build"
npm run build
cd ..

# 5. Move Garden build to public/garden without overwriting
log "Copying Garden build output to public/garden (no overwrite)"
mkdir -p public/garden

if [ ! -d "garden/public" ]; then
  log "ERROR: garden/public not found after build"
  exit 1
fi

# Copy files without overwriting existing ones; log conflicts
find garden/public -type f -print0 | while IFS= read -r -d '' src; do
  rel=${src#garden/public/}
  dest="public/garden/$rel"
  if [ -e "$dest" ]; then
    log "SKIP (exists): public/garden/$rel"
    continue
  fi
  mkdir -p "$(dirname "$dest")"
  cp "$src" "$dest"
  log "COPIED: public/garden/$rel"
done

# Copy empty directories that don't exist
find garden/public -type d -print0 | while IFS= read -r -d '' srcdir; do
  rel=${srcdir#garden/public}
  destdir="public/garden$rel"
  if [ ! -d "$destdir" ]; then
    mkdir -p "$destdir"
    log "DIR: public/garden$rel"
  fi
done

# 6. Save resources to cache for next time
log "Saving Hugo resources cache"
mkdir -p node_modules/.cache/hugo_resources
cp -r resources/* node_modules/.cache/hugo_resources/ || true

log "Build complete"
