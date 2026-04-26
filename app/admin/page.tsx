"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

type TimelineItem = { month: string; emoji: string; title: string; description: string };
type GalleryItem = { id: number; caption: string; url: string | null };
type Message = { author: string; message: string };
type Content = {
  family: { name: string; tagline: string; anniversary: string; story: string };
  timeline: TimelineItem[];
  gallery: GalleryItem[];
  messages: Message[];
};

type Section = "family" | "timeline" | "gallery" | "messages";

const NAV: { id: Section; label: string; emoji: string }[] = [
  { id: "family", label: "Family Info", emoji: "🏡" },
  { id: "timeline", label: "Timeline", emoji: "📅" },
  { id: "gallery", label: "Gallery", emoji: "🖼️" },
  { id: "messages", label: "Messages", emoji: "💬" },
];

const P = "#7C3AED";   // purple
const G = "#059669";   // green
const D = "#1E1B4B";   // dark
const B = "#DDD6FE";   // border
const BG = "#FEFCFF";  // card bg

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
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          rows={4} style={base}
          onFocus={(e) => (e.target.style.borderColor = P)}
          onBlur={(e) => (e.target.style.borderColor = B)} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          style={base}
          onFocus={(e) => (e.target.style.borderColor = P)}
          onBlur={(e) => (e.target.style.borderColor = B)} />
      )}
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
            style={{ background: "#FEE2E2", color: "#991B1B" }}>
            Remove
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function PhotoCard({ item, index, onCaptionChange, onUpload, onDelete }: {
  item: GalleryItem; index: number;
  onCaptionChange: (v: string) => void;
  onUpload: (file: File) => Promise<void>;
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
      {/* Photo preview */}
      <div className="relative w-full h-44 cursor-pointer group"
        style={{ background: "#EDE9FE" }}
        onClick={() => inputRef.current?.click()}>
        {item.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm" style={{ color: P, fontFamily: "var(--font-inter)" }}>
              {uploading ? "Uploading…" : "Click to upload photo"}
            </p>
          </div>
        )}
        {item.url && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <p className="text-white text-sm" style={{ fontFamily: "var(--font-inter)" }}>
              {uploading ? "Uploading…" : "Click to replace"}
            </p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {/* Caption + controls */}
      <div className="p-4 flex flex-col gap-3">
        <Field label={`Photo ${index + 1} Caption`} value={item.caption} onChange={onCaptionChange} placeholder="A wonderful moment…" />
        <button onClick={onDelete} className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70 self-start"
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
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setStatus({ type: "success", msg: "Saved & pushed to GitHub. Site rebuilding (~30s)." });
      } else {
        const { error } = await res.json();
        setStatus({ type: "error", msg: error || "Save failed." });
      }
    } catch {
      setStatus({ type: "error", msg: "Network error. Try again." });
    } finally {
      setSaving(false);
    }
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
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setContent((c) => {
        if (!c) return c;
        const gallery = [...c.gallery];
        gallery[index] = { ...gallery[index], url };
        return { ...c, gallery };
      });
      // Auto-save after upload so URL is persisted to GitHub
      setContent((c) => {
        if (!c) return c;
        const updated = { ...c };
        updated.gallery = [...c.gallery];
        updated.gallery[index] = { ...c.gallery[index], url };
        // Trigger save with updated content
        setTimeout(async () => {
          const res2 = await fetch("/api/admin/content", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: updated }),
          });
          if (res2.ok) {
            setStatus({ type: "success", msg: "Photo uploaded & saved. Site rebuilding (~30s)." });
          }
        }, 0);
        return updated;
      });
    } catch {
      setStatus({ type: "error", msg: "Photo upload failed. Check BLOB_READ_WRITE_TOKEN." });
    }
  }

  function addPhoto() {
    setContent((c) => {
      if (!c) return c;
      const maxId = c.gallery.reduce((m, g) => Math.max(m, g.id), 0);
      return { ...c, gallery: [...c.gallery, { id: maxId + 1, caption: "", url: null }] };
    });
  }

  function removePhoto(index: number) {
    setContent((c) => {
      if (!c) return c;
      const gallery = c.gallery.filter((_, i) => i !== index);
      return { ...c, gallery };
    });
  }

  function updateFamily(key: keyof Content["family"], val: string) {
    setContent((c) => c ? { ...c, family: { ...c.family, [key]: val } } : c);
  }
  function updateTimeline(i: number, key: keyof TimelineItem, val: string) {
    setContent((c) => {
      if (!c) return c;
      const timeline = [...c.timeline];
      timeline[i] = { ...timeline[i], [key]: val };
      return { ...c, timeline };
    });
  }
  function updateGalleryCaption(i: number, caption: string) {
    setContent((c) => {
      if (!c) return c;
      const gallery = [...c.gallery];
      gallery[i] = { ...gallery[i], caption };
      return { ...c, gallery };
    });
  }
  function updateMessage(i: number, key: keyof Message, val: string) {
    setContent((c) => {
      if (!c) return c;
      const messages = [...c.messages];
      messages[i] = { ...messages[i], [key]: val };
      return { ...c, messages };
    });
  }

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
              style={{
                background: section === n.id ? "#EDE9FE" : "transparent",
                color: section === n.id ? D : "#6D28D9",
                fontWeight: section === n.id ? 500 : 400,
              }}>
              <span>{n.emoji}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="px-3 pb-5 flex flex-col gap-2">
          <a href="/" target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-opacity hover:opacity-70"
            style={{ color: G }}>
            <span>↗</span> View site
          </a>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-opacity hover:opacity-70 text-left"
            style={{ color: "#6D28D9" }}>
            <span>⎋</span> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="flex items-center justify-between px-8 py-5 border-b sticky top-0 z-10"
          style={{ background: BG, borderColor: B }}>
          <div>
            <h2 className="font-display text-2xl" style={{ color: D }}>
              {NAV.find((n) => n.id === section)?.label}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "#6D28D9" }}>
              Edit below, then click Save &amp; Publish
            </p>
          </div>
          <div className="flex items-center gap-3">
            {status && (
              <p className="text-sm px-3 py-1.5 rounded-lg"
                style={{
                  background: status.type === "success" ? "#F0FDF4" : "#FEF2F2",
                  color: status.type === "success" ? "#166534" : "#991B1B",
                  maxWidth: 280,
                }}>
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
          {loading && (
            <div className="flex items-center justify-center h-48">
              <p className="text-base" style={{ color: "#6D28D9" }}>Loading from GitHub…</p>
            </div>
          )}

          {!loading && content && section === "family" && (
            <div className="flex flex-col gap-5">
              <Card title="Family Identity">
                <Field label="Family Name" value={content.family.name} onChange={(v) => updateFamily("name", v)} placeholder="OngLu / Luong" />
                <Field label="Tagline" value={content.family.tagline} onChange={(v) => updateFamily("tagline", v)} placeholder="One Year of Family, Love & Memories" />
                <Field label="Anniversary Years" value={content.family.anniversary} onChange={(v) => updateFamily("anniversary", v)} placeholder="2025 – 2026" />
              </Card>
              <Card title="Hero Story">
                <Field label="Story Paragraph" value={content.family.story} onChange={(v) => updateFamily("story", v)} multiline placeholder="The opening paragraph shown on the hero section…" />
              </Card>
            </div>
          )}

          {!loading && content && section === "timeline" && (
            <div className="flex flex-col gap-5">
              {content.timeline.map((item, i) => (
                <Card key={i} title={`Season ${i + 1}`}>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Season" value={item.month} onChange={(v) => updateTimeline(i, "month", v)} placeholder="Spring" />
                    <Field label="Emoji" value={item.emoji} onChange={(v) => updateTimeline(i, "emoji", v)} placeholder="🌸" />
                  </div>
                  <Field label="Title" value={item.title} onChange={(v) => updateTimeline(i, "title", v)} placeholder="Where It All Began" />
                  <Field label="Description" value={item.description} onChange={(v) => updateTimeline(i, "description", v)} multiline placeholder="A description of this season's memories…" />
                </Card>
              ))}
            </div>
          )}

          {!loading && content && section === "gallery" && (
            <div className="flex flex-col gap-5">
              <div className="rounded-xl border px-5 py-4 text-sm"
                style={{ background: "#EDE9FE", borderColor: B, color: "#4C1D95" }}>
                <strong>Click any photo card to upload</strong> — photos go directly to Vercel Blob CDN and save automatically.
                Captions and order changes require clicking <strong>Save &amp; Publish</strong>.
              </div>
              <div className="grid grid-cols-2 gap-4">
                {content.gallery.map((item, i) => (
                  <PhotoCard key={item.id} item={item} index={i}
                    onCaptionChange={(v) => updateGalleryCaption(i, v)}
                    onUpload={(file) => handlePhotoUpload(i, file)}
                    onDelete={() => removePhoto(i)} />
                ))}
              </div>
              <button onClick={addPhoto}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed text-base transition-colors hover:opacity-80"
                style={{ borderColor: P, color: P, fontFamily: "var(--font-inter)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                Add Photo
              </button>
            </div>
          )}

          {!loading && content && section === "messages" && (
            <div className="flex flex-col gap-5">
              {content.messages.map((msg, i) => (
                <Card key={i} title={`Message ${i + 1}`}
                  onDelete={content.messages.length > 1 ? () => setContent((c) => c ? { ...c, messages: c.messages.filter((_, j) => j !== i) } : c) : undefined}>
                  <Field label="Author" value={msg.author} onChange={(v) => updateMessage(i, "author", v)} placeholder="The OngLu Family" />
                  <Field label="Message" value={msg.message} onChange={(v) => updateMessage(i, "message", v)} multiline placeholder="Your heartfelt message…" />
                </Card>
              ))}
              <button onClick={() => setContent((c) => c ? { ...c, messages: [...c.messages, { author: "", message: "" }] } : c)}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed text-base transition-colors hover:opacity-80"
                style={{ borderColor: G, color: G, fontFamily: "var(--font-inter)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                Add Message
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
