"use client";

import { useState, useEffect } from "react";

const links = [
  { href: "#timeline", label: "Our Year" },
  { href: "#gallery", label: "Gallery" },
  { href: "#messages", label: "Messages" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}
      style={{ background: scrolled ? "rgba(253,248,240,0.95)" : "transparent", backdropFilter: scrolled ? "blur(8px)" : "none" }}>
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-display text-xl font-light transition-opacity hover:opacity-70"
          style={{ color: "#2C1A0E" }}>
          OngLu / Luong
        </a>
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <a key={link.href} href={link.href}
              className="text-xs uppercase tracking-widest transition-opacity hover:opacity-60"
              style={{ color: "#7A5C3A", fontFamily: "var(--font-inter)" }}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
