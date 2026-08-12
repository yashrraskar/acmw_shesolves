# SheSolves 2026 — ACM-W Event Landing Page

A responsive landing page for **SheSolves 2026**, an ACM-W chapter event at PCCOE Pune.
*Code. Create. Empower.*

**Venue:** New Computer Department Library, PCCOE, Pune 61  
**Date:** Saturday, September 19, 2026 | 9:00 AM – 6:00 PM  
**Contact:** acmw@pccoepune.org

🌐 **[View Live](https://acmw-shesolves.onrender.com)**

**Live structure:** `index.html` + `css/styles.css` + `js/script.js`, no build step, no external framework.

---

## Technologies used

- **HTML5** — semantic sectioning (`header`, `main`, `section`, `footer`), accessible landmarks and form markup.
- **CSS3** — custom properties (design tokens) for color/type/spacing, CSS Grid and Flexbox for layout, no CSS framework.
- **Vanilla JavaScript (ES5-friendly)** — no dependencies, no build tooling.
- **Google Fonts** — `Space Grotesk` (display), `IBM Plex Sans` (body), `IBM Plex Mono` (labels, timestamps, data).
- Custom inline **SVG** icons and a bespoke brand mark — no stock photography, so there's nothing to license or attribute.

## Design approach

The visual identity is built around a **node-and-connector motif** (three colored dots joined by lines), which echoes both a solved graph/path — a nod to algorithmic problem-solving — and the "connecting people" idea at the heart of ACM-W. That motif reappears as the brand mark, the schedule's vertical timeline, and the hero background.

- **Color:** deep indigo-black (`#1A1533`) paired with warm paper (`#FBF8F3`), with violet, coral, and mint as the three accent colors (also the three dots in the mark).
- **Type:** `Space Grotesk` for headings gives a technical, geometric personality distinct from generic sans defaults; `IBM Plex Mono` is used for timestamps, tags, and data-like labels to reinforce the "code" theme; `IBM Plex Sans` carries body copy for readability.
- **Layout:** hero → about → date/time/venue → schedule timeline → why-participate grid → registration → footer, matching the brief's required sections in order.

## Features added

- Fully responsive layout (mobile nav with hamburger toggle, fluid type via `clamp()`, stacking grids under 900px/720px breakpoints).
- Sticky, blurred header nav with scroll-based active-link highlighting.
- Animated **countdown timer** to the event date/time.
- **Scroll-reveal** animations on section entry, automatically disabled when the browser's `prefers-reduced-motion` is set.
- A working front-end **registration form** with inline validation and a confirmation message (no backend — see "What I'd improve").
- "Back to top" button that appears after scrolling.
- Keyboard-accessible skip link and visible focus states throughout.
- Custom SVG favicon and icon set (no external image requests beyond Google Fonts).

## What I would improve with more time

- Wire the registration form to a real backend or form service (e.g. Google Forms, Formspree, or a small serverless function) instead of the current front-end-only demo.
- Add a real photo/illustration layer (past-event photography or chapter-specific illustration) once assets are available, with `srcset` for responsive image loading.
- Add a light/dark theme toggle and run a full accessibility pass with a screen reader.
- Add an FAQ section and a sponsor/partner logo strip.
- Set up GitHub Pages / CI so the `main` branch deploys automatically.
- Add basic analytics (privacy-respecting, e.g. Plausible) to see which sections get read before people register.

---

## Running locally

No build step required. Either:

1. Open `index.html` directly in a browser, or
2. Serve it locally for the best experience with relative paths:
   ```bash
   python3 -m http.server 8000
   # then visit http://localhost:8000
   ```

## Deploying to GitHub

```bash
git init
git add .
git commit -m "SheSolves 2026 landing page"
git branch -M main
git remote add origin https://github.com/<your-username>/shesolves-2026.git
git push -u origin main
```

Then enable **GitHub Pages** (Settings → Pages → Deploy from branch → `main` / root) to get a live link to submit alongside the repo URL.
