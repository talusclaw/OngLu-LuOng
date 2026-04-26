import content from "@/data/content.json";

const PHOTO_SEEDS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

type GalleryItem = { id: number; caption: string; url?: string | null };

export default function Gallery() {
  const gallery = content.gallery as GalleryItem[];

  return (
    <section id="gallery" className="py-24 px-6" style={{ background: "#EDE9FE" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: "#059669", fontFamily: "var(--font-inter)" }}>
            Captured Moments
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light" style={{ color: "#1E1B4B" }}>
            Our Gallery
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12" style={{ background: "#7C3AED" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "#059669" }} />
            <div className="h-px w-12" style={{ background: "#7C3AED" }} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((item, i) => (
            <div key={item.id}
              className={`group relative overflow-hidden rounded-2xl shadow-sm ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              style={{ aspectRatio: i === 0 ? "auto" : "1 / 1", minHeight: i === 0 ? "360px" : "160px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url || `https://picsum.photos/seed/${PHOTO_SEEDS[i] ?? i * 10}/800/600`}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(to top, rgba(30,27,75,0.75) 0%, transparent 60%)" }}>
                <p className="text-white text-base font-light tracking-wide" style={{ fontFamily: "var(--font-inter)" }}>
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
