#!/bin/bash
set -euo pipefail
export PS4='+ [vercel-build] ${BASH_SOURCE##*/}:${LINENO} '
set -x

# Config
TRAKT_USERNAME="bpx"
TRAKT_CLIENT_ID="a52c9cdfbdddb8ba4ffe12a70c5591e05c985eddea6cd0fb53f998fee6c59dd0"
TMDB_API_KEY="61c9bbbefe48beed3b4f02f0cc4794e7"
DATA_DIR="assets/trakt"
IMG_DIR="assets/cinema/posters"
CACHE_DIR="node_modules/.cache/cinema_assets"

log() {
  echo "[vercel-build] $*"
}

# 0. Setup and Restore Cache
mkdir -p "$DATA_DIR"
mkdir -p "$IMG_DIR"
mkdir -p "$CACHE_DIR/posters"

if [ -d "$CACHE_DIR/posters" ]; then
  log "Restoring posters from cache..."
  cp -r "$CACHE_DIR/posters/." "$IMG_DIR/" 2>/dev/null || true
fi

if [ -f "package.json" ]; then
  log "Installing node dependencies"
  npm install
  export PATH="$PWD/node_modules/.bin:$PATH"
fi

# 1. Fetch Trakt Data (Always fetch fresh data)
log "Fetching data from Trakt..."

fetch_trakt() {
  local endpoint=$1
  local output=$2
  log "Fetching $endpoint -> $output"
  curl -s -L -H "Content-Type: application/json" \
       -H "trakt-api-version: 2" \
       -H "trakt-api-key: $TRAKT_CLIENT_ID" \
       "https://api.trakt.tv/$endpoint" > "$output"
}

fetch_trakt "users/$TRAKT_USERNAME/watched/movies?extended=full" "$DATA_DIR/watched_movies.json"
fetch_trakt "users/$TRAKT_USERNAME/watched/shows?extended=full" "$DATA_DIR/watched_shows.json"
fetch_trakt "users/$TRAKT_USERNAME/ratings/movies" "$DATA_DIR/movie_ratings.json"
fetch_trakt "users/$TRAKT_USERNAME/ratings/shows" "$DATA_DIR/show_ratings.json"
fetch_trakt "users/$TRAKT_USERNAME/comments/all/all?extended=full" "$DATA_DIR/comments.json"
fetch_trakt "users/$TRAKT_USERNAME/lists/favorites/items?extended=full" "$DATA_DIR/favorites.json"

mkdir -p data
cp "$DATA_DIR/favorites.json" data/trakt_favorites.json
fetch_trakt "users/$TRAKT_USERNAME/history/episodes?limit=3" "data/trakt.json"

# 2. Download Posters from TMDB
log "Downloading posters from TMDB..."

download_poster() {
  local type=$1 # movie or tv
  local tmdb_id=$2
  local target="$IMG_DIR/${type}_${tmdb_id}.jpg"
  
  if [ -f "$target" ] && [ -s "$target" ]; then
    # Already exists in cache/local
    return 0
  fi

  log "Downloading new poster for $type $tmdb_id..."
  
  local meta_url="https://api.themoviedb.org/3/$type/$tmdb_id?api_key=$TMDB_API_KEY"
  local meta_json=$(curl -s -L "$meta_url")
  local poster_path=$(node -e "try { console.log(JSON.parse(process.argv[1]).poster_path || '') } catch(e) { console.log('') }" "$meta_json")
  
  if [ -n "$poster_path" ] && [ "$poster_path" != "null" ]; then
    local img_url="https://image.tmdb.org/t/p/w500$poster_path"
    if ! curl -s -f -L "$img_url" -o "$target"; then
      log "ERROR: Failed to download $img_url"
      return 1
    fi
  else
    log "WARN: No poster path found for $type $tmdb_id"
    return 1
  fi
}

# Extract IDs and Download
MOVIE_IDS=$(node -e "try { const d = require('./$DATA_DIR/watched_movies.json'); console.log(d.map(m => m.movie.ids.tmdb).filter(id => id).join(' ')) } catch(e) { console.log('') }")
SHOW_IDS=$(node -e "try { const d = require('./$DATA_DIR/watched_shows.json'); console.log(d.map(s => s.show.ids.tmdb).filter(id => id).join(' ')) } catch(e) { console.log('') }")

for id in $MOVIE_IDS; do download_poster "movie" "$id" || true; done
for id in $SHOW_IDS; do download_poster "tv" "$id" || true; done

# 3. Verify Poster Presence
log "Verifying poster files..."
MISSING_COUNT=0
TOTAL_COUNT=0

check_presence() {
  local type=$1
  local id=$2
  TOTAL_COUNT=$((TOTAL_COUNT + 1))
  if [ ! -f "$IMG_DIR/${type}_${id}.jpg" ]; then
    log "MISSING: $type $id"
    MISSING_COUNT=$((MISSING_COUNT + 1))
  fi
}

for id in $MOVIE_IDS; do check_presence "movie" "$id"; done
for id in $SHOW_IDS; do check_presence "tv" "$id"; done

log "Poster verification complete: $TOTAL_COUNT total, $MISSING_COUNT missing."

# 4. Restore Hugo resources cache
if [ -d "node_modules/.cache/hugo_resources" ]; then
  log "Restoring Hugo resources cache"
  mkdir -p resources
  cp -r node_modules/.cache/hugo_resources/* resources/ || true
fi

# 5. Run Hugo build
log "Building root Hugo site"
ROOT_BUILD_DIR="/tmp/hugo-build-root"
rm -rf "$ROOT_BUILD_DIR" || true
mkdir -p "$ROOT_BUILD_DIR"
hugo -d "$ROOT_BUILD_DIR"

# 6. Finalize output and Save Cache
mkdir -p public
log "Copying root Hugo output into public"
cp -a "$ROOT_BUILD_DIR/." public/

log "Saving assets to persistent cache..."
mkdir -p "$CACHE_DIR/posters"
cp -r "$IMG_DIR/." "$CACHE_DIR/posters/"

log "Saving Hugo resources cache"
mkdir -p node_modules/.cache/hugo_resources
cp -r resources/_gen node_modules/.cache/hugo_resources/ || true

log "Build complete"
