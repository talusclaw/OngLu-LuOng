import content from "@/data/content.json";

const QUOTE_MARK = "“";
const CLOSE_QUOTE = "”";

export default function Messages() {
  const { messages } = content;

  return (
    <section id="messages" className="py-24 px-6" style={{ background: "#ECFDF5" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: "#059669", fontFamily: "var(--font-inter)" }}>
            From the Heart
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light" style={{ color: "#1E1B4B" }}>
            Family Messages
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12" style={{ background: "#7C3AED" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "#059669" }} />
            <div className="h-px w-12" style={{ background: "#7C3AED" }} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {messages.map((msg, i) => (
            <div key={i} className="rounded-2xl p-8 border flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
              style={{ background: "#FEFCFF", borderColor: "#DDD6FE" }}>
              <p className="font-display text-5xl leading-none" style={{ color: "#DDD6FE" }}>
                {QUOTE_MARK}
              </p>
              <p className="font-display text-xl font-light italic leading-relaxed flex-1" style={{ color: "#2E1065" }}>
                {msg.message}
                <span style={{ color: "#DDD6FE" }}>{CLOSE_QUOTE}</span>
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-px flex-1" style={{ background: "#D1FAE5" }} />
                <p className="text-sm uppercase tracking-widest" style={{ color: "#059669", fontFamily: "var(--font-inter)" }}>
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
