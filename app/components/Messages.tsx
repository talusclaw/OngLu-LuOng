import content from "@/data/content.json";

export default function Messages() {
  const { messages } = content;

  return (
    <section id="messages" className="py-28 px-6"
      style={{ background: "var(--bg-light)" }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <span className="section-label" style={{ color: "var(--purple)" }}>From the Heart</span>
          </div>
          <h2 className="font-display font-light"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)", color: "var(--t-l-1)", letterSpacing: "-0.01em" }}>
            Family{" "}
            <span className="gradient-text">Messages</span>
          </h2>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-20" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.4))" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--green)" }} />
            <div className="h-px w-20" style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.4), transparent)" }} />
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {messages.map((msg, i) => (
            <div key={i} className="glass-light rounded-2xl p-7 flex flex-col gap-4 relative overflow-hidden">
              {/* Decorative orb */}
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
                style={{
                  background: i % 2 === 0
                    ? "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)",
                }} />

              {/* Quote mark */}
              <p className="font-display leading-none select-none"
                style={{
                  fontSize: "4rem",
                  lineHeight: 1,
                  background: "linear-gradient(135deg, #7C3AED, #10B981)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  opacity: 0.8,
                }}>
                &ldquo;
              </p>

              {/* Message */}
              <p className="font-display font-light italic leading-relaxed flex-1 relative z-10"
                style={{ fontSize: "clamp(1rem, 1.5vw, 1.1rem)", color: "var(--t-l-1)" }}>
                {msg.message}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2">
                <div className="gradient-rule flex-1" />
                <span className="section-label" style={{ color: "var(--purple)", flexShrink: 0 }}>
                  {msg.author}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
