# Repository Guidelines

## Project Structure & Module Organization
- `config.toml` holds Hugo site configuration.
- Content lives in `content/` (pages) and `content/blog/` (posts); `content/gallery` (gallery, fetched from outside json file" archetypes in `archetypes/`.
- Theme files are under `themes/blackpiratex/`.
- Static assets are split between `assets/` (processed by Hugo) and `static/` (served as-is).
- Serverless handler code is in `api/mood.js`.

## Build, Test, and Development Commands
- `hugo server -D` runs a local dev server and includes drafts.
- `hugo` builds the site output (static HTML).

## Coding Style & Naming Conventions
- Use YAML front matter in Markdown files (see `content/`), with ISO-8601 dates and quoted titles.
- Prefer kebab-case file names for new content (e.g., `content/blog/my-new-post.md`).
- Keep Hugo shortcodes in the `{{< >}}` form for consistency with existing pages.
- JavaScript in `api/` currently uses 4-space indentation; match existing style when editing.

## Testing Guidelines
- There is no automated test suite. Validate changes by running `hugo server -D` and checking pages in the browser.

## Commit & Pull Request Guidelines
- Recent commit messages are short and lowercase (e.g., "footer update"). Follow that pattern and keep summaries concise.
- PRs should describe the change, link any related issue, and include screenshots for visible UI/content changes when possible.

## Security & Configuration Tips
- `api/mood.js` reads `MOOD_API_TOKEN` from the environment. Do not commit secrets; use local env vars for development.
