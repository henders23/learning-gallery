// gallery/explore.js — non-3D ways to use the gallery:
//   (6) Browse / search   — a searchable, filterable list of every exhibit
//   (1) Active recall      — flashcard-style self-testing on the theories
//   (8) Note export/import — back up notes as JSON or a Markdown study guide
//
// All three live here so they can be reviewed (or removed) as one unit. They
// reach into main.js through window.__gallery and pause the 3D scene by
// advertising themselves via window.GalleryExplore.isOpen().

(function () {
  const gallery = window.__gallery;
  if (!gallery) return;

  // localStorage key scheme — mirrors main.js (kept in sync deliberately).
  const NOTES_PREFIX = gallery.NOTES_PREFIX || "learning-gallery:notes:";
  const VISITED_KEY  = gallery.VISITED_KEY  || "learning-gallery:visited";
  const RECALL_KEY   = "learning-gallery:recall";

  // ── tiny DOM helper ───────────────────────────────────────────────────────
  function el(tag, attrs, kids) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k === "html") n.innerHTML = v;
      else if (k.slice(0, 2) === "on" && typeof v === "function") n.addEventListener(k.slice(2).toLowerCase(), v);
      else n.setAttribute(k, v);
    }
    if (kids != null) for (const c of [].concat(kids)) {
      if (c == null) continue;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return n;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ── recall stats (persisted, also feed the "mastered" badge in browse) ─────
  function loadRecall() {
    try { return JSON.parse(localStorage.getItem(RECALL_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function recordRecall(id, correct) {
    const r = loadRecall();
    const s = r[id] || { seen: 0, correct: 0 };
    s.seen++;
    if (correct) s.correct++;
    s.lastResult = correct ? "correct" : "review";
    s.ts = Date.now();
    r[id] = s;
    try { localStorage.setItem(RECALL_KEY, JSON.stringify(r)); } catch (e) {}
  }

  function isVisited(id) { return gallery.visited.has(id); }
  function isNoted(id)   { return gallery.notes.has(id); }

  // ──────────────────────────────────────────────────────────────────────────
  //  Styles
  // ──────────────────────────────────────────────────────────────────────────
  document.head.appendChild(el("style", { html: `
    .lgx-overlay {
      position: fixed; inset: 0; z-index: 28;
      background: rgba(10, 8, 6, 0.85);
      display: none; align-items: center; justify-content: center;
    }
    .lgx-overlay.open { display: flex; }
    .lgx-card {
      width: min(880px, 94vw); max-height: 90vh;
      background: var(--paper); color: var(--ink);
      box-shadow: 0 40px 100px rgba(0,0,0,0.6);
      display: flex; flex-direction: column; position: relative;
    }
    .lgx-head {
      padding: 22px 28px 16px;
      border-bottom: 1px solid rgba(0,0,0,0.1);
      display: flex; justify-content: space-between; align-items: baseline; gap: 16px;
    }
    .lgx-head h2 { font: 600 22px/1.1 Georgia, serif; margin: 0; color: var(--ink); }
    .lgx-head .lgx-sub {
      font: 500 11px/1 "Helvetica Neue", Arial, sans-serif;
      letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted);
    }
    .lgx-close {
      background: transparent; border: none;
      font: 500 12px/1 "Helvetica Neue", Arial, sans-serif;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--muted); cursor: pointer;
    }
    .lgx-close:hover { color: var(--gold); }

    /* search + filter controls */
    .lgx-controls {
      padding: 16px 28px 8px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
    }
    .lgx-search {
      flex: 1 1 240px; min-width: 180px;
      padding: 10px 14px; border: 1px solid #c8b890; background: #fff8e4;
      color: var(--ink); font: 400 14px/1.4 "Helvetica Neue", Arial, sans-serif;
      outline: none; border-radius: 2px;
    }
    .lgx-search:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(184,140,58,0.18); }
    .lgx-select {
      padding: 10px 12px; border: 1px solid #c8b890; background: #fff8e4; color: var(--ink);
      font: 400 13px/1 "Helvetica Neue", Arial, sans-serif; border-radius: 2px; cursor: pointer;
    }
    .lgx-seg { display: inline-flex; border: 1px solid #c8b890; border-radius: 2px; overflow: hidden; }
    .lgx-seg button {
      background: #fff8e4; border: none; cursor: pointer;
      padding: 9px 12px; font: 500 11px/1 "Helvetica Neue", Arial, sans-serif;
      letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted);
      border-left: 1px solid #e3d6b4;
    }
    .lgx-seg button:first-child { border-left: none; }
    .lgx-seg button.on { background: var(--ink); color: var(--paper); }
    .lgx-btn {
      background: var(--ink); color: var(--paper); border: none; cursor: pointer;
      padding: 10px 16px; font: 500 11px/1 "Helvetica Neue", Arial, sans-serif;
      letter-spacing: 0.14em; text-transform: uppercase; border-radius: 2px;
    }
    .lgx-btn:hover { background: var(--gold); color: var(--ink); }
    .lgx-btn[disabled] { opacity: 0.4; cursor: default; }
    .lgx-btn.ghost { background: transparent; color: var(--muted); border: 1px solid #c8b890; }
    .lgx-btn.ghost:hover { background: rgba(184,140,58,0.12); color: var(--ink); }

    .lgx-count {
      padding: 4px 28px 10px;
      font: 500 11px/1 "Helvetica Neue", Arial, sans-serif;
      letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted);
    }

    /* result grid */
    .lgx-grid {
      overflow: auto; padding: 6px 28px 26px;
      display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px;
    }
    .lgx-item {
      text-align: left; cursor: pointer; background: #fffdf4;
      border: 1px solid rgba(0,0,0,0.10); border-left: 4px solid var(--gold);
      padding: 12px 14px; border-radius: 2px;
      display: flex; flex-direction: column; gap: 4px;
    }
    .lgx-item:hover { background: rgba(184,140,58,0.10); }
    .lgx-item-top {
      display: flex; align-items: center; gap: 8px;
      font: 500 9.5px/1.2 "Helvetica Neue", Arial, sans-serif;
      letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted);
    }
    .lgx-chip { color: var(--gold); }
    .lgx-item-top .lgx-dot { margin-left: auto; font-size: 11px; }
    .lgx-item-title { font: 600 15px/1.25 Georgia, serif; color: var(--ink); }
    .lgx-item-author { font: italic 11.5px/1.3 Georgia, serif; color: var(--muted); }
    .lgx-item-sum {
      font: 400 12.5px/1.45 "Helvetica Neue", Arial, sans-serif; color: #3a3225;
      display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
    }
    .lgx-item-foot {
      display: flex; gap: 8px; align-items: center; margin-top: 2px;
      font: 500 9.5px/1 "Helvetica Neue", Arial, sans-serif; letter-spacing: 0.1em; text-transform: uppercase;
    }
    .lgx-badge { color: var(--moss); border: 1px solid var(--moss); padding: 2px 5px; border-radius: 2px; }
    .lgx-badge.master { color: var(--gold); border-color: var(--gold); }
    .lgx-ev { color: var(--gold); letter-spacing: 0; }
    .lgx-empty { padding: 30px 28px 40px; color: var(--muted); font: italic 14px/1.5 Georgia, serif; }

    /* recall */
    .lgx-recall-inner { padding: 26px 30px 30px; overflow: auto; }
    .lgx-r-progress { font: 500 11px/1 "Helvetica Neue", Arial, sans-serif; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
    .lgx-r-meta { font: 500 11px/1 "Helvetica Neue", Arial, sans-serif; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold); margin: 18px 0 8px; }
    .lgx-r-prompt { font: 600 28px/1.2 Georgia, serif; color: var(--ink); margin: 0 0 12px; }
    .lgx-r-cue { font: italic 14px/1.5 Georgia, serif; color: var(--muted); margin: 0 0 18px; }
    .lgx-r-answer { border-top: 1px solid rgba(0,0,0,0.12); padding-top: 16px; margin-top: 6px; }
    .lgx-r-answer .lab { font: 500 11px/1 "Helvetica Neue", Arial, sans-serif; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin: 0 0 8px; }
    .lgx-r-answer .sum { font: 500 15px/1.6 "Helvetica Neue", Arial, sans-serif; color: #2c2519; margin: 0 0 12px; }
    .lgx-r-answer ul { margin: 0; padding-left: 18px; }
    .lgx-r-answer li { font: 400 13.5px/1.5 "Helvetica Neue", Arial, sans-serif; color: #2c2519; margin-bottom: 5px; }
    .lgx-r-actions { display: flex; gap: 10px; margin-top: 22px; flex-wrap: wrap; }
    .lgx-r-setup p { font: 400 14px/1.55 "Helvetica Neue", Arial, sans-serif; color: #3a3225; }
    .lgx-r-big { font: 600 26px/1.2 Georgia, serif; color: var(--ink); margin: 8px 0 14px; }

    /* export buttons injected into the notebook header */
    .lgx-mini {
      background: transparent; border: 1px solid #c8b890; cursor: pointer;
      padding: 6px 10px; border-radius: 2px;
      font: 500 10px/1 "Helvetica Neue", Arial, sans-serif; letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--muted);
    }
    .lgx-mini:hover { color: var(--ink); border-color: var(--ink); }

    /* floating launch buttons (also the touch / no-keyboard entry point) */
    #lgx-fab {
      position: fixed; right: 22px; bottom: 18px; z-index: 6;
      display: flex; gap: 8px;
    }
    #lgx-fab button {
      background: rgba(20, 24, 30, 0.86); border: 1px solid rgba(255,240,200,0.18);
      color: #fff2c8; cursor: pointer; padding: 9px 13px; border-radius: 2px;
      font: 500 10px/1 "Helvetica Neue", Arial, sans-serif; letter-spacing: 0.16em; text-transform: uppercase;
      display: inline-flex; align-items: center; gap: 7px;
    }
    #lgx-fab button:hover { border-color: var(--gold); color: #fff; }
    #lgx-fab kbd {
      font-family: ui-monospace, Menlo, Consolas, monospace;
      background: rgba(255,240,200,0.10); border: 1px solid rgba(255,240,200,0.28);
      padding: 2px 6px; border-radius: 2px; font-size: 10px;
    }
    @media (max-width: 720px) { #lgx-fab kbd { display: none; } }
  ` }));

  // ──────────────────────────────────────────────────────────────────────────
  //  State + overlay plumbing
  // ──────────────────────────────────────────────────────────────────────────
  const state = { browse: false, recall: false };
  function anyOpen() { return state.browse || state.recall; }
  window.GalleryExplore = { isOpen: anyOpen };

  function panelIsOpen() {
    const p = document.getElementById("panel");
    return p && p.classList.contains("open");
  }
  function pauseScene() { if (gallery.controls.isLocked) gallery.controls.unlock(); }
  function resumeScene() { gallery.resume(); }

  // ──────────────────────────────────────────────────────────────────────────
  //  (6) Browse / search
  // ──────────────────────────────────────────────────────────────────────────
  const browseOverlay = el("div", { id: "lgx-browse", class: "lgx-overlay" });
  const searchInput = el("input", { class: "lgx-search", type: "search", placeholder: "Search exhibits, authors, key points…", oninput: renderBrowseList });
  const wingSelect = el("select", { class: "lgx-select", onchange: renderBrowseList });
  wingSelect.appendChild(el("option", { value: "", text: "All wings" }));
  for (const key of Object.keys(ROOMS)) wingSelect.appendChild(el("option", { value: key, text: ROOMS[key].name }));

  const STATUS = ["All", "Unread", "Read", "Noted"];
  let statusFilter = "All";
  const seg = el("div", { class: "lgx-seg" });
  STATUS.forEach((s) => {
    const b = el("button", { text: s, class: s === statusFilter ? "on" : "", onclick: () => {
      statusFilter = s;
      [...seg.children].forEach((c) => c.classList.toggle("on", c.textContent === s));
      renderBrowseList();
    } });
    seg.appendChild(b);
  });

  const browseCount = el("div", { class: "lgx-count" });
  const browseGrid = el("div", { class: "lgx-grid" });
  const recallFromBrowse = el("button", { class: "lgx-btn", text: "Quiz these →", onclick: () => {
    const list = currentBrowseList();
    if (list.length) { closeBrowse(); openRecall(list); }
  } });

  browseOverlay.appendChild(el("div", { class: "lgx-card" }, [
    el("div", { class: "lgx-head" }, [
      el("div", {}, [el("h2", { text: "Browse exhibits" })]),
      el("button", { class: "lgx-close", text: "Close", onclick: closeBrowse }),
    ]),
    el("div", { class: "lgx-controls" }, [searchInput, wingSelect, seg, recallFromBrowse]),
    browseCount,
    browseGrid,
  ]));
  document.body.appendChild(browseOverlay);

  function matchesStatus(id) {
    if (statusFilter === "Read")   return isVisited(id);
    if (statusFilter === "Unread") return !isVisited(id);
    if (statusFilter === "Noted")  return isNoted(id);
    return true;
  }
  function currentBrowseList() {
    const q = searchInput.value.trim().toLowerCase();
    const wing = wingSelect.value;
    return THEORIES.filter((t) => {
      if (wing && t.room !== wing) return false;
      if (!matchesStatus(t.id)) return false;
      if (!q) return true;
      const hay = [t.title, t.author, t.cluster, t.summary, t.extendedSummary, (t.keypoints || []).join(" ")]
        .join(" ").toLowerCase();
      return hay.includes(q);
    });
  }

  function renderBrowseList() {
    const list = currentBrowseList();
    const recall = loadRecall();
    browseGrid.innerHTML = "";
    recallFromBrowse.disabled = list.length === 0;
    browseCount.textContent =
      `${list.length} of ${THEORIES.length} exhibit${list.length === 1 ? "" : "s"}`;

    if (!list.length) {
      browseGrid.appendChild(el("p", { class: "lgx-empty", text: "No exhibits match — try clearing the search or filters." }));
      return;
    }
    for (const t of list) {
      const visited = isVisited(t.id);
      const noted = isNoted(t.id);
      const mastered = recall[t.id] && recall[t.id].lastResult === "correct";
      const foot = [];
      if (t.evidence) foot.push(el("span", { class: "lgx-ev", text: t.evidence }));
      if (noted) foot.push(el("span", { class: "lgx-badge", text: "notes" }));
      if (mastered) foot.push(el("span", { class: "lgx-badge master", text: "recalled" }));

      const card = el("button", { class: "lgx-item", onclick: () => { gallery.openPanel(t); } }, [
        el("div", { class: "lgx-item-top" }, [
          el("span", { class: "lgx-chip", text: t.cluster || "" }),
          el("span", { text: "· " + (ROOMS[t.room] ? ROOMS[t.room].name : t.room) }),
          el("span", { class: "lgx-dot", text: visited ? "●" : "○", style: visited ? "color:var(--gold)" : "color:#c8b890" }),
        ]),
        el("div", { class: "lgx-item-title", text: t.title }),
        el("div", { class: "lgx-item-author", text: t.author || "" }),
        el("div", { class: "lgx-item-sum", text: t.summary || "" }),
        foot.length ? el("div", { class: "lgx-item-foot" }, foot) : null,
      ]);
      browseGrid.appendChild(card);
    }
  }

  function openBrowse() {
    if (state.browse) return;
    state.browse = true;
    renderBrowseList();
    browseOverlay.classList.add("open");
    pauseScene();
    setTimeout(() => searchInput.focus(), 30);
  }
  function closeBrowse() {
    if (!state.browse) return;
    state.browse = false;
    browseOverlay.classList.remove("open");
    resumeScene();
  }

  // Re-sync read/notes status when a panel opened from here is closed.
  new MutationObserver(() => { if (state.browse && !panelIsOpen()) renderBrowseList(); })
    .observe(document.getElementById("panel"), { attributes: true, attributeFilter: ["class"] });

  // ──────────────────────────────────────────────────────────────────────────
  //  (1) Active recall
  // ──────────────────────────────────────────────────────────────────────────
  const recallOverlay = el("div", { id: "lgx-recall", class: "lgx-overlay" });
  const recallInner = el("div", { class: "lgx-recall-inner" });
  const recallProgress = el("span", { class: "lgx-r-progress", text: "" });
  recallOverlay.appendChild(el("div", { class: "lgx-card" }, [
    el("div", { class: "lgx-head" }, [
      el("div", {}, [el("h2", { text: "Active recall" })]),
      el("div", { style: "display:flex; gap:18px; align-items:baseline;" }, [
        recallProgress,
        el("button", { class: "lgx-close", text: "Close", onclick: closeRecall }),
      ]),
    ]),
    recallInner,
  ]));
  document.body.appendChild(recallOverlay);

  // deck = array of theories; pos walks through; review-agains form the next round
  const deckState = { round: [], pos: 0, next: [], correct: 0, reviewed: 0 };

  function openRecall(deck) {
    state.recall = true;
    recallOverlay.classList.add("open");
    pauseScene();
    if (deck && deck.length) beginRound(deck);
    else renderRecallSetup();
  }
  function closeRecall() {
    if (!state.recall) return;
    state.recall = false;
    recallOverlay.classList.remove("open");
    recallProgress.textContent = "";
    resumeScene();
  }

  function renderRecallSetup() {
    recallProgress.textContent = "";
    const read = THEORIES.filter((t) => isVisited(t.id));
    recallInner.innerHTML = "";
    recallInner.appendChild(el("div", { class: "lgx-r-setup" }, [
      el("div", { class: "lgx-r-big", text: "Test yourself" }),
      el("p", { text: "You'll see one framework at a time. Try to recall what it claims and its key points before revealing the answer — then mark whether you got it. Retrieving from memory builds far stronger learning than re-reading." }),
      el("div", { class: "lgx-r-actions" }, [
        el("button", {
          class: "lgx-btn",
          text: read.length ? `Exhibits I've read (${read.length})` : "Exhibits I've read (0)",
          disabled: read.length === 0,
          onclick: () => beginRound(read),
        }),
        el("button", { class: "lgx-btn ghost", text: `All exhibits (${THEORIES.length})`, onclick: () => beginRound(THEORIES.slice()) }),
      ]),
    ]));
  }

  function beginRound(deck) {
    deckState.round = shuffle(deck);
    deckState.pos = 0;
    deckState.next = [];
    deckState.correct = 0;
    deckState.total = deck.length;
    renderCard();
  }

  let revealed = false;
  function renderCard() {
    const t = deckState.round[deckState.pos];
    revealed = false;
    recallProgress.textContent = `Card ${deckState.pos + 1} / ${deckState.round.length}`;
    recallInner.innerHTML = "";
    recallInner.appendChild(el("div", {}, [
      el("p", { class: "lgx-r-meta", text: (ROOMS[t.room] ? ROOMS[t.room].name : t.room) + " · " + (t.cluster || "") }),
      el("h3", { class: "lgx-r-prompt", text: t.title }),
      el("p", { class: "lgx-r-cue", text: "Recall: what does this framework claim, and what are its key points? (press Space to reveal)" }),
    ]));
    const actions = el("div", { class: "lgx-r-actions" }, [
      el("button", { class: "lgx-btn", text: "Show answer", onclick: reveal }),
    ]);
    recallInner.appendChild(actions);
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    const t = deckState.round[deckState.pos];
    const answer = el("div", { class: "lgx-r-answer" }, [
      el("p", { class: "lab", text: "Answer" }),
      t.summary ? el("p", { class: "sum", text: t.summary }) : null,
      (t.keypoints && t.keypoints.length)
        ? el("ul", {}, t.keypoints.map((k) => el("li", { text: k })))
        : null,
    ]);
    const actions = el("div", { class: "lgx-r-actions" }, [
      el("button", { class: "lgx-btn", text: "Got it (1)", onclick: () => rate(true) }),
      el("button", { class: "lgx-btn ghost", text: "Review again (2)", onclick: () => rate(false) }),
    ]);
    // replace cue + actions with answer + new actions
    recallInner.querySelector(".lgx-r-actions").remove();
    recallInner.firstChild.appendChild(answer);
    recallInner.appendChild(actions);
  }

  function rate(correct) {
    const t = deckState.round[deckState.pos];
    recordRecall(t.id, correct);
    deckState.reviewed++;
    if (correct) deckState.correct++;
    else deckState.next.push(t);
    deckState.pos++;
    if (deckState.pos < deckState.round.length) renderCard();
    else endRound();
  }

  function endRound() {
    recallProgress.textContent = "";
    const stillToReview = deckState.next.slice();
    recallInner.innerHTML = "";
    if (!stillToReview.length) {
      recallInner.appendChild(el("div", { class: "lgx-r-setup" }, [
        el("div", { class: "lgx-r-big", text: "Round complete — nice recall." }),
        el("p", { text: `You worked through ${deckState.round.length} exhibit${deckState.round.length === 1 ? "" : "s"} and recalled them all.` }),
        el("div", { class: "lgx-r-actions" }, [
          el("button", { class: "lgx-btn", text: "Test again", onclick: renderRecallSetup }),
          el("button", { class: "lgx-btn ghost", text: "Done", onclick: closeRecall }),
        ]),
      ]));
    } else {
      recallInner.appendChild(el("div", { class: "lgx-r-setup" }, [
        el("div", { class: "lgx-r-big", text: "Round complete" }),
        el("p", { text: `You recalled ${deckState.correct} of ${deckState.round.length}. ${stillToReview.length} ${stillToReview.length === 1 ? "exhibit" : "exhibits"} you marked for another look.` }),
        el("div", { class: "lgx-r-actions" }, [
          el("button", { class: "lgx-btn", text: `Review those ${stillToReview.length} →`, onclick: () => beginRound(stillToReview) }),
          el("button", { class: "lgx-btn ghost", text: "Finish", onclick: closeRecall }),
        ]),
      ]));
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  (8) Note export / import
  // ──────────────────────────────────────────────────────────────────────────
  function download(filename, text, mime) {
    const blob = new Blob([text], { type: mime || "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = el("a", { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function dateStamp() { return new Date().toISOString().slice(0, 10); }

  function collectNotes() {
    const notes = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf(NOTES_PREFIX) === 0) {
        const v = localStorage.getItem(k);
        if (v && v.trim()) notes[k.slice(NOTES_PREFIX.length)] = v;
      }
    }
    return notes;
  }

  function exportBackup() {
    const data = {
      app: "learning-gallery", version: 1, exportedAt: new Date().toISOString(),
      visited: [...gallery.visited],
      notes: collectNotes(),
      recall: loadRecall(),
    };
    download(`learning-gallery-backup-${dateStamp()}.json`, JSON.stringify(data, null, 2), "application/json");
  }

  function exportStudyGuide() {
    const include = THEORIES.filter((t) => isVisited(t.id) || isNoted(t.id));
    const noted = THEORIES.filter((t) => isNoted(t.id));
    const L = [];
    L.push("# Learning Gallery — Study Guide");
    L.push("");
    L.push(`_Exported ${new Date().toLocaleDateString()}_`);
    L.push("");
    L.push(`Explored **${include.length}** of ${THEORIES.length} exhibits · notes on **${noted.length}**.`);
    L.push("");
    if (!include.length) {
      L.push("_Explore some exhibits in the gallery (or open one from Browse) and write a note or two, then export again._");
    }
    for (const key of Object.keys(ROOMS)) {
      const inWing = include.filter((t) => t.room === key);
      if (!inWing.length) continue;
      L.push(`## ${ROOMS[key].name}`);
      L.push("");
      for (const t of inWing) {
        L.push(`### ${t.title}`);
        const meta = [t.author, t.cluster].filter(Boolean).join(" · ");
        if (meta) L.push(`*${meta}*`);
        if (t.evidence) L.push(`Evidence: ${t.evidence}`);
        L.push("");
        if (t.summary) { L.push(t.summary); L.push(""); }
        if (t.keypoints && t.keypoints.length) {
          L.push("**Key points**");
          for (const k of t.keypoints) L.push(`- ${k}`);
          L.push("");
        }
        const note = gallery.notes.load(t.id);
        if (note && note.trim()) {
          L.push("**My notes**");
          for (const ln of note.split("\n")) L.push(`> ${ln}`);
          L.push("");
        }
      }
    }
    download(`learning-gallery-study-guide-${dateStamp()}.md`, L.join("\n"), "text/markdown");
  }

  const importInput = el("input", { type: "file", accept: "application/json,.json", style: "display:none" });
  importInput.addEventListener("change", () => {
    const file = importInput.files && importInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let data;
      try { data = JSON.parse(reader.result); }
      catch (e) { alert("That file isn't valid JSON."); importInput.value = ""; return; }
      if (!data || data.app !== "learning-gallery") {
        alert("That doesn't look like a Learning Gallery backup file.");
        importInput.value = "";
        return;
      }
      const noteCount = data.notes ? Object.keys(data.notes).length : 0;
      const readCount = Array.isArray(data.visited) ? data.visited.length : 0;
      if (!confirm(`Import ${noteCount} note${noteCount === 1 ? "" : "s"} and ${readCount} read marker${readCount === 1 ? "" : "s"}? This merges into what's already on this device, then reloads.`)) {
        importInput.value = "";
        return;
      }
      try {
        if (data.notes) for (const id in data.notes) {
          const v = data.notes[id];
          if (v && v.trim()) localStorage.setItem(NOTES_PREFIX + id, v);
        }
        const merged = new Set(gallery.visited);
        if (Array.isArray(data.visited)) data.visited.forEach((id) => merged.add(id));
        localStorage.setItem(VISITED_KEY, JSON.stringify([...merged]));
        if (data.recall && typeof data.recall === "object") {
          const r = loadRecall();
          Object.assign(r, data.recall);
          localStorage.setItem(RECALL_KEY, JSON.stringify(r));
        }
      } catch (e) {
        alert("Couldn't save the imported data — your browser storage may be full.");
        return;
      }
      location.reload();
    };
    reader.readAsText(file);
  });
  document.body.appendChild(importInput);

  // Add export/import controls to the notebook header (the "my stuff" hub).
  (function injectNotebookTools() {
    const meta = document.querySelector("#notebook .notebookHeader .meta");
    const closeBtn = document.getElementById("notebookClose");
    if (!meta || !closeBtn) return;
    const mk = (label, title, fn) => el("button", { class: "lgx-mini", text: label, title, onclick: fn });
    meta.insertBefore(mk("Backup", "Download all notes & progress as a JSON file you can re-import", exportBackup), closeBtn);
    meta.insertBefore(mk("Study guide", "Download your read exhibits & notes as a Markdown study guide", exportStudyGuide), closeBtn);
    meta.insertBefore(mk("Import", "Restore from a backup JSON file", () => importInput.click()), closeBtn);
  })();

  // ──────────────────────────────────────────────────────────────────────────
  //  Launch buttons + keyboard
  // ──────────────────────────────────────────────────────────────────────────
  const fab = el("div", { id: "lgx-fab" }, [
    el("button", { onclick: openBrowse, title: "Search & browse every exhibit" }, ["Browse", el("kbd", { text: "B" })]),
    el("button", { onclick: () => openRecall(), title: "Test yourself on the theories" }, ["Recall", el("kbd", { text: "R" })]),
  ]);
  document.body.appendChild(fab);

  window.addEventListener("keydown", (e) => {
    const ae = document.activeElement;
    const typing = ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable);

    // Recall in-card shortcuts
    if (state.recall && !typing) {
      if (e.code === "Space") { e.preventDefault(); if (!revealed && deckState.round[deckState.pos]) reveal(); return; }
      if (revealed && e.code === "Digit1") { rate(true); return; }
      if (revealed && e.code === "Digit2") { rate(false); return; }
    }

    if (e.code === "Escape") {
      if (state.recall) { closeRecall(); return; }
      if (state.browse) { closeBrowse(); return; }
      return;
    }

    if (typing || panelIsOpen()) return;
    // Don't fight the intro/guidebook before the visitor has entered.
    if (!gallery.isStarted()) return;

    if (e.code === "KeyB" || e.code === "Slash") {
      e.preventDefault();
      state.browse ? closeBrowse() : openBrowse();
    } else if (e.code === "KeyR") {
      if (state.browse) { const l = currentBrowseList(); closeBrowse(); openRecall(l.length ? l : null); }
      else state.recall ? closeRecall() : openRecall();
    }
  });
})();
