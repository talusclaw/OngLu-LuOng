export default function Footer() {
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
    </footer>
  );
}
