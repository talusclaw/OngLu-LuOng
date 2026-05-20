"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";

type TimelineItem = { id: number; date: string; emoji: string; title: string; description: string; photo?: string | null };
type GreatestHit  = { id: number; dish: string; emoji: string; description: string; recipe: string; photos: string[]; coverPhoto: string | null };
type GalleryItem  = { id: number; caption: string; url: string | null; focalX?: number; focalY?: number };
type Message      = { author: string; message: string };
type Letter       = { title: string; body: string };
type Pets         = { kiriMessages: string[]; doriMessages: string[] };
type Content = {
  family:       { name: string; tagline: string; anniversary: string; story: string };
  timeline:     TimelineItem[];
  greatestHits: GreatestHit[];
  gallery:      GalleryItem[];
  messages:     Message[];
  letter:       Letter;
  pets:         Pets;
};

type Section = "family" | "timeline" | "hits" | "gallery" | "messages" | "letter" | "pets";

const NAV: { id: Section; label: string; emoji: string }[] = [
  { id: "family",   label: "Family Info",   emoji: "🏡" },
  { id: "timeline", label: "Timeline",       emoji: "📅" },
  { id: "hits",     label: "Greatest Hits",  emoji: "🍽️" },
  { id: "gallery",  label: "Gallery",        emoji: "🖼️" },
  { id: "messages", label: "Messages",       emoji: "💬" },
  { id: "letter",   label: "Hidden Letter",  emoji: "💌" },
  { id: "pets",     label: "Pet Messages",   emoji: "🐾" },
];

const P = "#7C3AED", G = "#059669", D = "#1E1B4B", B = "#DDD6FE", BG = "#FEFCFF";

function isVideo(url: string | null | undefined) {
  return !!url && /\.(mp4|mov|webm|avi|m4v|mkv)(\?|$)/i.test(url);
}

function Field({ label, value, onChange, multiline = false, placeholder = "", rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; placeholder?: string; rows?: number;
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
            rows={rows} style={base}
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

function Card({ children, title, onDelete, onMoveUp, onMoveDown }: {
  children: React.ReactNode; title: string;
  onDelete?: () => void; onMoveUp?: () => void; onMoveDown?: () => void;
}) {
  return (
    <div className="rounded-2xl border p-6 flex flex-col gap-4" style={{ background: BG, borderColor: B }}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl" style={{ color: D }}>{title}</h3>
        <div className="flex items-center gap-1.5">
          {(onMoveUp || onMoveDown) && (
            <div className="flex items-center gap-0.5">
              <button onClick={onMoveUp} disabled={!onMoveUp}
                className="w-7 h-7 rounded flex items-center justify-center transition-opacity disabled:opacity-20 hover:opacity-70"
                style={{ background: "#EDE9FE", color: P, fontSize: "0.75rem" }}>▲</button>
              <button onClick={onMoveDown} disabled={!onMoveDown}
                className="w-7 h-7 rounded flex items-center justify-center transition-opacity disabled:opacity-20 hover:opacity-70"
                style={{ background: "#EDE9FE", color: P, fontSize: "0.75rem" }}>▼</button>
            </div>
          )}
          {onDelete && (
            <button onClick={onDelete} className="text-xs px-2.5 py-1 rounded-lg transition-opacity hover:opacity-70"
              style={{ background: "#FEE2E2", color: "#991B1B" }}>Remove</button>
          )}
        </div>
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

function PhotoCard({ item, index, onCaptionChange, onFocalChange, onUpload, onUrlSet, onDelete }: {
  item: GalleryItem; index: number;
  onCaptionChange: (v: string) => void;
  onFocalChange: (x: number, y: number) => void;
  onUpload: (f: File) => Promise<void>;
  onUrlSet: (url: string) => void;
  onDelete: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await onUpload(file);
    setUploading(false);
  }

  async function handleLinkEmbed() {
    if (!linkInput.trim()) return;
    setResolving(true); setResolveError("");
    try {
      const res = await fetch(`/api/resolve-embed?url=${encodeURIComponent(linkInput.trim())}`);
      const data = await res.json();
      if (data.embedUrl) { onUrlSet(data.embedUrl); setLinkInput(""); }
      else setResolveError(data.error ?? "Could not detect video link.");
    } catch { setResolveError("Network error."); }
    finally { setResolving(false); }
  }

  function handleFocalClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    onFocalChange(x, y);
  }

  const focalX = item.focalX ?? 50;
  const focalY = item.focalY ?? 50;

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: BG, borderColor: B }}>
      {/* Preview area — videos replace focal-point click with replace-file click */}
      <div className="relative w-full h-44 cursor-crosshair" style={{ background: "#EDE9FE" }}
        onClick={item.url && !isVideo(item.url) ? handleFocalClick : () => inputRef.current?.click()}>
        {item.url ? (
          <>
            {isVideo(item.url) ? (
              <video src={item.url} className="w-full h-full object-cover" muted playsInline loop autoPlay />
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.caption} className="w-full h-full object-cover"
                  style={{ objectPosition: `${focalX}% ${focalY}%` }} />
                <div style={{
                  position: "absolute",
                  left: `${focalX}%`, top: `${focalY}%`,
                  transform: "translate(-50%, -50%)",
                  width: 22, height: 22,
                  borderRadius: "50%",
                  border: "2.5px solid #fff",
                  boxShadow: "0 0 0 1.5px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(0,0,0,0.2)",
                  pointerEvents: "none",
                }} />
                <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none">
                  <span style={{ background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: "0.65rem",
                    padding: "2px 7px", borderRadius: 4, fontFamily: "var(--font-inter)", letterSpacing: "0.03em" }}>
                    Click to move focus point
                  </span>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm" style={{ color: P, fontFamily: "var(--font-inter)" }}>
              {uploading ? "Uploading…" : "Click to upload"}
            </p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
      </div>
      <div className="p-4 flex flex-col gap-3">
        <Field label={`Item ${index + 1} Caption`} value={item.caption} onChange={onCaptionChange} placeholder="A wonderful moment…" />
        {/* Social video link */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest" style={{ color: G, fontFamily: "var(--font-inter)" }}>Or paste a TikTok / YouTube link</label>
          <div className="flex gap-2">
            <input
              type="text" value={linkInput} onChange={(e) => setLinkInput(e.target.value)}
              placeholder="https://www.tiktok.com/t/…"
              onKeyDown={(e) => e.key === "Enter" && handleLinkEmbed()}
              style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: `1.5px solid ${B}`, fontFamily: "var(--font-inter)", fontSize: 13, color: D, background: "#F5F3FF", outline: "none" }}
              onFocus={(e) => (e.target.style.borderColor = P)}
              onBlur={(e) => (e.target.style.borderColor = B)} />
            <button onClick={handleLinkEmbed} disabled={resolving || !linkInput.trim()}
              className="text-xs px-3 py-1.5 rounded-lg transition-opacity disabled:opacity-40"
              style={{ background: P, color: "#fff", fontFamily: "var(--font-inter)", whiteSpace: "nowrap" }}>
              {resolving ? "…" : "Embed"}
            </button>
          </div>
          {resolveError && <p className="text-xs" style={{ color: "#991B1B", fontFamily: "var(--font-inter)" }}>{resolveError}</p>}
        </div>
        <div className="flex items-center gap-2">
          {item.url && (
            <button onClick={() => inputRef.current?.click()}
              className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70"
              style={{ background: "#EDE9FE", color: P, fontFamily: "var(--font-inter)" }}>
              Replace
            </button>
          )}
          <button onClick={onDelete} className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70"
            style={{ background: "#FEE2E2", color: "#991B1B", fontFamily: "var(--font-inter)" }}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function PhotoUpload({ photo, onUpload, onUrlSet, onRemove }: {
  photo: string | null;
  onUpload: (f: File) => Promise<void>;
  onUrlSet: (url: string) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await onUpload(file);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleLinkEmbed() {
    if (!linkInput.trim()) return;
    setResolving(true); setResolveError("");
    try {
      const res = await fetch(`/api/resolve-embed?url=${encodeURIComponent(linkInput.trim())}`);
      const data = await res.json();
      if (data.embedUrl) { onUrlSet(data.embedUrl); setLinkInput(""); }
      else setResolveError(data.error ?? "Could not detect video link.");
    } catch { setResolveError("Network error."); }
    finally { setResolving(false); }
  }

  const isEmbedUrl = (u: string | null) => !!u && (u.includes("tiktok.com/embed") || u.includes("youtube.com/embed"));
  const isVideoUrl = (u: string | null) => !!u && /\.(mp4|mov|webm|avi|m4v|mkv)(\?|$)/i.test(u);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-widest" style={{ color: G, fontFamily: "var(--font-inter)" }}>
        Photo / Video (optional)
      </label>
      <div
        className="relative w-full rounded-xl overflow-hidden cursor-pointer group"
        style={{ height: 140, background: "#EDE9FE", border: `1.5px dashed ${B}` }}
        onClick={() => !isEmbedUrl(photo) && inputRef.current?.click()}>
        {photo ? (
          isEmbedUrl(photo) ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1"
              style={{ background: photo.includes("tiktok") ? "#010101" : "#1a1a1a" }}>
              <p className="text-xs font-medium" style={{ color: "#fff", fontFamily: "var(--font-inter)" }}>
                {photo.includes("tiktok") ? "TikTok" : "YouTube"} embedded
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}>Remove to replace</p>
            </div>
          ) : isVideoUrl(photo) ? (
            <video src={photo} className="w-full h-full object-cover" muted playsInline loop autoPlay />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="Event photo" className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm" style={{ color: P, fontFamily: "var(--font-inter)" }}>
              {uploading ? "Uploading…" : "Click to add photo or video"}
            </p>
          </div>
        )}
        {photo && !isEmbedUrl(photo) && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <p className="text-white text-sm">{uploading ? "Uploading…" : "Click to replace"}</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
      </div>
      {/* Social video link input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest" style={{ color: G, fontFamily: "var(--font-inter)" }}>Or paste a TikTok / YouTube link</label>
        <div className="flex gap-2">
          <input
            type="text" value={linkInput} onChange={(e) => setLinkInput(e.target.value)}
            placeholder="https://www.tiktok.com/t/…"
            onKeyDown={(e) => e.key === "Enter" && handleLinkEmbed()}
            style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: `1.5px solid ${B}`, fontFamily: "var(--font-inter)", fontSize: 13, color: D, background: "#F5F3FF", outline: "none" }}
            onFocus={(e) => (e.target.style.borderColor = P)}
            onBlur={(e) => (e.target.style.borderColor = B)} />
          <button onClick={handleLinkEmbed} disabled={resolving || !linkInput.trim()}
            className="text-xs px-3 py-1.5 rounded-lg transition-opacity disabled:opacity-40"
            style={{ background: P, color: "#fff", fontFamily: "var(--font-inter)", whiteSpace: "nowrap" }}>
            {resolving ? "…" : "Embed"}
          </button>
        </div>
        {resolveError && <p className="text-xs" style={{ color: "#991B1B", fontFamily: "var(--font-inter)" }}>{resolveError}</p>}
      </div>
      {photo && (
        <button onClick={onRemove} className="text-xs px-3 py-1 rounded-lg self-start transition-opacity hover:opacity-70"
          style={{ background: "#FEE2E2", color: "#991B1B", fontFamily: "var(--font-inter)" }}>
          Remove
        </button>
      )}
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
    try {
      const blob = await upload(
        `gallery/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
        file,
        { access: "public", handleUploadUrl: "/api/admin/upload" }
      );
      const url = blob.url;
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
    } catch { setStatus({ type: "error", msg: "Photo upload failed. Check that BLOB_READ_WRITE_TOKEN is set in Vercel." }); }
  }

  async function handleTimelinePhotoUpload(index: number, file: File) {
    try {
      const blob = await upload(
        `timeline/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
        file,
        { access: "public", handleUploadUrl: "/api/admin/upload" }
      );
      const url = blob.url;
      setContent((c) => {
        if (!c) return c;
        const timeline = [...c.timeline];
        timeline[index] = { ...timeline[index], photo: url };
        const updated = { ...c, timeline };
        setTimeout(async () => {
          const r = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: updated }) });
          if (r.ok) setStatus({ type: "success", msg: "Photo uploaded & saved. Site rebuilding (~30s)." });
        }, 0);
        return updated;
      });
    } catch { setStatus({ type: "error", msg: "Photo upload failed. Check that BLOB_READ_WRITE_TOKEN is set in Vercel." }); }
  }

  async function handleHitMultiPhotoUpload(dishIdx: number, files: FileList) {
    const fileArray = Array.from(files);
    const results = await Promise.allSettled(
      fileArray.map(async (file) => {
        const blob = await upload(
          `hits/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
          file,
          { access: "public", handleUploadUrl: "/api/admin/upload" }
        );
        return blob.url;
      })
    );
    const urls = results
      .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled")
      .map((r) => r.value);
    const failed = results.filter((r) => r.status === "rejected").length;
    setContent((c) => {
      if (!c) return c;
      const greatestHits = [...c.greatestHits];
      const hit = greatestHits[dishIdx];
      const photos = [...(hit.photos ?? []), ...urls];
      const coverPhoto = hit.coverPhoto ?? urls[0] ?? null;
      greatestHits[dishIdx] = { ...hit, photos, coverPhoto };
      const updated = { ...c, greatestHits };
      setTimeout(async () => {
        const r = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: updated }) });
        if (r.ok) setStatus({ type: "success", msg: `${urls.length} photo${urls.length !== 1 ? "s" : ""} uploaded & saved.${failed ? ` ${failed} failed.` : ""} Site rebuilding (~30s).` });
      }, 0);
      return updated;
    });
    if (failed > 0) setStatus({ type: "error", msg: `${failed} upload(s) failed.` });
  }

  async function handleMultiPhotoUpload(files: FileList) {
    if (!content) return;
    const fileArray = Array.from(files);
    const maxId = content.gallery.reduce((m, g) => Math.max(m, g.id), 0);
    const newItems = fileArray.map((f, i) => ({
      id: maxId + 1 + i,
      caption: f.name.replace(/\.[^.]+$/, "").replace(/[_\-]/g, " "),
      url: null as string | null,
    }));
    setContent((c) => c ? { ...c, gallery: [...c.gallery, ...newItems] } : c);
    const results = await Promise.allSettled(
      fileArray.map(async (file, i) => {
        const blob = await upload(
          `gallery/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
          file,
          { access: "public", handleUploadUrl: "/api/admin/upload" }
        );
        return { id: newItems[i].id, url: blob.url };
      })
    );
    const urlMap = new Map(
      results
        .filter((r): r is PromiseFulfilledResult<{ id: number; url: string }> => r.status === "fulfilled")
        .map((r) => [r.value.id, r.value.url])
    );
    const failed = results.filter((r) => r.status === "rejected").length;
    setContent((c) => {
      if (!c) return c;
      const gallery = c.gallery.map((g) => urlMap.has(g.id) ? { ...g, url: urlMap.get(g.id)! } : g);
      const updated = { ...c, gallery };
      setTimeout(async () => {
        const r = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: updated }) });
        if (r.ok) setStatus({ type: "success", msg: `${urlMap.size} photo${urlMap.size !== 1 ? "s" : ""} uploaded & saved.${failed ? ` ${failed} failed.` : ""} Site rebuilding (~30s).` });
      }, 0);
      return updated;
    });
    if (failed > 0) setStatus({ type: "error", msg: `${failed} upload(s) failed.` });
  }

  /* ── Updaters ── */
  const upd = (fn: (c: Content) => Content) => setContent((c) => c ? fn(c) : c);

  const updateFamily  = (k: keyof Content["family"], v: string) => upd((c) => ({ ...c, family: { ...c.family, [k]: v } }));

  const updateTimeline = (i: number, k: keyof TimelineItem, v: string) => upd((c) => {
    const timeline = [...c.timeline]; timeline[i] = { ...timeline[i], [k]: v }; return { ...c, timeline };
  });
  const addTimeline = () => upd((c) => {
    const maxId = c.timeline.reduce((m, t) => Math.max(m, t.id), 0);
    return { ...c, timeline: [...c.timeline, { id: maxId + 1, date: "", emoji: "✨", title: "", description: "", photo: null }] };
  });
  const removeTimeline = (i: number) => upd((c) => ({ ...c, timeline: c.timeline.filter((_, j) => j !== i) }));
  const moveTimeline = (i: number, dir: -1 | 1) => upd((c) => {
    const t = [...c.timeline];
    [t[i], t[i + dir]] = [t[i + dir], t[i]];
    return { ...c, timeline: t };
  });

  const updateHit = (i: number, k: keyof GreatestHit, v: string) => upd((c) => {
    const greatestHits = [...c.greatestHits]; greatestHits[i] = { ...greatestHits[i], [k]: v }; return { ...c, greatestHits };
  });
  const addHit = () => upd((c) => {
    const maxId = c.greatestHits.reduce((m, h) => Math.max(m, h.id), 0);
    return { ...c, greatestHits: [...c.greatestHits, { id: maxId + 1, dish: "", emoji: "🍽️", description: "", recipe: "", photos: [], coverPhoto: null }] };
  });
  const removeHit = (i: number) => upd((c) => ({ ...c, greatestHits: c.greatestHits.filter((_, j) => j !== i) }));
  const setHitCover = (dishIdx: number, url: string) => upd((c) => {
    const greatestHits = [...c.greatestHits];
    greatestHits[dishIdx] = { ...greatestHits[dishIdx], coverPhoto: url };
    return { ...c, greatestHits };
  });
  const removeHitPhoto = (dishIdx: number, url: string) => upd((c) => {
    const greatestHits = [...c.greatestHits];
    const hit = greatestHits[dishIdx];
    const photos = hit.photos.filter((p) => p !== url);
    const coverPhoto = hit.coverPhoto === url ? (photos[0] ?? null) : hit.coverPhoto;
    greatestHits[dishIdx] = { ...hit, photos, coverPhoto };
    return { ...c, greatestHits };
  });

  const updateGalleryCaption = (i: number, caption: string) => upd((c) => {
    const gallery = [...c.gallery]; gallery[i] = { ...gallery[i], caption }; return { ...c, gallery };
  });
  const updateGalleryUrl = (i: number, url: string) => upd((c) => {
    const gallery = [...c.gallery]; gallery[i] = { ...gallery[i], url }; return { ...c, gallery };
  });
  const updateGalleryFocal = (i: number, focalX: number, focalY: number) => upd((c) => {
    const gallery = [...c.gallery]; gallery[i] = { ...gallery[i], focalX, focalY }; return { ...c, gallery };
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

  const updateLetter = (k: keyof Letter, v: string) => upd((c) => ({ ...c, letter: { ...c.letter, [k]: v } }));
  const updatePetsMsg = (k: keyof Pets, i: number, v: string) => upd((c) => {
    const msgs = [...(c.pets?.[k] ?? [])]; msgs[i] = v; return { ...c, pets: { ...c.pets, [k]: msgs } };
  });
  const addPetsMsg = (k: keyof Pets) => upd((c) => ({ ...c, pets: { ...c.pets, [k]: [...(c.pets?.[k] ?? []), ""] } }));
  const removePetsMsg = (k: keyof Pets, i: number) => upd((c) => {
    const msgs = (c.pets?.[k] ?? []).filter((_, j) => j !== i);
    return { ...c, pets: { ...c.pets, [k]: msgs.length ? msgs : [""] } };
  });

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
                <Card key={item.id} title={`Event ${i + 1}`}
                  onDelete={content.timeline.length > 1 ? () => removeTimeline(i) : undefined}
                  onMoveUp={i > 0 ? () => moveTimeline(i, -1) : undefined}
                  onMoveDown={i < content.timeline.length - 1 ? () => moveTimeline(i, 1) : undefined}>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Date" value={item.date} onChange={(v) => updateTimeline(i, "date", v)} placeholder="April 2025" />
                    <Field label="Emoji" value={item.emoji} onChange={(v) => updateTimeline(i, "emoji", v)} placeholder="🌸" />
                  </div>
                  <Field label="Title" value={item.title} onChange={(v) => updateTimeline(i, "title", v)} placeholder="A special moment…" />
                  <Field label="Description" value={item.description} onChange={(v) => updateTimeline(i, "description", v)} multiline placeholder="What made this moment special…" />
                  <PhotoUpload
                    photo={item.photo ?? null}
                    onUpload={(f) => handleTimelinePhotoUpload(i, f)}
                    onUrlSet={(url) => upd((c) => {
                      const timeline = [...c.timeline];
                      timeline[i] = { ...timeline[i], photo: url };
                      return { ...c, timeline };
                    })}
                    onRemove={() => {
                      upd((c) => {
                        const timeline = [...c.timeline];
                        timeline[i] = { ...timeline[i], photo: null };
                        return { ...c, timeline };
                      });
                    }}
                  />
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
                  <Field label="Recipe" value={hit.recipe ?? ""} onChange={(v) => updateHit(i, "recipe", v)} multiline placeholder="Ingredients and steps…" />

                  {/* Photos */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs uppercase tracking-widest" style={{ color: G, fontFamily: "var(--font-inter)" }}>
                        Photos {hit.photos?.length ? `(${hit.photos.length})` : ""}
                      </label>
                      {hit.photos?.length ? (
                        <p className="text-xs" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter)" }}>
                          Click a photo to set as cover
                        </p>
                      ) : null}
                    </div>

                    {/* Photo thumbnails */}
                    {hit.photos?.length ? (
                      <div className="grid grid-cols-3 gap-2">
                        {hit.photos.map((url) => {
                          const isCover = hit.coverPhoto === url;
                          return (
                            <div key={url} className="relative rounded-xl overflow-hidden cursor-pointer"
                              style={{ aspectRatio: "1", border: isCover ? `2px solid ${P}` : "2px solid transparent" }}
                              onClick={() => setHitCover(i, url)}>
                              {isVideo(url)
                                ? <video src={url} className="w-full h-full object-cover" muted playsInline loop autoPlay />
                                // eslint-disable-next-line @next/next/no-img-element
                                : <img src={url} alt="" className="w-full h-full object-cover" />
                              }
                              {isCover && (
                                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-xs font-medium"
                                  style={{ background: P, color: "#fff", fontFamily: "var(--font-inter)" }}>
                                  Cover
                                </div>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); removeHitPhoto(i, url); }}
                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-opacity hover:opacity-80"
                                style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}>
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}

                    {/* Add photos */}
                    <label className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm transition-opacity hover:opacity-70 cursor-pointer"
                      style={{ borderColor: G, color: G, fontFamily: "var(--font-inter)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                      Add Photos / Videos
                      <input type="file" accept="image/*,video/*" multiple className="hidden"
                        onChange={(e) => { if (e.target.files?.length) handleHitMultiPhotoUpload(i, e.target.files); e.target.value = ""; }} />
                    </label>
                  </div>
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
                    onFocalChange={(x, y) => updateGalleryFocal(i, x, y)}
                    onUpload={(f) => handlePhotoUpload(i, f)}
                    onUrlSet={(url) => updateGalleryUrl(i, url)}
                    onDelete={() => removePhoto(i)} />
                ))}
              </div>
              <label className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed text-base transition-opacity hover:opacity-70 w-full cursor-pointer"
                style={{ borderColor: P, color: P, fontFamily: "var(--font-inter)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                Add Photos / Videos
                <input type="file" accept="image/*,video/*" multiple className="hidden"
                  onChange={(e) => { if (e.target.files?.length) handleMultiPhotoUpload(e.target.files); e.target.value = ""; }} />
              </label>
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

          {/* ── Pet Messages ── */}
          {!loading && content && section === "pets" && (
            <div className="flex flex-col gap-5">
              <div className="rounded-xl border px-5 py-4 text-sm" style={{ background: "#EDE9FE", borderColor: B, color: "#4C1D95" }}>
                🐾 Each click picks a <strong>random</strong> message from the list. Add as many as you like — blank messages are ignored.
              </div>

              {/* Kiri */}
              <Card title="🐱 Kiri's Messages">
                <div className="flex flex-col gap-3">
                  {(content.pets?.kiriMessages ?? [""]).map((msg, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Field
                          label={`Message ${i + 1}`}
                          value={msg}
                          onChange={(v) => updatePetsMsg("kiriMessages", i, v)}
                          multiline rows={3}
                          placeholder="meow~ something sweet from Kiri…"
                        />
                      </div>
                      {(content.pets?.kiriMessages?.length ?? 1) > 1 && (
                        <button
                          onClick={() => removePetsMsg("kiriMessages", i)}
                          className="mt-6 text-xs px-2.5 py-1.5 rounded-lg transition-opacity hover:opacity-70 shrink-0"
                          style={{ background: "#FEE2E2", color: "#991B1B" }}>
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <AddButton onClick={() => addPetsMsg("kiriMessages")} label="Add Message" color={P} />
              </Card>

              {/* Dori */}
              <Card title="🐶 Dori's Messages">
                <div className="flex flex-col gap-3">
                  {(content.pets?.doriMessages ?? [""]).map((msg, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Field
                          label={`Message ${i + 1}`}
                          value={msg}
                          onChange={(v) => updatePetsMsg("doriMessages", i, v)}
                          multiline rows={3}
                          placeholder="woof! something sweet from Dori…"
                        />
                      </div>
                      {(content.pets?.doriMessages?.length ?? 1) > 1 && (
                        <button
                          onClick={() => removePetsMsg("doriMessages", i)}
                          className="mt-6 text-xs px-2.5 py-1.5 rounded-lg transition-opacity hover:opacity-70 shrink-0"
                          style={{ background: "#FEE2E2", color: "#991B1B" }}>
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <AddButton onClick={() => addPetsMsg("doriMessages")} label="Add Message" color={G} />
              </Card>
            </div>
          )}

          {/* ── Hidden Letter ── */}
          {!loading && content && section === "letter" && (
            <div className="flex flex-col gap-5">
              <div className="rounded-xl border px-5 py-4 text-sm" style={{ background: "#EDE9FE", borderColor: B, color: "#4C1D95" }}>
                💌 This letter appears when visitors click on <strong>Kiri & Dori</strong> in the footer. It&apos;s a hidden surprise.
              </div>
              <Card title="Hidden Letter">
                <Field label="Title" value={content.letter?.title ?? "Dear Helena"} onChange={(v) => updateLetter("title", v)} placeholder="Dear Helena" />
                <Field label="Letter Body" value={content.letter?.body ?? ""} onChange={(v) => updateLetter("body", v)} multiline rows={14} placeholder="Write your letter here…" />
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
