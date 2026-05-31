#!/bin/bash
set -euo pipefail
export PS4='+ [vercel-build] ${BASH_SOURCE##*/}:${LINENO} '
set -x

# Config
TRAKT_USERNAME="bpx"
TRAKT_CLIENT_ID="a52c9cdfbdddb8ba4ffe12a70c5591e05c985eddea6cd0fb53f998fee6c59dd0"
TMDB_API_KEY="61c9bbbefe48beed3b4f02f0cc4794e7"
DATA_DIR="data/trakt"
IMG_DIR="assets/cinema/posters"

log() {
  echo "[vercel-build] $*"
}

# 0. Setup
mkdir -p "$DATA_DIR"
mkdir -p "$IMG_DIR"

if [ -f "package.json" ]; then
  log "Installing node dependencies"
  npm install
  export PATH="$PWD/node_modules/.bin:$PATH"
fi

# 1. Fetch Trakt Data
log "Fetching data from Trakt..."

fetch_trakt() {
  local endpoint=$1
  local output=$2
  log "Fetching $endpoint -> $output"
  curl -s -H "Content-Type: application/json" \
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
fetch_trakt "users/$TRAKT_USERNAME/history/episodes?limit=3" "data/trakt.json" # Legacy compat for home/shows

# 2. Download Posters from TMDB
log "Downloading posters from TMDB..."

download_poster() {
  local type=$1 # movie or tv
  local tmdb_id=$2
  local target="$IMG_DIR/${type}_${tmdb_id}.jpg"
  
  if [ -f "$target" ] && [ -s "$target" ]; then
    return 0
  fi

  log "Processing $type $tmdb_id..."
  
  # Get poster path from TMDB
  local meta_url="https://api.themoviedb.org/3/$type/$tmdb_id?api_key=$TMDB_API_KEY"
  local poster_path=$(curl -s "$meta_url" | jq -r '.poster_path // empty')
  
  if [ "$poster_path" != "empty" ] && [ -n "$poster_path" ]; then
    local img_url="https://image.tmdb.org/t/p/w500$poster_path"
    log "Downloading $img_url -> $target"
    if ! curl -s -f "$img_url" -o "$target"; then
      log "ERROR: Failed to download poster for $type $tmdb_id"
    fi
  else
    log "WARN: No poster path found for $type $tmdb_id (URL: $meta_url)"
  fi
}

# Iterate through movies and shows to download posters
if command -v jq >/dev/null; then
  log "Extracting TMDB IDs and downloading posters..."
  
  # Movies
  for id in $(jq -r '.[].movie.ids.tmdb' "$DATA_DIR/watched_movies.json" 2>/dev/null | grep -v null); do
    download_poster "movie" "$id"
  done
  
  # Shows
  for id in $(jq -r '.[].show.ids.tmdb' "$DATA_DIR/watched_shows.json" 2>/dev/null | grep -v null); do
    download_poster "tv" "$id"
  done
else
  log "ERROR: jq not found, skipping poster downloads"
fi

# 3. Restore resources from cache (if they exist)
if [ -d "node_modules/.cache/hugo_resources" ]; then
  log "Restoring Hugo resources cache"
  mkdir -p resources
  cp -r node_modules/.cache/hugo_resources/* resources/ || true
fi

# 4. Run the actual Hugo build
log "Building root Hugo site"
ROOT_BUILD_DIR="/tmp/hugo-build-root"
rm -rf "$ROOT_BUILD_DIR" || true
mkdir -p "$ROOT_BUILD_DIR"
hugo -d "$ROOT_BUILD_DIR"

# 5. Ensure public exists
mkdir -p public
log "Copying root Hugo output into public"
cp -a "$ROOT_BUILD_DIR/." public/

# 6. Save resources to cache for next time
log "Saving Hugo resources cache"
mkdir -p node_modules/.cache/hugo_resources
cp -r resources/_gen node_modules/.cache/hugo_resources/ || true

log "Build complete"
