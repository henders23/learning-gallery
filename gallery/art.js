// gallery/art.js — procedural canvas-textured artwork generators
// Walls = light blue, floors = green (per gallery brief). Sign text auto-fits
// so the wording never gets cut off, even for long room names.

(function () {
  // ── seeded RNG ────────────────────────────────────────────────────────────
  function hashStr(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function mulberry32(a) {
    return function () {
      let t = (a += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function paper(ctx, w, h, base) {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 14;
      d[i]   = Math.max(0, Math.min(255, d[i]   + n));
      d[i+1] = Math.max(0, Math.min(255, d[i+1] + n));
      d[i+2] = Math.max(0, Math.min(255, d[i+2] + n));
    }
    ctx.putImageData(img, 0, 0);
  }

  // ── palette per theory ────────────────────────────────────────────────────
  const CLUSTER_HUES = {
    "Meta-framework":              [38,  18],
    "Design framework":            [205, 220],
    "Teacher stance":              [22,  10],
    "Contested theory":            [6,   354],
    "Contested framework":         [6,   354],
    "Cognitive architecture":      [225, 250],
    "Memory & practice":           [210, 195],
    "Taxonomy":                    [42,  18],
    "Transfer & expertise":        [195, 215],
    "Motivation & self-regulation":[14,  32],
    "Adult & experiential":        [12,  28],
    "Behaviourist":                [350, 6],
    "Tech-based":                  [200, 175],
    "Constructivist":              [36,  16],
    "Social & situated":           [120, 95],
    "EAP-specific":                [140, 110],
  };
  function paletteFor(theory) {
    const range = CLUSTER_HUES[theory.cluster] || [200, 40];
    const rng = mulberry32(hashStr(theory.id + theory.title));
    // base hue sits near the cluster family but with wide per-theory jitter,
    // so neighbouring pieces in the same room still read as different pictures
    const baseHue = ((range[0] + (rng() - 0.5) * 74) % 360 + 360) % 360;
    const scheme = rng();
    const compHue = (baseHue + (scheme < 0.5 ? 28 + rng() * 36 : 150 + rng() * 70)) % 360;
    const accentHue = ((baseHue + 180 + (rng() - 0.5) * 50) % 360 + 360) % 360;

    // ground tone varies: light, mid-tint, or dark — biggest driver of variety
    let bg, onDark = false;
    const g = rng();
    if (g < 0.46) {
      bg = `hsl(${baseHue}, ${22 + rng() * 24}%, ${80 + rng() * 12}%)`;
    } else if (g < 0.78) {
      bg = `hsl(${baseHue}, ${30 + rng() * 26}%, ${52 + rng() * 16}%)`;
    } else {
      bg = `hsl(${baseHue}, ${28 + rng() * 22}%, ${15 + rng() * 12}%)`;
      onDark = true;
    }
    const sat = 46 + rng() * 30;
    return {
      rng, onDark,
      bg,
      dark:  `hsl(${baseHue}, ${40 + rng() * 22}%, ${15 + rng() * 10}%)`,
      mid:   `hsl(${compHue}, ${sat}%, ${42 + rng() * 16}%)`,
      light: `hsl(${baseHue}, ${28 + rng() * 22}%, ${74 + rng() * 12}%)`,
      pop:   `hsl(${accentHue}, ${62 + rng() * 24}%, ${50 + rng() * 12}%)`,
    };
  }

  // ── styles ────────────────────────────────────────────────────────────────
  function styleOrbit(ctx, w, h, p, rng) {
    paper(ctx, w, h, p.bg);
    const cx = w * (0.4 + rng() * 0.2);
    const cy = h * (0.4 + rng() * 0.2);
    const rings = 6 + Math.floor(rng() * 6);
    ctx.lineCap = "round";
    for (let i = 0; i < rings; i++) {
      const r = 30 + i * (12 + rng() * 18);
      ctx.beginPath();
      ctx.strokeStyle = i % 3 === 0 ? p.pop : (i % 2 === 0 ? p.mid : p.dark);
      ctx.lineWidth = 2 + rng() * 6;
      const start = rng() * Math.PI * 2;
      const len = Math.PI * (0.6 + rng() * 1.2);
      ctx.arc(cx, cy, r, start, start + len);
      ctx.stroke();
    }
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = p.dark;
      ctx.beginPath();
      ctx.arc(rng() * w, rng() * h, 2 + rng() * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function styleRings(ctx, w, h, p, rng) {
    paper(ctx, w, h, p.bg);
    const cx = w / 2, cy = h / 2;
    const n = 14 + Math.floor(rng() * 10);
    for (let i = n; i > 0; i--) {
      const t = i / n;
      ctx.beginPath();
      ctx.fillStyle = i % 4 === 0 ? p.pop : (i % 2 === 0 ? p.mid : p.light);
      ctx.arc(cx, cy, t * h * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = p.dark;
    for (let i = 0; i < 200; i++) {
      ctx.fillRect(rng() * w, rng() * h, 1, 1 + rng() * 2);
    }
    ctx.globalAlpha = 1;
  }

  function styleStripes(ctx, w, h, p, rng) {
    paper(ctx, w, h, p.bg);
    const cols = [p.dark, p.mid, p.light, p.pop, p.mid];
    let y = 0;
    while (y < h) {
      const t = 6 + rng() * 42;
      ctx.fillStyle = cols[Math.floor(rng() * cols.length)];
      ctx.fillRect(0, y, w, t);
      y += t + (rng() * 8);
    }
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((rng() - 0.5) * 0.6);
    ctx.fillStyle = p.dark;
    ctx.fillRect(-w * 0.6, -6, w * 1.2, 10);
    ctx.restore();
  }

  function styleGrid(ctx, w, h, p, rng) {
    paper(ctx, w, h, p.bg);
    const cols = 4 + Math.floor(rng() * 4);
    const rows = 3 + Math.floor(rng() * 3);
    const cw = w / cols, rh = h / rows;
    const pal = [p.dark, p.mid, p.light, p.pop, p.bg];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rng() < 0.35) continue;
        ctx.fillStyle = pal[Math.floor(rng() * pal.length)];
        const inset = 4 + rng() * 12;
        ctx.fillRect(c * cw + inset, r * rh + inset, cw - 2 * inset, rh - 2 * inset);
        if (rng() < 0.3) {
          ctx.strokeStyle = p.dark;
          ctx.lineWidth = 2;
          ctx.strokeRect(c * cw + inset, r * rh + inset, cw - 2 * inset, rh - 2 * inset);
        }
      }
    }
  }

  function styleBauhaus(ctx, w, h, p, rng) {
    paper(ctx, w, h, p.bg);
    ctx.fillStyle = p.mid;
    ctx.beginPath();
    ctx.arc(w * (0.3 + rng() * 0.2), h * (0.4 + rng() * 0.2), 60 + rng() * 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.dark;
    ctx.fillRect(w * (0.45 + rng() * 0.2), h * (0.25 + rng() * 0.2), 80 + rng() * 90, 80 + rng() * 90);
    ctx.fillStyle = p.pop;
    ctx.beginPath();
    const tx = w * (0.55 + rng() * 0.2), ty = h * (0.55 + rng() * 0.2);
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx + 100 + rng() * 80, ty);
    ctx.lineTo(tx + 50, ty - 90 - rng() * 60);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = p.dark;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, h * (0.6 + rng() * 0.2));
    ctx.lineTo(w, h * (0.6 + rng() * 0.2) - (rng() - 0.5) * 80);
    ctx.stroke();
  }

  function styleStrokes(ctx, w, h, p, rng) {
    paper(ctx, w, h, p.bg);
    const palette = [p.dark, p.mid, p.pop];
    for (let i = 0; i < 60; i++) {
      const x = rng() * w;
      const y = rng() * h;
      const len = 30 + rng() * 120;
      const angle = (rng() - 0.5) * 0.6 + (i < 30 ? 0 : Math.PI / 2);
      ctx.strokeStyle = palette[Math.floor(rng() * palette.length)];
      ctx.globalAlpha = 0.7 + rng() * 0.3;
      ctx.lineWidth = 1 + rng() * 6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function styleLayers(ctx, w, h, p, rng) {
    paper(ctx, w, h, p.bg);
    const layers = 5 + Math.floor(rng() * 3);
    for (let i = 0; i < layers; i++) {
      ctx.fillStyle = [p.dark, p.mid, p.light, p.pop][i % 4];
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      const top = h * (0.2 + i * 0.12 + rng() * 0.05);
      ctx.moveTo(0, top);
      const steps = 8;
      for (let s = 1; s <= steps; s++) {
        const x = (s / steps) * w;
        const y = top + (rng() - 0.5) * 40;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function styleGlyphs(ctx, w, h, p, rng) {
    paper(ctx, w, h, p.bg);
    const chars = "◯◐◑◒◓△▽◇□■●▲▼◢◣◤◥▣◧◨◫⌬⏃⏄⏅⏆".split("");
    const palette = [p.dark, p.mid, p.pop];
    const cellsX = 6, cellsY = 5;
    const cw = w / cellsX, ch = h / cellsY;
    for (let y = 0; y < cellsY; y++) {
      for (let x = 0; x < cellsX; x++) {
        if (rng() < 0.3) continue;
        ctx.fillStyle = palette[Math.floor(rng() * palette.length)];
        const size = 32 + rng() * 56;
        ctx.font = `${size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          chars[Math.floor(rng() * chars.length)],
          x * cw + cw / 2 + (rng() - 0.5) * 14,
          y * ch + ch / 2 + (rng() - 0.5) * 14
        );
      }
    }
  }

  function styleLandscape(ctx, w, h, p, rng) {
    // sky gradient
    const horizon = h * (0.5 + rng() * 0.2);
    const sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, p.onDark ? p.dark : p.light);
    sky.addColorStop(1, p.bg);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, horizon);
    // sun / moon
    ctx.fillStyle = p.pop;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(w * (0.2 + rng() * 0.6), horizon * (0.4 + rng() * 0.3), 36 + rng() * 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    // layered hills
    const cols = [p.mid, p.dark, p.pop, p.mid];
    let base = horizon;
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = cols[i % cols.length];
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.moveTo(0, base);
      const amp = 30 + rng() * 50;
      for (let x = 0; x <= w; x += 40) ctx.lineTo(x, base + Math.sin(x * 0.01 + i * 2 + rng()) * amp);
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fill();
      base += (h - horizon) / 4;
    }
    // foreground
    ctx.globalAlpha = 1;
    ctx.fillStyle = p.dark;
    ctx.fillRect(0, h * 0.88, w, h * 0.12);
  }

  function stylePortrait(ctx, w, h, p, rng) {
    paper(ctx, w, h, p.bg);
    // inner panel
    ctx.fillStyle = p.onDark ? p.light : p.mid;
    ctx.globalAlpha = 0.18;
    ctx.fillRect(w * 0.16, h * 0.1, w * 0.68, h * 0.8);
    ctx.globalAlpha = 1;
    const cx = w * (0.45 + rng() * 0.1);
    // shoulders
    ctx.fillStyle = p.dark;
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.26, h);
    ctx.quadraticCurveTo(cx, h * 0.5, cx + w * 0.26, h);
    ctx.closePath();
    ctx.fill();
    // collar accent
    ctx.fillStyle = p.pop;
    ctx.beginPath();
    ctx.moveTo(cx - 22, h * 0.74);
    ctx.lineTo(cx, h * 0.92);
    ctx.lineTo(cx + 22, h * 0.74);
    ctx.fill();
    // head
    ctx.fillStyle = p.light;
    ctx.beginPath();
    ctx.ellipse(cx, h * (0.4 + rng() * 0.06), 70 + rng() * 24, 92 + rng() * 26, 0, 0, Math.PI * 2);
    ctx.fill();
    // hair / hat
    ctx.fillStyle = p.mid;
    ctx.beginPath();
    ctx.arc(cx, h * 0.32, 80 + rng() * 22, Math.PI * 1.05, Math.PI * 1.95);
    ctx.fill();
  }

  function styleBloom(ctx, w, h, p, rng) {
    paper(ctx, w, h, p.bg);
    const cx = w * (0.4 + rng() * 0.2), cy = h * (0.4 + rng() * 0.2);
    const petals = 7 + Math.floor(rng() * 8);
    const cols = [p.pop, p.mid, p.light];
    const rOut = 120 + rng() * 110;
    for (let ring = 0; ring < 2; ring++) {
      const rr = rOut * (1 - ring * 0.4);
      for (let i = 0; i < petals; i++) {
        const a = (i / petals) * Math.PI * 2 + ring * 0.4;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(a);
        ctx.fillStyle = cols[(i + ring) % cols.length];
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.ellipse(rr * 0.55, 0, rr * 0.42, 20 + rng() * 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = p.dark;
    ctx.beginPath();
    ctx.arc(cx, cy, 26 + rng() * 18, 0, Math.PI * 2);
    ctx.fill();
  }

  const STYLES = {
    orbit:    styleOrbit,
    rings:    styleRings,
    stripes:  styleStripes,
    grid:     styleGrid,
    bauhaus:  styleBauhaus,
    strokes:  styleStrokes,
    layers:   styleLayers,
    glyphs:   styleGlyphs,
    landscape: styleLandscape,
    portrait:  stylePortrait,
    bloom:     styleBloom,
  };

  // ── public api ────────────────────────────────────────────────────────────
  const STYLE_KEYS = Object.keys(STYLES);
  function makeArtworkCanvas(theory) {
    const w = 1024, h = 768;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    const p = paletteFor(theory);
    // spread styles deterministically across the whole pool so adjacent
    // pieces in a room look like different pictures
    const styleKey = STYLE_KEYS[hashStr(theory.id + "|s") % STYLE_KEYS.length];
    (STYLES[styleKey] || styleBauhaus)(ctx, w, h, p, p.rng, theory);
    // vignette
    const grad = ctx.createRadialGradient(w/2, h/2, h*0.3, w/2, h/2, h*0.85);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, p.onDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.22)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    // painted inner border
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.lineWidth = 10;
    ctx.strokeRect(6, 6, w - 12, h - 12);
    return c;
  }

  // Helper: shrink font until text fits in the given pixel width.
  function fitFontSize(ctx, text, weight, family, maxWidth, startPx, minPx) {
    let size = startPx;
    ctx.font = `${weight} ${size}px ${family}`;
    while (ctx.measureText(text).width > maxWidth && size > minPx) {
      size -= 2;
      ctx.font = `${weight} ${size}px ${family}`;
    }
    return size;
  }

  // Wrap text into lines that fit maxWidth (ctx.font must be set already).
  function wrapText(ctx, text, maxWidth) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";
    for (const word of words) {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  // Large room "guidebook page" panel hung on the wall of each wing, listing
  // the theories in the room and what to pay attention to.
  function makeRoomSummaryCanvas(room, theories) {
    const w = 1100, h = 820;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");

    // paper ground + border
    ctx.fillStyle = "#f6f0df";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(40,28,12,0.3)";
    ctx.lineWidth = 6;
    ctx.strokeRect(14, 14, w - 28, h - 28);

    // accent header
    const headH = 132;
    ctx.fillStyle = room.accent;
    ctx.fillRect(14, 14, w - 28, headH);
    ctx.fillStyle = "#fff8e8";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const padX = 50;
    const nameSize = fitFontSize(ctx, room.name.toUpperCase(), "600", "Georgia, serif", w - padX * 2, 64, 34);
    ctx.font = `600 ${nameSize}px Georgia, serif`;
    ctx.fillText(room.name.toUpperCase(), padX, 14 + headH / 2);

    let y = headH + 56;

    // "what to look for"
    ctx.fillStyle = room.accent;
    ctx.font = `600 26px "Helvetica Neue", Arial, sans-serif`;
    ctx.fillText("WHAT TO LOOK FOR", padX, y);
    y += 40;
    ctx.fillStyle = "#33291b";
    ctx.font = `400 30px Georgia, serif`;
    const guide = room.guide || room.subtitle || "";
    for (const ln of wrapText(ctx, guide, w - padX * 2)) {
      ctx.fillText(ln, padX, y);
      y += 40;
    }
    y += 22;

    // theory list
    ctx.fillStyle = room.accent;
    ctx.font = `600 26px "Helvetica Neue", Arial, sans-serif`;
    ctx.fillText(`IN THIS ROOM — ${theories.length} ${theories.length === 1 ? "EXHIBIT" : "EXHIBITS"}`, padX, y);
    y += 18;
    ctx.strokeStyle = "rgba(40,28,12,0.18)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(padX, y); ctx.lineTo(w - padX, y); ctx.stroke();
    y += 30;

    const colW = (w - padX * 2 - 40) / 2;
    const rowH = 52;
    const startY = y;
    const perCol = Math.ceil(theories.length / 2);
    theories.forEach((t, i) => {
      const col = Math.floor(i / perCol);
      const row = i % perCol;
      const cx = padX + col * (colW + 40);
      const cy = startY + row * rowH;
      ctx.fillStyle = room.accent;
      ctx.beginPath(); ctx.arc(cx + 7, cy + 8, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#262017";
      const tSize = fitFontSize(ctx, t.title, "600", "Georgia, serif", colW - 28, 27, 18);
      ctx.font = `600 ${tSize}px Georgia, serif`;
      ctx.textBaseline = "top";
      ctx.fillText(t.title, cx + 26, cy);
      ctx.fillStyle = "#8a7a5c";
      const aSize = fitFontSize(ctx, t.author, "italic", "Georgia, serif", colW - 28, 18, 13);
      ctx.font = `italic ${aSize}px Georgia, serif`;
      ctx.fillText(t.author, cx + 26, cy + tSize + 4);
      ctx.textBaseline = "middle";
    });

    // footer hint
    ctx.fillStyle = "#8a7a5c";
    ctx.font = `italic 22px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.fillText("Click any framed picture to read it  ·  press G for the full guidebook", w / 2, h - 38);

    return c;
  }

  // A small "museum label" plaque drawn below each artwork.
  // 4:1 aspect ratio. Auto-shrinks title and cluster text so nothing clips.
  function makeLabelCanvas(theory) {
    const w = 1024, h = 280;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#f6f1e3";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(60,40,20,0.25)";
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, w - 16, h - 16);

    const padX = 40;
    const innerW = w - padX * 2;

    // Title — fit to single line, min 36px
    ctx.fillStyle = "#262017";
    ctx.textBaseline = "top";
    const titleSize = fitFontSize(ctx, theory.title, "600", "Georgia, serif", innerW, 64, 34);
    ctx.fillText(theory.title, padX, 36);

    // Author
    ctx.fillStyle = "#7a6a4c";
    ctx.font = `italic 32px Georgia, serif`;
    const authorSize = fitFontSize(ctx, theory.author, "italic", "Georgia, serif", innerW, 32, 22);
    ctx.fillText(theory.author, padX, 36 + titleSize + 14);

    // Cluster
    ctx.fillStyle = "#a08658";
    const clusterText = theory.cluster.toUpperCase();
    const clusterSize = fitFontSize(ctx, clusterText, "500", "'Helvetica Neue', Arial, sans-serif", innerW, 28, 18);
    ctx.fillText(clusterText, padX, h - clusterSize - 28);

    return c;
  }

  // Large room sign placed above each doorway. Auto-fits room name and subtitle
  // so long names like "Memory, Practice & Taxonomies" never clip.
  function makeRoomSignCanvas(room) {
    const w = 1280, h = 384;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");

    // Background
    ctx.fillStyle = room.accent;
    ctx.fillRect(0, 0, w, h);
    // Subtle inset frame
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillRect(40, 38, w - 80, 2);
    ctx.fillRect(40, h - 40, w - 80, 2);

    const padX = 60;
    const innerW = w - padX * 2;

    // Room name — autofit, two-line wrap if needed
    ctx.fillStyle = "#fff8e8";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const nameUpper = room.name.toUpperCase();

    // Try one line first
    let nameSize = fitFontSize(ctx, nameUpper, "600", "Georgia, serif", innerW, 96, 36);
    if (ctx.measureText(nameUpper).width <= innerW) {
      ctx.font = `600 ${nameSize}px Georgia, serif`;
      ctx.fillText(nameUpper, w / 2, h / 2 - 40);
    } else {
      // Two-line wrap by words
      const words = nameUpper.split(" ");
      let best = { lines: [nameUpper], size: 36 };
      for (let i = 1; i < words.length; i++) {
        const l1 = words.slice(0, i).join(" ");
        const l2 = words.slice(i).join(" ");
        let s = 80;
        ctx.font = `600 ${s}px Georgia, serif`;
        while ((ctx.measureText(l1).width > innerW || ctx.measureText(l2).width > innerW) && s > 36) {
          s -= 2;
          ctx.font = `600 ${s}px Georgia, serif`;
        }
        if (s > best.size) best = { lines: [l1, l2], size: s };
      }
      ctx.font = `600 ${best.size}px Georgia, serif`;
      const lineH = best.size * 1.02;
      best.lines.forEach((ln, idx) => {
        ctx.fillText(ln, w / 2, h / 2 - 60 + idx * lineH);
      });
      nameSize = best.size;
    }

    // Subtitle (italic) — autofit
    ctx.fillStyle = "rgba(255,248,232,0.82)";
    const subSize = fitFontSize(ctx, room.subtitle, "italic", "Georgia, serif", innerW - 40, 40, 22);
    ctx.font = `italic ${subSize}px Georgia, serif`;
    ctx.fillText(room.subtitle, w / 2, h - 70);

    return c;
  }

  // Floor texture — light-brown wood planks
  function makeFloorCanvas(room) {
    const w = 512, h = 512;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    paper(ctx, w, h, room.floor || "#b98e5e");

    const ph = 64;                     // plank height
    const planks = h / ph;
    for (let i = 0; i < planks; i++) {
      const y = i * ph;
      // alternate plank tone so the boards read individually
      const tone = (i % 2 === 0) ? "rgba(255,238,205,0.07)" : "rgba(60,38,16,0.10)";
      ctx.fillStyle = tone;
      ctx.fillRect(0, y, w, ph);
      if (i % 3 === 0) { ctx.fillStyle = "rgba(40,24,8,0.06)"; ctx.fillRect(0, y, w, ph); }

      // wavy grain streaks
      ctx.strokeStyle = "rgba(58,36,14,0.11)";
      ctx.lineWidth = 1;
      for (let g = 0; g < 5; g++) {
        const gy = y + 8 + ((g * 13 + i * 7) % (ph - 14));
        ctx.beginPath();
        ctx.moveTo(0, gy);
        for (let x = 0; x <= w; x += 32) {
          ctx.lineTo(x, gy + Math.sin(x * 0.05 + i + g) * 1.8);
        }
        ctx.stroke();
      }

      // seam between planks
      ctx.strokeStyle = "rgba(26,15,5,0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, y + ph); ctx.lineTo(w, y + ph); ctx.stroke();

      // staggered end joint
      const jointX = (i % 2) * 256 + 128;
      ctx.beginPath(); ctx.moveTo(jointX, y); ctx.lineTo(jointX, y + ph); ctx.stroke();
    }
    return c;
  }

  // Wall texture — light blue
  function makeWallCanvas(room) {
    const w = 512, h = 512;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    paper(ctx, w, h, room.wall);
    // Chair-rail hairline
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillRect(0, h * 0.32, w, 2);
    ctx.fillStyle = "rgba(0,0,0,0.04)";
    ctx.fillRect(0, h * 0.32 + 2, w, 2);
    return c;
  }

  // Wayfinding arrow sign with autofit so long names don't clip.
  function makeArrowSignCanvas(text, accent) {
    const w = 768, h = 220;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#1e1a13";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, 14, h);
    ctx.fillStyle = "#f4ead2";
    const padL = 44, padR = 30;
    const innerW = w - padL - padR;
    const size = fitFontSize(ctx, text, "600", "Georgia, serif", innerW, 60, 28);
    ctx.font = `600 ${size}px Georgia, serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(text, padL, h / 2);
    return c;
  }

  window.GalleryArt = {
    makeArtworkCanvas,
    makeLabelCanvas,
    makeRoomSignCanvas,
    makeRoomSummaryCanvas,
    makeFloorCanvas,
    makeWallCanvas,
    makeArrowSignCanvas,
  };
})();
