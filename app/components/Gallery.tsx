import content from "@/data/content.json";

const PHOTO_SEEDS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

type GalleryItem = { id: number; caption: string; url?: string | null };

export default function Gallery() {
  const gallery = content.gallery as GalleryItem[];

  return (
    <section id="gallery" className="py-28 px-6"
      style={{ background: "linear-gradient(160deg, #150F30 0%, #0F1A2E 100%)" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.22)" }}>
            <span className="section-label" style={{ color: "#10B981" }}>Captured Moments</span>
          </div>
          <h2 className="font-display font-light"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)", color: "var(--t-d-1)", letterSpacing: "-0.01em" }}>
            Our{" "}
            <span className="gradient-text">Gallery</span>
          </h2>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-20" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.6))" }} />
            <div className="w-1.5 h-1.5 rounded-full animate-glow" style={{ background: "#10B981" }} />
            <div className="h-px w-20" style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.6), transparent)" }} />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((item, i) => (
            <div key={item.id}
              className={`gallery-item group relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              style={{
                aspectRatio: i === 0 ? "auto" : "1 / 1",
                minHeight: i === 0 ? "380px" : "170px",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
              }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url || `https://picsum.photos/seed/${PHOTO_SEEDS[i] ?? i * 10}/800/600`}
                alt={item.caption}
                className="gallery-img w-full h-full object-cover"
              />
              <div className="gallery-caption absolute inset-0 flex items-end p-5"
                style={{ background: "linear-gradient(to top, rgba(7,5,15,0.82) 0%, rgba(7,5,15,0.2) 55%, transparent 100%)" }}>
                <div>
                  <p className="font-display font-light" style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.94)" }}>
                    {item.caption}
                  </p>
                  <div className="mt-1.5 h-px w-10 glow-line" style={{ opacity: 0.8 }} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
