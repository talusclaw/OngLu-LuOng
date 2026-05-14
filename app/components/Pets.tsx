"use client";

import { useState, useEffect } from "react";
import content from "@/data/content.json";

/* ─────────────────────────────────────────────────────────
   Kiri (brown cat) & Dori (white dog) from A Day of Us
   Chibi style: huge round heads, tiny bodies, thick outlines
───────────────────────────────────────────────────────── */

const CAT  = "#A87648";   // warm caramel-brown
const CAT2 = "#C9956A";   // lighter for inner ear / shading
const DOG  = "#F5F0E8";   // cream-white
const DOG2 = "#DDD8CF";   // slightly darker for ears
const INK  = "#2B1F1F";   // thick outline colour
const SW   = 2.5;         // default stroke-width

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pets = (content as any).pets ?? {};
const KIRI_MSGS: string[] = (pets.kiriMessages ?? []).filter(Boolean);
const DORI_MSGS: string[] = (pets.doriMessages ?? []).filter(Boolean);

function PetModal({ name, emoji, message, onClose }: {
  name: string; emoji: string; message: string; onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fade-in"
      style={{ background: "rgba(10,7,22,0.75)", backdropFilter: "blur(10px)" }}
      onClick={onClose}>
      <div
        className="relative rounded-3xl"
        style={{
          maxWidth: 340,
          width: "100%",
          background: "var(--bg-light)",
          boxShadow: "0 28px 70px rgba(0,0,0,0.45), 0 0 0 1px rgba(124,58,237,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}>

        {/* Top accent bar */}
        <div className="h-1 w-full rounded-t-3xl"
          style={{ background: "linear-gradient(90deg, #7C3AED, #10B981)" }} />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-60"
          style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "var(--t-l-3)", fontSize: "0.9rem" }}>
          ✕
        </button>

        <div className="px-7 pt-6 pb-8 flex flex-col gap-4">
          {/* Name row */}
          <div className="flex items-center gap-3">
            <span style={{ fontSize: "2rem", lineHeight: 1 }}>{emoji}</span>
            <p className="font-display font-medium" style={{ fontSize: "1.25rem", color: "var(--t-l-1)" }}>
              {name}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px" style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.4), rgba(16,185,129,0.3), transparent)" }} />

          {/* Message */}
          <p className="font-display font-light italic leading-[1.8] whitespace-pre-line"
            style={{ fontSize: "0.98rem", color: "var(--t-l-2)" }}>
            &ldquo;{message}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

function PetWrap({
  children,
  style,
  messages,
  petName,
  petEmoji,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  messages?: string[];
  petName?: string;
  petEmoji?: string;
}) {
  const [up, setUp] = useState(false);
  const [currentMsg, setCurrentMsg] = useState<string | null>(null);

  function handleClick(e: React.MouseEvent) {
    if (!messages?.length) return;
    e.stopPropagation();
    const msg = messages[Math.floor(Math.random() * messages.length)];
    setCurrentMsg(msg);
  }

  return (
    <>
      <div
        aria-hidden="true"
        onMouseEnter={() => setUp(true)}
        onMouseLeave={() => setUp(false)}
        onClick={messages?.length ? handleClick : undefined}
        style={{
          display: "inline-block",
          cursor: "pointer",
          userSelect: "none",
          transition: "transform 0.35s cubic-bezier(.34,1.56,.64,1)",
          transform: up ? "translateY(-9px)" : "translateY(0)",
          ...style,
        }}
      >
        {children}
      </div>

      {currentMsg && petName && petEmoji && (
        <PetModal
          name={petName}
          emoji={petEmoji}
          message={currentMsg}
          onClose={() => setCurrentMsg(null)}
        />
      )}
    </>
  );
}

/* ── Shared face parts ── */
function Eyes({ lx, ly, rx, ry }: { lx:number; ly:number; rx:number; ry:number }) {
  return (
    <>
      <circle cx={lx} cy={ly} r={6.5} fill={INK} />
      <circle cx={lx - 2} cy={ly - 2} r={2.2} fill="white" />
      <circle cx={rx} cy={ry} r={6.5} fill={INK} />
      <circle cx={rx - 2} cy={ry - 2} r={2.2} fill="white" />
    </>
  );
}

/* ═══════════════════════════════════════
   KIRI – Brown cat, sitting upright
═══════════════════════════════════════ */
export function SittingCat({ style }: { style?: React.CSSProperties }) {
  return (
    <PetWrap style={style} messages={KIRI_MSGS} petName="Kiri" petEmoji="🐱">
      <svg width="68" height="92" viewBox="0 0 68 92" fill="none">
        {/* Left ear */}
        <polygon points="13,18 6,2 24,12" fill={CAT} stroke={INK} strokeWidth={SW} strokeLinejoin="round"/>
        <polygon points="13,17 9,6 21,12" fill={CAT2}/>
        {/* Right ear */}
        <polygon points="55,18 62,2 44,12" fill={CAT} stroke={INK} strokeWidth={SW} strokeLinejoin="round"/>
        <polygon points="55,17 59,6 47,12" fill={CAT2}/>
        {/* Body */}
        <ellipse cx="34" cy="78" rx="18" ry="13" fill={CAT} stroke={INK} strokeWidth={SW}/>
        {/* Paws */}
        <ellipse cx="22" cy="88" rx="10" ry="5.5" fill={CAT} stroke={INK} strokeWidth={1.8}/>
        <ellipse cx="46" cy="88" rx="10" ry="5.5" fill={CAT} stroke={INK} strokeWidth={1.8}/>
        {/* Head */}
        <circle cx="34" cy="36" r="27" fill={CAT} stroke={INK} strokeWidth={SW}/>
        {/* Eyes */}
        <Eyes lx={24} ly={33} rx={44} ry={33}/>
        {/* Nose (small pink triangle) */}
        <polygon points="34,42 30.5,46 37.5,46" fill={CAT2}/>
        {/* Mouth */}
        <path d="M30.5 46 Q34 50 37.5 46" stroke={INK} strokeWidth={1.6} strokeLinecap="round"/>
        {/* Tail */}
        <path d="M50 82 Q64 74 61 62 Q59 53 67 48" stroke={CAT} strokeWidth={6} strokeLinecap="round" fill="none"/>
        <path d="M50 82 Q64 74 61 62 Q59 53 67 48" stroke={INK} strokeWidth={1.8} strokeLinecap="round" fill="none"/>
      </svg>
    </PetWrap>
  );
}

/* ═══════════════════════════════════════
   DORI – White dog, sitting upright
═══════════════════════════════════════ */
export function SittingDog({ style }: { style?: React.CSSProperties }) {
  return (
    <PetWrap style={style} messages={DORI_MSGS} petName="Dori" petEmoji="🐶">
      <svg width="72" height="92" viewBox="0 0 72 92" fill="none">
        {/* Floppy ears (behind head) */}
        <ellipse cx="13" cy="38" rx="12" ry="10" fill={DOG2} stroke={INK} strokeWidth={SW} transform="rotate(-12,13,38)"/>
        <ellipse cx="59" cy="38" rx="12" ry="10" fill={DOG2} stroke={INK} strokeWidth={SW} transform="rotate(12,59,38)"/>
        {/* Body */}
        <ellipse cx="36" cy="78" rx="18" ry="13" fill={DOG} stroke={INK} strokeWidth={SW}/>
        {/* Paws */}
        <ellipse cx="24" cy="88" rx="10" ry="5.5" fill={DOG} stroke={INK} strokeWidth={1.8}/>
        <ellipse cx="48" cy="88" rx="10" ry="5.5" fill={DOG} stroke={INK} strokeWidth={1.8}/>
        {/* Head */}
        <circle cx="36" cy="36" r="27" fill={DOG} stroke={INK} strokeWidth={SW}/>
        {/* Eyes */}
        <Eyes lx={26} ly={33} rx={46} ry={33}/>
        {/* Nose (dark oval) */}
        <ellipse cx="36" cy="43" rx="5.5" ry="4" fill={INK}/>
        {/* Mouth */}
        <path d="M30 47 Q36 52 42 47" stroke={INK} strokeWidth={1.6} strokeLinecap="round"/>
      </svg>
    </PetWrap>
  );
}

/* ═══════════════════════════════════════
   KIRI sleeping – curled ball, side view
═══════════════════════════════════════ */
export function SleepingCat({ style }: { style?: React.CSSProperties }) {
  return (
    <PetWrap style={style} messages={KIRI_MSGS} petName="Kiri" petEmoji="🐱">
      <svg width="92" height="62" viewBox="0 0 92 62" fill="none">
        {/* Tail wrapping around */}
        <path d="M14 46 Q4 38 8 26 Q12 16 20 24" stroke={CAT} strokeWidth={8} strokeLinecap="round"/>
        <path d="M14 46 Q4 38 8 26 Q12 16 20 24" stroke={INK} strokeWidth={2} strokeLinecap="round" fill="none"/>
        <circle cx="20" cy="25" r="6" fill={CAT} stroke={INK} strokeWidth={1.8}/>
        {/* Curled body */}
        <ellipse cx="48" cy="46" rx="32" ry="14" fill={CAT} stroke={INK} strokeWidth={SW}/>
        {/* Head resting */}
        <circle cx="70" cy="30" r="20" fill={CAT} stroke={INK} strokeWidth={SW}/>
        {/* Ear */}
        <polygon points="70,12 62,20 78,20" fill={CAT} stroke={INK} strokeWidth={SW} strokeLinejoin="round"/>
        <polygon points="70,14 65,20 76,20" fill={CAT2}/>
        {/* Closed sleepy eyes (arcs) */}
        <path d="M61 30 Q66 27 71 30" stroke={INK} strokeWidth={2.2} strokeLinecap="round"/>
        {/* Tiny nose */}
        <polygon points="73,34 70.5,37 75.5,37" fill={CAT2}/>
        {/* Paws peeking */}
        <ellipse cx="32" cy="55" rx="12" ry="7" fill={CAT} stroke={INK} strokeWidth={1.8}/>
        <ellipse cx="50" cy="57" rx="13" ry="6" fill={CAT} stroke={INK} strokeWidth={1.8}/>
      </svg>
    </PetWrap>
  );
}

/* ═══════════════════════════════════════
   DORI waving – dog with arm raised
═══════════════════════════════════════ */
export function WavingDog({ style }: { style?: React.CSSProperties }) {
  return (
    <PetWrap style={style} messages={DORI_MSGS} petName="Dori" petEmoji="🐶">
      <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
        {/* Waving arm (raised right) */}
        <ellipse cx="70" cy="46" rx="9" ry="7" fill={DOG} stroke={INK} strokeWidth={SW} transform="rotate(-40,70,46)"/>
        <path d="M56 64 Q68 58 70 46" stroke={DOG} strokeWidth={10} strokeLinecap="round"/>
        <path d="M56 64 Q68 58 70 46" stroke={INK} strokeWidth={2} strokeLinecap="round" fill="none"/>
        {/* Floppy ears */}
        <ellipse cx="14" cy="40" rx="12" ry="10" fill={DOG2} stroke={INK} strokeWidth={SW} transform="rotate(-12,14,40)"/>
        <ellipse cx="60" cy="36" rx="10" ry="9" fill={DOG2} stroke={INK} strokeWidth={SW} transform="rotate(12,60,36)"/>
        {/* Body */}
        <ellipse cx="38" cy="80" rx="18" ry="13" fill={DOG} stroke={INK} strokeWidth={SW}/>
        {/* Paws */}
        <ellipse cx="26" cy="90" rx="10" ry="5.5" fill={DOG} stroke={INK} strokeWidth={1.8}/>
        <ellipse cx="50" cy="90" rx="10" ry="5.5" fill={DOG} stroke={INK} strokeWidth={1.8}/>
        {/* Head */}
        <circle cx="38" cy="38" r="27" fill={DOG} stroke={INK} strokeWidth={SW}/>
        {/* Eyes (happy, slightly squinted) */}
        <path d="M26 34 Q29 30 32 34" stroke={INK} strokeWidth={2.5} strokeLinecap="round"/>
        <path d="M42 34 Q45 30 48 34" stroke={INK} strokeWidth={2.5} strokeLinecap="round"/>
        {/* Nose */}
        <ellipse cx="38" cy="45" rx="5.5" ry="4" fill={INK}/>
        {/* Big smile */}
        <path d="M30 49 Q38 56 46 49" stroke={INK} strokeWidth={1.8} strokeLinecap="round"/>
      </svg>
    </PetWrap>
  );
}

/* ═══════════════════════════════════════
   KIRI peeking – just head visible
═══════════════════════════════════════ */
export function PeekingCat({ style }: { style?: React.CSSProperties }) {
  return (
    <PetWrap style={style} messages={KIRI_MSGS} petName="Kiri" petEmoji="🐱">
      {/* clip so only top half shows */}
      <svg width="68" height="38" viewBox="0 0 68 60" style={{ overflow: "hidden" }} fill="none">
        {/* Left ear */}
        <polygon points="13,18 6,2 24,12" fill={CAT} stroke={INK} strokeWidth={SW} strokeLinejoin="round"/>
        <polygon points="13,17 9,6 21,12" fill={CAT2}/>
        {/* Right ear */}
        <polygon points="55,18 62,2 44,12" fill={CAT} stroke={INK} strokeWidth={SW} strokeLinejoin="round"/>
        <polygon points="55,17 59,6 47,12" fill={CAT2}/>
        {/* Head (only upper portion visible) */}
        <circle cx="34" cy="38" r="27" fill={CAT} stroke={INK} strokeWidth={SW}/>
        {/* Wide curious eyes */}
        <circle cx="24" cy="35" r={7} fill={INK}/>
        <circle cx={22} cy={33} r={2.5} fill="white"/>
        <circle cx="44" cy="35" r={7} fill={INK}/>
        <circle cx={42} cy={33} r={2.5} fill="white"/>
      </svg>
    </PetWrap>
  );
}

/* ═══════════════════════════════════════
   Duo – cat & dog sitting side by side
═══════════════════════════════════════ */
export function PetsDuo({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, ...style }}>
      <SittingCat />
      <SittingDog />
    </div>
  );
}
