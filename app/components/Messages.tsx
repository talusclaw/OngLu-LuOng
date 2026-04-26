import content from "@/data/content.json";

const QUOTE_MARK = "“";
const CLOSE_QUOTE = "”";

export default function Messages() {
  const { messages } = content;

  return (
    <section id="messages" className="py-24 px-6" style={{ background: "#FDF8F0" }}>
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: "#C9A84C", fontFamily: "var(--font-inter)" }}>
            From the Heart
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light" style={{ color: "#2C1A0E" }}>
            Family Messages
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12" style={{ background: "#C9A84C" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C9A84C" }} />
            <div className="h-px w-12" style={{ background: "#C9A84C" }} />
          </div>
        </div>

        {/* Message cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {messages.map((msg, i) => (
            <div key={i} className="rounded-2xl p-8 border flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
              style={{ background: "#FFFDF8", borderColor: "#E8D5A3" }}>
              {/* Opening quote mark */}
              <p className="font-display text-5xl leading-none" style={{ color: "#E8D5A3" }}>
                {QUOTE_MARK}
              </p>
              <p className="font-display text-lg font-light italic leading-relaxed flex-1" style={{ color: "#5A3E28" }}>
                {msg.message}
                <span style={{ color: "#E8D5A3" }}>{CLOSE_QUOTE}</span>
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-px flex-1" style={{ background: "#E8D5A3" }} />
                <p className="text-xs uppercase tracking-widest" style={{ color: "#C9A84C", fontFamily: "var(--font-inter)" }}>
                  {msg.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
