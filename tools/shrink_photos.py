#!/usr/bin/env python3
"""Shrink photos for rishul.space before they go in /public.

A floating desktop photo never renders wider than ~101px, so a 3MB phone JPEG is
pure wasted page weight. This resizes to a 520px long edge, strips all EXIF
(including GPS), and writes a progressive JPEG.

Usage:
    python tools/shrink_photos.py                       # shrink every rishul-*.jpeg in public/
    python tools/shrink_photos.py photo1.jpg photo2.jpg  # shrink specific files in place
    python tools/shrink_photos.py --src <dir> --prefix rishul- --start 23
                                                         # import a folder -> public/rishul-<n>.jpeg
"""
import argparse
import glob
import os
import sys

from PIL import Image, ImageOps

PUBLIC = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public")


def shrink(src: str, dest: str, max_side: int = 520, quality: int = 82) -> tuple[int, int, tuple[int, int]]:
    before = os.path.getsize(src)
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")  # rotate upright, then drop all metadata
        im.thumbnail((max_side, max_side), Image.LANCZOS)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        im.save(dest, "JPEG", quality=quality, optimize=True, progressive=True)
        size = im.size
    return before, os.path.getsize(dest), size


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="*", help="files to shrink in place (default: every rishul-*.jpeg in public/)")
    ap.add_argument("--src", help="import a folder into public/ as rishul-<n>.jpeg")
    ap.add_argument("--prefix", default="rishul-")
    ap.add_argument("--start", type=int, default=1, help="first number to use with --src")
    ap.add_argument("--max-side", type=int, default=520)
    ap.add_argument("--quality", type=int, default=82)
    args = ap.parse_args()

    total_before = total_after = 0
    rows = []

    if args.src:
        sources = sorted(
            glob.glob(os.path.join(args.src, "*.jpg"))
            + glob.glob(os.path.join(args.src, "*.jpeg"))
            + glob.glob(os.path.join(args.src, "*.png")),
            key=os.path.getmtime,
        )
        if not sources:
            print(f"no images in {args.src}", file=sys.stderr)
            return 1
        for i, src in enumerate(sources, start=args.start):
            dest = os.path.join(PUBLIC, f"{args.prefix}{i}.jpeg")
            b, a, size = shrink(src, dest, args.max_side, args.quality)
            total_before += b
            total_after += a
            rows.append((os.path.basename(dest), size, b, a))
    else:
        targets = args.files or sorted(glob.glob(os.path.join(PUBLIC, "rishul-*.jpeg")))
        if not targets:
            print("nothing to do", file=sys.stderr)
            return 1
        for src in targets:
            b, a, size = shrink(src, src, args.max_side, args.quality)
            total_before += b
            total_after += a
            rows.append((os.path.basename(src), size, b, a))

    for name, size, b, a in rows:
        print(f"{name:24} {size[0]}x{size[1]:<6} {b / 1024:8.0f}KB -> {a / 1024:.0f}KB")
    print(f"\n{len(rows)} files: {total_before / 1e6:.1f}MB -> {total_after / 1024:.0f}KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
