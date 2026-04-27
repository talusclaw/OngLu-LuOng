import content from "@/data/content.json";

type TimelineItem = { id: number; date: string; emoji: string; title: string; description: string };

export default function Timeline() {
  const timeline = content.timeline as TimelineItem[];

  return (
    <section id="timeline" className="py-24 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #2E1065 50%, #064E3B 100%)" }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: "#10B981", fontFamily: "var(--font-inter)" }}>
            A Year in Review
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light gradient-text">
            Seasons Together
          </h2>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, #7C3AED)" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#10B981" }} />
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, #059669, transparent)" }} />
          </div>
        </div>

        {/* Horizontal scrolling track */}
        <div className="relative overflow-x-auto pb-6" style={{ scrollSnapType: "x mandatory" }}>
          <div className="flex" style={{ minWidth: "max-content", gap: 0 }}>

            {timeline.map((item, i) => (
              <div key={item.id}
                className="flex flex-col items-center"
                style={{ width: 280, scrollSnapAlign: "start", flexShrink: 0 }}>

                {/* Date badge */}
                <div className="mb-4 px-3 py-1 rounded-full text-xs uppercase tracking-widest"
                  style={{
                    background: "rgba(124,58,237,0.2)",
                    border: "1px solid rgba(124,58,237,0.4)",
                    color: "#A78BFA",
                    fontFamily: "var(--font-inter)",
                  }}>
                  {item.date}
                </div>

                {/* Connector line + dot */}
                <div className="relative w-full flex items-center" style={{ height: 24 }}>
                  {/* Left connector */}
                  <div className="flex-1 h-px"
                    style={{
                      background: i === 0
                        ? "transparent"
                        : "linear-gradient(90deg, rgba(124,58,237,0.3), #7C3AED)",
                    }} />
                  {/* Dot */}
                  <div className="w-4 h-4 rounded-full shrink-0 animate-glow z-10 relative"
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #059669)",
                      boxShadow: "0 0 12px rgba(124,58,237,0.6)",
                    }} />
                  {/* Right connector */}
                  <div className="flex-1 h-px"
                    style={{
                      background: i === timeline.length - 1
                        ? "transparent"
                        : "linear-gradient(90deg, #059669, rgba(5,150,105,0.3))",
                    }} />
                </div>

                {/* Card */}
                <div className="glass-card rounded-2xl p-5 mt-5 mx-3 w-56">
                  <p className="text-4xl mb-3">{item.emoji}</p>
                  <h3 className="font-display text-xl font-medium mb-2" style={{ color: "#1E1B4B" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#4C1D95", fontFamily: "var(--font-inter)", fontWeight: 300 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Scroll hint */}
        <p className="text-center mt-4 text-xs uppercase tracking-widest"
          style={{ color: "rgba(167,139,250,0.5)", fontFamily: "var(--font-inter)" }}>
          scroll to explore →
        </p>
      </div>
    </section>
  );
}
