// patterns.jsx — Abstract geometric patterns, one per room style.
// Each pattern is a self-contained SVG that accepts { hue, ink, paper } and
// fills its parent's box. No figurative drawing.

function PatternOrbit({ hue = "#444", ink = "#1a1814", paper = "#f4ead2" }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="200" height="200" fill={paper} />
      <g fill="none" stroke={ink} strokeWidth="0.5" opacity="0.55">
        <circle cx="100" cy="100" r="20" />
        <circle cx="100" cy="100" r="40" />
        <circle cx="100" cy="100" r="62" />
        <circle cx="100" cy="100" r="84" />
      </g>
      <circle cx="100" cy="100" r="12" fill={hue} />
      <g fill={ink}>
        <circle cx="100" cy="60"  r="2.5" />
        <circle cx="140" cy="100" r="2.5" />
        <circle cx="62"  cy="138" r="2.5" />
        <circle cx="38"  cy="100" r="2.5" />
        <circle cx="166" cy="148" r="2.5" />
      </g>
      <g stroke={hue} strokeWidth="1.2" fill="none" opacity="0.9">
        <path d="M100 100 L100 16" />
        <path d="M100 100 L184 100" />
      </g>
    </svg>
  );
}

function PatternGrid({ hue = "#444", ink = "#1a1814", paper = "#f4ead2" }) {
  const cells = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      cells.push(<rect key={`${i}-${j}`} x={i*22+4} y={j*22+4} width={18} height={18} fill="none" stroke={ink} strokeWidth="0.3" opacity="0.35" />);
    }
  }
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="200" height="200" fill={paper} />
      {cells}
      <rect x="48" y="48" width="40" height="40" fill={hue} opacity="0.85" />
      <rect x="92" y="48" width="40" height="40" fill="none" stroke={ink} strokeWidth="1" />
      <rect x="48" y="92" width="40" height="40" fill="none" stroke={ink} strokeWidth="1" />
      <rect x="92" y="92" width="40" height="40" fill={ink} />
    </svg>
  );
}

function PatternLayers({ hue = "#444", ink = "#1a1814", paper = "#f4ead2" }) {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="200" height="200" fill={paper} />
      <path d="M0 60 Q 50 30 100 60 T 200 60 L 200 80 Q 150 50 100 80 T 0 80 Z" fill={hue} opacity="0.18" />
      <path d="M0 100 Q 50 70 100 100 T 200 100 L 200 120 Q 150 90 100 120 T 0 120 Z" fill={hue} opacity="0.45" />
      <path d="M0 140 Q 50 110 100 140 T 200 140 L 200 160 Q 150 130 100 160 T 0 160 Z" fill={ink} opacity="0.85" />
      <g fill="none" stroke={ink} strokeWidth="0.4" opacity="0.6">
        <line x1="0"   y1="60"  x2="200" y2="60" />
        <line x1="0"   y1="100" x2="200" y2="100" />
        <line x1="0"   y1="140" x2="200" y2="140" />
      </g>
    </svg>
  );
}

function PatternRings({ hue = "#444", ink = "#1a1814", paper = "#f4ead2" }) {
  const rings = [];
  for (let r = 8; r < 110; r += 8) {
    rings.push(<circle key={r} cx="100" cy="100" r={r} fill="none" stroke={r % 16 === 0 ? hue : ink} strokeWidth={r % 16 === 0 ? 1.2 : 0.3} opacity={r % 16 === 0 ? 0.9 : 0.45} />);
  }
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="200" height="200" fill={paper} />
      {rings}
      <circle cx="100" cy="100" r="4" fill={ink} />
    </svg>
  );
}

function PatternStrokes({ hue = "#444", ink = "#1a1814", paper = "#f4ead2" }) {
  const lines = [];
  for (let i = 0; i < 16; i++) {
    const x = i * 13 + 4;
    const h = 60 + Math.abs(Math.sin(i * 1.7)) * 110;
    lines.push(<line key={i} x1={x} y1={196 - h} x2={x} y2={196} stroke={i % 4 === 0 ? hue : ink} strokeWidth={i % 4 === 0 ? 4 : 2} opacity={i % 4 === 0 ? 0.95 : 0.65} />);
  }
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="200" height="200" fill={paper} />
      {lines}
      <line x1="0" y1="196" x2="200" y2="196" stroke={ink} strokeWidth="0.5" />
    </svg>
  );
}

function PatternStripes({ hue = "#444", ink = "#1a1814", paper = "#f4ead2" }) {
  const stripes = [];
  for (let i = 0; i < 14; i++) {
    stripes.push(<rect key={i} x={i * 16} y="0" width="8" height="200" fill={i % 3 === 0 ? hue : ink} opacity={i % 3 === 0 ? 0.85 : 0.7} />);
  }
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="200" height="200" fill={paper} />
      {stripes}
      <rect x="0" y="80" width="200" height="40" fill={paper} />
      <rect x="0" y="80" width="200" height="0.5" fill={ink} />
      <rect x="0" y="120" width="200" height="0.5" fill={ink} />
    </svg>
  );
}

function PatternBauhaus({ hue = "#444", ink = "#1a1814", paper = "#f4ead2" }) {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="200" height="200" fill={paper} />
      <rect x="0" y="0" width="100" height="100" fill={hue} opacity="0.85" />
      <path d="M0 200 L100 200 L100 100 A 100 100 0 0 0 0 200 Z" fill={ink} />
      <circle cx="150" cy="50" r="50" fill="none" stroke={ink} strokeWidth="2" />
      <path d="M150 0 L200 50 L150 100 L100 50 Z" fill="none" stroke={hue} strokeWidth="2" />
      <circle cx="150" cy="150" r="20" fill={hue} />
      <rect x="120" y="120" width="60" height="60" fill="none" stroke={ink} strokeWidth="1" />
    </svg>
  );
}

const PATTERNS = {
  orbit:   PatternOrbit,
  grid:    PatternGrid,
  layers:  PatternLayers,
  rings:   PatternRings,
  strokes: PatternStrokes,
  stripes: PatternStripes,
  bauhaus: PatternBauhaus,
};

function RoomPattern({ kind, hue, ink = "#1a1814", paper = "#f4ead2", style }) {
  const C = PATTERNS[kind] || PatternOrbit;
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", ...style }}>
      <C hue={hue} ink={ink} paper={paper} />
    </div>
  );
}

Object.assign(window, {
  PatternOrbit, PatternGrid, PatternLayers, PatternRings, PatternStrokes, PatternStripes, PatternBauhaus,
  RoomPattern,
});
