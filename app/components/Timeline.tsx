import content from "@/data/content.json";

export default function Timeline() {
  const { timeline } = content;

  return (
    <section id="timeline" className="py-24 px-6" style={{ background: "#F5F3FF" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: "#059669", fontFamily: "var(--font-inter)" }}>
            A Year in Review
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light" style={{ color: "#1E1B4B" }}>
            Seasons Together
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12" style={{ background: "#7C3AED" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "#059669" }} />
            <div className="h-px w-12" style={{ background: "#7C3AED" }} />
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
            style={{ background: "linear-gradient(to bottom, transparent, #7C3AED 10%, #7C3AED 90%, transparent)" }} />

          <div className="space-y-12 md:space-y-0">
            {timeline.map((item, i) => (
              <div key={i} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className={`md:w-5/12 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                  <div className="rounded-2xl p-6 shadow-sm border transition-shadow hover:shadow-md"
                    style={{ background: "#FEFCFF", borderColor: "#DDD6FE" }}>
                    <p className="font-display text-4xl mb-1">{item.emoji}</p>
                    <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "#059669", fontFamily: "var(--font-inter)" }}>
                      {item.month}
                    </p>
                    <h3 className="font-display text-2xl font-medium mb-3" style={{ color: "#1E1B4B" }}>
                      {item.title}
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: "#4C1D95", fontFamily: "var(--font-inter)", fontWeight: 300 }}>
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="md:w-2/12 flex justify-center items-center z-10">
                  <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm"
                    style={{ background: "#F5F3FF", borderColor: "#7C3AED" }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: "#059669" }} />
                  </div>
                </div>

                <div className="hidden md:block md:w-5/12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
