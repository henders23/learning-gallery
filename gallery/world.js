// gallery/world.js — build the 3D scene (rooms, walls w/ doorways, artworks, signs)
// Rooms have independent sizeX and sizeZ so the layout is non-uniform.

(function () {
  const WALL_H = 5.6;          // ceiling height (a little taller for the larger rooms)
  const WALL_T = 0.3;          // wall thickness
  const DOOR_W = 4;            // doorway width
  const DOOR_H = 3.5;          // doorway opening height
  const ART_W = 2.4;
  const ART_H = 1.8;
  const ART_Y = 2.1;           // centre of artwork in metres
  const LABEL_W = 2.6;
  const LABEL_H = 0.7;
  const LABEL_Y = 0.78;

  function texFromCanvas(canvas) {
    const t = new THREE.CanvasTexture(canvas);
    t.anisotropy = 8;
    t.needsUpdate = true;
    return t;
  }
  function tiledTex(canvas, repX, repY) {
    const t = texFromCanvas(canvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repX, repY);
    return t;
  }

  // Build a thick box from a 2D segment.
  function buildWall(scene, from, to, material, height = WALL_H) {
    const dx = to[0] - from[0];
    const dz = to[1] - from[1];
    const len = Math.hypot(dx, dz);
    if (len < 0.05) return null;
    const geom = new THREE.BoxGeometry(len, height, WALL_T);
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.set((from[0] + to[0]) / 2, height / 2, (from[1] + to[1]) / 2);
    const angle = Math.atan2(dz, dx);
    mesh.rotation.y = -angle;
    mesh.userData.isWall = true;
    scene.add(mesh);
    return mesh;
  }

  // Given a room and a wall side, return segment endpoints + door cut.
  function wallSegments(room, side) {
    const [cx, cz] = room.center;
    const halfX = room.sizeX / 2;
    const halfZ = room.sizeZ / 2;
    const hasDoor = room.doors.includes(side);
    let a, b, axis;
    if (side === "N") { a = [cx - halfX, cz - halfZ]; b = [cx + halfX, cz - halfZ]; axis = "x"; }
    if (side === "S") { a = [cx - halfX, cz + halfZ]; b = [cx + halfX, cz + halfZ]; axis = "x"; }
    if (side === "E") { a = [cx + halfX, cz - halfZ]; b = [cx + halfX, cz + halfZ]; axis = "z"; }
    if (side === "W") { a = [cx - halfX, cz - halfZ]; b = [cx - halfX, cz + halfZ]; axis = "z"; }
    if (!hasDoor) return [{ from: a, to: b }];
    const doorMid = axis === "x" ? cx : cz;
    const halfD = DOOR_W / 2;
    if (axis === "x") {
      return [
        { from: a, to: [doorMid - halfD, a[1]] },
        { from: [doorMid + halfD, a[1]], to: b },
      ];
    } else {
      return [
        { from: a, to: [a[0], doorMid - halfD] },
        { from: [a[0], doorMid + halfD], to: b },
      ];
    }
  }

  function buildLintel(scene, room, side, material) {
    if (!room.doors.includes(side)) return;
    const [cx, cz] = room.center;
    const halfX = room.sizeX / 2;
    const halfZ = room.sizeZ / 2;
    const lintelH = WALL_H - DOOR_H;
    const yMid = DOOR_H + lintelH / 2;
    let pos, rotY, len;
    if (side === "N") { pos = [cx, yMid, cz - halfZ]; rotY = 0; len = DOOR_W; }
    if (side === "S") { pos = [cx, yMid, cz + halfZ]; rotY = 0; len = DOOR_W; }
    if (side === "E") { pos = [cx + halfX, yMid, cz]; rotY = Math.PI / 2; len = DOOR_W; }
    if (side === "W") { pos = [cx - halfX, yMid, cz]; rotY = Math.PI / 2; len = DOOR_W; }
    const geom = new THREE.BoxGeometry(len, lintelH, WALL_T);
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.set(...pos);
    mesh.rotation.y = rotY;
    mesh.userData.isWall = true;
    scene.add(mesh);
    return mesh;
  }

  function buildArtwork(scene, theory, room, raycastTargets) {
    const [cx, cz] = room.center;
    const halfX = room.sizeX / 2;
    const halfZ = room.sizeZ / 2;
    const side = theory.wall;
    const inset = WALL_T / 2 + 0.02;
    let pos, rotY, labelPos;
    if (room.shape === "circle") {
      const radius = Math.min(room.sizeX, room.sizeZ) / 2 - 0.12;
      const sideAngles = { N: Math.PI, E: -Math.PI / 2, S: 0, W: Math.PI / 2 };
      const base = sideAngles[side] ?? 0;
      const arcOffset = theory.t / Math.max(radius, 1);
      const a = base + arcOffset;
      const wallX = cx - Math.sin(a) * radius;
      const wallZ = cz - Math.cos(a) * radius;
      const facing = a + Math.PI;
      pos = [wallX, ART_Y, wallZ];
      labelPos = [wallX, LABEL_Y, wallZ];
      rotY = facing;
    } else if (side === "N") {
      pos      = [cx + theory.t, ART_Y,   cz - halfZ + inset]; rotY = 0;
      labelPos = [cx + theory.t, LABEL_Y, cz - halfZ + inset];
    }
    if (side === "S") {
      pos      = [cx + theory.t, ART_Y,   cz + halfZ - inset]; rotY = Math.PI;
      labelPos = [cx + theory.t, LABEL_Y, cz + halfZ - inset];
    }
    if (side === "E") {
      pos      = [cx + halfX - inset, ART_Y,   cz + theory.t]; rotY = -Math.PI / 2;
      labelPos = [cx + halfX - inset, LABEL_Y, cz + theory.t];
    }
    if (side === "W") {
      pos      = [cx - halfX + inset, ART_Y,   cz + theory.t]; rotY = Math.PI / 2;
      labelPos = [cx - halfX + inset, LABEL_Y, cz + theory.t];
    }

    // Frame
    const frameGeom = new THREE.BoxGeometry(ART_W + 0.2, ART_H + 0.2, 0.06);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e1a13, roughness: 0.7 });
    const frame = new THREE.Mesh(frameGeom, frameMat);
    frame.position.set(...pos);
    frame.rotation.y = rotY;
    scene.add(frame);

    // Artwork itself
    const artCanvas = GalleryArt.makeArtworkCanvas(theory);
    const artMat = new THREE.MeshBasicMaterial({ map: texFromCanvas(artCanvas) });
    const art = new THREE.Mesh(new THREE.PlaneGeometry(ART_W, ART_H), artMat);
    art.position.set(...pos);
    art.position.x += Math.sin(rotY) * 0.04;
    art.position.z += Math.cos(rotY) * 0.04;
    art.rotation.y = rotY;
    art.userData.theory = theory;
    scene.add(art);
    raycastTargets.push(art);

    // Label plaque (auto-fitted text)
    const labelCanvas = GalleryArt.makeLabelCanvas(theory);
    const labelMat = new THREE.MeshBasicMaterial({ map: texFromCanvas(labelCanvas) });
    const label = new THREE.Mesh(new THREE.PlaneGeometry(LABEL_W, LABEL_H), labelMat);
    label.position.set(...labelPos);
    label.position.x += Math.sin(rotY) * 0.045;
    label.position.z += Math.cos(rotY) * 0.045;
    label.rotation.y = rotY;
    label.userData.theory = theory;
    scene.add(label);
    raycastTargets.push(label);
  }

  // Doorway sign above each doorway — on the OUTER face of the wall.
  function buildDoorwaySign(scene, room, side) {
    if (!room.doors.includes(side)) return;
    const [cx, cz] = room.center;
    const halfX = room.sizeX / 2;
    const halfZ = room.sizeZ / 2;
    const sign = GalleryArt.makeRoomSignCanvas(room);
    const mat = new THREE.MeshBasicMaterial({ map: texFromCanvas(sign) });
    // Larger sign canvas (and physical) means more room for text. 4.4×1.32 keeps a
    // 3.33:1 aspect ratio matching the new canvas.
    const sw = 4.4, sh = 1.32;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), mat);
    const y = DOOR_H + 0.75;
    const out = 0.18;
    let pos, rotY;
    if (side === "N") { pos = [cx, y, cz - halfZ - out]; rotY = Math.PI; }
    if (side === "S") { pos = [cx, y, cz + halfZ + out]; rotY = 0; }
    if (side === "E") { pos = [cx + halfX + out, y, cz]; rotY = Math.PI / 2; }
    if (side === "W") { pos = [cx - halfX - out, y, cz]; rotY = -Math.PI / 2; }
    plane.position.set(...pos);
    plane.rotation.y = rotY;
    scene.add(plane);
  }

  // Arrow signposts in the atrium pointing to each wing.
  function buildAtriumArrows(scene) {
    const atrium = ROOMS.atrium;
    [
      { side: "N", text: "→  Cognitive Architecture", target: ROOMS.north },
      { side: "S", text: "→  Motivation, Humanist & Tech", target: ROOMS.south },
      { side: "E", text: "→  Memory, Practice & Taxonomies", target: ROOMS.east },
      { side: "W", text: "→  Social, Situated & EAP", target: ROOMS.west },
    ].forEach(({ side, text, target }) => {
      const c = GalleryArt.makeArrowSignCanvas(text, target.accent);
      const mat = new THREE.MeshStandardMaterial({ map: texFromCanvas(c), emissive: 0x000000 });
      // Larger physical arrow sign so the text reads from across the atrium
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.95), mat);
      const [cx, cz] = atrium.center;
      const halfX = atrium.sizeX / 2;
      const halfZ = atrium.sizeZ / 2;
      const offset = 5.0;
      let pos, rotY;
      const y = 2.5;
      if (side === "N") { pos = [cx + offset, y, cz - halfZ + 0.03]; rotY = 0; }
      if (side === "S") { pos = [cx - offset, y, cz + halfZ - 0.03]; rotY = Math.PI; }
      if (side === "E") { pos = [cx + halfX - 0.03, y, cz + offset]; rotY = -Math.PI / 2; }
      if (side === "W") { pos = [cx - halfX + 0.03, y, cz - offset]; rotY = Math.PI / 2; }
      plane.position.set(...pos);
      plane.rotation.y = rotY;
      scene.add(plane);
    });
  }

  // Return signs inside each wing pointing back to the atrium.
  function buildWingReturnSigns(scene) {
    for (const key of ["north", "south", "east", "west"]) {
      const room = ROOMS[key];
      const door = room.doors[0];
      const c = GalleryArt.makeArrowSignCanvas("↩  Atrium", "#b88c3a");
      const mat = new THREE.MeshStandardMaterial({ map: texFromCanvas(c) });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.74), mat);
      const [cx, cz] = room.center;
      const halfX = room.sizeX / 2;
      const halfZ = room.sizeZ / 2;
      const off = 3.6;
      const y = 2.4;
      let pos, rotY;
      if (door === "N") { pos = [cx - off, y, cz - halfZ + 0.03]; rotY = 0; }
      if (door === "S") { pos = [cx + off, y, cz + halfZ - 0.03]; rotY = Math.PI; }
      if (door === "E") { pos = [cx + halfX - 0.03, y, cz - off]; rotY = -Math.PI / 2; }
      if (door === "W") { pos = [cx - halfX + 0.03, y, cz + off]; rotY = Math.PI / 2; }
      plane.position.set(...pos);
      plane.rotation.y = rotY;
      scene.add(plane);
    }
  }

  function buildRoom(scene, room, raycastTargets) {
    const floorTex = tiledTex(GalleryArt.makeFloorCanvas(room), room.sizeX / 4, room.sizeZ / 4);
    const wallTexNS = tiledTex(GalleryArt.makeWallCanvas(room), room.sizeX / 4, WALL_H / 4);
    const wallTexEW = tiledTex(GalleryArt.makeWallCanvas(room), room.sizeZ / 4, WALL_H / 4);

    // Floor
    const floorGeom = room.shape === "circle"
      ? new THREE.CircleGeometry(Math.min(room.sizeX, room.sizeZ) / 2, 72)
      : new THREE.PlaneGeometry(room.sizeX, room.sizeZ);
    const floor = new THREE.Mesh(
      floorGeom,
      new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(room.center[0], 0, room.center[1]);
    scene.add(floor);

    // Ceiling (subtle warm wash)
    const ceilGeom = room.shape === "circle"
      ? new THREE.CircleGeometry(Math.min(room.sizeX, room.sizeZ) / 2, 72)
      : new THREE.PlaneGeometry(room.sizeX, room.sizeZ);
    const ceil = new THREE.Mesh(
      ceilGeom,
      new THREE.MeshStandardMaterial({ color: 0xf2ecdc, roughness: 1 })
    );
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(room.center[0], WALL_H, room.center[1]);
    scene.add(ceil);

    // Wall material — use two tilings so the texture orientation looks right
    // on both axes of a non-square room.
    const wallMatNS = new THREE.MeshStandardMaterial({ map: wallTexNS, roughness: 0.95 });
    const wallMatEW = new THREE.MeshStandardMaterial({ map: wallTexEW, roughness: 0.95 });
    if (room.shape === "circle") {
      const radius = Math.min(room.sizeX, room.sizeZ) / 2;
      const hole = DOOR_W / radius;
      const doorRanges = {
        N: [Math.PI - hole / 2, Math.PI + hole / 2],
        E: [-Math.PI / 2 - hole / 2, -Math.PI / 2 + hole / 2],
        S: [-hole / 2, hole / 2],
        W: [Math.PI / 2 - hole / 2, Math.PI / 2 + hole / 2],
      };
      const segments = 180;
      let openStart = null;
      const inDoor = (a) => room.doors.some((d) => {
        const [a0, a1] = doorRanges[d];
        return a >= a0 && a <= a1;
      });
      for (let i = 0; i <= segments; i++) {
        const a = -Math.PI + (i / segments) * (Math.PI * 2);
        const open = inDoor(a);
        if (!open && openStart === null) openStart = a;
        if ((open || i === segments) && openStart !== null) {
          const end = open ? a : a;
          const from = [room.center[0] - Math.sin(openStart) * radius, room.center[1] - Math.cos(openStart) * radius];
          const to = [room.center[0] - Math.sin(end) * radius, room.center[1] - Math.cos(end) * radius];
          buildWall(scene, from, to, wallMatNS);
          openStart = null;
        }
      }
      for (const side of room.doors) buildLintel(scene, room, side, wallMatNS);
      for (const side of room.doors) buildDoorwaySign(scene, room, side);
      return;
    }
    for (const side of ["N", "S", "E", "W"]) {
      const mat = (side === "N" || side === "S") ? wallMatNS : wallMatEW;
      const segs = wallSegments(room, side);
      for (const s of segs) buildWall(scene, s.from, s.to, mat);
      buildLintel(scene, room, side, mat);
      buildDoorwaySign(scene, room, side);
    }

    // Per-room ambient point light — strong enough to read across the room
    const ptColor = new THREE.Color(room.wall).lerp(new THREE.Color(0xfff2cc), 0.45);
    const radius = Math.max(room.sizeX, room.sizeZ) * 0.65;
    const pt = new THREE.PointLight(ptColor.getHex(), 1.2, radius, 1.6);
    pt.position.set(room.center[0], WALL_H - 0.5, room.center[1]);
    scene.add(pt);

    // A second light in larger rooms to keep far corners legible
    if (Math.max(room.sizeX, room.sizeZ) > 24) {
      const aux = new THREE.PointLight(ptColor.getHex(), 0.7, radius, 1.8);
      const ox = room.sizeX > room.sizeZ ? room.sizeX * 0.25 : 0;
      const oz = room.sizeZ > room.sizeX ? room.sizeZ * 0.25 : 0;
      aux.position.set(room.center[0] + ox, WALL_H - 0.5, room.center[1] + oz);
      scene.add(aux);

      const aux2 = new THREE.PointLight(ptColor.getHex(), 0.7, radius, 1.8);
      aux2.position.set(room.center[0] - ox, WALL_H - 0.5, room.center[1] - oz);
      scene.add(aux2);
    }
  }

  function buildAtriumPedestals(scene) {
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

    // Floating title
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

  function buildRoomFurniture(scene, room) {
    if (room === ROOMS.atrium) return;
    const [cx, cz] = room.center;
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x2a241a, roughness: 0.8 });
    // A pair of benches in larger rooms; a single bench in smaller ones
    const big = Math.max(room.sizeX, room.sizeZ) > 24;
    if (big) {
      const benchA = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.5, 0.55), benchMat);
      benchA.position.set(cx + 3, 0.25, cz);
      scene.add(benchA);
      const benchB = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.5, 0.55), benchMat);
      benchB.position.set(cx - 3, 0.25, cz);
      scene.add(benchB);
    } else {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 0.55), benchMat);
      bench.position.set(cx, 0.25, cz);
      scene.add(bench);
    }
  }

  // Walkable boxes — player is allowed in any of these AABBs.
  function walkableBoxes() {
    const boxes = [];
    const margin = 0.6;
    for (const key of Object.keys(ROOMS)) {
      const r = ROOMS[key];
      const hx = r.sizeX / 2, hz = r.sizeZ / 2;
      boxes.push({
        x0: r.center[0] - hx + margin,
        x1: r.center[0] + hx - margin,
        z0: r.center[1] - hz + margin,
        z1: r.center[1] + hz - margin,
        room: key,
        shape: r.shape || "rect",
        radius: Math.min(r.sizeX, r.sizeZ) / 2 - margin,
        cx: r.center[0],
        cz: r.center[1],
      });
    }
    // Corridors connect atrium to each wing through the doorways.
    const A = ROOMS.atrium;
    const half = DOOR_W / 2;
    const corridor = (x0, z0, x1, z1, label) => boxes.push({ x0, x1, z0, z1, room: label });

    // North corridor: from atrium top (cz - halfZ_A) to north bottom (cz_n + halfZ_n)
    {
      const ax = A.center[0];
      const az_top = A.center[1] - A.sizeZ / 2;
      const N = ROOMS.north;
      const nz_bot = N.center[1] + N.sizeZ / 2;
      corridor(ax - half - margin, nz_bot - margin,
               ax + half + margin, az_top + margin, "door-n");
    }
    // South corridor
    {
      const ax = A.center[0];
      const az_bot = A.center[1] + A.sizeZ / 2;
      const S = ROOMS.south;
      const sz_top = S.center[1] - S.sizeZ / 2;
      corridor(ax - half - margin, az_bot - margin,
               ax + half + margin, sz_top + margin, "door-s");
    }
    // East corridor
    {
      const az = A.center[1];
      const ax_right = A.center[0] + A.sizeX / 2;
      const E = ROOMS.east;
      const ex_left = E.center[0] - E.sizeX / 2;
      corridor(ax_right - margin, az - half - margin,
               ex_left + margin, az + half + margin, "door-e");
    }
    // West corridor
    {
      const az = A.center[1];
      const ax_left = A.center[0] - A.sizeX / 2;
      const W = ROOMS.west;
      const wx_right = W.center[0] + W.sizeX / 2;
      corridor(wx_right - margin, az - half - margin,
               ax_left + margin, az + half + margin, "door-w");
    }
    corridor(-9, -35, 9, -31, "door-north-archive");
    corridor(32, -4, 34, 4, "door-east-studio");
    corridor(-36, -4, -34, 4, "door-west-passage");
    return boxes;
  }

  function currentRoom(boxes, x, z) {
    for (const b of boxes) {
      if (b.shape === "circle") {
        if ((x - b.cx) ** 2 + (z - b.cz) ** 2 <= b.radius ** 2) return b.room;
      } else if (x >= b.x0 && x <= b.x1 && z >= b.z0 && z <= b.z1) return b.room;
    }
    return null;
  }

  function isWalkable(boxes, x, z) {
    return currentRoom(boxes, x, z) !== null;
  }

  function buildWorld(scene) {
    const raycastTargets = [];

    for (const key of Object.keys(ROOMS)) {
      buildRoom(scene, ROOMS[key], raycastTargets);
      buildRoomFurniture(scene, ROOMS[key]);
    }

    for (const t of THEORIES) {
      buildArtwork(scene, t, ROOMS[t.room], raycastTargets);
    }

    buildAtriumPedestals(scene);
    buildAtriumArrows(scene);
    buildWingReturnSigns(scene);

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
