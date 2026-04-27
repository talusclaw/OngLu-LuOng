import content from "@/data/content.json";

type Hit = { id: number; dish: string; emoji: string; description: string };

export default function GreatestHits() {
  const hits = content.greatestHits as Hit[];

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
          <p className="mt-6 font-display font-light italic"
            style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "var(--t-l-2)" }}>
            Every great meal is a memory in the making.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {hits.map((hit, i) => (
            <div key={hit.id} className="glass-light rounded-2xl p-6 flex flex-col gap-4">
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

              {/* Description */}
              <p className="leading-relaxed flex-1"
                style={{ fontSize: "0.9rem", color: "var(--t-l-2)", fontWeight: 300 }}>
                {hit.description}
              </p>

              {/* Bottom accent */}
              <div className="glow-line" style={{ height: 1, opacity: 0.6 }} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
