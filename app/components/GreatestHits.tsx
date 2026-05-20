"use client";

import { useState, useEffect } from "react";
import content from "@/data/content.json";
import { SittingCat } from "@/app/components/Pets";

function isVideo(url: string | null | undefined) {
  return !!url && /\.(mp4|mov|webm|avi|m4v|mkv)(\?|$)/i.test(url);
}

type Hit = {
  id: number;
  dish: string;
  emoji: string;
  description: string;
  recipe?: string;
  photos?: string[];
  coverPhoto?: string | null;
};

export default function GreatestHits() {
  const hits = content.greatestHits as Hit[];
  const [selected, setSelected] = useState<Hit | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section id="greatest-hits" className="py-28 px-6"
      style={{ background: "var(--bg-light)" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <span className="section-label" style={{ color: "var(--purple)" }}>Dishes We&apos;ve Made Together</span>
          </div>
          <h2 className="font-display font-light"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)", color: "var(--t-l-1)", letterSpacing: "-0.01em" }}>
            Greatest{" "}
            <span className="gradient-text">Hits</span>
          </h2>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-20" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.4))" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--green)" }} />
            <div className="h-px w-20" style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.4), transparent)" }} />
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <p className="font-display font-light italic"
              style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "var(--t-l-2)" }}>
              Every great meal is a memory in the making.
            </p>
            <SittingCat style={{ opacity: 0.85, flexShrink: 0 }} />
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {hits.map((hit) => {
            const cover = hit.coverPhoto || hit.photos?.[0] || null;
            const hasMore = !!(hit.recipe || (hit.description && hit.description.length > 120));
            return (
              <div key={hit.id} className="glass-light rounded-2xl overflow-hidden flex flex-col">

                {/* Cover photo — click to expand */}
                {cover ? (
                  <div className="relative cursor-pointer group" onClick={() => setSelected(hit)}>
                    {isVideo(cover)
                      ? <video src={cover} className="w-full object-cover" style={{ height: 160 }} muted playsInline loop autoPlay />
                      // eslint-disable-next-line @next/next/no-img-element
                      : <img src={cover} alt={hit.dish} className="w-full object-cover" style={{ height: 160 }} />
                    }
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: "rgba(16,12,36,0.5)" }}>
                      <span className="section-label" style={{ color: "#fff", letterSpacing: "0.1em" }}>View Recipe →</span>
                    </div>
                  </div>
                ) : (
                  /* No photo: make emoji orb the click target */
                  <div className="pt-6 px-6 cursor-pointer" onClick={() => hasMore ? setSelected(hit) : undefined} />
                )}

                <div className="p-6 flex flex-col gap-3 flex-1">
                  {/* Emoji orb */}
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                    style={{
                      background: "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(16,185,129,0.1) 100%)",
                      border: "1px solid rgba(124,58,237,0.15)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
                    }}>
                    {hit.emoji}
                  </div>

                  {/* Dish name */}
                  <h3 className="font-display font-medium"
                    style={{ fontSize: "1.5rem", color: "var(--t-l-1)" }}>
                    {hit.dish}
                  </h3>

                  {/* Description — clamped to 3 lines */}
                  <p className="leading-relaxed"
                    style={{
                      fontSize: "0.9rem", color: "var(--t-l-2)", fontWeight: 300,
                      display: "-webkit-box", WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                    {hit.description}
                  </p>

                  {/* Expand prompt */}
                  {hasMore && (
                    <button onClick={() => setSelected(hit)}
                      className="self-start transition-opacity hover:opacity-70"
                      style={{ fontSize: "0.78rem", color: "var(--purple)", fontFamily: "var(--font-inter)", fontWeight: 500 }}>
                      {hit.recipe ? "View recipe →" : "Read more →"}
                    </button>
                  )}

                  <div className="glow-line mt-auto" style={{ height: 1, opacity: 0.6 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Expanded modal ── */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in"
          style={{ background: "rgba(10,7,22,0.75)", backdropFilter: "blur(12px)" }}
          onClick={() => setSelected(null)}>
          <div
            className="relative w-full rounded-3xl overflow-y-auto"
            style={{ maxWidth: 520, maxHeight: "85vh", background: "var(--bg-light)", boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }}
            onClick={(e) => e.stopPropagation()}>

            {/* Cover media */}
            {(selected.coverPhoto || selected.photos?.[0]) && (
              isVideo(selected.coverPhoto || selected.photos?.[0])
                ? <video src={selected.coverPhoto || selected.photos?.[0]!} className="w-full object-cover" style={{ height: 240 }} playsInline controls />
                // eslint-disable-next-line @next/next/no-img-element
                : <img src={selected.coverPhoto || selected.photos?.[0]} alt={selected.dish} className="w-full object-cover" style={{ height: 240 }} />
            )}

            {/* Additional media strip */}
            {selected.photos && selected.photos.length > 1 && (() => {
              const rest = selected.photos.filter((u) => u !== (selected.coverPhoto || selected.photos?.[0]));
              return rest.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto px-4 pt-3 pb-1" style={{ scrollbarWidth: "thin" }}>
                  {rest.map((url) => (
                    <div key={url} className="shrink-0 rounded-xl overflow-hidden" style={{ width: 100, height: 100 }}>
                      {isVideo(url)
                        ? <video src={url} className="w-full h-full object-cover" playsInline controls style={{ width: 100, height: 100 }} />
                        // eslint-disable-next-line @next/next/no-img-element
                        : <img src={url} alt="" className="w-full h-full object-cover" />
                      }
                    </div>
                  ))}
                </div>
              ) : null;
            })()}

            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ background: "rgba(0,0,0,0.4)", color: "#fff", fontSize: "1rem" }}>
              ✕
            </button>

            <div className="p-8 flex flex-col gap-5">
              {/* Title row */}
              <div className="flex items-center gap-3">
                <span style={{ fontSize: "2.2rem" }}>{selected.emoji}</span>
                <h2 className="font-display font-medium"
                  style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "var(--t-l-1)" }}>
                  {selected.dish}
                </h2>
              </div>

              {/* Full description */}
              <p className="leading-relaxed"
                style={{ fontSize: "0.95rem", color: "var(--t-l-2)", fontWeight: 300, lineHeight: 1.75 }}>
                {selected.description}
              </p>

              {/* Full recipe */}
              {selected.recipe && (
                <div className="pt-4 border-t" style={{ borderColor: "rgba(124,58,237,0.15)" }}>
                  <p className="section-label mb-3" style={{ color: "var(--purple)" }}>Recipe</p>
                  <p className="whitespace-pre-line leading-relaxed"
                    style={{ fontSize: "0.9rem", color: "var(--t-l-2)", fontWeight: 300, lineHeight: 1.8 }}>
                    {selected.recipe}
                  </p>
                </div>
              )}

              <button onClick={() => setSelected(null)}
                className="self-center mt-2 section-label transition-opacity hover:opacity-60"
                style={{ color: "var(--t-l-3)" }}>
                ↑ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
