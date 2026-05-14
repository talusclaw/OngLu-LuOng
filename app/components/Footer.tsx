"use client";

import { useState, useEffect } from "react";
import { PetsDuo } from "@/app/components/Pets";
import content from "@/data/content.json";

export default function Footer() {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const letter = (content as any).letter ?? { title: "Dear Helena", body: "" };

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
    <footer className="py-16 px-6 text-center relative overflow-hidden"
      style={{ background: "var(--bg-dark)" }}>

      {/* Glow top border */}
      <div className="absolute top-0 left-0 right-0 glow-line" style={{ height: 1 }} />

      {/* Background orb */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(124,58,237,0.08) 0%, transparent 100%)",
        }} />

      <div className="relative z-10">
        {/* Easter egg — cat & dog, click to reveal letter */}
        <div className="flex justify-center mb-4">
          <div
            onClick={() => setOpen(true)}
            title="A secret is hiding here…"
            style={{ cursor: "pointer" }}>
            <PetsDuo style={{ opacity: 0.9 }} />
          </div>
        </div>

        {/* Name */}
        <p className="font-display font-light"
          style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "var(--t-d-1)", letterSpacing: "0.02em" }}>
          OngLu{" "}
          <span style={{ color: "var(--green)", fontStyle: "normal" }}>/</span>
          {" "}LuOng
        </p>

        {/* Divider */}
        <div className="my-5 flex items-center justify-center gap-3">
          <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5))" }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(16,185,129,0.6)" }} />
          <div className="h-px w-12" style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.5), transparent)" }} />
        </div>

        {/* Year */}
        <p className="section-label" style={{ color: "var(--t-d-3)" }}>
          One Year Together &nbsp;·&nbsp; 2025 – 2026
        </p>
      </div>

      {/* ── Hidden letter modal ── */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in"
          style={{ background: "rgba(10,7,22,0.88)", backdropFilter: "blur(18px)" }}
          onClick={() => setOpen(false)}>
          <div
            className="relative w-full overflow-y-auto"
            style={{
              maxWidth: 540,
              maxHeight: "82vh",
              background: "var(--bg-light)",
              borderRadius: 28,
              boxShadow: "0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}>

            {/* Top decorative bar */}
            <div className="h-1.5 w-full rounded-t-full"
              style={{ background: "linear-gradient(90deg, #7C3AED, #10B981)" }} />

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-60"
              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "var(--t-l-2)", fontSize: "1rem" }}>
              ✕
            </button>

            <div className="px-10 pt-10 pb-12 flex flex-col gap-6">
              {/* Envelope icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(16,185,129,0.12) 100%)",
                  border: "1px solid rgba(124,58,237,0.2)",
                }}>
                💌
              </div>

              {/* Title */}
              <div className="text-center">
                <h2 className="font-display font-light"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: "var(--t-l-1)", letterSpacing: "0.01em" }}>
                  {letter.title}
                </h2>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5))" }} />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#10B981" }} />
                  <div className="h-px w-16" style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.5), transparent)" }} />
                </div>
              </div>

              {/* Letter body */}
              {letter.body ? (
                <p className="font-display font-light italic leading-[1.9] whitespace-pre-line"
                  style={{ fontSize: "clamp(1rem, 1.8vw, 1.1rem)", color: "var(--t-l-2)" }}>
                  {letter.body}
                </p>
              ) : (
                <p className="font-display font-light italic text-center"
                  style={{ fontSize: "1rem", color: "var(--t-l-3)", opacity: 0.6 }}>
                  A letter is on its way…
                </p>
              )}

              {/* Closing */}
              <div className="pt-4 flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.3))" }} />
                <p className="section-label" style={{ color: "var(--purple)" }}>
                  with love ♡
                </p>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.3), transparent)" }} />
              </div>

              <button onClick={() => setOpen(false)}
                className="self-center section-label transition-opacity hover:opacity-60"
                style={{ color: "var(--t-l-3)" }}>
                ↑ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
