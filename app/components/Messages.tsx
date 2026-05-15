"use client";

import { useState, useEffect } from "react";
import content from "@/data/content.json";
import { WavingDog } from "@/app/components/Pets";

function pickRandom<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length));
}

export default function Messages() {
  const { messages } = content;
  const showCount = Math.min(3, messages.length);

  const [shown, setShown] = useState(() => pickRandom(messages, showCount));
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (messages.length <= 3) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setShown(pickRandom(messages, showCount));
        setFading(false);
      }, 350);
    }, 5000);
    return () => clearInterval(id);
  }, [messages, showCount]);

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
            Quote{" "}
            <span className="gradient-text">Wall</span>
          </h2>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-20" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.4))" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--green)" }} />
            <div className="h-px w-20" style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.4), transparent)" }} />
          </div>
          <p className="mt-5 font-display font-light italic"
            style={{ fontSize: "clamp(0.9rem, 1.6vw, 1.05rem)", color: "var(--t-l-3)" }}>
            Guess who said the quote — hover over the blurred name to reveal the answer!
          </p>
        </div>

        {/* Easter egg — waving dog */}
        <div className="flex justify-end mb-2 -mt-8">
          <WavingDog style={{ opacity: 0.8 }} />
        </div>

        {/* Cards */}
        <div
          className="grid md:grid-cols-3 gap-6"
          style={{ transition: "opacity 0.35s ease", opacity: fading ? 0 : 1 }}>
          {shown.map((msg, i) => (
            <div key={`${msg.author}-${i}`} className="glass-light rounded-2xl p-7 flex flex-col gap-4 relative overflow-hidden">
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

              {/* Author — blurred until hover */}
              <div className="flex items-center gap-3 pt-2">
                <div className="gradient-rule flex-1" />
                <span
                  className="section-label blur hover:blur-none transition-all duration-300 cursor-help"
                  style={{ color: "var(--purple)", flexShrink: 0 }}>
                  {msg.author}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Count label */}
        {messages.length > 3 && (
          <p className="text-center mt-6 section-label" style={{ color: "var(--t-l-3)" }}>
            {showCount} of {messages.length} · cycles automatically
          </p>
        )}

      </div>
    </section>
  );
}
