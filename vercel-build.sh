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
if [ -d "garden" ]; then
  log "Garden directory exists"
  ls -la garden || true
  if git -C garden rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    log "Garden is a git working tree"
  else
    log "Garden is NOT a git working tree"
  fi
else
  log "Garden directory does not exist yet"
fi

GARDEN_BUILD_DIR=""
if git -C garden rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  log "Updating submodule in-place"
  git submodule update --init garden
  GARDEN_BUILD_DIR="garden"
else
  log "Cloning submodule to a temp directory to avoid conflicts"
  GARDEN_BUILD_DIR="/tmp/garden-build"
  rm -rf "$GARDEN_BUILD_DIR" || true
  git clone https://github.com/blackpirateapps/digital-garden.git "$GARDEN_BUILD_DIR"
fi

cd "$GARDEN_BUILD_DIR"
log "Garden cwd=$(pwd)"
log "Installing Garden dependencies"
npm install
log "Running Garden build"
npm run build
cd ..

# 5. Move Garden build to public/garden without overwriting
log "Copying Garden build output to public/garden (no overwrite)"
mkdir -p public/garden

if [ ! -d "$GARDEN_BUILD_DIR/public" ]; then
  log "ERROR: $GARDEN_BUILD_DIR/public not found after build"
  exit 1
fi

# Copy files without overwriting existing ones; log conflicts
find "$GARDEN_BUILD_DIR/public" -type f -print0 | while IFS= read -r -d '' src; do
  rel=${src#"$GARDEN_BUILD_DIR/public"/}
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
find "$GARDEN_BUILD_DIR/public" -type d -print0 | while IFS= read -r -d '' srcdir; do
  rel=${srcdir#"$GARDEN_BUILD_DIR/public"}
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
