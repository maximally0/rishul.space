// floating photos for the desktop.
//
// to add more: drop the image in /public and add one line below.
// `size` is the rendered width in px (default 100); height follows the aspect
// ratio of the source image, so portrait shots stay portrait.
//
// images are pre-shrunk with tools/shrink_photos.py — a floating thumbnail never
// renders wider than ~101px, so a full-res phone photo is wasted page weight.
export type DesktopPhoto = {
  src: string;
  /** rendered width in px */
  size?: number;
  alt?: string;
};

const ALT = "rishul chanana";

export const DESKTOP_PHOTOS: DesktopPhoto[] = [
  { src: "/rishul-1.jpeg", size: 77, alt: ALT },
  { src: "/rishul-2.jpeg", size: 95, alt: ALT },
  { src: "/rishul-3.jpeg", size: 71, alt: ALT },
  { src: "/rishul-4.jpeg", size: 98, alt: ALT },
  { src: "/rishul-5.jpeg", size: 74, alt: ALT },
  { src: "/rishul-6.jpeg", size: 89, alt: ALT },
  { src: "/rishul-7.jpeg", size: 80, alt: ALT },
  { src: "/rishul-8.jpeg", size: 83, alt: ALT },
  { src: "/rishul-9.jpeg", size: 87, alt: ALT },
  { src: "/rishul-10.jpeg", size: 73, alt: ALT },
  { src: "/rishul-11.jpeg", size: 101, alt: ALT },
  { src: "/rishul-12.jpeg", size: 74, alt: ALT },
  { src: "/rishul-13.jpeg", size: 92, alt: ALT },
  { src: "/rishul-14.jpeg", size: 78, alt: ALT },
  { src: "/rishul-15.jpeg", size: 71, alt: ALT },
  { src: "/rishul-16.jpeg", size: 96, alt: ALT },
  { src: "/rishul-18.jpeg", size: 90, alt: ALT },
  { src: "/rishul-19.jpeg", size: 81, alt: ALT },
  { src: "/rishul-20.jpeg", size: 99, alt: ALT },
  { src: "/rishul-21.jpeg", size: 77, alt: ALT },
  { src: "/rishul-22.jpeg", size: 93, alt: ALT },
];
