import content from "@/data/content.json";

export default function Hero() {
  const { family } = content;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%)" }}>

      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, transparent, #7C3AED, transparent)" }} />

      <div className="absolute inset-0 pointer-events-none opacity-20 select-none" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="20%" x2="100%" y2="80%" stroke="#7C3AED" strokeWidth="1" />
          <line x1="0" y1="80%" x2="100%" y2="20%" stroke="#059669" strokeWidth="1" />
          <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#7C3AED" strokeWidth="0.5" />
          <line x1="80%" y1="0" x2="80%" y2="100%" stroke="#059669" strokeWidth="0.5" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#7C3AED" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <p className="animate-fade-in-up text-base uppercase tracking-[0.3em] mb-6"
          style={{ color: "#059669", fontFamily: "var(--font-inter)" }}>
          {family.anniversary}
        </p>

        <h1 className="animate-fade-in-up animate-delay-200 font-display text-6xl md:text-8xl lg:text-9xl font-light leading-tight"
          style={{ color: "#1E1B4B" }}>
          {family.name.split("/").map((part, i) => (
            <span key={i}>
              {i > 0 && (
                <span className="block text-4xl md:text-5xl font-light my-1" style={{ color: "#7C3AED" }}>&</span>
              )}
              {part.trim()}
            </span>
          ))}
        </h1>

        <div className="animate-fade-in-up animate-delay-400 my-8 flex items-center justify-center gap-3">
          <div className="h-px w-16" style={{ background: "#7C3AED" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#059669" }} />
          <div className="h-px w-16" style={{ background: "#7C3AED" }} />
        </div>

        <p className="animate-fade-in-up animate-delay-400 font-display text-2xl md:text-3xl font-light italic"
          style={{ color: "#6D28D9" }}>
          {family.tagline}
        </p>

        <p className="animate-fade-in-up animate-delay-600 mt-8 text-lg md:text-xl leading-relaxed max-w-xl mx-auto"
          style={{ color: "#3B1A6B", fontFamily: "var(--font-inter)", fontWeight: 300 }}>
          {family.story}
        </p>

        <div className="animate-fade-in-up animate-delay-600 mt-14 flex flex-col items-center gap-2">
          <a href="#timeline" className="text-sm uppercase tracking-widest transition-opacity hover:opacity-60"
            style={{ color: "#059669", fontFamily: "var(--font-inter)" }}>
            Explore Our Year
          </a>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2V22M8 22L2 16M8 22L14 16" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, transparent, #059669, transparent)" }} />
    </section>
  );
}
