# Hack47

Delhi's first hacker house. A 30-day residency for 16 builders who ship fast, sleep less, and build what matters.

**Sept 15 – Oct 15 | Delhi**

## What is this

A Windows XP-themed website for Hack47, a hacker house residency in Delhi. The entire site is designed as an interactive desktop environment with draggable windows, floating animations, dynamic clouds, and a built-in "Sell Your Soul" application form.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP (GreenSock) + Draggable plugin
- **Fonts:** Anton, IBM Plex Mono
- **Deployment:** Netlify / Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Windows XP desktop environment with draggable, floating windows
- 2x2 grid layout that adapts to any screen size (no overlapping)
- Dynamic cloud layer with GSAP-animated drift and bob
- In-page typeform-style application ("Sell Your Soul") with field validation
- Photo gallery with prev/next navigation
- System specs, residents panel, and error dialogs
- Mobile users are blocked (intentionally) — desktop only experience
- Full SEO: Open Graph, Twitter Cards, sitemap, robots.txt, web manifest

## Mobile Policy

This site intentionally does not support mobile. If someone opens it on a phone, they get a full-screen blocker telling them to use a real computer. This is by design — the Windows XP desktop experience requires a proper screen.

## Structure

```
app/
  page.tsx        — Main desktop page + all window components
  layout.tsx      — Root layout, fonts, metadata/SEO
  globals.css     — Tailwind config, custom utilities, theme
  sitemap.ts      — Auto-generated sitemap
components/
  win-window.tsx  — Draggable, floating Windows XP window component
  taskbar.tsx     — Bottom taskbar with clock and active tasks
  desktop-icon.tsx — Desktop shortcut icons
public/
  favicon.ico, apple-touch-icon.png, android-chrome-*.png
  robots.txt, site.webmanifest
```

## License

Private. All rights reserved.
