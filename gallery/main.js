// gallery/main.js — controls, render loop, panel + notebook + map UI + notes

(function () {
  const { WALL_H, DOOR_W } = window.GalleryWorld;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1d22);
  scene.fog = new THREE.Fog(0x1a1d22, 34, 80);

  const camera = new THREE.PerspectiveCamera(
    72, window.innerWidth / window.innerHeight, 0.1, 200
  );
  camera.position.set(0, 1.65, 6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(window.innerWidth || 800, window.innerHeight || 600);
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.getElementById("stage").appendChild(renderer.domElement);

  function resizeRenderer() {
    const w = window.innerWidth || document.documentElement.clientWidth || 800;
    const h = window.innerHeight || document.documentElement.clientHeight || 600;
    if (w > 0 && h > 0) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, true);
    }
  }
  window.addEventListener("resize", resizeRenderer);
  window.addEventListener("load", resizeRenderer);
  if (window.ResizeObserver) {
    new ResizeObserver(resizeRenderer).observe(document.documentElement);
  }
  for (const t of [0, 50, 200, 1000]) setTimeout(resizeRenderer, t);

  // Lights — bright, neutral gallery wash for clean contrast
  scene.add(new THREE.AmbientLight(0xffffff, 0.62));
  const hemi = new THREE.HemisphereLight(0xfff8ee, 0x6b6456, 0.5);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff4e2, 0.5);
  sun.position.set(8, 30, 6);
  scene.add(sun);

  // World
  const world = window.GalleryWorld.buildWorld(scene);

  // Pointer-lock controls
  const controls = new THREE.PointerLockControls(camera, document.body);

  // ── input ────────────────────────────────────────────────────────────────
  const keys = Object.create(null);
  window.addEventListener("keydown", (e) => {
    const ae = document.activeElement;
    const typing = ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable);
    if (typing) {
      if (e.code === "Escape") {
        ae.blur();
        e.preventDefault();
      }
      return;
    }
    keys[e.code] = true;
    if (e.code === "KeyN") toggleNotebook();
    if (e.code === "KeyM") toggleMap();
    if (e.code === "KeyG") toggleGuide();
    if (e.code === "Escape") {
      closePanel(); closeNotebook();
      if (guideOpen() && started) closeGuide();
    }
  });
  function toggleGuide() { if (guideOpen()) closeGuide(); else openGuide(); }
  window.addEventListener("keyup", (e) => { keys[e.code] = false; });

  // ── overlay (intro / guidebook) ──────────────────────────────────────────
  const intro = document.getElementById("intro");
  const startBtn = document.getElementById("startBtn");
  const introClose = document.getElementById("introClose");
  let started = false;
  function guideOpen() { return intro.style.display !== "none"; }
  function openGuide() {
    buildGuide();
    intro.style.display = "flex";
    if (started) {
      intro.classList.add("reopened");
      startBtn.textContent = "Resume exploring";
    }
    hint.style.display = "none";
    if (controls.isLocked) controls.unlock();
  }
  function closeGuide() {
    intro.style.display = "none";
    started = true;
    controls.lock();
  }
  startBtn.addEventListener("click", closeGuide);
  introClose.addEventListener("click", closeGuide);

  controls.addEventListener("lock", () => { intro.style.display = "none"; hint.style.display = "none"; });
  controls.addEventListener("unlock", () => {
    if (!panel.classList.contains("open") && !notebook.classList.contains("open") && !guideOpen()
        && !(window.GalleryExplore && window.GalleryExplore.isOpen())) {
      setTimeout(() => controls.lock(), 0);
    }
  });
  const hint = document.getElementById("hint");
  hint.addEventListener("click", () => { hint.style.display = "none"; controls.lock(); });

  // ── click → raycast ─────────────────────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  const screenCenter = new THREE.Vector2(0, 0);
  const mouseNDC = new THREE.Vector2(0, 0);
  function tryInteract(useMousePos = false) {
    raycaster.setFromCamera(useMousePos ? mouseNDC : screenCenter, camera);
    const hits = raycaster.intersectObjects(world.raycastTargets, false);
    if (hits.length && hits[0].distance < 11) {
      const theory = hits[0].object.userData.theory;
      if (theory) openPanel(theory);
    }
  }

  let mouseDown = false, dragDistance = 0;
  window.addEventListener("mousemove", (e) => {
    mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
  window.addEventListener("mouseup", () => { mouseDown = false; });

  document.addEventListener("click", (e) => {
    if (panel.classList.contains("open") || notebook.classList.contains("open")) return;
    if (window.GalleryExplore && window.GalleryExplore.isOpen()) return;
    if (e.target.closest("#map, #hud, #hint, #intro, #panel, #notebook, #lgx-browse, #lgx-recall, #lgx-fab")) return;
    if (controls.isLocked) {
      tryInteract(false);
    } else if (dragDistance <= 8) tryInteract(true);
  });

  // ── crosshair hover ─────────────────────────────────────────────────────
  let hovered = null;
  let litFrame = null;
  const crosshair = document.getElementById("crosshair");
  const reticleLabel = document.getElementById("reticleLabel");
  function clearFrameHighlight() {
    if (litFrame) {
      litFrame.emissive.setHex(0x000000);
      litFrame = null;
    }
  }
  function updateHover() {
    raycaster.setFromCamera(screenCenter, camera);
    const hits = raycaster.intersectObjects(world.raycastTargets, false);
    const hit = hits.find((h) => h.distance < 11);
    if (hit) {
      hovered = hit.object;
      const t = hit.object.userData.theory;
      const frameMat = hit.object.userData.frameMat;
      if (frameMat && litFrame !== frameMat) {
        clearFrameHighlight();
        frameMat.emissive.setHex(0x5a4a22);
        litFrame = frameMat;
      }
      if (t) {
        reticleLabel.textContent = t.title + " — click to read";
        reticleLabel.style.display = "block";
      }
      crosshair.classList.add("active");
    } else {
      hovered = null;
      clearFrameHighlight();
      reticleLabel.style.display = "none";
      crosshair.classList.remove("active");
    }
  }

  // ── movement + collision ────────────────────────────────────────────────
  const SPEED = 4.8;
  const RUN_MULT = 1.7;
  let prev = performance.now();

  function overlayOpen() {
    return panel.classList.contains("open") || notebook.classList.contains("open") || guideOpen()
      || (window.GalleryExplore && window.GalleryExplore.isOpen());
  }

  function step(dt) {
    if (overlayOpen()) return;
    const dir = new THREE.Vector3();
    if (keys["KeyW"] || keys["ArrowUp"])    dir.z -= 1;
    if (keys["KeyS"] || keys["ArrowDown"])  dir.z += 1;
    if (keys["KeyA"] || keys["ArrowLeft"])  dir.x -= 1;
    if (keys["KeyD"] || keys["ArrowRight"]) dir.x += 1;
    if (dir.lengthSq() === 0) return;
    dir.normalize();

    const speed = SPEED * (keys["ShiftLeft"] || keys["ShiftRight"] ? RUN_MULT : 1);
    if (dir.z !== 0) controls.moveForward(-dir.z * speed * dt);
    if (dir.x !== 0) controls.moveRight(dir.x * speed * dt);

    const obj = controls.getObject();
    const x = obj.position.x, z = obj.position.z;
    if (!world.isWalkable(world.boxes, x, z)) {
      const prevX = obj.userData.lastX ?? x;
      const prevZ = obj.userData.lastZ ?? z;
      if (world.isWalkable(world.boxes, prevX, z)) {
        obj.position.x = prevX;
      } else if (world.isWalkable(world.boxes, x, prevZ)) {
        obj.position.z = prevZ;
      } else {
        obj.position.x = prevX;
        obj.position.z = prevZ;
      }
    }
    obj.userData.lastX = obj.position.x;
    obj.userData.lastZ = obj.position.z;
    obj.position.y = 1.65;
  }

  // ── panel UI ────────────────────────────────────────────────────────────
  const panel = document.getElementById("panel");
  const panelTitle = document.getElementById("panelTitle");
  const panelAuthor = document.getElementById("panelAuthor");
  const panelCluster = document.getElementById("panelCluster");
  const panelSummary = document.getElementById("panelSummary");
  const panelExtended = document.getElementById("panelExtended");
  const panelPoints = document.getElementById("panelPoints");
  const panelEvidenceWrap = document.getElementById("panelEvidenceWrap");
  const panelEvidence = document.getElementById("panelEvidence");
  const panelPitfallsWrap = document.getElementById("panelPitfallsWrap");
  const panelPitfalls = document.getElementById("panelPitfalls");
  const panelAiWrap = document.getElementById("panelAiWrap");
  const panelAi = document.getElementById("panelAi");
  const panelRelatedWrap = document.getElementById("panelRelatedWrap");
  const panelRelated = document.getElementById("panelRelated");
  const panelClose = document.getElementById("panelClose");
  const panelArt = document.getElementById("panelArt");
  const panelNotes = document.getElementById("panelNotes");
  const notesStatus = document.getElementById("notesStatus");
  const notesClear = document.getElementById("notesClear");
  panelClose.addEventListener("click", closePanel);

  const visited = new Set();
  let currentTheoryId = null;
  let notesSaveTimer = null;

  function notesKey(id) { return `learning-gallery:notes:${id}`; }
  function loadNote(id) {
    try { return localStorage.getItem(notesKey(id)) || ""; }
    catch (e) { return ""; }
  }
  function saveNote(id, text) {
    try {
      if (text.trim() === "") localStorage.removeItem(notesKey(id));
      else localStorage.setItem(notesKey(id), text);
    } catch (e) {}
  }
  function hasNote(id) {
    const n = loadNote(id);
    return n && n.trim().length > 0;
  }

  panelNotes.addEventListener("input", () => {
    if (!currentTheoryId) return;
    notesStatus.textContent = "Saving…";
    clearTimeout(notesSaveTimer);
    notesSaveTimer = setTimeout(() => {
      saveNote(currentTheoryId, panelNotes.value);
      notesStatus.textContent = panelNotes.value.trim() ? "Saved locally" : "";
    }, 350);
  });
  panelNotes.addEventListener("blur", () => {
    if (!currentTheoryId) return;
    saveNote(currentTheoryId, panelNotes.value);
    notesStatus.textContent = panelNotes.value.trim() ? "Saved locally" : "";
  });

  notesClear.addEventListener("click", () => {
    if (!currentTheoryId) return;
    if (!panelNotes.value.trim()) return;
    panelNotes.value = "";
    saveNote(currentTheoryId, "");
    notesStatus.textContent = "Cleared";
  });

  function setOptionalSection(wrap, el, text) {
    if (text && text.trim()) {
      el.textContent = text;
      wrap.style.display = "";
    } else {
      wrap.style.display = "none";
    }
  }

  // Surface connections: same-cluster exhibits first, then same-wing to fill out.
  function relatedTheories(theory, max = 4) {
    const picked = new Set([theory.id]);
    const out = [];
    for (const t of THEORIES) {
      if (!picked.has(t.id) && t.cluster === theory.cluster) { out.push(t); picked.add(t.id); }
    }
    for (const t of THEORIES) {
      if (out.length >= max) break;
      if (!picked.has(t.id) && t.room === theory.room) { out.push(t); picked.add(t.id); }
    }
    return out.slice(0, max);
  }

  function renderRelated(theory) {
    panelRelated.innerHTML = "";
    const rel = relatedTheories(theory);
    if (!rel.length) { panelRelatedWrap.style.display = "none"; return; }
    for (const r of rel) {
      const b = document.createElement("button");
      b.className = "relChip";
      b.textContent = r.title;
      b.title = r.cluster || "";
      b.addEventListener("click", () => openPanel(r));
      panelRelated.appendChild(b);
    }
    panelRelatedWrap.style.display = "";
  }

  // Progress indicator (persistent, on the map).
  const mapProgressText = document.getElementById("mapProgressText");
  const mapProgressFill = document.getElementById("mapProgressFill");
  function updateProgress() {
    const total = THEORIES.length;
    let seen = 0;
    for (const t of THEORIES) if (visited.has(t.id)) seen++;
    if (mapProgressText) mapProgressText.textContent = `${seen} / ${total} explored`;
    if (mapProgressFill) mapProgressFill.style.width = total ? (seen / total * 100).toFixed(1) + "%" : "0%";
  }

  function openPanel(theory) {
    visited.add(theory.id);
    persistVisited();
    updateProgress();
    currentTheoryId = theory.id;

    panelTitle.textContent = theory.title;
    panelAuthor.textContent = theory.author;
    panelCluster.textContent = theory.cluster;
    panelSummary.textContent = theory.summary || "";
    panelExtended.textContent = theory.extendedSummary || "";
    panelExtended.style.display = theory.extendedSummary ? "" : "none";

    panelPoints.innerHTML = "";
    for (const k of (theory.keypoints || [])) {
      const li = document.createElement("li");
      li.textContent = k;
      panelPoints.appendChild(li);
    }

    setOptionalSection(panelEvidenceWrap, panelEvidence, theory.evidence);
    setOptionalSection(panelPitfallsWrap, panelPitfalls, theory.pitfalls);
    setOptionalSection(panelAiWrap, panelAi, theory.aiImplications);
    renderRelated(theory);

    panelArt.innerHTML = "";
    const c = GalleryArt.makeArtworkCanvas(theory);
    c.style.width = "100%";
    c.style.height = "auto";
    c.style.display = "block";
    c.style.borderRadius = "4px";
    panelArt.appendChild(c);

    panelNotes.value = loadNote(theory.id);
    notesStatus.textContent = panelNotes.value.trim() ? "Saved locally" : "";

    panel.classList.add("open");
    if (controls.isLocked) controls.unlock();
    hint.style.display = "none";

    requestAnimationFrame(() => {
      const card = panel.querySelector(".panelCard");
      if (card) card.scrollTop = 0;
    });
  }
  function closePanel() {
    if (currentTheoryId) saveNote(currentTheoryId, panelNotes.value);
    panel.classList.remove("open");
    currentTheoryId = null;
  }

  // ── notebook ────────────────────────────────────────────────────────────
  const notebook = document.getElementById("notebook");
  const notebookList = document.getElementById("notebookList");
  const notebookCount = document.getElementById("notebookCount");
  const notebookClose = document.getElementById("notebookClose");
  notebookClose.addEventListener("click", closeNotebook);

  function loadVisited() {
    try {
      const v = JSON.parse(localStorage.getItem("learning-gallery:visited") || "[]");
      for (const id of v) visited.add(id);
    } catch (e) {}
  }
  function persistVisited() {
    try {
      localStorage.setItem("learning-gallery:visited", JSON.stringify([...visited]));
    } catch (e) {}
  }
  loadVisited();
  updateProgress();

  function renderNotebook() {
    notebookList.innerHTML = "";
    const grouped = {};
    for (const t of THEORIES) {
      const room = ROOMS[t.room].name;
      (grouped[room] ||= []).push(t);
    }
    let total = 0, seen = 0, withNotes = 0;
    for (const room of Object.keys(grouped)) {
      const items = grouped[room];
      const groupSeen = items.reduce((n, t) => n + (visited.has(t.id) ? 1 : 0), 0);
      const section = document.createElement("section");
      const h = document.createElement("h3");
      h.appendChild(document.createTextNode(room));
      const cnt = document.createElement("span");
      cnt.className = "nbCount";
      cnt.textContent = `${groupSeen}/${items.length}`;
      h.appendChild(cnt);
      section.appendChild(h);
      const ul = document.createElement("ul");
      for (const t of grouped[room]) {
        total++;
        const isSeen = visited.has(t.id);
        const noted = hasNote(t.id);
        if (isSeen) seen++;
        if (noted) withNotes++;
        const li = document.createElement("li");
        li.dataset.id = t.id;
        li.className = (isSeen ? "seen" : "unseen") + (noted ? " hasnotes" : "");
        const noteBadge = noted ? '<span class="noteBadge">notes</span>' : "";
        li.innerHTML = `
          <span class="check">${isSeen ? "●" : "○"}</span>
          <div style="flex:1;">
            <div class="title">${t.title}</div>
            <div class="author">${t.author}</div>
          </div>${noteBadge}`;
        li.addEventListener("click", () => {
          closeNotebook();
          openPanel(t);
        });
        ul.appendChild(li);
      }
      section.appendChild(ul);
      notebookList.appendChild(section);
    }
    const noteLine = withNotes ? `  ·  ${withNotes} noted` : "";
    notebookCount.textContent = `${seen} of ${total} read${noteLine}`;
  }
  function toggleNotebook() {
    if (notebook.classList.contains("open")) closeNotebook();
    else openNotebook();
  }
  function openNotebook() {
    renderNotebook();
    notebook.classList.add("open");
    if (controls.isLocked) controls.unlock();
    hint.style.display = "none";
  }
  function closeNotebook() {
    notebook.classList.remove("open");
  }

  // ── minimap (radial 8-wing layout) ─────────────────────────────────────
  const map = document.getElementById("map");
  const mapSvg = document.getElementById("mapSvg");
  const mapRoomLabel = document.getElementById("mapRoomLabel");

  function mapBounds() {
    let xmin = Infinity, xmax = -Infinity, zmin = Infinity, zmax = -Infinity;
    for (const k of Object.keys(ROOMS)) {
      const r = ROOMS[k];
      const a = (r.angle || 0) * Math.PI / 180;
      const cosA = Math.cos(a), sinA = Math.sin(a);
      const hx = r.sizeX / 2, hz = r.sizeZ / 2;
      const corners = [[-hx,-hz],[hx,-hz],[hx,hz],[-hx,hz]];
      for (const [lx, lz] of corners) {
        const wx = r.center[0] + lx * cosA + lz * sinA;
        const wz = r.center[1] - lx * sinA + lz * cosA;
        xmin = Math.min(xmin, wx);
        xmax = Math.max(xmax, wx);
        zmin = Math.min(zmin, wz);
        zmax = Math.max(zmax, wz);
      }
    }
    return { xmin, xmax, zmin, zmax };
  }

  let MAP_W = 260, MAP_H = 260, MAP_SCALE = 1, MAP_OX = 0, MAP_OZ = 0;
  function computeMapScale() {
    const b = mapBounds();
    const padding = 14;
    const sx = (MAP_W - padding * 2) / (b.xmax - b.xmin);
    const sz = (MAP_H - padding * 2) / (b.zmax - b.zmin);
    MAP_SCALE = Math.min(sx, sz);
    MAP_OX = padding - b.xmin * MAP_SCALE + ((MAP_W - padding * 2) - (b.xmax - b.xmin) * MAP_SCALE) / 2;
    MAP_OZ = padding - b.zmin * MAP_SCALE + ((MAP_H - padding * 2) - (b.zmax - b.zmin) * MAP_SCALE) / 2;
  }
  function mx(x) { return x * MAP_SCALE + MAP_OX; }
  function mz(z) { return z * MAP_SCALE + MAP_OZ; }

  const WING_SHORT_NAMES = {
    atrium: "Rotunda",
    design: "Design",
    cog: "Cognitive",
    mem: "Memory",
    mot: "Motivation",
    soc: "Social",
    adu: "Adult",
    eap: "EAP",
    tax: "Taxonomy",
  };

  function buildMap() {
    computeMapScale();
    const ns = "http://www.w3.org/2000/svg";
    mapSvg.setAttribute("viewBox", `0 0 ${MAP_W} ${MAP_H}`);
    mapSvg.setAttribute("width", MAP_W);
    mapSvg.setAttribute("height", MAP_H);

    const labels = [];

    for (const key of Object.keys(ROOMS)) {
      const r = ROOMS[key];
      const a = (r.angle || 0) * Math.PI / 180;

      if (r.shape === "circle") {
        const circ = document.createElementNS(ns, "circle");
        circ.setAttribute("cx", mx(r.center[0]));
        circ.setAttribute("cy", mz(r.center[1]));
        circ.setAttribute("r", Math.min(r.sizeX, r.sizeZ) / 2 * MAP_SCALE);
        circ.setAttribute("fill", r.accent);
        circ.setAttribute("fill-opacity", "0.35");
        circ.setAttribute("stroke", r.accent);
        circ.setAttribute("stroke-width", "1.5");
        circ.dataset.room = key;
        mapSvg.appendChild(circ);
      } else {
        const cosA = Math.cos(a), sinA = Math.sin(a);
        const hx = r.sizeX / 2, hz = r.sizeZ / 2;
        const corners = [[-hx,-hz],[hx,-hz],[hx,hz],[-hx,hz]];
        const pts = corners.map(([lx, lz]) => {
          const wx = r.center[0] + lx * cosA + lz * sinA;
          const wz = r.center[1] - lx * sinA + lz * cosA;
          return `${mx(wx)},${mz(wz)}`;
        }).join(" ");
        const poly = document.createElementNS(ns, "polygon");
        poly.setAttribute("points", pts);
        poly.setAttribute("fill", r.accent);
        poly.setAttribute("fill-opacity", "0.35");
        poly.setAttribute("stroke", r.accent);
        poly.setAttribute("stroke-width", "1.5");
        poly.dataset.room = key;
        mapSvg.appendChild(poly);
      }

      // Corridor line from atrium to wing
      if (key !== "atrium") {
        const line = document.createElementNS(ns, "line");
        line.setAttribute("x1", mx(0));
        line.setAttribute("y1", mz(0));
        line.setAttribute("x2", mx(r.center[0]));
        line.setAttribute("y2", mz(r.center[1]));
        line.setAttribute("stroke", "#3a342a");
        line.setAttribute("stroke-width", DOOR_W * MAP_SCALE * 0.6);
        line.setAttribute("stroke-linecap", "round");
        mapSvg.appendChild(line);
      }

      const lab = document.createElementNS(ns, "text");
      lab.setAttribute("x", mx(r.center[0]));
      lab.setAttribute("y", mz(r.center[1]) + 3);
      lab.setAttribute("text-anchor", "middle");
      lab.setAttribute("font-size", "8");
      lab.setAttribute("font-family", "Georgia, serif");
      lab.setAttribute("fill", "#f6efd9");
      lab.setAttribute("stroke", "rgba(20,16,10,0.7)");
      lab.setAttribute("stroke-width", "2");
      lab.setAttribute("paint-order", "stroke");
      lab.textContent = WING_SHORT_NAMES[key] || key;
      labels.push(lab);
    }

    for (const lab of labels) mapSvg.appendChild(lab);

    const dot = document.createElementNS(ns, "circle");
    dot.setAttribute("r", "3.5");
    dot.setAttribute("fill", "#fff2c8");
    dot.setAttribute("stroke", "#000");
    dot.setAttribute("stroke-width", "0.8");
    dot.id = "playerDot";
    mapSvg.appendChild(dot);
    const facing = document.createElementNS(ns, "line");
    facing.setAttribute("stroke", "#fff2c8");
    facing.setAttribute("stroke-width", "1.6");
    facing.id = "playerFacing";
    mapSvg.appendChild(facing);
  }
  buildMap();

  function updateMap() {
    const obj = controls.getObject();
    const px = mx(obj.position.x);
    const py = mz(obj.position.z);
    const dot = document.getElementById("playerDot");
    dot.setAttribute("cx", px);
    dot.setAttribute("cy", py);
    const yaw = obj.rotation.y;
    const lx = px + Math.sin(yaw) * 8;
    const ly = py + Math.cos(yaw) * 8;
    const f = document.getElementById("playerFacing");
    f.setAttribute("x1", px);
    f.setAttribute("y1", py);
    f.setAttribute("x2", lx);
    f.setAttribute("y2", ly);

    const cur = world.currentRoom(world.boxes, obj.position.x, obj.position.z);
    const roomKey = cur && ROOMS[cur] ? cur : null;
    const isCorridor = cur && cur.startsWith("corridor-");
    const r = roomKey && ROOMS[roomKey];
    if (r) mapRoomLabel.textContent = r.name.toUpperCase();
    else if (isCorridor) mapRoomLabel.textContent = "↳ path";
    else mapRoomLabel.textContent = "—";

    [...mapSvg.querySelectorAll("[data-room]")].forEach((el) => {
      if (el.dataset.room === roomKey) {
        el.setAttribute("fill-opacity", "0.78");
        el.setAttribute("stroke-width", "2.4");
      } else {
        el.setAttribute("fill-opacity", "0.35");
        el.setAttribute("stroke-width", "1.2");
      }
    });
  }

  function toggleMap() {
    map.classList.toggle("collapsed");
  }

  // ── guidebook content (built once from data) ─────────────────────────────
  function buildGuide() {
    const container = document.getElementById("guideRooms");
    if (!container) return;
    const grouped = {};
    for (const t of THEORIES) (grouped[t.room] ||= []).push(t);
    container.innerHTML = "";
    for (const key of Object.keys(ROOMS)) {
      const r = ROOMS[key];
      const list = grouped[key] || [];
      const titles = list.map((t) => t.title).join(" · ");
      const groupSeen = list.reduce((n, t) => n + (visited.has(t.id) ? 1 : 0), 0);
      const readLabel = groupSeen ? `${groupSeen} of ${list.length} read` : `${list.length} ${list.length === 1 ? "exhibit" : "exhibits"}`;
      const div = document.createElement("div");
      div.className = "guideRoom";
      div.style.borderLeftColor = r.accent;
      div.innerHTML =
        `<p class="gr-name" style="color:${r.accent}">${r.name}</p>` +
        `<p class="gr-look">${r.guide || r.subtitle || ""}</p>` +
        `<p class="gr-list"><strong>${readLabel}</strong> — ${titles}</p>`;
      container.appendChild(div);
    }
  }
  buildGuide();

  // ── animation loop ──────────────────────────────────────────────────────
  function tick() {
    try {
      const now = performance.now();
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;

      step(dt);
      updateHover();
      updateMap();

      if (scene.userData.titleGroup) {
        scene.userData.titleGroup.rotation.y += dt * 0.16;
      }

      renderer.render(scene, camera);
    } catch (e) {
      console.log("TICK ERR:", e.message, e.stack);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Re-grab the pointer after an external overlay (browse / recall) closes,
  // mirroring the behaviour of the guidebook's "resume exploring".
  function resumeControls() {
    if (started &&
        !panel.classList.contains("open") &&
        !notebook.classList.contains("open") &&
        !guideOpen() &&
        !(window.GalleryExplore && window.GalleryExplore.isOpen())) {
      controls.lock();
    }
  }

  window.__gallery = {
    scene, camera, controls, world, renderer,
    openPanel, closePanel,
    visited, persistVisited,
    notes: { load: loadNote, save: saveNote, has: hasNote, key: notesKey },
    VISITED_KEY: "learning-gallery:visited",
    NOTES_PREFIX: "learning-gallery:notes:",
    isStarted: () => started,
    resume: resumeControls,
  };
})();
