"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type TimelineItem = { month: string; emoji: string; title: string; description: string };
type GalleryItem = { id: number; caption: string };
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

function Field({
  label, value, onChange, multiline = false, placeholder = "",
}: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; placeholder?: string;
}) {
  const base: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1.5px solid #E8D5A3", fontFamily: "var(--font-inter)",
    color: "#2C1A0E", background: "#FDF8F0", fontSize: 14,
    outline: "none", resize: multiline ? "vertical" : undefined,
  };
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-widest" style={{ color: "#7A5C3A", fontFamily: "var(--font-inter)" }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          rows={4} style={base}
          onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
          onBlur={(e) => (e.target.style.borderColor = "#E8D5A3")}
        />
      ) : (
        <input
          type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          style={base}
          onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
          onBlur={(e) => (e.target.style.borderColor = "#E8D5A3")}
        />
      )}
    </div>
  );
}

function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="rounded-2xl border p-6 flex flex-col gap-4"
      style={{ background: "#FFFDF8", borderColor: "#E8D5A3" }}>
      <h3 className="font-display text-xl" style={{ color: "#2C1A0E" }}>{title}</h3>
      {children}
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
  function updateGallery(i: number, caption: string) {
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
    <div className="min-h-screen flex" style={{ background: "#FDF8F0", fontFamily: "var(--font-inter)" }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r" style={{ borderColor: "#E8D5A3", background: "#FFFDF8" }}>
        <div className="px-6 py-6 border-b" style={{ borderColor: "#E8D5A3" }}>
          <p className="font-display text-xl" style={{ color: "#2C1A0E" }}>OngLu / Luong</p>
          <p className="text-xs mt-0.5 uppercase tracking-widest" style={{ color: "#C9A84C" }}>Admin</p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setSection(n.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors w-full"
              style={{
                background: section === n.id ? "#F5ECD7" : "transparent",
                color: section === n.id ? "#2C1A0E" : "#7A5C3A",
                fontWeight: section === n.id ? 500 : 400,
              }}>
              <span>{n.emoji}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="px-3 pb-5 flex flex-col gap-2">
          <a href="/" target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-opacity hover:opacity-70"
            style={{ color: "#7A5C3A" }}>
            <span>↗</span> View site
          </a>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-opacity hover:opacity-70 text-left"
            style={{ color: "#7A5C3A" }}>
            <span>⎋</span> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-5 border-b sticky top-0 z-10"
          style={{ background: "#FFFDF8", borderColor: "#E8D5A3" }}>
          <div>
            <h2 className="font-display text-2xl" style={{ color: "#2C1A0E" }}>
              {NAV.find((n) => n.id === section)?.label}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#7A5C3A" }}>
              Edit content below, then click Save &amp; Publish
            </p>
          </div>
          <div className="flex items-center gap-3">
            {status && (
              <p className="text-xs px-3 py-1.5 rounded-lg"
                style={{
                  background: status.type === "success" ? "#F0FDF4" : "#FEF2F2",
                  color: status.type === "success" ? "#166534" : "#991B1B",
                  maxWidth: 260,
                }}>
                {status.msg}
              </p>
            )}
            <button onClick={handleSave} disabled={saving || loading}
              className="px-5 py-2.5 rounded-lg text-sm uppercase tracking-widest transition-opacity disabled:opacity-40"
              style={{ background: "#C9A84C", color: "#FFFDF8" }}>
              {saving ? "Publishing…" : "Save & Publish"}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-8 py-8 max-w-3xl">
          {loading && (
            <div className="flex items-center justify-center h-48">
              <p className="text-sm" style={{ color: "#7A5C3A" }}>Loading from GitHub…</p>
            </div>
          )}

          {!loading && content && section === "family" && (
            <div className="flex flex-col gap-5">
              <Card title="Family Identity">
                <Field label="Family Name" value={content.family.name}
                  onChange={(v) => updateFamily("name", v)} placeholder="OngLu / Luong" />
                <Field label="Tagline" value={content.family.tagline}
                  onChange={(v) => updateFamily("tagline", v)}
                  placeholder="One Year of Family, Love & Memories" />
                <Field label="Anniversary Years" value={content.family.anniversary}
                  onChange={(v) => updateFamily("anniversary", v)} placeholder="2025 – 2026" />
              </Card>
              <Card title="Hero Story">
                <Field label="Story Paragraph" value={content.family.story}
                  onChange={(v) => updateFamily("story", v)} multiline
                  placeholder="The opening paragraph shown on the hero section…" />
              </Card>
            </div>
          )}

          {!loading && content && section === "timeline" && (
            <div className="flex flex-col gap-5">
              {content.timeline.map((item, i) => (
                <Card key={i} title={`Season ${i + 1}`}>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Season" value={item.month}
                      onChange={(v) => updateTimeline(i, "month", v)} placeholder="Spring" />
                    <Field label="Emoji" value={item.emoji}
                      onChange={(v) => updateTimeline(i, "emoji", v)} placeholder="🌸" />
                  </div>
                  <Field label="Title" value={item.title}
                    onChange={(v) => updateTimeline(i, "title", v)} placeholder="Where It All Began" />
                  <Field label="Description" value={item.description}
                    onChange={(v) => updateTimeline(i, "description", v)} multiline
                    placeholder="A description of this season's memories…" />
                </Card>
              ))}
            </div>
          )}

          {!loading && content && section === "gallery" && (
            <div className="flex flex-col gap-5">
              <div className="rounded-xl border px-5 py-4 text-sm"
                style={{ background: "#FFF9EC", borderColor: "#E8D5A3", color: "#7A5C3A" }}>
                <strong>To add real photos:</strong> Drop image files into{" "}
                <code className="bg-amber-100 px-1 rounded">public/gallery/</code> in your repo,
                then update the Gallery component to reference them. Captions here are saved instantly.
              </div>
              <div className="grid grid-cols-2 gap-4">
                {content.gallery.map((item, i) => (
                  <Card key={i} title={`Photo ${i + 1}`}>
                    <Field label="Caption" value={item.caption}
                      onChange={(v) => updateGallery(i, v)} placeholder="Summer celebration…" />
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!loading && content && section === "messages" && (
            <div className="flex flex-col gap-5">
              {content.messages.map((msg, i) => (
                <Card key={i} title={`Message ${i + 1}`}>
                  <Field label="Author" value={msg.author}
                    onChange={(v) => updateMessage(i, "author", v)} placeholder="The OngLu Family" />
                  <Field label="Message" value={msg.message}
                    onChange={(v) => updateMessage(i, "message", v)} multiline
                    placeholder="Your heartfelt message…" />
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
