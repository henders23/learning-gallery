// gallery/world.js — load cathedral GLB + place artworks in 8 radial wings

(function () {
  const WALL_H = 5.6;
  const WALL_T = 0.3;
  const DOOR_W = 4;
  const ART_W = 2.4;
  const ART_H = 1.8;
  const ART_Y = 2.1;
  const LABEL_W = 2.6;
  const LABEL_H = 0.7;
  const LABEL_Y = 0.78;

  function texFromCanvas(canvas) {
    const t = new THREE.CanvasTexture(canvas);
    t.anisotropy = 8;
    t.needsUpdate = true;
    return t;
  }

  // ── coordinate transforms for rotated wings ──────────────────────────────
  // angle α: 0°=East(+X), 45°=NE, 90°=North(-Z), etc.
  // Forward: local → world
  function localToWorld(room, lx, lz) {
    const a = (room.angle || 0) * Math.PI / 180;
    const c = Math.cos(a), s = Math.sin(a);
    return [
      room.center[0] + lx * c + lz * s,
      room.center[1] + (-lx * s + lz * c)
    ];
  }
  // Inverse: world → local
  function worldToLocal(room, wx, wz) {
    const a = (room.angle || 0) * Math.PI / 180;
    const c = Math.cos(a), s = Math.sin(a);
    const dx = wx - room.center[0], dz = wz - room.center[1];
    return [dx * c - dz * s, dx * s + dz * c];
  }

  // ── artwork placement ────────────────────────────────────────────────────
  function buildArtwork(scene, theory, room, raycastTargets) {
    const halfX = room.sizeX / 2;
    const halfZ = room.sizeZ / 2;
    const side = theory.wall;
    const inset = WALL_T / 2 + 0.02;
    let lx, lz, localRotY;

    if (room.shape === "circle") {
      const radius = Math.min(room.sizeX, room.sizeZ) / 2 - 0.12;
      const sideAngles = { N: Math.PI, E: -Math.PI / 2, S: 0, W: Math.PI / 2 };
      const base = sideAngles[side] ?? 0;
      const arcOffset = theory.t / Math.max(radius, 1);
      const a = base + arcOffset;
      const wallX = -Math.sin(a) * radius;
      const wallZ = -Math.cos(a) * radius;
      const facing = a + Math.PI;

      const wx = room.center[0] + wallX;
      const wz = room.center[1] + wallZ;
      placeArt(scene, theory, wx, wz, facing, raycastTargets);
      return;
    }

    if (side === "N") { lx = theory.t; lz = -halfZ + inset; localRotY = 0; }
    if (side === "S") { lx = theory.t; lz = halfZ - inset; localRotY = Math.PI; }
    if (side === "E") { lz = theory.t; lx = halfX - inset; localRotY = -Math.PI / 2; }
    if (side === "W") { lz = theory.t; lx = -halfX + inset; localRotY = Math.PI / 2; }

    const [wx, wz] = localToWorld(room, lx, lz);
    const worldRotY = localRotY + (room.angle || 0) * Math.PI / 180;
    placeArt(scene, theory, wx, wz, worldRotY, raycastTargets);
  }

  function placeArt(scene, theory, wx, wz, rotY, raycastTargets) {
    // Frame
    const frameGeom = new THREE.BoxGeometry(ART_W + 0.2, ART_H + 0.2, 0.06);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e1a13, roughness: 0.7 });
    const frame = new THREE.Mesh(frameGeom, frameMat);
    frame.position.set(wx, ART_Y, wz);
    frame.rotation.y = rotY;
    scene.add(frame);

    // Artwork canvas
    const artCanvas = GalleryArt.makeArtworkCanvas(theory);
    const artMat = new THREE.MeshBasicMaterial({ map: texFromCanvas(artCanvas) });
    const art = new THREE.Mesh(new THREE.PlaneGeometry(ART_W, ART_H), artMat);
    art.position.set(wx, ART_Y, wz);
    art.position.x += Math.sin(rotY) * 0.04;
    art.position.z += Math.cos(rotY) * 0.04;
    art.rotation.y = rotY;
    art.userData.theory = theory;
    scene.add(art);
    raycastTargets.push(art);

    // Label plaque
    const labelCanvas = GalleryArt.makeLabelCanvas(theory);
    const labelMat = new THREE.MeshBasicMaterial({ map: texFromCanvas(labelCanvas) });
    const label = new THREE.Mesh(new THREE.PlaneGeometry(LABEL_W, LABEL_H), labelMat);
    label.position.set(wx, LABEL_Y, wz);
    label.position.x += Math.sin(rotY) * 0.045;
    label.position.z += Math.cos(rotY) * 0.045;
    label.rotation.y = rotY;
    label.userData.theory = theory;
    scene.add(label);
    raycastTargets.push(label);
  }

  // ── wing entrance signs ──────────────────────────────────────────────────
  function buildWingEntranceSigns(scene) {
    for (const key of Object.keys(ROOMS)) {
      if (key === "atrium") continue;
      const room = ROOMS[key];
      const a = (room.angle || 0) * Math.PI / 180;
      const signDist = 15;
      const sx = signDist * Math.cos(a);
      const sz = -signDist * Math.sin(a);
      const sign = GalleryArt.makeRoomSignCanvas(room);
      const mat = new THREE.MeshBasicMaterial({ map: texFromCanvas(sign) });
      const sw = 4.4, sh = 1.32;
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), mat);
      plane.position.set(sx, 4.0, sz);
      plane.rotation.y = a + Math.PI;
      scene.add(plane);

      // Return sign inside the wing pointing back
      const retDist = room.sizeX * 0.3 + 18;
      const [rx, rz] = localToWorld(room, -room.sizeX * 0.3, -3);
      const retCanvas = GalleryArt.makeArrowSignCanvas("↩  Central Dome", "#b88c3a");
      const retMat = new THREE.MeshStandardMaterial({ map: texFromCanvas(retCanvas) });
      const retPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.74), retMat);
      retPlane.position.set(rx, 2.4, rz);
      retPlane.rotation.y = a + Math.PI;
      scene.add(retPlane);
    }
  }

  // ── arrow signs in the atrium ────────────────────────────────────────────
  function buildAtriumArrows(scene) {
    for (const key of Object.keys(ROOMS)) {
      if (key === "atrium") continue;
      const room = ROOMS[key];
      const a = (room.angle || 0) * Math.PI / 180;
      const dist = 11;
      const ax = dist * Math.cos(a);
      const az = -dist * Math.sin(a);
      const text = "→  " + room.name;
      const c = GalleryArt.makeArrowSignCanvas(text, room.accent);
      const mat = new THREE.MeshStandardMaterial({ map: texFromCanvas(c), emissive: 0x000000 });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.95), mat);
      plane.position.set(ax, 2.5, az);
      plane.rotation.y = a;
      scene.add(plane);
    }
  }

  // ── central pedestal ─────────────────────────────────────────────────────
  function buildCenterPedestal(scene) {
    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(1.3, 1.45, 0.9, 32),
      new THREE.MeshStandardMaterial({ color: 0x2a241a, roughness: 0.6 })
    );
    plinth.position.set(0, 0.45, 0);
    scene.add(plinth);
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.3, 0.06, 32),
      new THREE.MeshStandardMaterial({ color: 0x8a6a2c, roughness: 0.4, metalness: 0.4 })
    );
    cap.position.set(0, 0.93, 0);
    scene.add(cap);

    const c = document.createElement("canvas");
    c.width = 1280; c.height = 320;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 1280, 320);
    ctx.fillStyle = "#1e1a13";
    ctx.font = "600 110px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("THE  LEARNING  GALLERY", 640, 130);
    ctx.fillStyle = "#7a6a4c";
    ctx.font = "italic 40px Georgia, serif";
    ctx.fillText("a walkable atlas of theories of learning", 640, 240);
    const t = new THREE.CanvasTexture(c);
    const titleMat = new THREE.MeshBasicMaterial({ map: t, transparent: true });
    const titleGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 1.13), titleMat);
      plane.position.set(0, 1.9, 0);
      plane.rotation.y = (i * Math.PI) / 2;
      plane.position.x = Math.sin((i * Math.PI) / 2) * 1.3;
      plane.position.z = Math.cos((i * Math.PI) / 2) * 1.3;
      titleGroup.add(plane);
    }
    scene.add(titleGroup);
    scene.userData.titleGroup = titleGroup;
  }

  // ── lighting for the cathedral ───────────────────────────────────────────
  function buildLighting(scene) {
    // Sunlight through the dome
    const sun = new THREE.DirectionalLight(0xfff5e0, 0.6);
    sun.position.set(0, 30, 0);
    scene.add(sun);

    // Central dome glow
    const dome = new THREE.PointLight(0xfff2cc, 1.2, 60, 1.2);
    dome.position.set(0, WALL_H + 4, 0);
    scene.add(dome);

    // Wing lights
    for (const key of Object.keys(ROOMS)) {
      if (key === "atrium") continue;
      const room = ROOMS[key];
      const a = (room.angle || 0) * Math.PI / 180;
      const dist = 28;
      const lx = dist * Math.cos(a);
      const lz = -dist * Math.sin(a);
      const ptColor = new THREE.Color(room.wall).lerp(new THREE.Color(0xfff2cc), 0.45);
      const radius = Math.max(room.sizeX, room.sizeZ) * 0.65;
      const pt = new THREE.PointLight(ptColor.getHex(), 1.0, radius, 1.6);
      pt.position.set(lx, WALL_H - 0.5, lz);
      scene.add(pt);

      if (Math.max(room.sizeX, room.sizeZ) > 20) {
        const farDist = 38;
        const pt2 = new THREE.PointLight(ptColor.getHex(), 0.7, radius, 1.8);
        pt2.position.set(farDist * Math.cos(a), WALL_H - 0.5, -farDist * Math.sin(a));
        scene.add(pt2);
      }
    }
  }

  // ── fallback floors (if GLB fails to load) ──────────────────────────────
  function buildFallbackFloors(scene) {
    for (const key of Object.keys(ROOMS)) {
      const r = ROOMS[key];
      const a = (r.angle || 0) * Math.PI / 180;
      let floorGeom;
      if (r.shape === "circle") {
        floorGeom = new THREE.CircleGeometry(Math.min(r.sizeX, r.sizeZ) / 2, 72);
      } else {
        floorGeom = new THREE.PlaneGeometry(r.sizeX, r.sizeZ);
      }
      const floor = new THREE.Mesh(
        floorGeom,
        new THREE.MeshStandardMaterial({ color: r.floor, roughness: 0.9 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.rotation.z = a;
      floor.position.set(r.center[0], 0, r.center[1]);
      scene.add(floor);
    }
    // Path floors connecting atrium to wings
    for (const key of Object.keys(ROOMS)) {
      if (key === "atrium") continue;
      const room = ROOMS[key];
      const a = (room.angle || 0) * Math.PI / 180;
      const pathLen = 20;
      const pathGeom = new THREE.PlaneGeometry(pathLen, DOOR_W);
      const path = new THREE.Mesh(
        pathGeom,
        new THREE.MeshStandardMaterial({ color: "#c8b890", roughness: 0.85 })
      );
      path.rotation.x = -Math.PI / 2;
      path.rotation.z = a;
      const mid = 14;
      path.position.set(mid * Math.cos(a), 0.01, -mid * Math.sin(a));
      scene.add(path);
    }
  }

  // ── load cathedral GLB ───────────────────────────────────────────────────
  function loadCathedral(scene) {
    if (typeof THREE.GLTFLoader === "undefined") {
      console.warn("GLTFLoader not available, using fallback");
      buildFallbackFloors(scene);
      return;
    }
    const loader = new THREE.GLTFLoader();
    loader.load(
      "gallery/cathedral.glb",
      function (gltf) {
        const model = gltf.scene;
        // Hide text and built-in art nodes to avoid clashing with our artworks
        model.traverse(function (child) {
          if (child.name && (child.name.startsWith("Text.") || child.name.startsWith("Text_"))) {
            child.visible = false;
          }
        });
        scene.add(model);
      },
      undefined,
      function (err) {
        console.warn("GLB load failed, using fallback:", err);
        buildFallbackFloors(scene);
      }
    );
  }

  // ── walkable areas ───────────────────────────────────────────────────────
  function walkableBoxes() {
    const boxes = [];
    const margin = 0.6;

    for (const key of Object.keys(ROOMS)) {
      const r = ROOMS[key];
      if (r.shape === "circle") {
        boxes.push({
          shape: "circle",
          cx: r.center[0], cz: r.center[1],
          radius: Math.min(r.sizeX, r.sizeZ) / 2 - margin,
          room: key
        });
      } else {
        const a = (r.angle || 0) * Math.PI / 180;
        boxes.push({
          shape: "rotated-rect",
          cx: r.center[0], cz: r.center[1],
          halfX: r.sizeX / 2 - margin,
          halfZ: r.sizeZ / 2 - margin,
          cosA: Math.cos(a), sinA: Math.sin(a),
          room: key
        });
      }
    }

    // Corridors from atrium to each wing (narrow paths at each angle)
    for (const key of Object.keys(ROOMS)) {
      if (key === "atrium") continue;
      const room = ROOMS[key];
      const a = (room.angle || 0) * Math.PI / 180;
      const cosA = Math.cos(a), sinA = Math.sin(a);

      // Corridor from atrium edge to wing entrance
      const innerR = 14;
      const outerR = room.sizeX > 0 ? Math.sqrt(
        Math.pow(room.center[0], 2) + Math.pow(room.center[1], 2)
      ) - room.sizeX / 2 : 18;
      const midR = (innerR + outerR) / 2;
      const halfLen = (outerR - innerR) / 2 + margin;
      const halfWid = DOOR_W / 2 + margin;
      boxes.push({
        shape: "rotated-rect",
        cx: midR * cosA, cz: -midR * sinA,
        halfX: halfLen, halfZ: halfWid,
        cosA, sinA,
        room: "corridor-" + key
      });
    }

    return boxes;
  }

  function currentRoom(boxes, x, z) {
    for (const b of boxes) {
      if (b.shape === "circle") {
        if ((x - b.cx) ** 2 + (z - b.cz) ** 2 <= b.radius ** 2) return b.room;
      } else if (b.shape === "rotated-rect") {
        const dx = x - b.cx, dz = z - b.cz;
        const localX = dx * b.cosA - dz * b.sinA;
        const localZ = dx * b.sinA + dz * b.cosA;
        if (Math.abs(localX) <= b.halfX && Math.abs(localZ) <= b.halfZ) return b.room;
      } else {
        if (x >= b.x0 && x <= b.x1 && z >= b.z0 && z <= b.z1) return b.room;
      }
    }
    return null;
  }

  function isWalkable(boxes, x, z) {
    return currentRoom(boxes, x, z) !== null;
  }

  // ── main entry ───────────────────────────────────────────────────────────
  function buildWorld(scene) {
    const raycastTargets = [];

    loadCathedral(scene);
    buildLighting(scene);
    buildCenterPedestal(scene);
    buildAtriumArrows(scene);
    buildWingEntranceSigns(scene);

    for (const t of THEORIES) {
      buildArtwork(scene, t, ROOMS[t.room], raycastTargets);
    }

    return {
      raycastTargets,
      boxes: walkableBoxes(),
      currentRoom,
      isWalkable,
    };
  }

  window.GalleryWorld = {
    buildWorld,
    WALL_H,
    DOOR_W,
  };
})();
