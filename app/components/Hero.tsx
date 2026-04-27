"use client";

import content from "@/data/content.json";

export default function Hero() {
  const { family } = content;
  const [first, second] = family.name.split("/").map((s) => s.trim());

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{ background: "var(--bg-dark)" }}
    >
      {/* Floating orbs */}
      <div className="hero-orb animate-float-a"
        style={{ width: 800, height: 800, top: "-220px", left: "-160px",
          background: "radial-gradient(circle, rgba(124,58,237,0.28) 0%, transparent 68%)" }} />
      <div className="hero-orb animate-float-b"
        style={{ width: 560, height: 560, bottom: "-120px", right: "-80px",
          background: "radial-gradient(circle, rgba(16,185,129,0.20) 0%, transparent 68%)" }} />
      <div className="hero-orb animate-float-a"
        style={{ width: 360, height: 360, top: "38%", right: "18%", animationDelay: "-7s",
          background: "radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 68%)" }} />

      {/* Dot grid */}
      <div className="hero-grid" />

      {/* Top glow border */}
      <div className="absolute top-0 left-0 right-0 glow-line" style={{ height: 1 }} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto w-full">

        {/* Year badge */}
        <div className="animate-fade-up d-0 inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-10"
          style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.28)" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-glow" style={{ background: "#10B981", flexShrink: 0 }} />
          <span className="section-label" style={{ color: "#A78BFA" }}>{family.anniversary}</span>
        </div>

        {/* Title */}
        <h1 className="animate-fade-up d-2 font-display font-light leading-[0.9] tracking-tight"
          style={{ fontSize: "clamp(3.5rem, 11vw, 8.5rem)" }}>
          <span className="shimmer-text">{first}</span>
          <span className="block font-display font-light" style={{
            fontSize: "clamp(1.5rem, 4vw, 3.5rem)",
            color: "var(--green)",
            letterSpacing: "0.25em",
            margin: "0.3em 0",
          }}>
            &amp;
          </span>
          <span className="shimmer-text" style={{ animationDelay: "-3.5s" }}>{second}</span>
        </h1>

        {/* Glow divider */}
        <div className="animate-fade-up d-3 glow-line mx-auto my-10" style={{ height: 1, width: 160 }} />

        {/* Tagline */}
        <p className="animate-fade-up d-4 font-display font-light italic"
          style={{ fontSize: "clamp(1.2rem, 2.8vw, 1.9rem)", color: "var(--t-d-1)", letterSpacing: "0.02em" }}>
          {family.tagline}
        </p>

        {/* Story */}
        <p className="animate-fade-up d-5 mt-7 mx-auto leading-[1.85]"
          style={{
            maxWidth: 600,
            fontSize: "clamp(1rem, 1.5vw, 1.1rem)",
            color: "var(--t-d-2)",
            fontWeight: 300,
          }}>
          {family.story}
        </p>

        {/* Scroll CTA */}
        <div className="animate-fade-up d-6 mt-16 flex flex-col items-center gap-3">
          <a href="#timeline" className="relative w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.38)",
              transition: "transform 0.35s var(--ease-spring), box-shadow 0.35s var(--ease-out)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.12)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(124,58,237,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}>
            {/* Pulse rings */}
            <span className="absolute inset-0 rounded-full animate-pulse-ring"
              style={{ border: "1px solid rgba(124,58,237,0.45)" }} />
            <span className="absolute inset-0 rounded-full animate-pulse-ring"
              style={{ border: "1px solid rgba(16,185,129,0.3)", animationDelay: "1.4s" }} />
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 2v11M7.5 13L3 8.5M7.5 13L12 8.5"
                stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <span className="section-label" style={{ color: "var(--t-d-3)" }}>Explore Our Year</span>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none"
        style={{ background: "linear-gradient(to top, #1A1040 0%, transparent 100%)" }} />
    </section>
  );
}
