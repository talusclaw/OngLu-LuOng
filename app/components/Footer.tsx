export default function Footer() {
  return (
    <footer className="py-12 px-6 text-center" style={{ background: "#1E1B4B" }}>
      <p className="font-display text-3xl font-light" style={{ color: "#A78BFA" }}>
        OngLu &amp; Luong
      </p>
      <div className="my-4 flex items-center justify-center gap-3">
        <div className="h-px w-8" style={{ background: "#4C1D95" }} />
        <div className="w-2 h-2 rounded-full" style={{ background: "#059669" }} />
        <div className="h-px w-8" style={{ background: "#4C1D95" }} />
      </div>
      <p className="text-sm tracking-widest uppercase" style={{ color: "#6D28D9", fontFamily: "var(--font-inter)" }}>
        One Year Together · 2025 – 2026
      </p>
    </footer>
  );
}
