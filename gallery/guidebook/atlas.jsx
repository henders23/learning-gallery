// atlas.jsx — Direction A: "The Atlas"
// Aeon / Atlantic / Paris Review feel. Single-page portrait magazine with
// prev/next page flip. Generous white space, deep serif, single accent.
// One artboard contains the whole paged magazine.

function AtlasMagazine({ fontPair = "newsreader", density = "regular", keyboardEnabled = true }) {
  const [page, setPage] = React.useState(0);
  const rooms = window.GUIDE.rooms;
  const totalPages = 3 + rooms.length + 1;   // cover, editor, contents, N rooms, colophon

  // ---------- typography ----------
  const FONT_PAIRS = {
    newsreader: {
      display: "'Newsreader', Georgia, serif",
      body:    "'Newsreader', Georgia, serif",
      meta:    "'Inter Tight', 'Helvetica Neue', sans-serif",
      displayWeight: 500,
      headingWeight: 500,
    },
    fraunces: {
      display: "'Fraunces', Georgia, serif",
      body:    "'Source Serif 4', Georgia, serif",
      meta:    "'Inter Tight', 'Helvetica Neue', sans-serif",
      displayWeight: 400,
      headingWeight: 500,
    },
    cormorant: {
      display: "'Cormorant Garamond', Georgia, serif",
      body:    "'EB Garamond', Georgia, serif",
      meta:    "'IBM Plex Sans', 'Helvetica Neue', sans-serif",
      displayWeight: 500,
      headingWeight: 600,
    },
  };
  const fp = FONT_PAIRS[fontPair] || FONT_PAIRS.newsreader;

  // ---------- density ----------
  const DENSITY = {
    compact: { pad: 48,  bodySize: 14, leading: 1.55, gap: 14, ledeSize: 17, displaySize: 60 },
    regular: { pad: 64,  bodySize: 15, leading: 1.62, gap: 20, ledeSize: 19, displaySize: 72 },
    comfy:   { pad: 80,  bodySize: 16, leading: 1.7,  gap: 28, ledeSize: 21, displaySize: 84 },
  };
  const D = DENSITY[density] || DENSITY.regular;

  // ---------- palette ----------
  const C = {
    paper:  "#f4ecd8",
    ink:    "#1a1410",
    muted:  "#6a5a48",
    rule:   "#c8b890",
    accent: "#7a1e2b",          // deep editorial burgundy
    plate:  "#28201b",
  };

  // ---------- keyboard nav ----------
  React.useEffect(() => {
    if (!keyboardEnabled) return;
    const onKey = (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") { setPage(p => Math.min(totalPages - 1, p + 1)); }
      if (e.key === "ArrowLeft"  || e.key === "PageUp")   { setPage(p => Math.max(0, p - 1)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [totalPages, keyboardEnabled]);

  // ---------- page renderers ----------
  const pageProps = { C, fp, D };

  const renderPage = () => {
    if (page === 0) return <AtlasCover {...pageProps} />;
    if (page === 1) return <AtlasEditor {...pageProps} />;
    if (page === 2) return <AtlasContents {...pageProps} rooms={rooms} onGoto={setPage} />;
    if (page >= 3 && page < 3 + rooms.length) {
      const room = rooms[page - 3];
      return <AtlasRoomPage {...pageProps} room={room} pageNum={page - 1} />;
    }
    return <AtlasColophon {...pageProps} />;
  };

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: C.plate,
      display: "flex",
      flexDirection: "column",
      fontFamily: fp.body,
      color: C.ink,
      position: "relative",
    }}>
      {/* paper page */}
      <div style={{
        flex: 1,
        background: C.paper,
        position: "relative",
        overflow: "hidden",
      }}>
        {renderPage()}
      </div>

      {/* runner / nav */}
      <AtlasNav page={page} total={totalPages} onPrev={() => setPage(p => Math.max(0, p - 1))} onNext={() => setPage(p => Math.min(totalPages - 1, p + 1))} C={C} fp={fp} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COVER
// ─────────────────────────────────────────────────────────────────────────
function AtlasCover({ C, fp, D }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      padding: `${D.pad}px ${D.pad}px ${D.pad}px`,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
    }}>
      {/* top runner */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        borderBottom: `1px solid ${C.ink}`, paddingBottom: 10,
        fontFamily: fp.meta, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
      }}>
        <span>The Learning Gallery</span>
        <span>{window.GUIDE.meta.issue}</span>
      </div>

      {/* hero block */}
      <div style={{ marginTop: 24 }}>
        <div style={{
          fontFamily: fp.meta, fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase",
          color: C.accent, marginBottom: 20,
        }}>A Visitor's Guide</div>
        <h1 style={{
          fontFamily: fp.display, fontWeight: fp.displayWeight,
          fontSize: 100, lineHeight: 0.95, letterSpacing: "-0.025em",
          margin: "0 0 18px",
          fontStyle: "italic",
        }}>Theories<br/>of Learning</h1>
        <p style={{
          fontFamily: fp.body, fontSize: 18, lineHeight: 1.5,
          color: C.muted, maxWidth: 460, margin: 0,
          fontStyle: "italic",
        }}>
          A walkable atlas of nine wings, fifty‑odd frameworks, and the evidence
          for what we keep believing about how people learn.
        </p>
      </div>

      {/* footer */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        borderTop: `1px solid ${C.ink}`, paddingTop: 12,
        fontFamily: fp.meta, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
      }}>
        <span>Read before you enter</span>
        <span>{window.GUIDE.meta.season}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// EDITOR'S NOTE
// ─────────────────────────────────────────────────────────────────────────
function AtlasEditor({ C, fp, D }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      padding: `${D.pad}px ${D.pad}px ${D.pad + 30}px`,
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        fontFamily: fp.meta, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase",
        color: C.accent, marginBottom: 24,
      }}>From the Editor</div>

      <h2 style={{
        fontFamily: fp.display, fontWeight: fp.displayWeight,
        fontSize: 44, lineHeight: 1.05, letterSpacing: "-0.018em",
        margin: "0 0 28px", maxWidth: 540,
      }}>How to read a room you will, in a moment, walk into.</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 32, rowGap: D.gap, color: C.ink }}>
        <p style={{
          fontFamily: fp.body, fontSize: D.bodySize, lineHeight: D.leading,
          margin: 0,
        }}>
          <span style={{
            float: "left", fontFamily: fp.display, fontStyle: "italic",
            fontSize: 64, lineHeight: 0.85, paddingRight: 8, paddingTop: 4,
            color: C.accent,
          }}>T</span>
          his guidebook is not a catalogue. The gallery beyond the rotunda is — there is a frame
          for every theory, a paragraph beneath every frame, and a notebook you can fill as you go.
          What you hold instead is a slow introduction: nine wings, sketched the way an essayist
          sketches a country before crossing its border.
        </p>
        <p style={{ fontFamily: fp.body, fontSize: D.bodySize, lineHeight: D.leading, margin: 0 }}>
          Each spread takes one wing in turn. It tells you what is in it, names the pictures
          worth standing in front of, and offers three questions to carry through the doorway with
          you. The questions are not a test. They are a way of bringing your own teaching, your
          own learning, and your own intuitions into the room before any of the wall texts can.
        </p>
        <p style={{ fontFamily: fp.body, fontSize: D.bodySize, lineHeight: D.leading, margin: 0, color: C.muted, fontStyle: "italic" }}>
          A note on the references. Each wing lists its anchoring sources at the foot of the page —
          a reading list, not a bibliography. They are the texts the wing was built from. Many of
          the wall texts inside dig much deeper.
        </p>
        <p style={{ fontFamily: fp.body, fontSize: D.bodySize, lineHeight: D.leading, margin: 0 }}>
          You can read the guidebook through, or page directly to whichever wing called you across
          the rotunda. Either way, the rotunda is the room to begin in — for the meta‑frameworks
          it gathers, and for the small, candid display of contested theories you will meet
          everywhere else if you do not meet them here first.
        </p>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{
        fontFamily: fp.meta, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
        color: C.muted, paddingTop: 18, borderTop: `1px solid ${C.rule}`,
        display: "flex", justifyContent: "space-between",
      }}>
        <span>— The Curators</span>
        <span style={{ fontFamily: fp.meta, color: C.ink }}>Use ← → to turn the page</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// CONTENTS
// ─────────────────────────────────────────────────────────────────────────
function AtlasContents({ C, fp, D, rooms, onGoto }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      padding: `${D.pad}px ${D.pad}px ${D.pad + 30}px`,
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        fontFamily: fp.meta, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase",
        color: C.accent, marginBottom: 12,
      }}>Contents</div>
      <h2 style={{
        fontFamily: fp.display, fontWeight: fp.displayWeight,
        fontSize: 50, lineHeight: 1, letterSpacing: "-0.018em",
        margin: "0 0 36px",
      }}>The nine wings</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", columnGap: 40, flex: 1, minHeight: 0 }}>
        {/* TOC list */}
        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {rooms.map((r, i) => (
            <li key={r.id} onClick={() => onGoto(3 + i)} style={{
              cursor: "pointer", padding: "10px 0",
              borderBottom: i === rooms.length - 1 ? "none" : `1px solid ${C.rule}`,
              display: "grid", gridTemplateColumns: "32px 1fr 40px", alignItems: "baseline", gap: 12,
            }}>
              <span style={{
                fontFamily: fp.meta, fontSize: 11, color: C.muted,
                letterSpacing: "0.1em",
              }}>{r.ordinal}</span>
              <div>
                <div style={{ fontFamily: fp.display, fontWeight: fp.headingWeight, fontSize: 18, lineHeight: 1.15, color: C.ink }}>
                  {r.name}
                </div>
                <div style={{ fontFamily: fp.body, fontSize: 12, fontStyle: "italic", color: C.muted, marginTop: 2 }}>
                  {r.tag}
                </div>
              </div>
              <span style={{ fontFamily: fp.meta, fontSize: 11, color: C.muted, textAlign: "right" }}>
                p.{String(i + 4).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ol>

        {/* map / floorplan */}
        <div style={{ position: "relative", paddingTop: 4 }}>
          <div style={{
            fontFamily: fp.meta, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
            color: C.muted, marginBottom: 10,
          }}>Floor plan</div>
          <AtlasFloorPlan rooms={rooms} C={C} fp={fp} />
        </div>
      </div>
    </div>
  );
}

function AtlasFloorPlan({ rooms, C, fp }) {
  // 8 wings around a central rotunda — positions match the original gallery
  // (compass points). Atrium = rooms[0]; wings = rooms[1..8] mapped to
  // compass positions in the data's traversal order.
  const compass = [
    { ang: 0,   label: "E"  }, // design
    { ang: 315, label: "NE" }, // cog (data has NE at -45°/315° in screen space)
    { ang: 270, label: "N"  }, // mem
    { ang: 225, label: "NW" }, // mot
    { ang: 180, label: "W"  }, // soc
    { ang: 135, label: "SW" }, // adu
    { ang: 90,  label: "S"  }, // eap
    { ang: 45,  label: "SE" }, // tax
  ];
  const cx = 150, cy = 150, R = 95;
  return (
    <svg viewBox="0 0 300 300" style={{ width: "100%", maxWidth: 340, display: "block" }}>
      {/* compass marks */}
      <g fontFamily={fp.meta} fontSize="8" fill={C.muted} letterSpacing="0.15em" textAnchor="middle">
        <text x={cx} y="14">N</text>
        <text x="290" y={cy + 3}>E</text>
        <text x={cx} y="294">S</text>
        <text x="10" y={cy + 3}>W</text>
      </g>
      {/* faint grid */}
      <g stroke={C.rule} strokeWidth="0.5" fill="none" opacity="0.6">
        <line x1="0" y1={cy} x2="300" y2={cy} />
        <line x1={cx} y1="0" x2={cx} y2="300" />
      </g>
      {/* rotunda */}
      <circle cx={cx} cy={cy} r="38" fill="none" stroke={C.ink} strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r="38" fill={C.accent} opacity="0.08" />
      <text x={cx} y={cy + 4} fontFamily={fp.meta} fontSize="9" fill={C.ink} textAnchor="middle" letterSpacing="0.16em">ROTUNDA</text>

      {/* wings */}
      {compass.map((c, i) => {
        const room = rooms[i + 1];
        if (!room) return null;
        const a = (c.ang * Math.PI) / 180;
        const x = cx + Math.cos(a) * R;
        const y = cy + Math.sin(a) * R;
        return (
          <g key={room.id}>
            <line x1={cx + Math.cos(a) * 38} y1={cy + Math.sin(a) * 38} x2={x} y2={y} stroke={C.ink} strokeWidth="0.5" />
            <rect x={x - 22} y={y - 11} width="44" height="22" fill={C.paper} stroke={C.ink} strokeWidth="1" />
            <text x={x} y={y + 3} fontFamily={fp.meta} fontSize="8" fill={C.ink} textAnchor="middle" letterSpacing="0.06em">
              {room.ordinal} · {short(room.name)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function short(name) {
  return name.replace(/^The /, "").replace(/ Wing$/, "").toUpperCase().slice(0, 8);
}

// ─────────────────────────────────────────────────────────────────────────
// ROOM PAGE
// ─────────────────────────────────────────────────────────────────────────
function AtlasRoomPage({ C, fp, D, room, pageNum }) {
  const RoomPattern = window.RoomPattern;
  return (
    <div style={{
      position: "absolute", inset: 0,
      padding: `${D.pad}px ${D.pad}px ${D.pad + 30}px`,
      display: "flex", flexDirection: "column",
    }}>
      {/* runner */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        borderBottom: `1px solid ${C.ink}`, paddingBottom: 8, marginBottom: 28,
        fontFamily: fp.meta, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
      }}>
        <span>Wing №{room.ordinal} · The Visitor's Guide</span>
        <span style={{ color: C.muted }}>{room.tag}</span>
      </div>

      {/* hero */}
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", columnGap: 32, alignItems: "start" }}>
        <div>
          <div style={{
            fontFamily: fp.display, fontWeight: 300, fontSize: 120, lineHeight: 0.85,
            color: C.accent, marginBottom: 4, letterSpacing: "-0.04em",
          }}>{room.ordinal}</div>
          <h2 style={{
            fontFamily: fp.display, fontWeight: fp.displayWeight,
            fontSize: 52, lineHeight: 1, letterSpacing: "-0.02em",
            margin: "0 0 12px", color: C.ink,
            fontStyle: "italic",
          }}>{room.name}</h2>
          <div style={{
            fontFamily: fp.meta, fontSize: 11, letterSpacing: "0.18em",
            textTransform: "uppercase", color: C.muted,
          }}>{room.tag}</div>
        </div>
        {/* pattern plate */}
        <div style={{
          aspectRatio: "1 / 1", border: `1px solid ${C.ink}`,
          position: "relative", overflow: "hidden",
        }}>
          <RoomPattern kind={room.pattern} hue={room.hue} ink={C.ink} paper={C.paper} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: C.ink, color: C.paper, fontFamily: fp.meta, fontSize: 9,
            letterSpacing: "0.2em", textTransform: "uppercase", padding: "6px 10px",
            display: "flex", justifyContent: "space-between",
          }}>
            <span>Pl. {room.ordinal}</span><span>{room.pattern}</span>
          </div>
        </div>
      </div>

      {/* lede + curator */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 32, marginTop: 30,
      }}>
        <p style={{
          fontFamily: fp.body, fontSize: D.ledeSize, lineHeight: 1.5, margin: 0,
          color: C.ink,
        }}>
          <span style={{
            float: "left", fontFamily: fp.display, fontStyle: "italic",
            fontSize: D.ledeSize * 3.4, lineHeight: 0.85,
            paddingRight: 10, paddingTop: 6, color: C.accent,
          }}>{room.lede.trim()[0]}</span>
          {room.lede.trim().slice(1)}
        </p>
        <div>
          <div style={{
            fontFamily: fp.meta, fontSize: 10, letterSpacing: "0.22em",
            textTransform: "uppercase", color: C.muted, marginBottom: 8,
          }}>The curator's note</div>
          <p style={{
            fontFamily: fp.body, fontSize: D.bodySize, lineHeight: D.leading,
            margin: 0, color: C.ink, fontStyle: "italic",
            borderLeft: `2px solid ${C.accent}`, paddingLeft: 16,
          }}>
            {room.curator}
          </p>
        </div>
      </div>

      {/* questions row */}
      <div style={{
        marginTop: 32, paddingTop: 22, borderTop: `1px solid ${C.rule}`,
      }}>
        <div style={{
          fontFamily: fp.meta, fontSize: 10, letterSpacing: "0.24em",
          textTransform: "uppercase", color: C.accent, marginBottom: 14,
        }}>Three questions to carry through the doorway</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", columnGap: 24 }}>
          {room.questions.map((q, i) => (
            <div key={i} style={{ borderTop: `1px solid ${C.ink}`, paddingTop: 12 }}>
              <div style={{
                fontFamily: fp.meta, fontSize: 9, letterSpacing: "0.22em",
                textTransform: "uppercase", color: C.muted, marginBottom: 8,
              }}>
                <span style={{ color: C.accent }}>№{i + 1}</span> &nbsp; {q.mode}
              </div>
              <p style={{
                fontFamily: fp.body, fontSize: D.bodySize, lineHeight: 1.45, margin: 0,
                color: C.ink,
              }}>{q.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* featured + refs row */}
      <div style={{ flex: 1 }} />
      <div style={{
        marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.rule}`,
        display: "grid", gridTemplateColumns: "1fr 1.2fr", columnGap: 32,
      }}>
        <div>
          <div style={{
            fontFamily: fp.meta, fontSize: 9, letterSpacing: "0.22em",
            textTransform: "uppercase", color: C.muted, marginBottom: 8,
          }}>Look for</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {room.look.map((line, i) => (
              <li key={i} style={{
                fontFamily: fp.body, fontSize: 12, lineHeight: 1.45, margin: "0 0 6px",
                color: C.ink, paddingLeft: 12, position: "relative",
              }}>
                <span style={{ position: "absolute", left: 0, top: 7, width: 5, height: 5, background: C.accent, borderRadius: "50%" }} />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{
            fontFamily: fp.meta, fontSize: 9, letterSpacing: "0.22em",
            textTransform: "uppercase", color: C.muted, marginBottom: 8,
          }}>Selected references</div>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, counterReset: "ref" }}>
            {room.refs.slice(0, 5).map((ref, i) => (
              <li key={i} style={{
                fontFamily: fp.body, fontSize: 10.5, lineHeight: 1.4, margin: "0 0 4px",
                color: C.ink, paddingLeft: 14, position: "relative",
              }}>
                <span style={{ position: "absolute", left: 0, top: 0, fontFamily: fp.meta, fontSize: 9, color: C.muted }}>{i + 1}.</span>
                {ref}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COLOPHON
// ─────────────────────────────────────────────────────────────────────────
function AtlasColophon({ C, fp, D }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      padding: `${D.pad}px ${D.pad}px ${D.pad + 30}px`,
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        fontFamily: fp.meta, fontSize: 10, letterSpacing: "0.28em",
        textTransform: "uppercase", color: C.accent, marginBottom: 12,
      }}>Colophon</div>
      <h2 style={{
        fontFamily: fp.display, fontWeight: fp.displayWeight,
        fontSize: 44, lineHeight: 1.05, margin: "0 0 28px",
        letterSpacing: "-0.018em", maxWidth: 520,
      }}>A note on what this guide is, and what it isn't.</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", columnGap: 36, rowGap: D.gap }}>
        <p style={{ fontFamily: fp.body, fontSize: D.bodySize, lineHeight: D.leading, margin: 0 }}>
          The Learning Gallery is a walkable atlas of theories of learning. The
          guidebook is its companion — a slow introduction to the rooms before
          you enter them, so that the wall texts arrive in conversation with
          your own teaching rather than as instructions to it.
        </p>
        <p style={{ fontFamily: fp.body, fontSize: D.bodySize, lineHeight: D.leading, margin: 0, color: C.muted, fontStyle: "italic" }}>
          The guide is deliberately under‑written. The rooms themselves carry the
          full evidence — citations, key points, common pitfalls, implications
          for the age of generative AI. Read this first; argue with it later, on
          the gallery floor.
        </p>

        <div>
          <div style={{ fontFamily: fp.meta, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>
            How to read
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ fontFamily: fp.body, fontSize: 12.5, lineHeight: 1.55, margin: "0 0 6px" }}>
              <strong>Pre-entry.</strong> One wing per spread. Read the lede, the curator's note, and the three questions. Do not enter until you have something to say to at least one of them.
            </li>
            <li style={{ fontFamily: fp.body, fontSize: 12.5, lineHeight: 1.55, margin: "0 0 6px" }}>
              <strong>In the room.</strong> The wall texts are deeper than these pages. Stand in front of one picture per visit.
            </li>
            <li style={{ fontFamily: fp.body, fontSize: 12.5, lineHeight: 1.55, margin: "0 0 6px" }}>
              <strong>Afterwards.</strong> Return to the same question with the room's answer in mind.
            </li>
          </ul>
        </div>
        <div>
          <div style={{ fontFamily: fp.meta, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>
            Set in
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ fontFamily: fp.body, fontSize: 12.5, lineHeight: 1.55, margin: "0 0 6px" }}>
              <strong>Display & body.</strong> Variable serif at the curator's discretion.
            </li>
            <li style={{ fontFamily: fp.body, fontSize: 12.5, lineHeight: 1.55, margin: "0 0 6px" }}>
              <strong>Meta.</strong> A neutral sans, set sparingly.
            </li>
            <li style={{ fontFamily: fp.body, fontSize: 12.5, lineHeight: 1.55, margin: "0 0 6px" }}>
              <strong>Paper.</strong> A warm cream, simulated.
            </li>
          </ul>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{
        borderTop: `1px solid ${C.rule}`, paddingTop: 14,
        display: "flex", justifyContent: "space-between",
        fontFamily: fp.meta, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.muted,
      }}>
        <span>The Learning Gallery, {window.GUIDE.meta.season}</span>
        <span>End of guidebook</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────────────────────────────
function AtlasNav({ page, total, onPrev, onNext, C, fp }) {
  return (
    <div style={{
      height: 44, background: C.plate, color: C.paper,
      display: "flex", alignItems: "stretch", justifyContent: "space-between",
      fontFamily: fp.meta, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
      flexShrink: 0,
    }}>
      <button onClick={onPrev} disabled={page === 0} style={{
        all: "unset", padding: "0 22px", cursor: page === 0 ? "default" : "pointer",
        opacity: page === 0 ? 0.3 : 1, display: "flex", alignItems: "center", gap: 10,
      }}>← Previous</button>
      <div style={{ display: "flex", alignItems: "center", gap: 14, color: C.paper, opacity: 0.7 }}>
        <span>Page {String(page + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>
      <button onClick={onNext} disabled={page === total - 1} style={{
        all: "unset", padding: "0 22px", cursor: page === total - 1 ? "default" : "pointer",
        opacity: page === total - 1 ? 0.3 : 1, display: "flex", alignItems: "center", gap: 10,
      }}>Next →</button>
    </div>
  );
}

window.AtlasMagazine = AtlasMagazine;
