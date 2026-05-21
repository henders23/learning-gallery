// gallery/main.js — controls, render loop, panel + notebook + map UI + notes

(function () {
  const { WALL_H, DOOR_W } = window.GalleryWorld;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0e1418);
  scene.fog = new THREE.Fog(0x0e1418, 22, 65);

  const camera = new THREE.PerspectiveCamera(
    72, window.innerWidth / window.innerHeight, 0.1, 240
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

  // Lights — cool sky tint to match the light-blue walls, plus a warm fill
  scene.add(new THREE.AmbientLight(0xe8f2fa, 0.36));
  const hemi = new THREE.HemisphereLight(0xdfeefb, 0x2f3a25, 0.38);
  scene.add(hemi);

  // World
  const world = window.GalleryWorld.buildWorld(scene);

  // Pointer-lock controls
  const controls = new THREE.PointerLockControls(camera, document.body);

  // ── input ────────────────────────────────────────────────────────────────
  const keys = Object.create(null);
  window.addEventListener("keydown", (e) => {
    // If a notes textarea is focused, only Escape should be intercepted.
    const focusingNotes = document.activeElement && document.activeElement.id === "panelNotes";
    if (focusingNotes) {
      if (e.code === "Escape") {
        document.activeElement.blur();
        e.preventDefault();
      }
      return;
    }
    keys[e.code] = true;
    if (e.code === "KeyN") toggleNotebook();
    if (e.code === "KeyM") toggleMap();
    if (e.code === "Escape") { closePanel(); closeNotebook(); }
  });
  window.addEventListener("keyup", (e) => { keys[e.code] = false; });

  // ── overlay (intro + click to start) ─────────────────────────────────────
  const intro = document.getElementById("intro");
  const startBtn = document.getElementById("startBtn");
  startBtn.addEventListener("click", () => {
    intro.style.display = "none";
    controls.lock();
  });
  controls.addEventListener("lock", () => { intro.style.display = "none"; hint.style.display = "none"; });
  controls.addEventListener("unlock", () => {
    if (!panel.classList.contains("open") && !notebook.classList.contains("open")) {
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
    if (hits.length && hits[0].distance < 9) {
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
    if (e.target.closest("#map, #hud, #hint, #intro, #panel, #notebook")) return;
    if (controls.isLocked) {
      tryInteract(false);
    } else if (dragDistance <= 8) tryInteract(true);
  });

  // ── crosshair hover ─────────────────────────────────────────────────────
  let hovered = null;
  const crosshair = document.getElementById("crosshair");
  const reticleLabel = document.getElementById("reticleLabel");
  function updateHover() {
    raycaster.setFromCamera(screenCenter, camera);
    const hits = raycaster.intersectObjects(world.raycastTargets, false);
    const hit = hits.find((h) => h.distance < 9);
    if (hit) {
      if (hovered !== hit.object) { hovered = hit.object; }
      const t = hit.object.userData.theory;
      if (t) {
        reticleLabel.textContent = t.title + " — click to read";
        reticleLabel.style.display = "block";
      }
      crosshair.classList.add("active");
    } else {
      hovered = null;
      reticleLabel.style.display = "none";
      crosshair.classList.remove("active");
    }
  }

  // ── movement + collision ────────────────────────────────────────────────
  const SPEED = 4.8;
  const RUN_MULT = 1.7;
  let prev = performance.now();

  function step(dt) {
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
  const panelClose = document.getElementById("panelClose");
  const panelArt = document.getElementById("panelArt");
  const panelNotes = document.getElementById("panelNotes");
  const notesStatus = document.getElementById("notesStatus");
  const notesClear = document.getElementById("notesClear");
  panelClose.addEventListener("click", closePanel);

  const visited = new Set();
  let currentTheoryId = null;
  let notesSaveTimer = null;

  // localStorage helpers for per-theory notes
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

  // Debounced auto-save while typing
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

  function openPanel(theory) {
    visited.add(theory.id);
    persistVisited();
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

    panelArt.innerHTML = "";
    const c = GalleryArt.makeArtworkCanvas(theory);
    c.style.width = "100%";
    c.style.height = "auto";
    c.style.display = "block";
    c.style.borderRadius = "4px";
    panelArt.appendChild(c);

    // Load existing note
    panelNotes.value = loadNote(theory.id);
    notesStatus.textContent = panelNotes.value.trim() ? "Saved locally" : "";

    panel.classList.add("open");
    if (controls.isLocked) controls.unlock();
    hint.style.display = "none";

    // scroll panel back to top
    requestAnimationFrame(() => {
      const card = panel.querySelector(".panelCard");
      if (card) card.scrollTop = 0;
    });
  }
  function closePanel() {
    // save current note before closing
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

  function renderNotebook() {
    notebookList.innerHTML = "";
    const grouped = {};
    for (const t of THEORIES) {
      const room = ROOMS[t.room].name;
      (grouped[room] ||= []).push(t);
    }
    let total = 0, seen = 0, withNotes = 0;
    for (const room of Object.keys(grouped)) {
      const section = document.createElement("section");
      const h = document.createElement("h3");
      h.textContent = room;
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

  // ── minimap ─────────────────────────────────────────────────────────────
  const map = document.getElementById("map");
  const mapSvg = document.getElementById("mapSvg");
  const mapRoomLabel = document.getElementById("mapRoomLabel");

  function mapBounds() {
    // compute bounding box of all rooms to scale the map nicely
    let xmin = Infinity, xmax = -Infinity, zmin = Infinity, zmax = -Infinity;
    for (const k of Object.keys(ROOMS)) {
      const r = ROOMS[k];
      xmin = Math.min(xmin, r.center[0] - r.sizeX / 2);
      xmax = Math.max(xmax, r.center[0] + r.sizeX / 2);
      zmin = Math.min(zmin, r.center[1] - r.sizeZ / 2);
      zmax = Math.max(zmax, r.center[1] + r.sizeZ / 2);
    }
    return { xmin, xmax, zmin, zmax };
  }

  let MAP_W = 240, MAP_H = 240, MAP_SCALE = 1, MAP_OX = 0, MAP_OZ = 0;
  function computeMapScale() {
    const b = mapBounds();
    const padding = 12;
    const sx = (MAP_W - padding * 2) / (b.xmax - b.xmin);
    const sz = (MAP_H - padding * 2) / (b.zmax - b.zmin);
    MAP_SCALE = Math.min(sx, sz);
    MAP_OX = padding - b.xmin * MAP_SCALE + ((MAP_W - padding * 2) - (b.xmax - b.xmin) * MAP_SCALE) / 2;
    MAP_OZ = padding - b.zmin * MAP_SCALE + ((MAP_H - padding * 2) - (b.zmax - b.zmin) * MAP_SCALE) / 2;
  }
  function mx(x) { return x * MAP_SCALE + MAP_OX; }
  function mz(z) { return z * MAP_SCALE + MAP_OZ; }

  function buildMap() {
    computeMapScale();
    const ns = "http://www.w3.org/2000/svg";
    mapSvg.setAttribute("viewBox", `0 0 ${MAP_W} ${MAP_H}`);
    mapSvg.setAttribute("width", MAP_W);
    mapSvg.setAttribute("height", MAP_H);

    const labels = [];
    for (const key of Object.keys(ROOMS)) {
      const r = ROOMS[key];
      const rect = document.createElementNS(ns, "rect");
      rect.setAttribute("x", mx(r.center[0] - r.sizeX / 2));
      rect.setAttribute("y", mz(r.center[1] - r.sizeZ / 2));
      rect.setAttribute("width", r.sizeX * MAP_SCALE);
      rect.setAttribute("height", r.sizeZ * MAP_SCALE);
      rect.setAttribute("fill", r.accent);
      rect.setAttribute("fill-opacity", "0.35");
      rect.setAttribute("stroke", r.accent);
      rect.setAttribute("stroke-width", "1.5");
      rect.dataset.room = key;
      mapSvg.appendChild(rect);

      const lab = document.createElementNS(ns, "text");
      lab.setAttribute("x", mx(r.center[0]));
      lab.setAttribute("y", mz(r.center[1]) + 4);
      lab.setAttribute("text-anchor", "middle");
      lab.setAttribute("font-size", "10");
      lab.setAttribute("font-family", "Georgia, serif");
      lab.setAttribute("fill", "#f6efd9");
      lab.setAttribute("stroke", "rgba(20,16,10,0.7)");
      lab.setAttribute("stroke-width", "2");
      lab.setAttribute("paint-order", "stroke");
      lab.textContent = key === "atrium" ? "Atrium" :
                        key === "north" ? "Cognitive" :
                        key === "east" ? "Memory" :
                        key === "south" ? "Motivation" :
                        "Social & EAP";
      labels.push(lab);
    }

    // Corridors as thin strips between adjacent rooms
    const A = ROOMS.atrium;
    const half = DOOR_W / 2;
    const corridors = [
      // N corridor between atrium top and north bottom
      { x: A.center[0] - half, z: ROOMS.north.center[1] + ROOMS.north.sizeZ / 2,
        w: DOOR_W, h: (A.center[1] - A.sizeZ/2) - (ROOMS.north.center[1] + ROOMS.north.sizeZ/2) },
      { x: A.center[0] - half, z: A.center[1] + A.sizeZ / 2,
        w: DOOR_W, h: (ROOMS.south.center[1] - ROOMS.south.sizeZ/2) - (A.center[1] + A.sizeZ/2) },
      { x: A.center[0] + A.sizeX / 2, z: A.center[1] - half,
        w: (ROOMS.east.center[0] - ROOMS.east.sizeX/2) - (A.center[0] + A.sizeX/2), h: DOOR_W },
      { x: ROOMS.west.center[0] + ROOMS.west.sizeX/2, z: A.center[1] - half,
        w: (A.center[0] - A.sizeX/2) - (ROOMS.west.center[0] + ROOMS.west.sizeX/2), h: DOOR_W },
    ];
    for (const c of corridors) {
      if (c.w <= 0 || c.h <= 0) continue;
      const rect = document.createElementNS(ns, "rect");
      rect.setAttribute("x", mx(c.x));
      rect.setAttribute("y", mz(c.z));
      rect.setAttribute("width", c.w * MAP_SCALE);
      rect.setAttribute("height", c.h * MAP_SCALE);
      rect.setAttribute("fill", "#3a342a");
      mapSvg.appendChild(rect);
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
    const roomKey = cur && ROOMS[cur] ? cur : (cur || "").startsWith("door") ? null : cur;
    const r = roomKey && ROOMS[roomKey];
    if (r) mapRoomLabel.textContent = r.name.toUpperCase();
    else if (cur) mapRoomLabel.textContent = "↳ corridor";
    else mapRoomLabel.textContent = "—";

    [...mapSvg.querySelectorAll("rect[data-room]")].forEach((rect) => {
      if (rect.dataset.room === roomKey) {
        rect.setAttribute("fill-opacity", "0.78");
        rect.setAttribute("stroke-width", "2.4");
      } else {
        rect.setAttribute("fill-opacity", "0.35");
        rect.setAttribute("stroke-width", "1.2");
      }
    });
  }

  function toggleMap() {
    map.classList.toggle("collapsed");
  }

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

  window.__gallery = { scene, camera, controls, world, openPanel, closePanel, renderer };
})();
