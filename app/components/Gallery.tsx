"use client";

import { useState, useEffect } from "react";
import content from "@/data/content.json";
import { SittingDog } from "@/app/components/Pets";

type GalleryItem = { id: number; caption: string; url?: string | null; focalX?: number; focalY?: number };

function isVideo(url: string | null | undefined) {
  return !!url && /\.(mp4|mov|webm|avi|m4v|mkv)(\?|$)/i.test(url);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

        {/* Preview: square bento — aspect-ratio:1 grid makes every cell a perfect square */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gridTemplateAreas: '"a a b" "a a c" "d e f"',
          aspectRatio: "1",
          gap: 12,
        }}>
          {(["a","b","c","d","e","f"] as const).map((area, idx) => (
            <div key={preview[idx].id}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              style={{ gridArea: area, border: "1px solid rgba(255,255,255,0.06)" }}
              onClick={() => setOpen(true)}>
              {isVideo(preview[idx].url)
                ? <video src={preview[idx].url!} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" playsInline loop controls />
                // eslint-disable-next-line @next/next/no-img-element
                : <img
                    src={preview[idx].url || `https://picsum.photos/seed/${preview[idx].id * 10}/600/600`}
                    alt={preview[idx].caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: `${preview[idx].focalX ?? 50}% ${preview[idx].focalY ?? 50}%` }}
                  />
              }
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                style={{ background: "linear-gradient(to top, rgba(16,12,36,0.85) 0%, transparent 55%)" }}>
                <p className="font-display font-light text-sm" style={{ color: "rgba(255,255,255,0.92)" }}>
                  {preview[idx].caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer row: count + view all */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-end gap-3">
            <p className="section-label" style={{ color: "var(--t-d-3)" }}>
              6 of {gallery.length} · refreshes each visit
            </p>
            {/* Easter egg — little dog */}
            <SittingDog style={{ opacity: 0.85, marginBottom: -8 }} />
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all hover:opacity-80"
            style={{
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.35)",
              color: "#A78BFA",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
            }}>
            View All {gallery.length} Photos
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Full gallery modal ── */}
      {open && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto animate-fade-in"
          style={{ background: "rgba(10,7,22,0.97)", backdropFilter: "blur(16px)" }}
          onClick={(e) => { if (e.currentTarget === e.target) setOpen(false); }}>
          <div className="max-w-5xl mx-auto px-6 py-10">

            {/* Modal header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display font-light"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "var(--t-d-1)" }}>
                  All <span className="gradient-text">Photos</span>
                </h2>
                <p className="section-label mt-1" style={{ color: "var(--t-d-3)" }}>
                  {gallery.length} moments
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-opacity hover:opacity-60"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "var(--t-d-1)",
                  fontSize: "1.1rem",
                }}>
                ✕
              </button>
            </div>

            {/* All photos: 2-col on mobile, 3-col on md, 4-col on lg */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.map((item) => (
                <div key={item.id}
                  className="group relative overflow-hidden rounded-xl"
                  style={{ aspectRatio: "1 / 1", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {isVideo(item.url)
                    ? <video src={item.url!} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" playsInline loop controls />
                    // eslint-disable-next-line @next/next/no-img-element
                    : <img
                        src={item.url || `https://picsum.photos/seed/${item.id * 10}/400/400`}
                        alt={item.caption}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ objectPosition: `${item.focalX ?? 50}% ${item.focalY ?? 50}%` }}
                      />
                  }
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
                    style={{ background: "linear-gradient(to top, rgba(16,12,36,0.85) 0%, transparent 55%)" }}>
                    <p className="font-display font-light text-sm" style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.85rem" }}>
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Close button at bottom */}
            <div className="mt-10 text-center">
              <button onClick={() => setOpen(false)}
                className="section-label transition-opacity hover:opacity-60"
                style={{ color: "var(--t-d-3)" }}>
                ↑ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
