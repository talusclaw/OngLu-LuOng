"use client";

import { useState, useEffect } from "react";

const links = [
  { href: "#timeline",      label: "Our Year"     },
  { href: "#greatest-hits", label: "Greatest Hits" },
  { href: "#gallery",       label: "Gallery"       },
  { href: "#messages",      label: "Messages"      },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background:    scrolled ? "rgba(7, 5, 15, 0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(28px) saturate(1.6)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(28px) saturate(1.6)" : "none",
        borderBottom:  scrolled ? "1px solid rgba(124,58,237,0.12)" : "1px solid transparent",
        transition: "background 0.5s var(--ease-out), border-color 0.5s var(--ease-out), backdrop-filter 0.5s",
      }}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="font-display font-light"
          style={{
            fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
            color: "rgba(255,255,255,0.88)",
            letterSpacing: "0.02em",
            transition: "opacity 0.3s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.6")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}>
          OngLu <span style={{ color: "var(--green)", fontStyle: "normal" }}>/</span> LuOng
        </a>

        {/* Links */}
        <div className="hidden sm:flex items-center gap-8">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="nav-link section-label">
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile menu indicator */}
        <div className="sm:hidden flex flex-col gap-1.5 cursor-pointer"
          style={{ color: "rgba(255,255,255,0.5)" }}>
          <div className="w-5 h-px" style={{ background: "currentColor" }} />
          <div className="w-3 h-px" style={{ background: "currentColor" }} />
        </div>
      </div>
    </nav>
  );
}
