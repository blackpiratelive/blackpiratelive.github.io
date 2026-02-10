#!/bin/bash
set -euo pipefail
export PS4='+ [vercel-build] ${BASH_SOURCE##*/}:${LINENO} '
set -x

log() {
  echo "[vercel-build] $*"
}

log "start time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
ROOT_DIR="$(pwd)"
log "cwd=$ROOT_DIR"
log "node=$(command -v node || true)"
log "npm=$(command -v npm || true)"
log "hugo=$(command -v hugo || true)"
log "git=$(command -v git || true)"
log "node version=$(node -v || true)"
log "npm version=$(npm -v || true)"
log "hugo version=$(hugo version || true)"
log "git version=$(git --version || true)"
log "uname=$(uname -a || true)"
log "env: NODE_ENV=${NODE_ENV-} VERCEL=${VERCEL-} VERCEL_ENV=${VERCEL_ENV-} VERCEL_GIT_COMMIT_SHA=${VERCEL_GIT_COMMIT_SHA-}"
log "root ls:"
ls -la || true

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
if [ -d "garden/.git" ] || [ -f "garden/.git" ]; then
  log "Garden appears to be a git repository; updating submodule"
  if git submodule update --init garden; then
    GARDEN_BUILD_DIR="garden"
  else
    log "Submodule update failed; falling back to temp clone"
  fi
else
  log "Garden is not a git repo; using temp clone to avoid deleting local files"
fi

if [ -z "$GARDEN_BUILD_DIR" ]; then
  GARDEN_BUILD_DIR="/tmp/garden-build"
  rm -rf "$GARDEN_BUILD_DIR" || true
  git clone https://github.com/blackpirateapps/digital-garden.git "$GARDEN_BUILD_DIR"
fi

cd "$GARDEN_BUILD_DIR"
log "Garden cwd=$(pwd)"
log "Garden ls:"
ls -la || true
log "Installing Garden dependencies"
npm install
log "Running Garden build"
npm run build
cd "$ROOT_DIR"

# 5. Move Garden build to public/garden without overwriting
log "Copying Garden build output to public/garden (no overwrite)"
PUBLIC_DIR="$ROOT_DIR/public"
mkdir -p "$PUBLIC_DIR/garden"

if [ ! -d "$GARDEN_BUILD_DIR/public" ]; then
  log "ERROR: $GARDEN_BUILD_DIR/public not found after build"
  exit 1
fi

# Copy files without overwriting existing ones; log conflicts
find "$GARDEN_BUILD_DIR/public" -type f -print0 | while IFS= read -r -d '' src; do
  rel=${src#"$GARDEN_BUILD_DIR/public"/}
  dest="$PUBLIC_DIR/garden/$rel"
  if [ -e "$dest" ]; then
    log "SKIP (exists): $PUBLIC_DIR/garden/$rel"
    continue
  fi
  mkdir -p "$(dirname "$dest")"
  cp "$src" "$dest"
  log "COPIED: $PUBLIC_DIR/garden/$rel"
done

# Copy empty directories that don't exist
find "$GARDEN_BUILD_DIR/public" -type d -print0 | while IFS= read -r -d '' srcdir; do
  rel=${srcdir#"$GARDEN_BUILD_DIR/public"}
  destdir="$PUBLIC_DIR/garden$rel"
  if [ ! -d "$destdir" ]; then
    mkdir -p "$destdir"
    log "DIR: $PUBLIC_DIR/garden$rel"
  fi
done

# 6. Save resources to cache for next time
log "Saving Hugo resources cache"
mkdir -p node_modules/.cache/hugo_resources
cp -r resources/* node_modules/.cache/hugo_resources/ || true

log "Build complete"
