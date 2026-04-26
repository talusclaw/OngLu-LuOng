import content from "@/data/content.json";

export default function Hero() {
  const { family } = content;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #FDF8F0 0%, #F5ECD7 50%, #EDD9B0 100%)" }}>

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />

      {/* Petal / ornament SVG */}
      <div className="absolute inset-0 pointer-events-none opacity-10 select-none" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10%" cy="15%" r="120" fill="#C9A84C" />
          <circle cx="90%" cy="80%" r="160" fill="#C9A84C" />
          <circle cx="85%" cy="10%" r="80" fill="#7A5C3A" />
          <circle cx="5%" cy="85%" r="100" fill="#7A5C3A" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Year badge */}
        <p className="animate-fade-in-up text-sm uppercase tracking-[0.3em] mb-6"
          style={{ color: "#C9A84C", fontFamily: "var(--font-inter)" }}>
          {family.anniversary}
        </p>

        {/* Main title */}
        <h1 className="animate-fade-in-up animate-delay-200 font-display text-6xl md:text-8xl lg:text-9xl font-light leading-tight"
          style={{ color: "#2C1A0E" }}>
          {family.name.split("/").map((part, i) => (
            <span key={i}>
              {i > 0 && (
                <span className="block text-4xl md:text-5xl font-light my-1" style={{ color: "#C9A84C" }}>&</span>
              )}
              {part.trim()}
            </span>
          ))}
        </h1>

        {/* Divider */}
        <div className="animate-fade-in-up animate-delay-400 my-8 flex items-center justify-center gap-3">
          <div className="h-px w-16" style={{ background: "#C9A84C" }} />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2L11.8 7.2H17.6L12.9 10.5L14.7 15.7L10 12.4L5.3 15.7L7.1 10.5L2.4 7.2H8.2L10 2Z"
              fill="#C9A84C" />
          </svg>
          <div className="h-px w-16" style={{ background: "#C9A84C" }} />
        </div>

        {/* Tagline */}
        <p className="animate-fade-in-up animate-delay-400 font-display text-xl md:text-2xl font-light italic"
          style={{ color: "#7A5C3A" }}>
          {family.tagline}
        </p>

        {/* Story */}
        <p className="animate-fade-in-up animate-delay-600 mt-8 text-base md:text-lg leading-relaxed max-w-xl mx-auto"
          style={{ color: "#5A3E28", fontFamily: "var(--font-inter)", fontWeight: 300 }}>
          {family.story}
        </p>

        {/* Scroll cue */}
        <div className="animate-fade-in-up animate-delay-600 mt-14 flex flex-col items-center gap-2">
          <a href="#timeline" className="text-xs uppercase tracking-widest transition-opacity hover:opacity-60"
            style={{ color: "#C9A84C", fontFamily: "var(--font-inter)" }}>
            Explore Our Year
          </a>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2V22M8 22L2 16M8 22L14 16" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
    </section>
  );
}
