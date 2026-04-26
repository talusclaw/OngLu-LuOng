import content from "@/data/content.json";

export default function Timeline() {
  const { timeline } = content;

  return (
    <section id="timeline" className="py-24 px-6" style={{ background: "#FDF8F0" }}>
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: "#C9A84C", fontFamily: "var(--font-inter)" }}>
            A Year in Review
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light" style={{ color: "#2C1A0E" }}>
            Seasons Together
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12" style={{ background: "#C9A84C" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C9A84C" }} />
            <div className="h-px w-12" style={{ background: "#C9A84C" }} />
          </div>
        </div>

        {/* Timeline items */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
            style={{ background: "linear-gradient(to bottom, transparent, #C9A84C 10%, #C9A84C 90%, transparent)" }} />

          <div className="space-y-12 md:space-y-0">
            {timeline.map((item, i) => (
              <div key={i} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                {/* Content card */}
                <div className={`md:w-5/12 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                  <div className="rounded-2xl p-6 shadow-sm border transition-shadow hover:shadow-md"
                    style={{ background: "#FFFDF8", borderColor: "#E8D5A3" }}>
                    <p className="font-display text-4xl mb-1">{item.emoji}</p>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#C9A84C", fontFamily: "var(--font-inter)" }}>
                      {item.month}
                    </p>
                    <h3 className="font-display text-2xl font-medium mb-2" style={{ color: "#2C1A0E" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#7A5C3A", fontFamily: "var(--font-inter)", fontWeight: 300 }}>
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="md:w-2/12 flex justify-center items-center z-10">
                  <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm"
                    style={{ background: "#FDF8F0", borderColor: "#C9A84C" }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: "#C9A84C" }} />
                  </div>
                </div>

                {/* Spacer on alternating side */}
                <div className="hidden md:block md:w-5/12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
