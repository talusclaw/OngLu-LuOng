"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────
   Brown cat & white dog inspired by A Day of Us
   Simple, round, minimalist SVG figures
───────────────────────────────────────────── */

function PetWrap({
  children,
  style,
  label = "A Day of Us 🐾",
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  label?: string;
}) {
  const [up, setUp] = useState(false);
  return (
    <div
      title={label}
      aria-hidden="true"
      onMouseEnter={() => setUp(true)}
      onMouseLeave={() => setUp(false)}
      style={{
        display: "inline-block",
        cursor: "pointer",
        userSelect: "none",
        transition: "transform 0.35s cubic-bezier(.34,1.56,.64,1)",
        transform: up ? "translateY(-8px)" : "translateY(0)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Brown cat, curled up sleeping — side profile */
export function SleepingCat({ style }: { style?: React.CSSProperties }) {
  return (
    <PetWrap style={style}>
      <svg width="80" height="58" viewBox="0 0 80 58" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Tail curling behind */}
        <path d="M12 38 Q4 30 9 20 Q14 12 20 20" stroke="#9B6A47" strokeWidth="6" strokeLinecap="round"/>
        <circle cx="19" cy="21" r="5.5" fill="#9B6A47"/>
        {/* Body curl */}
        <ellipse cx="42" cy="42" rx="30" ry="13" fill="#9B6A47"/>
        {/* Head resting on body */}
        <circle cx="64" cy="28" r="16" fill="#9B6A47"/>
        {/* Ear */}
        <polygon points="64,13 55,22 73,22" fill="#9B6A47"/>
        <polygon points="64,15 58,22 71,22" fill="#C4826A" opacity="0.75"/>
        {/* Closed sleepy eye */}
        <path d="M56 28 Q60 25 65 28" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
        {/* Tiny nose */}
        <ellipse cx="67" cy="32" rx="2" ry="1.3" fill="#C4826A"/>
        {/* Paws */}
        <ellipse cx="26" cy="49" rx="10" ry="6" fill="#8B5A38"/>
        <ellipse cx="42" cy="52" rx="11" ry="5" fill="#8B5A38"/>
      </svg>
    </PetWrap>
  );
}

/** Brown cat, sitting upright — front view */
export function SittingCat({ style }: { style?: React.CSSProperties }) {
  return (
    <PetWrap style={style}>
      <svg width="60" height="76" viewBox="0 0 60 76" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left ear */}
        <polygon points="11,20 5,6 22,16" fill="#9B6A47"/>
        <polygon points="12,19 8,9 20,16" fill="#C4826A" opacity="0.75"/>
        {/* Right ear */}
        <polygon points="49,20 55,6 38,16" fill="#9B6A47"/>
        <polygon points="48,19 52,9 40,16" fill="#C4826A" opacity="0.75"/>
        {/* Head */}
        <circle cx="30" cy="29" r="21" fill="#9B6A47"/>
        {/* Body */}
        <ellipse cx="30" cy="61" rx="19" ry="14" fill="#9B6A47"/>
        {/* Eyes */}
        <circle cx="22" cy="28" r="4.5" fill="#1a1a1a"/>
        <circle cx="23.8" cy="26.5" r="1.4" fill="white"/>
        <circle cx="38" cy="28" r="4.5" fill="#1a1a1a"/>
        <circle cx="39.8" cy="26.5" r="1.4" fill="white"/>
        {/* Nose */}
        <polygon points="30,34 26.5,37 33.5,37" fill="#C4826A"/>
        {/* Mouth */}
        <path d="M26.5 37.5 Q30 40.5 33.5 37.5" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round"/>
        {/* Whiskers */}
        <line x1="6" y1="34" x2="23" y2="34.5" stroke="#1a1a1a" strokeWidth="0.9" opacity="0.35"/>
        <line x1="6" y1="37.5" x2="23" y2="36.5" stroke="#1a1a1a" strokeWidth="0.9" opacity="0.35"/>
        <line x1="54" y1="34" x2="37" y2="34.5" stroke="#1a1a1a" strokeWidth="0.9" opacity="0.35"/>
        <line x1="54" y1="37.5" x2="37" y2="36.5" stroke="#1a1a1a" strokeWidth="0.9" opacity="0.35"/>
        {/* Tail */}
        <path d="M46 66 Q60 58 57 46 Q55 38 63 34" stroke="#9B6A47" strokeWidth="5.5" strokeLinecap="round"/>
      </svg>
    </PetWrap>
  );
}

/** White / cream dog, sitting upright — front view */
export function SittingDog({ style }: { style?: React.CSSProperties }) {
  return (
    <PetWrap style={style}>
      <svg width="64" height="76" viewBox="0 0 64 76" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Floppy ears (behind head) */}
        <ellipse cx="11" cy="32" rx="11" ry="17" fill="#D9CABB" transform="rotate(-6,11,32)"/>
        <ellipse cx="53" cy="32" rx="11" ry="17" fill="#D9CABB" transform="rotate(6,53,32)"/>
        {/* Head */}
        <circle cx="32" cy="27" r="21" fill="#F0E8D8"/>
        {/* Body */}
        <ellipse cx="32" cy="61" rx="19" ry="14" fill="#F0E8D8"/>
        {/* Eyes */}
        <circle cx="24" cy="26" r="5" fill="#1a1a1a"/>
        <circle cx="25.8" cy="24.3" r="1.5" fill="white"/>
        <circle cx="40" cy="26" r="5" fill="#1a1a1a"/>
        <circle cx="41.8" cy="24.3" r="1.5" fill="white"/>
        {/* Nose */}
        <ellipse cx="32" cy="34" rx="5.5" ry="4" fill="#2a2a2a"/>
        {/* Mouth */}
        <path d="M26.5 37.5 Q32 41 37.5 37.5" stroke="#888" strokeWidth="1.3" strokeLinecap="round"/>
        {/* Tail stub */}
        <path d="M50 65 Q63 58 60 48" stroke="#D9CABB" strokeWidth="6.5" strokeLinecap="round"/>
      </svg>
    </PetWrap>
  );
}

/** Cat and dog sitting side by side */
export function PetsDuo({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, ...style }}>
      <SittingCat />
      <SittingDog />
    </div>
  );
}
