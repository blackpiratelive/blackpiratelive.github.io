#!/bin/bash

# 1. Restore resources from cache (if they exist)
if [ -d "node_modules/.cache/hugo_resources" ]; then
  echo "♻️  Restoring resources from cache..."
  mkdir -p resources
  cp -r node_modules/.cache/hugo_resources/* resources/
else
  echo "⚠️  No cache found. Starting fresh."
fi

# 2. Run the actual Hugo build
echo "🚀 Building Hugo site..."
hugo --gc --minify

# 3. Save resources to cache for next time
echo "💾 Saving resources to cache..."
mkdir -p node_modules/.cache/hugo_resources
cp -r resources/* node_modules/.cache/hugo_resources/