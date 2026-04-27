import content from "@/data/content.json";

type Hit = { id: number; dish: string; emoji: string; description: string };

export default function GreatestHits() {
  const hits = content.greatestHits as Hit[];

  return (
    <section id="greatest-hits" className="py-24 px-6"
      style={{ background: "linear-gradient(160deg, #F0FDF4 0%, #ECFDF5 40%, #EDE9FE 100%)" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: "#059669", fontFamily: "var(--font-inter)" }}>
            Dishes We&apos;ve Made Together
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light gradient-text">
            Greatest Hits
          </h2>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, #7C3AED)" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#059669" }} />
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, #059669, transparent)" }} />
          </div>
          <p className="mt-5 text-base" style={{ color: "#065F46", fontFamily: "var(--font-inter)", fontWeight: 300 }}>
            Every great meal is a memory in the making.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {hits.map((hit, i) => (
            <div key={hit.id}
              className="glass-card gradient-border rounded-2xl p-6 flex flex-col gap-3"
              style={{ animationDelay: `${i * 0.1}s` }}>
              {/* Emoji */}
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(5,150,105,0.1))" }}>
                {hit.emoji}
              </div>
              {/* Dish name */}
              <h3 className="font-display text-2xl font-medium" style={{ color: "#1E1B4B" }}>
                {hit.dish}
              </h3>
              {/* Description */}
              <p className="text-base leading-relaxed flex-1" style={{ color: "#065F46", fontFamily: "var(--font-inter)", fontWeight: 300 }}>
                {hit.description}
              </p>
              {/* Bottom accent line */}
              <div className="h-px w-full mt-1"
                style={{ background: "linear-gradient(90deg, #7C3AED, #059669)" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
