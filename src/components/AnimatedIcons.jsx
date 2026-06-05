import React from 'react';

// ── 1. Blazing Fire (Trending) ────────────────────────────────────────────────
export const AnimatedFire = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="animated-icon fire">
    <style>
      {`
        .fire .flame-main { fill: #E50914; transform-origin: center bottom; animation: flicker 0.6s ease-in-out infinite alternate; }
        .fire .flame-inner { fill: #ff9900; transform-origin: center bottom; animation: flickerInner 0.4s ease-in-out infinite alternate; }
        .fire .spark { fill: #ffdb58; animation: sparkFly 1.5s linear infinite; }
        .fire .spark2 { fill: #ffdb58; animation: sparkFly 1.2s linear infinite 0.5s; }
        @keyframes flicker {
          0% { transform: scale(1) skewX(-2deg); opacity: 0.9; }
          100% { transform: scale(1.05) skewX(2deg); opacity: 1; filter: brightness(1.2); }
        }
        @keyframes flickerInner {
          0% { transform: scale(0.9) translateY(1px); }
          100% { transform: scale(1.1) translateY(-1px); }
        }
        @keyframes sparkFly {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-15px) scale(0); opacity: 0; }
        }
      `}
    </style>
    <path className="flame-main" d="M12 22C12 22 6 16.5 6 11C6 7.5 8.5 4.5 12 2C12 2 13 5.5 15.5 7.5C18 9.5 18 12.5 18 14.5C18 18 15 22 12 22Z" />
    <path className="flame-inner" d="M12 20C12 20 9 16 9 12.5C9 10 10.5 8 12 6.5C12 6.5 13 8.5 14 9.5C15 10.5 15 12.5 15 14C15 16.5 13.5 20 12 20Z" />
    <circle className="spark" cx="10" cy="18" r="1.5" />
    <circle className="spark2" cx="14" cy="16" r="1" />
  </svg>
);

// ── 2. Spinning Film (Now Playing) ───────────────────────────────────────────
export const AnimatedFilm = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon film">
    <style>
      {`
        .film .reel { animation: spinReel 4s linear infinite; transform-origin: center; }
        .film .play-btn { fill: #E50914; animation: pulsePlay 1.5s ease-in-out infinite alternate; }
        @keyframes spinReel { 100% { transform: rotate(360deg); } }
        @keyframes pulsePlay { 0% { transform: scale(0.85); opacity: 0.8; } 100% { transform: scale(1.15); opacity: 1; } }
      `}
    </style>
    <rect className="reel" x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line className="reel" x1="7" y1="2" x2="7" y2="22" />
    <line className="reel" x1="17" y1="2" x2="17" y2="22" />
    <line className="reel" x1="2" y1="12" x2="22" y2="12" />
    <line className="reel" x1="2" y1="7" x2="7" y2="7" />
    <line className="reel" x1="2" y1="17" x2="7" y2="17" />
    <line className="reel" x1="17" y1="17" x2="22" y2="17" />
    <line className="reel" x1="17" y1="7" x2="22" y2="7" />
    <polygon className="play-btn" points="10 9 15 12 10 15 10 9" />
  </svg>
);

// ── 3. Glowing Star (Top Rated) ──────────────────────────────────────────────
export const AnimatedStar = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" className="animated-icon star">
    <style>
      {`
        .star .star-shape { fill: #f5c518; stroke: #f5c518; stroke-width: 1; transform-origin: center; animation: starPulse 2s ease-in-out infinite alternate; }
        .star .star-glow { fill: #f5c518; opacity: 0.3; filter: blur(3px); transform-origin: center; animation: starGlow 2s ease-in-out infinite alternate; }
        @keyframes starPulse { 0% { transform: scale(0.9) rotate(-5deg); } 100% { transform: scale(1.15) rotate(5deg); } }
        @keyframes starGlow { 0% { transform: scale(1); opacity: 0.2; } 100% { transform: scale(1.6); opacity: 0.5; } }
      `}
    </style>
    <polygon className="star-glow" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    <polygon className="star-shape" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ── 4. Launching Rocket (Popular) ────────────────────────────────────────────
export const AnimatedRocket = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" className="animated-icon rocket">
    <style>
      {`
        .rocket .ship { fill: #3b82f6; transform-origin: center; animation: rocketShake 0.3s ease-in-out infinite alternate; }
        .rocket .flame { fill: #f97316; transform-origin: top left; animation: rocketFlame 0.1s ease-in-out infinite alternate; }
        .rocket .window { fill: #fff; }
        @keyframes rocketShake {
          0% { transform: translate(1px, 1px) rotate(45deg); }
          100% { transform: translate(-1px, -1px) rotate(45deg); }
        }
        @keyframes rocketFlame {
          0% { transform: scale(0.8) translate(-1px, 1px); opacity: 0.8; }
          100% { transform: scale(1.2) translate(1px, -1px); opacity: 1; filter: brightness(1.3); }
        }
      `}
    </style>
    <g transform="translate(2, 2)">
      <path className="flame" d="M3 17L1 21L5 19L3 17Z" />
      <path className="ship" d="M12 2C12 2 4 8 4 14C4 16 2 18 2 18L6 18L6 22L8 20C10 20 16 12 16 12L12 2Z" />
      <path className="ship" d="M12 2C12 2 18 8 18 14C18 16 20 18 20 18L16 18L16 22L14 20C12 20 6 12 6 12L12 2Z" fill="#2563eb" />
      <circle className="window" cx="12" cy="12" r="2" />
    </g>
  </svg>
);

// ── 5. Clashing Swords (Action) ──────────────────────────────────────────────
export const AnimatedSwords = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon swords">
    <style>
      {`
        .swords .sword1 { transform-origin: 50% 50%; animation: clash1 1s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate; }
        .swords .sword2 { transform-origin: 50% 50%; animation: clash2 1s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate; }
        .swords .spark { fill: #f5c518; stroke: none; opacity: 0; animation: strikeSpark 1s ease-out infinite alternate; }
        @keyframes clash1 { 0% { transform: rotate(-15deg) translate(-2px, -2px); } 100% { transform: rotate(5deg) translate(0, 0); } }
        @keyframes clash2 { 0% { transform: rotate(15deg) translate(2px, 2px); } 100% { transform: rotate(-5deg) translate(0, 0); } }
        @keyframes strikeSpark { 80% { opacity: 0; transform: scale(0.5); } 100% { opacity: 1; transform: scale(1.5); } }
      `}
    </style>
    <path className="sword1" d="M14.5 17.5L3 6V3h3l11.5 11.5 M13 19l6-6 M16 16l4 4" />
    <path className="sword2" d="M9.5 17.5L21 6V3h-3L6.5 14.5 M11 19l-6-6 M8 16l-4 4" />
    <circle className="spark" cx="12" cy="12" r="3" />
  </svg>
);

// ── 6. Laughing Face (Comedy) ────────────────────────────────────────────────
export const AnimatedSmile = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon smile">
    <style>
      {`
        .smile { transform-origin: center; animation: bounceLaugh 1s cubic-bezier(0.28, 0.84, 0.42, 1) infinite; }
        .smile .eyes { animation: blink 3s linear infinite; }
        .smile .mouth { transform-origin: center; animation: laughMouth 1s ease-in-out infinite; }
        @keyframes bounceLaugh { 0%, 100% { transform: translateY(0) scaleY(1); } 50% { transform: translateY(-4px) scaleY(0.95); } }
        @keyframes blink { 0%, 96%, 100% { transform: scaleY(1); } 98% { transform: scaleY(0.1); } }
        @keyframes laughMouth { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); stroke-width: 2.5; } }
      `}
    </style>
    <circle cx="12" cy="12" r="10" fill="#f59e0b" fillOpacity="0.2" />
    <path className="eyes" d="M8 9h.01M16 9h.01" strokeWidth="3" />
    <path className="mouth" d="M8 14c2 3 6 3 8 0" />
  </svg>
);

// ── 7. Floating Ghost (Horror) ───────────────────────────────────────────────
export const AnimatedGhost = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon ghost">
    <style>
      {`
        .ghost { transform-origin: center; animation: floatGhost 3s ease-in-out infinite; }
        .ghost .body { fill: #e5e7eb; fill-opacity: 0.8; }
        .ghost .face { stroke: #1c1917; animation: spookyFace 4s steps(2, end) infinite; }
        @keyframes floatGhost { 0%, 100% { transform: translateY(0) rotate(-3deg); opacity: 0.8; } 50% { transform: translateY(-6px) rotate(3deg); opacity: 1; filter: drop-shadow(0 0 5px rgba(255,255,255,0.5)); } }
        @keyframes spookyFace { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(1px) scaleY(1.2); } }
      `}
    </style>
    <path className="body" d="M9 10h.01 M15 10h.01 M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />
    <g className="face">
      <circle cx="9" cy="10" r="1" fill="#1c1917" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="#1c1917" stroke="none" />
      <path d="M11 14h2" />
    </g>
  </svg>
);

// ── 8. Spinning Orbit (Sci-Fi) ───────────────────────────────────────────────
export const AnimatedOrbit = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon orbit">
    <style>
      {`
        .orbit .ring1 { transform-origin: center; animation: spinRing 4s linear infinite; }
        .orbit .ring2 { transform-origin: center; animation: spinRing 6s linear infinite reverse; }
        .orbit .core { fill: #06b6d4; animation: corePulse 1.5s ease-in-out infinite alternate; }
        @keyframes spinRing { 100% { transform: rotate(360deg); } }
        @keyframes corePulse { 0% { transform: scale(0.8); filter: drop-shadow(0 0 2px #06b6d4); } 100% { transform: scale(1.3); filter: drop-shadow(0 0 8px #06b6d4); } }
      `}
    </style>
    <circle className="core" cx="12" cy="12" r="3" />
    <ellipse className="ring1" cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)" />
    <ellipse className="ring2" cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)" />
  </svg>
);

// ── 9. Beating Heart (Romance) ───────────────────────────────────────────────
export const AnimatedHeart = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon heart">
    <style>
      {`
        .heart .shape { fill: #ec4899; transform-origin: center; animation: heartbeat 1.2s cubic-bezier(0.28, 0.84, 0.42, 1) infinite; }
        @keyframes heartbeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.25); filter: drop-shadow(0 0 8px rgba(236,72,153,0.6)); }
          30% { transform: scale(1); }
          45% { transform: scale(1.15); }
          60%, 100% { transform: scale(1); }
        }
      `}
    </style>
    <path className="shape" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// ── 10. Drama Masks (Drama) ──────────────────────────────────────────────────
export const AnimatedDrama = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon drama">
    <style>
      {`
        .drama .mask-happy { transform-origin: bottom left; animation: maskSway 3s ease-in-out infinite alternate; fill: rgba(168,85,247,0.2); }
        .drama .mask-sad { transform-origin: bottom right; animation: maskSway 3s ease-in-out infinite alternate-reverse; fill: rgba(0,0,0,0.5); }
        @keyframes maskSway { 0% { transform: rotate(-5deg) translateY(0); } 100% { transform: rotate(5deg) translateY(-2px); } }
      `}
    </style>
    {/* Sad mask back */}
    <path className="mask-sad" d="M16 4a6 6 0 0 1 6 6c0 4-3 9-6 11-3-2-6-7-6-11a6 6 0 0 1 6-6z" />
    <path d="M14 9h2 M18 9h2 M15 15c1-2 3-2 4 0" stroke="#a855f7" />
    {/* Happy mask front */}
    <path className="mask-happy" d="M8 2a6 6 0 0 0-6 6c0 4 3 9 6 11 3-2 6-7 6-11a6 6 0 0 0-6-6z" />
    <path d="M5 8h2 M9 8h2 M6 13c1 2 3 2 4 0" stroke="#a855f7" />
  </svg>
);

// ── 11. Searching Eye/Glass (Thriller) ───────────────────────────────────────
export const AnimatedSearch = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon search">
    <style>
      {`
        .search .glass { transform-origin: center; animation: searchMove 4s ease-in-out infinite; fill: rgba(16,185,129,0.1); }
        .search .pupil { animation: pupilDart 4s steps(3, end) infinite; }
        @keyframes searchMove {
          0%, 100% { transform: translate(0,0) scale(1); }
          25% { transform: translate(-3px, -2px) scale(1.1); }
          50% { transform: translate(4px, 1px) scale(1.05); }
          75% { transform: translate(-2px, 3px) scale(1.1); }
        }
        @keyframes pupilDart {
          0%, 100% { transform: translate(0,0); }
          30% { transform: translate(-1px, 0); }
          60% { transform: translate(2px, 1px); }
        }
      `}
    </style>
    <circle className="glass" cx="11" cy="11" r="8" />
    <line className="glass" x1="21" y1="21" x2="16.65" y2="16.65" />
    <circle className="pupil" cx="11" cy="11" r="2" fill="#10b981" stroke="none" />
  </svg>
);

// ── 12. Bouncing Palette (Animation) ─────────────────────────────────────────
export const AnimatedPalette = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animated-icon palette">
    <style>
      {`
        .palette { transform-origin: center; animation: paletteWobble 3s ease-in-out infinite; }
        .palette .paint { animation: colorPulse 2s infinite alternate; }
        .palette .paint-1 { fill: #ef4444; animation-delay: 0s; }
        .palette .paint-2 { fill: #3b82f6; animation-delay: 0.4s; }
        .palette .paint-3 { fill: #eab308; animation-delay: 0.8s; }
        @keyframes paletteWobble { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(10deg); } }
        @keyframes colorPulse { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.3); opacity: 1; } }
      `}
    </style>
    <path d="M13.5 22c5.2 0 9.5-4.3 9.5-9.5S18.7 3 13.5 3 4 7.3 4 12.5c0 2.4.9 4.6 2.4 6.3l.5.6c.7.8 2 1.5 3.3 1.5.5 0 1.2-.2 1.6-.7.4-.5.6-1 .6-1.5 0-1.1.9-2 2-2h.1c1.1 0 2 .9 2 2 0 1.3-.6 2.3-1 2.8-.4.5-1.1.7-1.6.7z" fill="rgba(244,63,94,0.1)" />
    <circle className="paint paint-1" cx="8.5" cy="10.5" r="1.5" stroke="none" />
    <circle className="paint paint-2" cx="12.5" cy="7.5" r="1.5" stroke="none" />
    <circle className="paint paint-3" cx="16.5" cy="10.5" r="1.5" stroke="none" />
  </svg>
);
