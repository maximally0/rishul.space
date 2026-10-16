# rishul.space

my personal website. a windows 98-style desktop OS where everything floats, my photos run away from your cursor, and vibes are mandatory.

## what's on here

- **RISHUL.EXE** — who i am, one terminal boot sequence
- **NOW.TXT** — what i'm actively working on (Meritalien + a collapsible side projects drawer)
- **CONTACT.EXE** — twitter, linkedin, instagram, youtube, email
- **ABOUT.SYS** — the simple version
- **floating photos** — whimsical pics that scatter when you hover near them
- **clouds, sun, birds** — because vibes

## adding floating photos

the desktop photos live in `lib/photos.ts`. drop the image into `public/` and add one line:

```ts
{ src: "/rishul-9.jpeg", size: 110 },
```

`size` is the rendered width in px; height follows the image's own aspect ratio. the desktop lays them
in a ring around the edges and pushes them apart so none overlap, leaving the middle of the screen
clear for the windows, however many entries exist. the ring rotates on every page load.

images are pre-shrunk with `python tools/shrink_photos.py` before they go in `public/` (520px long
edge, EXIF stripped). a floating thumb never renders wider than ~101px, so a full-res phone photo is
just wasted page weight.

## tech

- next.js 16 (app router)
- tailwind css 4
- gsap (animations, draggable windows, floating photos)
- deployed on vercel

## run locally

```bash
git clone https://github.com/maximally0/rishul.space.git
cd rishul.space
npm install
npm run dev
```

> **important**: don't run this from a OneDrive/cloud-synced folder. the 30K+ files in node_modules will fight your cloud sync and crash everything.

## deploy

push to `master` → vercel auto-deploys to [rishul.space](https://rishul.space)

## license

do whatever you want with the code. the photos are mine tho.
