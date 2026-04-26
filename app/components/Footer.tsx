export default function Footer() {
  return (
    <footer className="py-12 px-6 text-center" style={{ background: "#2C1A0E" }}>
      <p className="font-display text-3xl font-light" style={{ color: "#C9A84C" }}>
        OngLu &amp; Luong
      </p>
      <div className="my-4 flex items-center justify-center gap-3">
        <div className="h-px w-8" style={{ background: "#7A5C3A" }} />
        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2L11.8 7.2H17.6L12.9 10.5L14.7 15.7L10 12.4L5.3 15.7L7.1 10.5L2.4 7.2H8.2L10 2Z" fill="#7A5C3A" />
        </svg>
        <div className="h-px w-8" style={{ background: "#7A5C3A" }} />
      </div>
      <p className="text-xs tracking-widest uppercase" style={{ color: "#7A5C3A", fontFamily: "var(--font-inter)" }}>
        One Year Together · 2025 – 2026
      </p>
    </footer>
  );
}
