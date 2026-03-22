# AI Handoff Document - BlackPirateX Hugo Site

## Project Overview
- **Site**: Personal website for "BlackPirateX" (Sudip)
- **URL**: https://blackpiratex.com
- **Built with**: Hugo static site generator
- **Theme**: Custom "html" theme in `themes/html/`
- **Build**: Static HTML generated from Markdown content

---

## Directory Structure

```
├── config.toml              # Site configuration (baseURL, title, theme, outputs)
├── content/                # All Markdown content
│   ├── about.md            # About page
│   ├── blog/               # Blog posts
│   ├── thoughts/           # Microblog/daily thoughts (date-organized)
│   ├── gallery/            # Gallery section
│   ├── books/              # Book notes
│   ├── movies.md           # Movie recommendations
│   ├── music.md            # Music section
│   ├── uses.md             # Uses page (tools/software)
│   ├── now.md              # Now page
│   ├── contact.md          # Contact page
│   ├── search.md           # Search page
│   └── [other pages]
├── themes/html/            # Main theme (active)
│   ├── layouts/            # Template layouts
│   │   ├── baseof.html     # Base template
│   │   ├── _partials/      # Partials (header, footer, head)
│   │   ├── shortcodes/     # Custom shortcodes
│   │   ├── books/          # Book list/single layouts
│   │   ├── thoughts/       # Thoughts layouts
│   │   └── gallery/        # Gallery layouts
│   ├── assets/             # CSS/JS processed by Hugo
│   ├── static/             # Static assets (fonts, images)
│   └── hugo.toml           # Theme config
├── layouts/                # Root-level overrides
│   └── shortcodes/         # Custom shortcodes (guestbook, s)
├── api/                    # Serverless functions
│   └── mood.js             # Mood tracker API (reads MOOD_API_TOKEN env var)
├── assets/                 # Site assets (images, movies)
├── static/                 # Served as-is (favicon, etc.)
└── public/                 # Generated output (don't edit)
```

---

## Configuration

**config.toml** (`/`):
```toml
baseURL = 'https://blackpiratex.com'
languageCode = 'en-us'
title = 'BlackPirateX'
theme = 'html'

[outputs]
  home = ["HTML", "RSS", "JSON"]
```

**Theme menu** (defined in `themes/html/hugo.toml`):
- Home (`/`)
- Thoughts (`/thoughts`)
- Blog (`/blog`)
- Gallery (`/gallery`)
- Book Notes (`/books`)
- Uses (`/uses`)

---

## Content Types

### Front Matter Format (YAML)
All content uses YAML front matter with ISO-8601 dates:
```yaml
---
title: "Page Title"
date: 2024-01-15T10:30:00+05:30
draft: true
---
```

### Content Sections

| Section | Path | Description |
|---------|------|-------------|
| Pages | `content/*.md` | Static pages (about, uses, now, etc.) |
| Blog | `content/blog/` | Long-form blog posts |
| Thoughts | `content/thoughts/` | Microblog posts, organized by year |
| Gallery | `content/gallery/_index.md` | Photo gallery |
| Books | `content/books/_index.md` | Book notes/reviews |
| Archive | `content/archive/` | Year-based archives |

### File Naming
- Use **kebab-case** for filenames (e.g., `my-new-post.md`)
- Thoughts use date-prefixed format: `2024-01-15-10-30-30.md`

---

## Available Shortcodes

Located in `themes/html/layouts/shortcodes/`:

| Shortcode | Usage | Example |
|-----------|-------|---------|
| `{{< box >}}` | Styled content box | `{{< box >}}content{{< /box >}}` |
| `{{< image >}}` | Image with caption | `{{< image >}}/path/img.png{{< /image >}}` |
| `{{< image-rounded >}}` | Rounded image | `{{< image-rounded >}}/path/img.png{{< /image-rounded >}}` |
| `{{< gallery >}}` | Image gallery | `{{< gallery >}}` |
| `{{< gal >}}` | Gallery variant | `{{< gal >}}` |
| `{{< video >}}` | Video embed | `{{< video >}}` |
| `{{< code >}}` | Code block | `{{< code >}}` |
| `{{< box-start >}}` | Box start | `{{< box-start >}}` |
| `{{< box-end >}}` | Box end | `{{< box-end >}}` |
| `{{< flashcard >}}` | Flashcard | `{{< flashcard >}}` |
| `{{< lightbox >}}` | Lightbox image | `{{< lightbox >}}` |
| `{{< contact-form >}}` | Contact form | `{{< contact-form >}}` |
| `{{< img >}}` | Image alt | `{{< img >}}` |
| `{{< imgc >}}` | Image with caption | `{{< imgc >}}` |

---

## Development Commands

```bash
# Start local dev server (includes drafts)
hugo server -D

# Build static site
hugo

# Build for production (no drafts)
hugo --buildDrafts=false
```

---

## API - Mood Tracker

**File**: `api/mood.js`

A serverless function that fetches mood data from an external API.

- **Environment Variable**: `MOOD_API_TOKEN` (required)
- **API Endpoint**: `https://mood-tracker.blackpiratex.com/api/external`
- **Usage**: Fetches today's mood entry and displays emoji + label
- **Error Handling**: Returns "could not load mood data" on failure

**Note**: Do not commit secrets. Use local environment variables for development.

---

## Custom Root Shortcodes

Located in `layouts/shortcodes/`:

- `guestbook.html` - Guestbook functionality
- `s.html` - Unknown purpose (check content usage)

---

## Styling

- **Main CSS**: `themes/html/assets/css/main.css`
- **Fonts**: Montserrat (400, 700, 400-italic), Alfa Slab One, Lora, Betania Patmos
- **CSS Framework**: Custom (no major framework detected)

---

## Common Tasks

### Add a new blog post
```bash
# Create file: content/blog/my-new-post.md
# Use front matter:
---
title: "My New Post"
date: 2026-03-16T12:00:00+05:30
draft: true
---
```

### Add a new thought
```bash
# Create file: content/thoughts/2026/2026-03-16-12-00-00.md
# Use front matter with date in filename
```

### Add images
- Put images in `assets/` (processed by Hugo)
- Or in `static/` (served directly)

### Update navigation
Edit `themes/html/hugo.toml` under `[menus]` section

---

## Notes

- **Drafts**: Use `draft: true` in front matter, visible with `hugo server -D`
- **RSS/JSON**: Home page outputs RSS and JSON (see `config.toml` `[outputs]`)
- **Gallery**: Fetched from external JSON (per AGENTS.md)
- **Testing**: No automated tests - validate manually via browser

---

## External Dependencies

- Mood Tracker API: `https://mood-tracker.blackpiratex.com`
- Hosting: Netlify (implied by `netlify.toml`, `sitemap-netlify.xml`)
- CDN: External gallery images

---

## Security

- `api/mood.js` requires `MOOD_API_TOKEN` environment variable
- Never commit secrets or API keys
- Use `.gitignore` for sensitive files

---

## Recent Homepage Updates (March 2026)

- Homepage uses a full-width, two-column layout in `themes/html/layouts/home.html` and `themes/html/assets/css/main.css`.
- Left column now contains:
  - About + interests content (`{{ .Content }}` from `themes/html/content/_index.md`)
  - Featured gallery images (3 items, prefers `featured: true` gallery entries)
  - Latest read books (3 items from `books` section where `Params.shelf == "read"`)
- Right column now contains:
  - Recent blog posts (5 items)
  - Recent thoughts (3 items)
  - WebSutra members list (fetched from API) and WebSutra ad banner
- Mobile behavior:
  - Main homepage columns stack
  - Featured pics and latest books use compact single-row 3-column thumbnail grids

### WebSutra API Integration

- API endpoint used: `https://webring.blackpiratex.com/api/latest`
- Client-side fetch implemented in `themes/html/assets/js/main.js`
- Renders member title + URL in the homepage right column (`[data-webring-list]`)
- Includes loading, empty, and error states via `[data-webring-status]`

### Notable Styling / Layout Changes

- Header and hero already use full-width breakout layout.
- Homepage two-column area also uses breakout/full-width behavior.
- Hero keeps cropped mobile image behavior (`background-size: cover`).
- Lora font is active for body text via local font files in `themes/html/static/fonts/`.

---

## Guestbook Updates (March 2026)

- Guestbook shortcode updated in `layouts/shortcodes/guestbook.html`.
- Entries are now rendered as threaded conversations, so replies appear directly below the entry they respond to.
- Owner replies are visually indented and include an `OWNER` tag for clear identification.
- Added per-entry actions:
  - `Like` button
  - `Reply` button (sets `parent_id` and shows reply context above the form)
- Like API wiring now matches backend docs:
  - `PUT https://sudip-gb.blackpiratex.com/api/entries`
  - Body: `{ "action": "like", "id": <entry id> }`
- Reply creation continues via:
  - `POST https://sudip-gb.blackpiratex.com/api/entries`
  - Uses `parent_id` when replying to an existing entry.
- Added a small attribution below the form:
  - `Powered by BlackPirateX's Guestbook`
  - Links to `https://guestbook.blackpiratex.com`

### Guestbook Styling

- Guestbook UI additions are in `themes/html/assets/css/main.css`.
- Added styles for:
  - `.gbw-owner-reply`
  - `.gbw-owner-tag`
  - `.gbw-entry-actions`
  - `.gbw-action-btn`, `.gbw-inline-btn`
  - `#guestbook-reply-context`
  - `.guestbook-powered-by`
