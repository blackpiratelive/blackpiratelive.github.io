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

[markup]
  [markup.goldmark]
    [markup.goldmark.extensions]
      footnote = true
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

### Blog Enhancements (April 2026)

- **Cover images**: Blog posts can use `cover` front matter (path in `assets/`), rendered as WebP on the post page and used for OG/Twitter sharing.
  - Example: `cover: "img/my-cover.jpg"`
  - Optional: `cover_alt: "Alt text"`
- **Post meta**: Blog single page shows date, word count, reading time, and tags in a single meta row.
- **Footnotes**: Enabled globally via Goldmark. Use standard Markdown footnote syntax in any content.
- **Tag pages**: Tag term pages split content into Blog/Thoughts/Gallery sections; thoughts show content with clickable date links.

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
- **Gallery shortcode**: `{{< gal >}}` uses justifiedGallery only; no LightGallery integration.
- **Footer tags**: Footer includes a Tags section listing all tags by count.
- **Testing**: No automated tests - validate manually via browser
- **Stats page**: `/stats/` uses `content/stats/index.md` with layout `themes/suckless/layouts/stats/single.html` to show yearly word/post counts for blog, thoughts, books, and gallery entries. Charts are rendered with local Chart.js at `static/vendor/chart.umd.min.js`. Footer Browse section links to `/stats`.

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

---

## Umami Visitor Counter (April 2026)

- **Counter Text**: "You are the Nth visitor" in `themes/suckless/layouts/_partials/footer.html`
- **Hero Subtitle**: Uses visitor count in `themes/suckless/layouts/home.html` with fallback to "Hello, I am" when unavailable
- **Client Fetch**: `/api/visitors` with localStorage cache (30-minute TTL) in `themes/suckless/layouts/_default/baseof.html`
- **Vercel Function**: `api/visitors.js`
  - Authenticates via `POST /api/auth/login`
  - Attempts v2 stats: `/api/websites/{id}/stats?startAt&endAt`
  - Falls back to v1 metrics: `/api/websites/{id}/metrics?type=visitors&startAt&endAt`
- **Environment Variables**:
  - `UMAMI_BASE_URL=https://u-one-livid.vercel.app`
  - `UMAMI_USERNAME=...`
  - `UMAMI_PASSWORD=...`
  - `UMAMI_SITE_ID=80888a44-8645-40c5-9c06-a1e5a2da24fc`
  - `UMAMI_START_DATE=2025-11-02`

---

## Thoughts Page Redesign (April 2026)

- **Layout**: Changed from flat card list to a **timeline micro feed** with a vertical left-border spine
- **Date Grouping**: Uses Hugo's `.GroupByDate "January 2, 2006"` to cluster thoughts by day
- **Date Labels**: Sticky dark (`#222`) labels with a teal (`#005577`) dot, positioned against the timeline spine
- **Animation**: `@keyframes date-slide-in` — date labels fade + slide in from the left on page load
- **Thought Cards**: Left accent border (`3px solid #ccc`) that turns teal on hover, with subtle `translateY(-1px)` elevation and box-shadow
- **Timestamps**: Displayed in monospace, linked to individual thought pages via `.RelPermalink`
- **Tags**: Styled as small bordered pills with hover accent
- **RSS Button**: Styled as a minimal outlined pill (`#eee` background, `#ccc` border) in the page header
- **Header**: `h1` downsized to `1.3rem` with a `#005577` bottom-border accent

### Files Changed
- `themes/suckless/layouts/thoughts/list.html` — template rewrite with date grouping
- `themes/suckless/layouts/_default/baseof.html` — inline CSS for timeline, date labels, cards, animations

---

## Homepage Redesign (April 2026)

- **Hero**: Changed from centered large photo + text to a compact left-aligned layout (`.hero-compact`):
  - 80px avatar inline with name + greeting text (font-size 1.6rem)
  - Visitor counter woven into a casual sentence: "Hello, Nth visitor — welcome to my corner of the web"
  - Status line showing latest thought (fetched at build time from `/thoughts`), displayed in monospace with a pulsing teal dot
- **Animations (CSS-only)**:
  - `@keyframes fade-up`: all `.home-section` elements fade in + slide up with staggered `animation-delay` (0.06s increments)
  - `@keyframes pulse-border`: avatar border pulses between `#ccc` and `#005577` once on load
  - `@keyframes blink`: used for the `/now` teaser cursor
- **Blog Posts**: Styled as a list with monospace dates, transparent left-border that turns teal on hover
- **Recent Thoughts**: Uses the same thought-card style from the timeline redesign, with a "→ all thoughts" monospace link
- **Now Teaser**: A dark (`#222`) terminal-style box: `$ cat /now` with a blinking teal cursor, links to `/now/`
- **WebSutra**: Kept as-is with the existing `web1-ad` styling
- **Layout**: Single column flow, no sidebar or multi-column grid
- **Mobile**: Avatar shrinks to 60px, hero-name to 1.3rem, status text to 0.78rem

### Files Changed
- `themes/suckless/layouts/home.html` — full template rewrite
- `themes/suckless/layouts/_default/baseof.html` — inline CSS for homepage styles, animations

---

## Blog List Redesign (April 2026)

- **Layout**: Same style as homepage blog posts — monospace `Jan 02` dates, left accent border turning teal on hover
- **Tags**: Displayed inline as small `.tag-pill` badges after each post title
- **Header**: Same styled header with RSS pill button (`.btn-rss`) as thoughts page

### Files Changed
- `themes/suckless/layouts/blog/list.html` — template rewrite
- `themes/suckless/layouts/_default/baseof.html` — `.blog-entry`, `.blog-tags` CSS

---

## WebSutra Ad Styling (April 2026)

- **Homepage ad** (`.web1-ad`): Retro flashy dark banner with:
  - Animated border cycling teal → red → orange (`@keyframes ad-border-cycle`)
  - Shimmer gradient text on "Join WebSutra" (`@keyframes ad-text-shimmer`)
  - Scanline overlay sweeping top-to-bottom (`@keyframes ad-scanline`)
  - Pulsing glow matching border colors (`@keyframes ad-glow`)
  - "Are you an Indian? 🇮🇳" question text, star decorators
- **Footer ad** (`.footer-websutra`): Compact one-line dark banner with:
  - Magenta border, cyan "WebSutra" text
  - Sparkle stars cycling magenta → cyan → yellow (`@keyframes fws-sparkle`)
  - Hover changes border to cyan

### Files Changed
- `themes/suckless/layouts/home.html` — WebSutra ad markup update
- `themes/suckless/layouts/_partials/footer.html` — compact footer banner added
- `themes/suckless/layouts/_default/baseof.html` — retro ad CSS + footer banner CSS
