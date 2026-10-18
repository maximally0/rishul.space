"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Monitor, Trash2, Globe, Coffee } from "lucide-react";
import { WinWindow } from "@/components/win-window";
import { DesktopIcon } from "@/components/desktop-icon";
import { Taskbar } from "@/components/taskbar";
import { cn } from "@/lib/utils";
import { DESKTOP_PHOTOS } from "@/lib/photos";

const SIDE_PROJECTS = [
  { label: "hack47.org", url: "https://hack47.org", note: "hacker houses around india" },
  { label: "maxmomentum.co", url: "https://maxmomentum.co", note: "ai-native growth infrastructure: gtm, media, distribution" },
  { label: "loftrobotics.org", url: "https://loftrobotics.org" },
  { label: "salesclaw.app", url: "https://salesclaw.app" },
];

const PHOTO_SRCS = DESKTOP_PHOTOS.map((p) => p.src);

function computeWindowLayout() {
  if (typeof window === "undefined") {
    return { main: { x: 100, y: 30 }, now: { x: 550, y: 30 }, contact: { x: 350, y: 180 }, about: { x: 300, y: 200 } };
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const iconCol = 85;
  const taskbarH = 36;
  const gutter = 12;
  const availW = vw - iconCol - gutter * 3;
  const availH = vh - taskbarH - gutter * 3;
  const colW = Math.floor(availW / 2);
  const col1X = iconCol + gutter;
  const col2X = iconCol + gutter + colW + gutter;
  const row1Y = gutter + 20;
  const centerX = iconCol + Math.floor(availW / 2) - 130;
  const centerY = Math.floor(availH / 2) - 80;

  return {
    main: { x: col1X, y: row1Y },
    now: { x: col2X, y: row1Y },
    contact: { x: centerX, y: centerY },
    about: { x: col1X + 40, y: Math.floor(availH / 2) + 20 },
  };
}

export default function DesktopPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) return <MobileView />;
  return <DesktopView />;
}

// ─── Whimsical Photos that float around and run from cursor ──────────────────

function FloatingPhotos() {
  const containerRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLImageElement[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    if (!containerRef.current) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const taskbarH = 36;
    const n = DESKTOP_PHOTOS.length;

    // Photos sit in a ring around the edges of the desktop, never in the middle.
    // Even spacing around the perimeter keeps them from bunching up, and the
    // inward push is capped so the centre stays clear for the windows.
    const pad = 10;
    const H = vh - taskbarH;
    const w = vw - pad * 2;
    const h = H - pad * 2;
    const perim = 2 * (w + h);
    const maxPush = Math.min(vw, H) * 0.26;
    // rotate the ring on every load so the arrangement is never the same twice
    const offset = Math.random();

    const clamp = (lo: number, v: number, hi: number) => Math.max(lo, Math.min(v, hi));

    const slots = DESKTOP_PHOTOS.map((photo, i) => {
      const size = photo.size ?? 100;

      // walk the rectangle perimeter to get an evenly spaced starting slot
      let d = ((offset + i / n) % 1) * perim;
      let bx: number;
      let by: number;
      if (d < w) {
        bx = pad + d; by = pad;
      } else if (d < w + h) {
        d -= w; bx = pad + w; by = pad + d;
      } else if (d < 2 * w + h) {
        d -= w + h; bx = pad + w - d; by = pad + h;
      } else {
        d -= 2 * w + h; bx = pad; by = pad + h - d;
      }

      // nudge it inward by a random amount, so it reads as scatter rather than
      // a tidy frame, then keep the whole tile on screen
      const push = Math.random() * maxPush;
      const vx = pad + w / 2 - bx;
      const vy = pad + h / 2 - by;
      const len = Math.hypot(vx, vy) || 1;

      return {
        x: clamp(-8, bx + (vx / len) * push, vw - size - 10),
        y: clamp(34, by + (vy / len) * push, vh - taskbarH - size * 1.34 - 4),
        tw: size,
        th: size * 1.34,
      };
    });

    // nudge apart anything that landed on top of anything else, so the tiles
    // read as separate photos instead of a pile
    const keepOnScreen = (s: { x: number; y: number; tw: number; th: number }) => {
      s.x = clamp(-8, s.x, vw - s.tw - 10);
      s.y = clamp(34, s.y, vh - taskbarH - s.th - 4);
    };

    for (let pass = 0; pass < 4; pass++) {
      for (let a = 0; a < slots.length; a++) {
        for (let b = a + 1; b < slots.length; b++) {
          const A = slots[a];
          const B = slots[b];
          const overlapX = (A.tw + B.tw) * 0.62 - Math.abs(B.x - A.x);
          const overlapY = (A.th + B.th) * 0.62 - Math.abs(B.y - A.y);
          if (overlapX > 0 && overlapY > 0) {
            if (overlapX < overlapY) {
              const shove = (B.x < A.x ? -1 : 1) * overlapX * 0.5;
              A.x -= shove;
              B.x += shove;
            } else {
              const shove = (B.y < A.y ? -1 : 1) * overlapY * 0.5;
              A.y -= shove;
              B.y += shove;
            }
          }
        }
      }
      slots.forEach(keepOnScreen);
    }

    photosRef.current.forEach((img, i) => {
      if (!img || !slots[i]) return;

      gsap.set(img, {
        x: slots[i].x,
        y: slots[i].y,
        rotation: (Math.random() - 0.5) * 22,
        scale: 0.92 + Math.random() * 0.16,
      });

      // gentle float, kept small so nothing drifts back into the middle
      gsap.to(img, {
        x: `+=${(Math.random() - 0.5) * 34}`,
        y: `+=${(Math.random() - 0.5) * 26}`,
        rotation: (Math.random() - 0.5) * 8,
        duration: 4 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 3,
      });
    });

    // Track mouse
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    // Repel from cursor
    const repelInterval = setInterval(() => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      photosRef.current.forEach((img) => {
        if (!img) return;
        const rect = img.getBoundingClientRect();
        const imgCenterX = rect.left + rect.width / 2;
        const imgCenterY = rect.top + rect.height / 2;
        const dx = imgCenterX - mx;
        const dy = imgCenterY - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          const force = (200 - dist) / 200;
          const angle = Math.atan2(dy, dx);
          gsap.to(img, {
            x: `+=${Math.cos(angle) * force * 80}`,
            y: `+=${Math.sin(angle) * force * 80}`,
            rotation: `+=${(Math.random() - 0.5) * 20}`,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
    }, 100);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      clearInterval(repelInterval);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-[3] overflow-hidden">
      {DESKTOP_PHOTOS.map((photo, i) => (
        <img
          key={photo.src}
          ref={(el) => { if (el) photosRef.current[i] = el; }}
          src={photo.src}
          alt={photo.alt ?? ""}
          className="absolute h-auto max-h-[180px] object-cover rounded border-[3px] border-white shadow-[4px_4px_20px_rgba(0,0,0,0.4)] opacity-80 hover:opacity-100 transition-opacity pointer-events-auto"
          style={{ width: photo.size ?? 100, willChange: "transform" }}
        />
      ))}

    </div>
  );
}

// ─── Nature Layer (clouds, sun, birds) ───────────────────────────────────────

function NatureLayer() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!layerRef.current) return;
    const clouds = layerRef.current.querySelectorAll(".cloud");
    clouds.forEach((cloud, i) => {
      gsap.fromTo(cloud,
        { x: -300 },
        { x: window.innerWidth + 300, duration: 55 + i * 18, repeat: -1, ease: "none", delay: i * 12 }
      );
    });
    const birds = layerRef.current.querySelectorAll(".bird");
    birds.forEach((bird, i) => {
      gsap.fromTo(bird,
        { x: -80, y: 140 + Math.random() * 80 },
        { x: window.innerWidth + 80, y: 120 + Math.random() * 60, duration: 22 + i * 8, repeat: -1, ease: "none", delay: i * 6 }
      );
    });
  }, []);

  return (
    <div ref={layerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      <div className="cloud absolute top-[18%] w-[280px] h-[70px] bg-white/25 rounded-full blur-md" />
      <div className="cloud absolute top-[30%] w-[350px] h-[90px] bg-white/18 rounded-full blur-lg" />
      <div className="cloud absolute top-[45%] w-[220px] h-[55px] bg-white/15 rounded-full blur-md" />
      <div className="cloud absolute top-[55%] w-[300px] h-[65px] bg-white/12 rounded-full blur-lg" />
      {[0, 1, 2, 3].map((i) => (
        <svg key={i} className="bird absolute w-6 h-4 opacity-50" viewBox="0 0 24 12">
          <path d="M0 6 Q6 0 12 6 Q18 0 24 6" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" />
        </svg>
      ))}
      <div className="absolute top-4 right-6 w-24 h-24 md:w-32 md:h-32">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-500 shadow-[0_0_80px_rgba(255,200,0,0.7),0_0_160px_rgba(255,150,0,0.3)] animate-pulse" />
      </div>
      <div className="absolute top-14 right-28 w-48 h-[2px] bg-gradient-to-r from-transparent via-yellow-200/60 to-transparent rotate-[-15deg]" />
      <div className="absolute top-20 right-12 w-36 h-[1px] bg-gradient-to-r from-transparent via-orange-200/40 to-transparent rotate-[20deg]" />
    </div>
  );
}

// ─── Mobile View ─────────────────────────────────────────────────────────────

function MobileView() {
  return (
    <div className="min-h-screen text-white font-mono p-4 pb-20" style={{
      background: "linear-gradient(180deg, #1a6b8a 0%, #2d8a6e 30%, #1a5c3a 100%)"
    }}>
      <div className="mb-6 p-4 bg-black/30 backdrop-blur-sm border border-white/10 rounded">
        <h1 className="font-[var(--font-anton)] text-4xl tracking-tight mb-1">RISHUL.SPACE</h1>
        <p className="text-xs text-white/60">the personal OS of rishul chanana</p>
      </div>
      <MobileCard title="RISHUL.EXE"><RishulBio /></MobileCard>
      <MobileCard title="NOW.TXT"><NowContent /></MobileCard>
      <MobileCard title="CONTACT.EXE"><ContactContent /></MobileCard>
      <MobileCard title="ABOUT.SYS"><AboutContent /></MobileCard>

      {/* Photo scatter */}
      <div className="mt-4 mb-4 overflow-x-auto flex gap-2 pb-2">
        {PHOTO_SRCS.map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" className="h-28 w-auto object-cover rounded border-2 border-white/30 shrink-0 shadow-lg" style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (2 + i)}deg)` }} />
        ))}
      </div>
      <div className="mt-4 text-center text-[9px] text-white/40 border-t border-white/10 pt-4">
        <p>rishul.space © 2026</p>
      </div>
    </div>
  );
}

function MobileCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 bg-[#c0c0c0] win-border-outset overflow-hidden">
      <div className="bg-gradient-to-r from-[#0058ee] to-[#3789f8] px-2 py-1 text-[11px] font-bold text-white">{title}</div>
      <div className="p-0.5 m-[3px] win-border-inset bg-white text-black">{children}</div>
    </div>
  );
}

// ─── Desktop View ────────────────────────────────────────────────────────────

function DesktopView() {
  const [openWindows, setOpenWindows] = useState<Record<string, boolean>>({
    main: true,
    now: true,
    contact: true,
    about: false,
  });
  const [windowOrder, setWindowOrder] = useState<string[]>(["contact", "main", "now", "about"]);
  const [clippyVisible, setClippyVisible] = useState(false);
  const [layout, setLayout] = useState(computeWindowLayout);

  useEffect(() => { setLayout(computeWindowLayout()); }, []);

  const toggleWindow = (id: string, state?: boolean) => {
    setOpenWindows((prev) => ({ ...prev, [id]: state ?? !prev[id] }));
    if (state !== false) bringToFront(id);
  };
  const bringToFront = (id: string) => setWindowOrder((prev) => [id, ...prev.filter((w) => w !== id)]);
  const getZIndex = (id: string) => 100 - windowOrder.indexOf(id);

  const activeTasks = Object.entries(openWindows)
    .filter(([_, isOpen]) => isOpen)
    .map(([id]) => ({ id, title: getWindowTitle(id) }));

  function getWindowTitle(id: string) {
    switch (id) {
      case "main": return "RISHUL.EXE";
      case "now": return "NOW.TXT";
      case "contact": return "⚡ CONTACT.EXE";

      case "about": return "ABOUT.SYS";
      default: return id;
    }
  }

  return (
    <div
      className="desktop-environment relative w-full h-screen overflow-hidden font-win"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&w=2000&q=80&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Nature — clouds, sun, birds */}
      <NatureLayer />

      {/* Your photos floating whimsically and running from cursor */}
      <FloatingPhotos />

      {/* Desktop Icons */}
      <div className="desktop-icons absolute top-4 left-3 flex flex-col gap-3 z-20">
        <DesktopIcon icon={Monitor} label="About Me" onClick={() => toggleWindow("about", true)} />
        <DesktopIcon icon={Trash2} label="Killed Ideas" onClick={() => alert("💀 RIP: 47 abandoned side projects, 3 startup pivots, and that one app I built at 3AM that made absolutely no sense in daylight.")} />
        <DesktopIcon icon={Globe} label="Socials" onClick={() => toggleWindow("contact", true)} />
        <DesktopIcon icon={Coffee} label="Now" onClick={() => toggleWindow("now", true)} />

      </div>

      {/* ═══════ WINDOWS ═══════ */}

      {openWindows.main && (
        <WinWindow id="main" title="C:\RISHUL\RISHUL.EXE" startX={layout.main.x} startY={layout.main.y}
          className="w-[45vw] min-w-[260px] max-w-[520px]"
          isActive={windowOrder[0] === "main"} zIndex={getZIndex("main")}
          onActivate={() => bringToFront("main")} onClose={() => toggleWindow("main", false)} floating={true}>
          <RishulBio />
        </WinWindow>
      )}

      {openWindows.now && (
        <WinWindow id="now" title="NOW.TXT" startX={layout.now.x} startY={layout.now.y}
          className="w-[40vw] min-w-[220px] max-w-[320px]" titleBarClassName="bg-[#800000]"
          isActive={windowOrder[0] === "now"} zIndex={getZIndex("now")}
          onActivate={() => bringToFront("now")} onClose={() => toggleWindow("now", false)} floating={true}>
          <NowContent />
        </WinWindow>
      )}

      {openWindows.contact && (
        <WinWindow id="contact" title="⚡ LETS_CONNECT.EXE" startX={layout.contact.x} startY={layout.contact.y}
          className="w-[32vw] min-w-[250px] max-w-[300px]" titleBarClassName="bg-[#cc0000]"
          isActive={windowOrder[0] === "contact"} zIndex={getZIndex("contact")}
          onActivate={() => bringToFront("contact")} onClose={() => toggleWindow("contact", false)} floating={true}>
          <ContactContent />
        </WinWindow>
      )}

      {openWindows.about && (
        <WinWindow id="about" title="ABOUT.SYS" startX={layout.about.x} startY={layout.about.y}
          className="w-[36vw] min-w-[250px] max-w-[320px]"
          isActive={windowOrder[0] === "about"} zIndex={getZIndex("about")}
          onActivate={() => bringToFront("about")} onClose={() => toggleWindow("about", false)} floating={true}>
          <AboutContent />
        </WinWindow>
      )}



      {/* Your avatar mascot */}
      <div className="absolute bottom-11 right-4 z-[9000]">
        <div className={cn(
          "absolute bottom-full right-0 mb-3 w-48 p-2.5 bg-[#ffffcc] border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.3)] text-[10px] leading-snug transition-all duration-300 origin-bottom-right pointer-events-none",
          clippyVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}>
          <p className="text-black font-mono">i do business with pleasure. catch me vibing or building — no in between 🎧</p>
          <div className="absolute top-full right-4 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-black" />
        </div>
        <div
          className="w-12 h-12 cursor-pointer hover:scale-110 active:scale-95 transition-all rounded-full overflow-hidden border-2 border-electric-yellow shadow-[0_0_20px_rgba(250,255,0,0.5)] animate-pulse"
          onClick={() => setClippyVisible((v) => !v)}
        >
          <img src="/rishul.jpeg" alt="Rishul" className="w-full h-full object-cover" />
        </div>
      </div>

      <Taskbar
        activeTasks={activeTasks}
        onTaskClick={(id) => { toggleWindow(id, true); bringToFront(id); }}
        onStartClick={() => {
          setOpenWindows({ main: true, now: true, contact: true, about: true });
        }}
      />
    </div>
  );
}

// ─── RISHUL.EXE — Hero ───────────────────────────────────────────────────────

function RishulBio() {
  return (
    <div className="p-3 md:p-4">
      <div className="flex items-start gap-3 mb-3">
        <img src="/rishul.jpeg" alt="Rishul Chanana" className="w-16 h-16 object-cover border-2 border-gray-400 shadow-[2px_2px_0px_rgba(0,0,0,0.4)]" />
        <div>
          <h1 className="font-[var(--font-anton)] text-[clamp(36px,6vw,80px)] leading-none tracking-tighter text-black uppercase select-none whitespace-nowrap">
            RISHUL<span className="text-[clamp(20px,3vw,40px)]">.SPACE</span>
          </h1>
          <p className="text-[10px] text-gray-500 font-mono">the personal OS of rishul chanana</p>
        </div>
      </div>
      <div className="bg-black text-electric-yellow p-2 md:p-3 font-mono text-[9px] md:text-[11px] mb-3 border-l-4 border-electric-yellow">
        <p>&gt; LOADING RISHUL_OS v2.0...</p>
        <p>&gt; STATUS: VIBING + BUILDING</p>
        <p>&gt; LOCATION: CHANDIGARH / BANGALORE</p>
        <p>&gt; MODE: business with pleasure</p>
      </div>
      <p className="font-serif italic text-[clamp(11px,1.3vw,16px)] text-gray-700 leading-snug border-l-4 border-gray-300 pl-2">
        &quot;i do business with pleasure and i like to have fun. the rest you can figure out from the vibes.&quot;
      </p>
    </div>
  );
}

// ─── NOW.TXT ─────────────────────────────────────────────────────────────────

function NowContent() {
  const [sideProjectsOpen, setSideProjectsOpen] = useState(false);

  return (
    <div className="p-3 font-mono text-[11px] text-black">
      <p className="font-bold underline mb-3 uppercase">ACTIVE_PROCESSES.EXE:</p>
      <ul className="space-y-2.5 mb-4">
        <li>→ <span className="font-bold">Meritalien</span> — global talent mobility. making exceptional people borderless: O-1A, EB-1A, NIW and UK Global Talent. <a href="https://meritalien.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">meritalien.com ↗</a></li>
      </ul>

      <button
        type="button"
        aria-expanded={sideProjectsOpen}
        onClick={() => setSideProjectsOpen((v) => !v)}
        className="w-full flex items-center gap-1.5 bg-win-grey win-border-outset px-1.5 py-1 text-left text-[10px] font-bold uppercase tracking-wide cursor-pointer hover:brightness-105 active:translate-x-px active:translate-y-px"
      >
        <span className="text-[8px] leading-none">{sideProjectsOpen ? "▼" : "▶"}</span>
        Side Projects
      </button>

      {sideProjectsOpen && (
        <ul className="mt-2 ml-1 space-y-2 border-l-2 border-dashed border-[#808080] pl-3">
          {SIDE_PROJECTS.map((project) => (
            <li key={project.url}>
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline">
                {project.label} ↗
              </a>
              {project.note ? <span className="text-gray-500"> — {project.note}</span> : null}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 p-2 border-2 border-dashed border-red-500 bg-red-50/70">
        <p className="text-[10px] leading-relaxed text-black">⚠ highly productive. may cause career pivots.</p>
      </div>
    </div>
  );
}

// ─── CONTACT.EXE ─────────────────────────────────────────────────────────────

function ContactContent() {
  return (
    <div className="p-4 text-center font-mono">
      <p className="text-2xl font-bold mb-2">⚡</p>
      <p className="font-bold text-sm uppercase tracking-wide mb-1">LET&apos;S CONNECT</p>
      <p className="text-[9px] text-gray-500 mb-4">I&apos;m always down.</p>
      <div className="space-y-2 text-[11px]">
        <a href="https://x.com/rishhul" target="_blank" rel="noopener noreferrer"
          className="block w-full bg-black text-white py-2 font-bold hover:bg-gray-800 transition-colors shadow-[3px_3px_0px_rgba(0,0,0,0.3)]">
          𝕏 @rishhul
        </a>
        <a href="https://www.linkedin.com/in/rishul-chanana/" target="_blank" rel="noopener noreferrer"
          className="block w-full bg-[#0077b5] text-white py-2 font-bold hover:bg-[#005f8f] transition-colors shadow-[3px_3px_0px_rgba(0,0,0,0.3)]">
          LinkedIn ↗
        </a>
        <a href="https://www.youtube.com/@RishulChananaYT" target="_blank" rel="noopener noreferrer"
          className="block w-full bg-[#ff0000] text-white py-2 font-bold hover:bg-[#cc0000] transition-colors shadow-[3px_3px_0px_rgba(0,0,0,0.3)]">
          ▶ YouTube ↗
        </a>
        <a href="https://instagram.com/chanana_rishul" target="_blank" rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white py-2 font-bold hover:opacity-90 transition-opacity shadow-[3px_3px_0px_rgba(0,0,0,0.3)]">
          @chanana_rishul
        </a>
        <a href="mailto:hello@rishul.space"
          className="block w-full bg-win-grey text-black py-2 font-bold hover:brightness-105 transition-all win-border-outset">
          hello@rishul.space
        </a>
      </div>
      <p className="text-[8px] text-gray-400 mt-3 italic">response time: mass destruction level fast</p>
    </div>
  );
}

// ─── ABOUT.SYS — super simple ────────────────────────────────────────────────

function AboutContent() {
  return (
    <div className="p-4 font-mono text-[11px]">
      <p className="font-bold mb-3 text-[12px]">ABOUT.SYS</p>
      <div className="space-y-3 text-gray-800 leading-relaxed">
        <p>i do business with pleasure.</p>
        <p>i like to have fun, build things, meet cool people, and figure the rest out along the way.</p>
        <p>18. chandigarh. always moving.</p>
        <p>grab a window, look around, say hi.</p>
      </div>
      <div className="mt-4 p-2 bg-black text-electric-yellow text-[9px]">
        <p>&gt; PHILOSOPHY: life&apos;s too short for boring shit</p>
        <p>&gt; CURRENT_MOOD: vibing</p>
      </div>
    </div>
  );
}


