"use client";

import { useState } from "react";
import content from "@/data/content.json";
import { WavingDog } from "@/app/components/Pets";

export default function Messages() {
  const { messages } = content;

  // Shuffle once on page load, then paginate in groups of 3
  const [shuffled] = useState(() => [...messages].sort(() => Math.random() - 0.5));
  const pages = Math.ceil(shuffled.length / 3);
  const [page, setPage] = useState(0);
  const [fading, setFading] = useState(false);

  function navigate(dir: 1 | -1) {
    if (pages <= 1) return;
    setFading(true);
    setTimeout(() => {
      setPage((p) => (p + dir + pages) % pages);
      setFading(false);
    }, 280);
  }

  const shown = shuffled.slice(page * 3, page * 3 + 3);

  return (
    <section id="messages" className="py-28 px-6"
      style={{ background: "var(--bg-light)" }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <span className="section-label" style={{ color: "var(--purple)" }}>From the Heart</span>
          </div>
          <h2 className="font-display font-light"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)", color: "var(--t-l-1)", letterSpacing: "-0.01em" }}>
            Quote{" "}
            <span className="gradient-text">Wall</span>
          </h2>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-20" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.4))" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--green)" }} />
            <div className="h-px w-20" style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.4), transparent)" }} />
          </div>
          <p className="mt-5 font-display font-light italic"
            style={{ fontSize: "clamp(0.9rem, 1.6vw, 1.05rem)", color: "var(--t-l-3)" }}>
            Guess who said the quote — hover over the blurred name to reveal the answer!
          </p>
        </div>

        {/* Easter egg — waving dog */}
        <div className="flex justify-end mb-2 -mt-8">
          <WavingDog style={{ opacity: 0.8 }} />
        </div>

        {/* Cards */}
        <div
          className="grid md:grid-cols-3 gap-6"
          style={{ transition: "opacity 0.28s ease", opacity: fading ? 0 : 1 }}>
          {shown.map((msg, i) => (
            <div key={`${msg.author}-${page}-${i}`} className="glass-light rounded-2xl p-7 flex flex-col gap-4 relative overflow-hidden">
              {/* Decorative orb */}
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
                style={{
                  background: i % 2 === 0
                    ? "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)",
                }} />

              {/* Quote mark */}
              <p className="font-display leading-none select-none"
                style={{
                  fontSize: "4rem", lineHeight: 1,
                  background: "linear-gradient(135deg, #7C3AED, #10B981)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  opacity: 0.8,
                }}>
                &ldquo;
              </p>

              {/* Message */}
              <p className="font-display font-light italic leading-relaxed flex-1 relative z-10"
                style={{ fontSize: "clamp(1rem, 1.5vw, 1.1rem)", color: "var(--t-l-1)" }}>
                {msg.message}
              </p>

              {/* Author — blurred until hover */}
              <div className="flex items-center gap-3 pt-2">
                <div className="gradient-rule flex-1" />
                <span
                  className="section-label blur hover:blur-none transition-all duration-300 cursor-help"
                  style={{ color: "var(--purple)", flexShrink: 0 }}>
                  {msg.author}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        {pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-5">
            {/* Prev */}
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-70 active:scale-95"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", color: "#A78BFA" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Page dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (i === page) return;
                    setFading(true);
                    setTimeout(() => { setPage(i); setFading(false); }, 280);
                  }}
                  style={{
                    width: i === page ? 20 : 7,
                    height: 7,
                    borderRadius: 4,
                    background: i === page ? "var(--purple)" : "rgba(124,58,237,0.25)",
                    transition: "all 0.3s ease",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => navigate(1)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-70 active:scale-95"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", color: "#A78BFA" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
