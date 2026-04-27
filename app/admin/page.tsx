"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

type TimelineItem = { id: number; date: string; emoji: string; title: string; description: string };
type GreatestHit  = { id: number; dish: string; emoji: string; description: string };
type GalleryItem  = { id: number; caption: string; url: string | null };
type Message      = { author: string; message: string };
type Content = {
  family:       { name: string; tagline: string; anniversary: string; story: string };
  timeline:     TimelineItem[];
  greatestHits: GreatestHit[];
  gallery:      GalleryItem[];
  messages:     Message[];
};

type Section = "family" | "timeline" | "hits" | "gallery" | "messages";

const NAV: { id: Section; label: string; emoji: string }[] = [
  { id: "family",   label: "Family Info",   emoji: "🏡" },
  { id: "timeline", label: "Timeline",       emoji: "📅" },
  { id: "hits",     label: "Greatest Hits",  emoji: "🍽️" },
  { id: "gallery",  label: "Gallery",        emoji: "🖼️" },
  { id: "messages", label: "Messages",       emoji: "💬" },
];

const P = "#7C3AED", G = "#059669", D = "#1E1B4B", B = "#DDD6FE", BG = "#FEFCFF";

function Field({ label, value, onChange, multiline = false, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; placeholder?: string;
}) {
  const base: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: `1.5px solid ${B}`, fontFamily: "var(--font-inter)",
    color: D, background: "#F5F3FF", fontSize: 15,
    outline: "none", resize: multiline ? "vertical" : undefined,
  };
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-widest" style={{ color: G, fontFamily: "var(--font-inter)" }}>
        {label}
      </label>
      {multiline
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
            rows={3} style={base}
            onFocus={(e) => (e.target.style.borderColor = P)}
            onBlur={(e)  => (e.target.style.borderColor = B)} />
        : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
            style={base}
            onFocus={(e) => (e.target.style.borderColor = P)}
            onBlur={(e)  => (e.target.style.borderColor = B)} />
      }
    </div>
  );
}

function Card({ children, title, onDelete }: { children: React.ReactNode; title: string; onDelete?: () => void }) {
  return (
    <div className="rounded-2xl border p-6 flex flex-col gap-4" style={{ background: BG, borderColor: B }}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl" style={{ color: D }}>{title}</h3>
        {onDelete && (
          <button onClick={onDelete} className="text-xs px-2.5 py-1 rounded-lg transition-opacity hover:opacity-70"
            style={{ background: "#FEE2E2", color: "#991B1B" }}>Remove</button>
        )}
      </div>
      {children}
    </div>
  );
}

function AddButton({ onClick, label, color = P }: { onClick: () => void; label: string; color?: string }) {
  return (
    <button onClick={onClick}
      className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed text-base transition-opacity hover:opacity-70 w-full"
      style={{ borderColor: color, color, fontFamily: "var(--font-inter)" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
      {label}
    </button>
  );
}

function PhotoCard({ item, index, onCaptionChange, onUpload, onDelete }: {
  item: GalleryItem; index: number;
  onCaptionChange: (v: string) => void;
  onUpload: (f: File) => Promise<void>;
  onDelete: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await onUpload(file);
    setUploading(false);
  }

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: BG, borderColor: B }}>
      <div className="relative w-full h-44 cursor-pointer group" style={{ background: "#EDE9FE" }}
        onClick={() => inputRef.current?.click()}>
        {item.url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm" style={{ color: P, fontFamily: "var(--font-inter)" }}>
                {uploading ? "Uploading…" : "Click to upload"}
              </p>
            </div>
        }
        {item.url && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <p className="text-white text-sm">{uploading ? "Uploading…" : "Click to replace"}</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <div className="p-4 flex flex-col gap-3">
        <Field label={`Photo ${index + 1} Caption`} value={item.caption} onChange={onCaptionChange} placeholder="A wonderful moment…" />
        <button onClick={onDelete} className="text-xs px-3 py-1.5 rounded-lg self-start transition-opacity hover:opacity-70"
          style={{ background: "#FEE2E2", color: "#991B1B", fontFamily: "var(--font-inter)" }}>
          Remove photo
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<Content | null>(null);
  const [section, setSection] = useState<Section>("family");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (res.status === 401) { router.push("/admin/login"); return; }
      const { content } = await res.json();
      setContent(content);
    } catch {
      setStatus({ type: "error", msg: "Failed to load content from GitHub." });
    } finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  async function handleSave() {
    if (!content) return;
    setSaving(true); setStatus(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) setStatus({ type: "success", msg: "Saved & pushed to GitHub. Site rebuilding (~30s)." });
      else { const { error } = await res.json(); setStatus({ type: "error", msg: error || "Save failed." }); }
    } catch { setStatus({ type: "error", msg: "Network error." }); }
    finally { setSaving(false); }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  async function handlePhotoUpload(index: number, file: File) {
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setContent((c) => {
        if (!c) return c;
        const gallery = [...c.gallery];
        gallery[index] = { ...gallery[index], url };
        const updated = { ...c, gallery };
        setTimeout(async () => {
          const r = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: updated }) });
          if (r.ok) setStatus({ type: "success", msg: "Photo uploaded & saved. Site rebuilding (~30s)." });
        }, 0);
        return updated;
      });
    } catch { setStatus({ type: "error", msg: "Photo upload failed. Is BLOB_READ_WRITE_TOKEN set?" }); }
  }

  /* ── Updaters ── */
  const upd = (fn: (c: Content) => Content) => setContent((c) => c ? fn(c) : c);

  const updateFamily  = (k: keyof Content["family"], v: string) => upd((c) => ({ ...c, family: { ...c.family, [k]: v } }));

  const updateTimeline = (i: number, k: keyof TimelineItem, v: string) => upd((c) => {
    const timeline = [...c.timeline]; timeline[i] = { ...timeline[i], [k]: v }; return { ...c, timeline };
  });
  const addTimeline = () => upd((c) => {
    const maxId = c.timeline.reduce((m, t) => Math.max(m, t.id), 0);
    return { ...c, timeline: [...c.timeline, { id: maxId + 1, date: "", emoji: "✨", title: "", description: "" }] };
  });
  const removeTimeline = (i: number) => upd((c) => ({ ...c, timeline: c.timeline.filter((_, j) => j !== i) }));

  const updateHit = (i: number, k: keyof GreatestHit, v: string) => upd((c) => {
    const greatestHits = [...c.greatestHits]; greatestHits[i] = { ...greatestHits[i], [k]: v }; return { ...c, greatestHits };
  });
  const addHit = () => upd((c) => {
    const maxId = c.greatestHits.reduce((m, h) => Math.max(m, h.id), 0);
    return { ...c, greatestHits: [...c.greatestHits, { id: maxId + 1, dish: "", emoji: "🍽️", description: "" }] };
  });
  const removeHit = (i: number) => upd((c) => ({ ...c, greatestHits: c.greatestHits.filter((_, j) => j !== i) }));

  const updateGalleryCaption = (i: number, caption: string) => upd((c) => {
    const gallery = [...c.gallery]; gallery[i] = { ...gallery[i], caption }; return { ...c, gallery };
  });
  const addPhoto = () => upd((c) => {
    const maxId = c.gallery.reduce((m, g) => Math.max(m, g.id), 0);
    return { ...c, gallery: [...c.gallery, { id: maxId + 1, caption: "", url: null }] };
  });
  const removePhoto = (i: number) => upd((c) => ({ ...c, gallery: c.gallery.filter((_, j) => j !== i) }));

  const updateMessage = (i: number, k: keyof Message, v: string) => upd((c) => {
    const messages = [...c.messages]; messages[i] = { ...messages[i], [k]: v }; return { ...c, messages };
  });
  const addMessage = () => upd((c) => ({ ...c, messages: [...c.messages, { author: "", message: "" }] }));
  const removeMessage = (i: number) => upd((c) => ({ ...c, messages: c.messages.filter((_, j) => j !== i) }));

  return (
    <div className="min-h-screen flex" style={{ background: "#F5F3FF", fontFamily: "var(--font-inter)" }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r" style={{ borderColor: B, background: BG }}>
        <div className="px-6 py-6 border-b" style={{ borderColor: B }}>
          <p className="font-display text-xl" style={{ color: D }}>OngLu / Luong</p>
          <p className="text-xs mt-0.5 uppercase tracking-widest" style={{ color: P }}>Admin</p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setSection(n.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors w-full"
              style={{ background: section === n.id ? "#EDE9FE" : "transparent", color: section === n.id ? D : "#6D28D9", fontWeight: section === n.id ? 500 : 400 }}>
              <span>{n.emoji}</span><span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="px-3 pb-5 flex flex-col gap-2">
          <a href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-opacity hover:opacity-70" style={{ color: G }}>
            <span>↗</span> View site
          </a>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-opacity hover:opacity-70 text-left" style={{ color: "#6D28D9" }}>
            <span>⎋</span> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="flex items-center justify-between px-8 py-5 border-b sticky top-0 z-10" style={{ background: BG, borderColor: B }}>
          <div>
            <h2 className="font-display text-2xl" style={{ color: D }}>{NAV.find((n) => n.id === section)?.label}</h2>
            <p className="text-sm mt-0.5" style={{ color: "#6D28D9" }}>Edit below, then click Save &amp; Publish</p>
          </div>
          <div className="flex items-center gap-3">
            {status && (
              <p className="text-sm px-3 py-1.5 rounded-lg" style={{ background: status.type === "success" ? "#F0FDF4" : "#FEF2F2", color: status.type === "success" ? "#166534" : "#991B1B", maxWidth: 280 }}>
                {status.msg}
              </p>
            )}
            <button onClick={handleSave} disabled={saving || loading}
              className="px-5 py-2.5 rounded-lg text-sm uppercase tracking-widest transition-opacity disabled:opacity-40"
              style={{ background: P, color: "#fff" }}>
              {saving ? "Publishing…" : "Save & Publish"}
            </button>
          </div>
        </header>

        <div className="flex-1 px-8 py-8 max-w-3xl">
          {loading && <div className="flex items-center justify-center h-48"><p className="text-base" style={{ color: "#6D28D9" }}>Loading from GitHub…</p></div>}

          {/* ── Family Info ── */}
          {!loading && content && section === "family" && (
            <div className="flex flex-col gap-5">
              <Card title="Family Identity">
                <Field label="Family Name" value={content.family.name} onChange={(v) => updateFamily("name", v)} placeholder="OngLu / Luong" />
                <Field label="Tagline" value={content.family.tagline} onChange={(v) => updateFamily("tagline", v)} placeholder="One Year of Love, Joy & Wonder" />
                <Field label="Anniversary Years" value={content.family.anniversary} onChange={(v) => updateFamily("anniversary", v)} placeholder="2025 – 2026" />
              </Card>
              <Card title="Hero Story">
                <Field label="Story Paragraph" value={content.family.story} onChange={(v) => updateFamily("story", v)} multiline placeholder="The opening paragraph…" />
              </Card>
            </div>
          )}

          {/* ── Timeline ── */}
          {!loading && content && section === "timeline" && (
            <div className="flex flex-col gap-5">
              <div className="rounded-xl border px-5 py-4 text-sm" style={{ background: "#EDE9FE", borderColor: B, color: "#4C1D95" }}>
                Add as many events as you like. <strong>Date</strong> is freeform — e.g. &ldquo;April 2025&rdquo; or &ldquo;Summer&rdquo;.
              </div>
              {content.timeline.map((item, i) => (
                <Card key={item.id} title={`Event ${i + 1}`} onDelete={content.timeline.length > 1 ? () => removeTimeline(i) : undefined}>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Date" value={item.date} onChange={(v) => updateTimeline(i, "date", v)} placeholder="April 2025" />
                    <Field label="Emoji" value={item.emoji} onChange={(v) => updateTimeline(i, "emoji", v)} placeholder="🌸" />
                  </div>
                  <Field label="Title" value={item.title} onChange={(v) => updateTimeline(i, "title", v)} placeholder="A special moment…" />
                  <Field label="Description" value={item.description} onChange={(v) => updateTimeline(i, "description", v)} multiline placeholder="What made this moment special…" />
                </Card>
              ))}
              <AddButton onClick={addTimeline} label="Add Event" color={P} />
            </div>
          )}

          {/* ── Greatest Hits ── */}
          {!loading && content && section === "hits" && (
            <div className="flex flex-col gap-5">
              {content.greatestHits.map((hit, i) => (
                <Card key={hit.id} title={`Dish ${i + 1}`} onDelete={() => removeHit(i)}>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Dish Name" value={hit.dish} onChange={(v) => updateHit(i, "dish", v)} placeholder="Phở Bò" />
                    <Field label="Emoji" value={hit.emoji} onChange={(v) => updateHit(i, "emoji", v)} placeholder="🍜" />
                  </div>
                  <Field label="Description" value={hit.description} onChange={(v) => updateHit(i, "description", v)} multiline placeholder="What makes this dish special…" />
                </Card>
              ))}
              <AddButton onClick={addHit} label="Add Dish" color={G} />
            </div>
          )}

          {/* ── Gallery ── */}
          {!loading && content && section === "gallery" && (
            <div className="flex flex-col gap-5">
              <div className="rounded-xl border px-5 py-4 text-sm" style={{ background: "#EDE9FE", borderColor: B, color: "#4C1D95" }}>
                <strong>Click any photo to upload</strong> — saves to Vercel CDN automatically. Captions and order require Save &amp; Publish.
              </div>
              <div className="grid grid-cols-2 gap-4">
                {content.gallery.map((item, i) => (
                  <PhotoCard key={item.id} item={item} index={i}
                    onCaptionChange={(v) => updateGalleryCaption(i, v)}
                    onUpload={(f) => handlePhotoUpload(i, f)}
                    onDelete={() => removePhoto(i)} />
                ))}
              </div>
              <AddButton onClick={addPhoto} label="Add Photo" color={P} />
            </div>
          )}

          {/* ── Messages ── */}
          {!loading && content && section === "messages" && (
            <div className="flex flex-col gap-5">
              {content.messages.map((msg, i) => (
                <Card key={i} title={`Message ${i + 1}`} onDelete={content.messages.length > 1 ? () => removeMessage(i) : undefined}>
                  <Field label="Author" value={msg.author} onChange={(v) => updateMessage(i, "author", v)} placeholder="The OngLu Family" />
                  <Field label="Message" value={msg.message} onChange={(v) => updateMessage(i, "message", v)} multiline placeholder="Your heartfelt message…" />
                </Card>
              ))}
              <AddButton onClick={addMessage} label="Add Message" color={G} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
