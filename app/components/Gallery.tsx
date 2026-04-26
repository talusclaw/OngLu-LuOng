import content from "@/data/content.json";

const PHOTO_SEEDS = [10, 20, 30, 40, 50, 60];

export default function Gallery() {
  const { gallery } = content;

  return (
    <section id="gallery" className="py-24 px-6" style={{ background: "#F5ECD7" }}>
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: "#C9A84C", fontFamily: "var(--font-inter)" }}>
            Captured Moments
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light" style={{ color: "#2C1A0E" }}>
            Our Gallery
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12" style={{ background: "#C9A84C" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C9A84C" }} />
            <div className="h-px w-12" style={{ background: "#C9A84C" }} />
          </div>
          <p className="mt-5 text-sm" style={{ color: "#7A5C3A", fontFamily: "var(--font-inter)", fontWeight: 300 }}>
            Replace these placeholders with your own family photos.
          </p>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((item, i) => (
            <div key={item.id} className={`group relative overflow-hidden rounded-2xl shadow-sm ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              style={{ aspectRatio: i === 0 ? "auto" : "1 / 1", minHeight: i === 0 ? "360px" : "160px" }}>
              {/* Placeholder image from picsum */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/seed/${PHOTO_SEEDS[i]}/800/600`}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Caption overlay */}
              <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(to top, rgba(44,26,14,0.7) 0%, transparent 60%)" }}>
                <p className="text-white text-sm font-light tracking-wide" style={{ fontFamily: "var(--font-inter)" }}>
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-xs" style={{ color: "#C9A84C", fontFamily: "var(--font-inter)" }}>
          ✦ &nbsp; Photos are placeholders — update <code className="bg-amber-100 px-1 rounded">data/content.json</code> and drop real images in <code className="bg-amber-100 px-1 rounded">public/gallery/</code> &nbsp; ✦
        </p>
      </div>
    </section>
  );
}
