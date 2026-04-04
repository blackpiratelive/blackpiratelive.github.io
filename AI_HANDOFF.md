# AI Handoff Document - BlackPirateX Hugo Site

## Project Overview
- **Site**: Personal website for "BlackPirateX" (Sudip)
- **URL**: https://blackpiratex.com
- **Built with**: Hugo static site generator
- **Theme**: Custom "suckless" theme in `themes/suckless/`
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
├── themes/suckless/        # Main theme (active)
│   ├── layouts/            # Template layouts
│   │   ├── baseof.html     # Base template
│   │   ├── _partials/      # Partials (header, footer, head)
│   │   ├── shortcodes/     # Custom shortcodes
│   │   ├── books/          # Book list/single layouts
│   │   ├── thoughts/       # Thoughts layouts
│   │   └── gallery/        # Gallery layouts
│   └── theme.toml          # Theme config
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
theme = 'suckless'

[outputs]
  home = ["HTML", "RSS", "JSON"]
```

**Theme menu** (defined in `config.toml`):
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

Located in `themes/suckless/layouts/shortcodes/`:

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

- **Main CSS**: Inline in `themes/suckless/layouts/_default/baseof.html`
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
Edit `config.toml` under `[menus]` section

---

## Notes

- **Drafts**: Use `draft: true` in front matter, visible with `hugo server -D`
- **RSS/JSON**: Home page outputs RSS and JSON (see `config.toml` `[outputs]`)
- **Gallery**: Fetched from external JSON (per AGENTS.md)
- **Testing**: No automated tests - validate manually via browser

---

## OS Experience (/os)

- **Route**: `/os/` from `content/os.md` using `type: "os"`.
- **Layout**: `themes/html/layouts/os/single.html` (standalone HTML, no header/footer).
- **Assets**:
  - CSS: `assets/css/os.css`
  - JS: `assets/js/os.js`
  - Animation lib: `assets/js/vendor/anime.min.js` (loaded only on `/os`).
- **Design**: Retro OS UI with boot + login, draggable/resizable windows, taskbar, start menu.
- **Login flow**: Skippable login overlay (auto types 8 dots) before boot sequence.
- **Apps**:
  - About, Blog, Projects, Contact, Guestbook, Calendar, Photos.
  - Desktop icons: Blog, Guestbook, Photos.
  - Start menu: full app list with search.
- **Calendar**: Month view with date selection; shows `thoughts` content by date (build-time JSON embed).
- **Weather/Clock**: Open-Meteo (Kolkata) + 24h time with seconds/date; shown on desktop and taskbar.
- **Guestbook**: Uses shortcode `{{< guestbook >}}` in the OS window; OS-scoped styling in `assets/css/os.css`.
- **Photos**: Split view (thumb list + preview) fed from `https://gallery.blackpiratex.com/index.json`, with fullscreen overlay.
- **Animations**: anime.js-driven transitions for boot, windows, start menu, calendar, taskbar hover, widgets (skips Photos app).

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

- Homepage uses a simple hero + content layout in `themes/suckless/layouts/home.html` with inline styling from `themes/suckless/layouts/_default/baseof.html`.
- Left column includes the about content, featured gallery items, recent books, recent blog posts, recent thoughts, and the WebSutra promo.

### WebSutra API Integration

- API endpoint used: `https://webring.blackpiratex.com/api/latest`
- Client-side fetch implemented inline in `themes/suckless/layouts/home.html`

### Notable Styling / Layout Changes

- Styling is inline within `themes/suckless/layouts/_default/baseof.html`.

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

- Guestbook UI additions are in the inline CSS within `themes/suckless/layouts/_default/baseof.html`.
- Added styles for:
  - `.gbw-owner-reply`
  - `.gbw-owner-tag`
  - `.gbw-entry-actions`
  - `.gbw-action-btn`, `.gbw-inline-btn`
  - `#guestbook-reply-context`
  - `.guestbook-powered-by`

---

## Blog Comment Updates (March 2026)

- Comment section appears below post content in `themes/suckless/layouts/blog/single.html`.
- **Rate Limiting**: Added a client-side wait timer that requires visitors to stay on the page for at least 60 seconds before submitting a comment.
  - The submit button is disabled and shows a countdown (e.g., "Post Comment (45s)").
  - Once the timer expires, the button is enabled and returns to its original state.
- **Honeypot**: Added a hidden field `website_url_check` to the form.
  - Submissions with this field filled are treated as bot spam.
- Styled to match the website theme and Guestbook UI via inline CSS in `themes/suckless/layouts/_default/baseof.html`.
  - Improved date formatting in `renderComment` using `toLocaleDateString`.
  - Added responsive behavior for mobile (stacking form fields, reduced reply indentation).
- API wiring remains connected to `https://guestbook.blackpiratex.com`.
- Styles live inline in `themes/suckless/layouts/_default/baseof.html`.

---

## Likes Integration (April 2026)

- **API Endpoint**: `https://tools.blackpiratex.com/api/likes`
- **Owner Username**: `sudip`
- **Endpoints**: Single POST with actions `like`, `get`, `summary`
- **Where it appears**:
  - Blog posts: `themes/suckless/layouts/blog/single.html`
  - Thoughts list: `themes/suckless/layouts/thoughts/list.html`
  - Thought single: `themes/suckless/layouts/thoughts/single.html`
- **Implementation**:
  - Inline JS and CSS in `themes/suckless/layouts/_default/baseof.html`
  - Uses `data-like-url` with `{{ .Permalink }}` for stable `post_url`
  - Local cache (localStorage) for counts with 15-minute TTL
  - One-like-per-user enforced client-side via localStorage flag
