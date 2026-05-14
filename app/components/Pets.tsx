"use client";

import { useState } from "react";
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

function PetWrap({
  children,
  style,
  messages,
  petEmoji,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  messages?: string[];
  petEmoji?: string;
}) {
  const [up, setUp] = useState(false);
  const [shownMsg, setShownMsg] = useState<string | null>(null);

  function handleEnter() {
    setUp(true);
    if (messages?.length) {
      setShownMsg(messages[Math.floor(Math.random() * messages.length)]);
    }
  }

  function handleLeave() {
    setUp(false);
    setShownMsg(null);
  }

  return (
    <div
      aria-hidden="true"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        display: "inline-block",
        position: "relative",
        cursor: "default",
        userSelect: "none",
        transition: "transform 0.35s cubic-bezier(.34,1.56,.64,1)",
        transform: up ? "translateY(-9px)" : "translateY(0)",
        ...style,
      }}
    >
      {children}

      {/* Speech bubble — appears above on hover */}
      {shownMsg && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 10px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#FEFCFF",
          border: "1px solid rgba(124,58,237,0.22)",
          borderRadius: 14,
          padding: "8px 13px",
          minWidth: 110,
          maxWidth: 190,
          boxShadow: "0 6px 20px rgba(0,0,0,0.14)",
          zIndex: 50,
          pointerEvents: "none",
          textAlign: "center",
          whiteSpace: "normal",
        }}>
          <p style={{
            fontSize: "0.77rem",
            color: "#3D2A6E",
            fontStyle: "italic",
            lineHeight: 1.55,
            fontFamily: "var(--font-inter)",
            wordBreak: "break-word",
          }}>
            {petEmoji} &ldquo;{shownMsg}&rdquo;
          </p>
          {/* Triangle pointer */}
          <div style={{
            position: "absolute",
            bottom: -7,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderTop: "7px solid #FEFCFF",
          }} />
        </div>
      )}
    </div>
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
    <PetWrap style={style} messages={KIRI_MSGS} petEmoji="🐱">
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
    <PetWrap style={style} messages={DORI_MSGS} petEmoji="🐶">
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
    <PetWrap style={style} messages={KIRI_MSGS} petEmoji="🐱">
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
    <PetWrap style={style} messages={DORI_MSGS} petEmoji="🐶">
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
    <PetWrap style={style} messages={KIRI_MSGS} petEmoji="🐱">
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
