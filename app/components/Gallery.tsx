"use client";

import { useState, useEffect } from "react";
import content from "@/data/content.json";

type GalleryItem = { id: number; caption: string; url?: string | null };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function GalleryGrid({ items, featured = false }: { items: GalleryItem[]; featured?: boolean }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item, i) => (
        <div key={item.id}
          className={`gallery-item group relative overflow-hidden rounded-2xl${featured && i === 0 ? " col-span-2 row-span-2" : ""}`}
          style={{
            aspectRatio: featured && i === 0 ? "auto" : "1 / 1",
            minHeight: featured && i === 0 ? "380px" : "170px",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.url || `https://picsum.photos/seed/${item.id * 10}/800/600`}
            alt={item.caption}
            className="gallery-img w-full h-full object-cover"
          />
          <div className="gallery-caption absolute inset-0 flex items-end p-5"
            style={{ background: "linear-gradient(to top, rgba(16,12,36,0.85) 0%, rgba(16,12,36,0.2) 55%, transparent 100%)" }}>
            <div>
              <p className="font-display font-light" style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.94)" }}>
                {item.caption}
              </p>
              <div className="mt-1.5 h-px w-10 glow-line" style={{ opacity: 0.8 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Gallery() {
  const gallery = content.gallery as GalleryItem[];
  const [open, setOpen] = useState(false);
  const [preview] = useState<GalleryItem[]>(() => shuffle(gallery).slice(0, 6));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section id="gallery" className="py-28 px-6"
      style={{ background: "linear-gradient(160deg, #150F30 0%, #0F1A2E 100%)" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.22)" }}>
            <span className="section-label" style={{ color: "#10B981" }}>Captured Moments</span>
          </div>
          <h2 className="font-display font-light"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)", color: "var(--t-d-1)", letterSpacing: "-0.01em" }}>
            Our{" "}
            <span className="gradient-text">Gallery</span>
          </h2>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-20" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.6))" }} />
            <div className="w-1.5 h-1.5 rounded-full animate-glow" style={{ background: "#10B981" }} />
            <div className="h-px w-20" style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.6), transparent)" }} />
          </div>
        </div>

        {/* 6 shuffled preview photos */}
        <GalleryGrid items={preview} featured />

        {/* View All button */}
        {gallery.length > 6 && (
          <div className="mt-10 text-center">
            <button onClick={() => setOpen(true)}
              className="btn-primary"
              style={{ fontSize: "0.72rem" }}>
              View All Photos — {gallery.length} total
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 6 }}>
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Full gallery modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto animate-fade-in"
          style={{ background: "rgba(10,7,22,0.97)", backdropFilter: "blur(16px)" }}
          onClick={(e) => { if (e.currentTarget === e.target) setOpen(false); }}>
          <div className="max-w-5xl mx-auto px-6 py-10">

            {/* Modal header */}
            <div className="flex items-center justify-between mb-8 sticky top-6 z-10">
              <div>
                <h2 className="font-display font-light"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "var(--t-d-1)" }}>
                  All <span className="gradient-text">Photos</span>
                </h2>
                <p className="section-label mt-1" style={{ color: "var(--t-d-3)" }}>
                  {gallery.length} moments
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "var(--t-d-1)",
                  fontSize: "1.3rem",
                }}>
                ✕
              </button>
            </div>

            {/* All photos */}
            <GalleryGrid items={gallery} />

            {/* Bottom close */}
            <div className="mt-10 text-center">
              <button onClick={() => setOpen(false)}
                className="section-label transition-opacity hover:opacity-60"
                style={{ color: "var(--t-d-3)" }}>
                ↑ Close gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
