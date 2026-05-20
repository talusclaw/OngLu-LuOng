"use client";

import content from "@/data/content.json";
import { PeekingCat } from "@/app/components/Pets";

type TimelineItem = { id: number; date: string; emoji: string; title: string; description: string; photo?: string | null };

function isVideo(url: string | null | undefined) {
  return !!url && /\.(mp4|mov|webm|avi|m4v|mkv)(\?|$)/i.test(url);
}

export default function Timeline() {
  const timeline = content.timeline as TimelineItem[];

  return (
    <section id="timeline" className="py-28 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1A1040 0%, #180F38 50%, #0F1E2A 100%)" }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.22)" }}>
            <span className="section-label" style={{ color: "#10B981" }}>A Year in Review</span>
          </div>
          <h2 className="font-display font-light"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)", color: "var(--t-d-1)", letterSpacing: "-0.01em" }}>
            Seasons{" "}
            <span className="gradient-text">Together</span>
          </h2>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-20" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.6))" }} />
            <div className="w-1.5 h-1.5 rounded-full animate-glow" style={{ background: "#10B981" }} />
            <div className="h-px w-20" style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.6), transparent)" }} />
          </div>
        </div>

        {/* Horizontal scrolling track */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-10"
            style={{ background: "linear-gradient(90deg, var(--bg-dark-2), transparent)" }} />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-10"
            style={{ background: "linear-gradient(270deg, var(--bg-dark-2), transparent)" }} />

          <div className="overflow-x-auto pb-4" style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
            <div className="flex px-6" style={{ gap: 0, minWidth: "max-content" }}>

              {timeline.map((item, i) => (
                <div key={item.id}
                  className="flex flex-col items-center"
                  style={{ width: 300, scrollSnapAlign: "start", flexShrink: 0 }}>

                  {/* Date badge */}
                  <div className="mb-6 px-4 py-1.5 rounded-full"
                    style={{
                      background: "rgba(124,58,237,0.12)",
                      border: "1px solid rgba(124,58,237,0.3)",
                    }}>
                    <span className="section-label" style={{ color: "#A78BFA" }}>{item.date}</span>
                  </div>

                  {/* Connector line + dot */}
                  <div className="relative w-full flex items-center" style={{ height: 28 }}>
                    <div className="flex-1 h-px"
                      style={{
                        background: i === 0
                          ? "transparent"
                          : "linear-gradient(90deg, rgba(16,185,129,0.25), rgba(124,58,237,0.5))",
                      }} />
                    <div className="relative shrink-0 z-10" style={{ width: 20, height: 20 }}>
                      <div className="absolute inset-0 rounded-full"
                        style={{
                          background: "linear-gradient(135deg, #7C3AED, #10B981)",
                          boxShadow: "0 0 16px rgba(124,58,237,0.7), 0 0 6px rgba(16,185,129,0.4)",
                        }} />
                      <div className="absolute inset-0 rounded-full animate-pulse-ring"
                        style={{ border: "1px solid rgba(124,58,237,0.5)" }} />
                    </div>
                    <div className="flex-1 h-px"
                      style={{
                        background: i === timeline.length - 1
                          ? "transparent"
                          : "linear-gradient(90deg, rgba(124,58,237,0.5), rgba(16,185,129,0.25))",
                      }} />
                  </div>

                  {/* Card */}
                  <div className="glass-dark rounded-2xl mt-6 mx-4 w-64 overflow-hidden">
                    {item.photo && (
                      isVideo(item.photo)
                        ? <video src={item.photo} className="w-full object-cover" style={{ height: 140 }} muted playsInline loop autoPlay />
                        // eslint-disable-next-line @next/next/no-img-element
                        : <img src={item.photo} alt={item.title} className="w-full object-cover" style={{ height: 140 }} />
                    )}
                    <div className="p-6">
                      <p className="text-4xl mb-4">{item.emoji}</p>
                      <h3 className="font-display font-light mb-3"
                        style={{ fontSize: "1.4rem", color: "var(--t-d-1)" }}>
                        {item.title}
                      </h3>
                      <p className="leading-relaxed" style={{ fontSize: "0.9rem", color: "var(--t-d-2)", fontWeight: 300 }}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                </div>
              ))}

            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <PeekingCat style={{ opacity: 0.8 }} />
          <p className="section-label" style={{ color: "var(--t-d-3)" }}>Scroll to explore →</p>
        </div>

      </div>
    </section>
  );
}
