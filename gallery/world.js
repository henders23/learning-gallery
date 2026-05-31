// gallery/world.js — clean procedural hub-and-spoke gallery.
// A central circular rotunda with 8 labelled doorways, each opening (via a
// short corridor) into a colour-coded themed wing. Artworks are auto-
// distributed as framed pictures along the walls.

(function () {
  const WALL_H = 4.6;          // wing ceiling height
  const ROT_WALL_H = 7.0;      // rotunda ceiling height
  const WALL_T = 0.4;          // wall thickness
  const DOOR_W = 4.5;          // doorway width
  const DOOR_H = 3.2;          // doorway opening height
  const ROT_R = 16;            // rotunda radius
  const CORRIDOR_LEN = 3;      // gap between rotunda wall and wing inner edge

  const ART_W = 2.6, ART_H = 1.85, ART_Y = 1.9;
  const FRAME_EXT = 0.24, FRAME_DEPTH = 0.16;
  const LABEL_W = 2.5, LABEL_H = 0.6;

  const WING_KEYS = ["design", "cog", "mem", "mot", "soc", "adu", "eap", "tax"];

  function texFromCanvas(canvas) {
    const t = new THREE.CanvasTexture(canvas);
    t.anisotropy = 8;
    t.needsUpdate = true;
    return t;
  }
  function tiledTex(canvas, rx, ry) {
    const t = texFromCanvas(canvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rx, ry);
    return t;
  }
  function lighten(hex, amt) {
    const c = new THREE.Color(hex);
    return c.lerp(new THREE.Color(0xffffff), amt);
  }
  function darken(hex, amt) {
    const c = new THREE.Color(hex);
    return c.lerp(new THREE.Color(0x000000), amt);
  }

  function addBox(parent, w, h, d, x, y, z, mat) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }

  // ── framed picture (built in a parent's local plane: x across, y up, +z out)
  // opts.backboard: mount on a flat panel that juts out from the wall, so a
  // curved (rotunda) wall behind can't cut across the title plaque.
  function makeFramedArt(parent, theory, accent, x, y, z, rotY, raycastTargets, opts) {
    opts = opts || {};
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = rotY;
    parent.add(g);

    // optional backing board (a flat protruding section of wall)
    if (opts.backboard) {
      const depth = opts.backboardDepth || 0.55;
      const bw = ART_W + FRAME_EXT + 0.7;
      const bh = ART_H + 1.9;
      const bbMat = new THREE.MeshStandardMaterial({ color: opts.backboardColor ?? 0xdccdb2, roughness: 0.9 });
      addBox(g, bw, bh, depth, 0, -0.45, -(FRAME_DEPTH / 2) - depth / 2, bbMat);
    }

    // outer frame (dark, high-contrast) with an accent inner lip
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x241c14, roughness: 0.55 });
    addBox(g, ART_W + FRAME_EXT, ART_H + FRAME_EXT, FRAME_DEPTH, 0, 0, 0, frameMat);
    const lipMat = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.5 });
    addBox(g, ART_W + FRAME_EXT * 0.5, ART_H + FRAME_EXT * 0.5, FRAME_DEPTH + 0.02, 0, 0, 0.005, lipMat);

    // the picture
    const artMat = new THREE.MeshBasicMaterial({ map: texFromCanvas(GalleryArt.makeArtworkCanvas(theory)) });
    const art = new THREE.Mesh(new THREE.PlaneGeometry(ART_W, ART_H), artMat);
    art.position.z = FRAME_DEPTH / 2 + 0.012;
    art.userData.theory = theory;
    art.userData.frameMat = frameMat;
    g.add(art);
    raycastTargets.push(art);

    // label plaque beneath
    const labMat = new THREE.MeshBasicMaterial({ map: texFromCanvas(GalleryArt.makeLabelCanvas(theory)) });
    const lab = new THREE.Mesh(new THREE.PlaneGeometry(LABEL_W, LABEL_H), labMat);
    lab.position.set(0, -(ART_H / 2) - 0.52, FRAME_DEPTH / 2 + 0.012);
    lab.userData.theory = theory;
    lab.userData.frameMat = frameMat;
    g.add(lab);
    raycastTargets.push(lab);

    // generous invisible click target (opacity 0 so it still raycasts)
    const hit = new THREE.Mesh(
      new THREE.BoxGeometry(ART_W + 1.0, ART_H + 1.6, 0.5),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    hit.position.set(0, -0.25, FRAME_DEPTH / 2 + 0.25);
    hit.userData.theory = theory;
    hit.userData.frameMat = frameMat;
    g.add(hit);
    raycastTargets.push(hit);
  }

  // distribute `count` points across a list of runs ({len, at(s)})
  function distribute(runs, count) {
    const total = runs.reduce((a, r) => a + r.len, 0);
    const out = [];
    if (total <= 0 || count <= 0) return out;
    for (let i = 0; i < count; i++) {
      let s = ((i + 0.5) / count) * total;
      for (const r of runs) {
        if (s <= r.len) { out.push(r.at(s)); break; }
        s -= r.len;
      }
    }
    return out;
  }

  // ── one themed wing (rectangular room) ──────────────────────────────────
  function buildWing(scene, room, theories, raycastTargets) {
    const a = (room.angle || 0) * Math.PI / 180;
    const hx = room.sizeX / 2, hz = room.sizeZ / 2;
    const h = WALL_H;

    const group = new THREE.Group();
    group.position.set(room.center[0], 0, room.center[1]);
    group.rotation.y = a;
    scene.add(group);

    const wallMat = new THREE.MeshStandardMaterial({ color: room.wall, roughness: 0.92 });
    const baseMat = new THREE.MeshStandardMaterial({ color: darken(room.accent, 0.45), roughness: 0.8 });
    const corniceMat = new THREE.MeshStandardMaterial({ color: room.accent, roughness: 0.6 });

    // floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(room.sizeX, room.sizeZ),
      new THREE.MeshStandardMaterial({
        map: tiledTex(GalleryArt.makeFloorCanvas(room), room.sizeX / 4, room.sizeZ / 4),
        roughness: 0.95,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    group.add(floor);

    // ceiling
    const ceil = new THREE.Mesh(
      new THREE.PlaneGeometry(room.sizeX, room.sizeZ),
      new THREE.MeshStandardMaterial({ color: lighten(room.wall, 0.18), roughness: 1 })
    );
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = h;
    group.add(ceil);

    // solid walls: N(z=-hz), S(z=+hz), outer E(x=+hx)
    addBox(group, room.sizeX, h, WALL_T, 0, h / 2, -hz, wallMat);
    addBox(group, room.sizeX, h, WALL_T, 0, h / 2, hz, wallMat);
    addBox(group, WALL_T, h, room.sizeZ, hx, h / 2, 0, wallMat);

    // inner wall W(x=-hx) with central doorway gap
    const segLen = (room.sizeZ - DOOR_W) / 2;
    if (segLen > 0.1) {
      addBox(group, WALL_T, h, segLen, -hx, h / 2, -(DOOR_W / 2 + segLen / 2), wallMat);
      addBox(group, WALL_T, h, segLen, -hx, h / 2, (DOOR_W / 2 + segLen / 2), wallMat);
    }
    addBox(group, WALL_T, h - DOOR_H, DOOR_W, -hx, DOOR_H + (h - DOOR_H) / 2, 0, wallMat);

    // baseboard + cornice on the three display walls (contrast + identity)
    const bb = 0.32, cc = 0.22;
    addBox(group, room.sizeX, bb, WALL_T + 0.04, 0, bb / 2, -hz, baseMat);
    addBox(group, room.sizeX, bb, WALL_T + 0.04, 0, bb / 2, hz, baseMat);
    addBox(group, WALL_T + 0.04, bb, room.sizeZ, hx, bb / 2, 0, baseMat);
    addBox(group, room.sizeX, cc, WALL_T + 0.04, 0, h - cc / 2, -hz, corniceMat);
    addBox(group, room.sizeX, cc, WALL_T + 0.04, 0, h - cc / 2, hz, corniceMat);
    addBox(group, WALL_T + 0.04, cc, room.sizeZ, hx, h - cc / 2, 0, corniceMat);

    // room "guidebook page" panel, centred on the outer wall facing the door —
    // the first thing seen on entering, to aid navigation
    const SUM_W = 3.7, SUM_H = SUM_W * (820 / 1100);
    const sumGroup = new THREE.Group();
    sumGroup.position.set(hx - WALL_T / 2 - 0.05, 1.0 + SUM_H / 2, 0);
    sumGroup.rotation.y = -Math.PI / 2;
    group.add(sumGroup);
    addBox(sumGroup, SUM_W + 0.34, SUM_H + 0.34, 0.14, 0, 0, 0,
      new THREE.MeshStandardMaterial({ color: 0x241c14, roughness: 0.55 }));
    const sumPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(SUM_W, SUM_H),
      new THREE.MeshBasicMaterial({ map: texFromCanvas(GalleryArt.makeRoomSummaryCanvas(room, theories)) })
    );
    sumPanel.position.z = 0.08;
    sumGroup.add(sumPanel);

    // distribute artworks evenly along the two long side walls
    const m = 1.3, inset = WALL_T / 2 + 0.06;
    const runs = [
      { len: room.sizeX - 2 * m, at: (s) => ({ x: -hx + m + s, z: -hz + inset, ry: 0 }) },
      { len: room.sizeX - 2 * m, at: (s) => ({ x: hx - m - s, z: hz - inset, ry: Math.PI }) },
    ];
    const slots = distribute(runs, theories.length);
    theories.forEach((t, i) => {
      const p = slots[i];
      if (p) makeFramedArt(group, t, room.accent, p.x, ART_Y, p.z, p.ry, raycastTargets);
    });

    // wing light
    const lightColor = lighten(room.accent, 0.55).getHex();
    const pt = new THREE.PointLight(lightColor, 0.9, room.sizeX * 1.4, 1.6);
    pt.position.set(0, h - 0.6, 0);
    group.add(pt);
  }

  // ── rotunda hub (circular) ──────────────────────────────────────────────
  function buildRotunda(scene, room, theories, raycastTargets) {
    const h = ROT_WALL_H;
    const wallMat = new THREE.MeshStandardMaterial({ color: room.wall, roughness: 0.92 });
    const baseMat = new THREE.MeshStandardMaterial({ color: darken(room.accent, 0.4), roughness: 0.8 });

    // floor
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(ROT_R, 80),
      new THREE.MeshStandardMaterial({
        map: tiledTex(GalleryArt.makeFloorCanvas(room), ROT_R / 3, ROT_R / 3),
        roughness: 0.95,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // ceiling with an emissive skylight ring
    const ceil = new THREE.Mesh(
      new THREE.CircleGeometry(ROT_R, 80),
      new THREE.MeshStandardMaterial({ color: lighten(room.wall, 0.12), roughness: 1 })
    );
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = h;
    scene.add(ceil);
    const sky = new THREE.Mesh(
      new THREE.RingGeometry(4.5, 7.5, 64),
      new THREE.MeshBasicMaterial({ color: 0xfff6e2, side: THREE.DoubleSide })
    );
    sky.rotation.x = Math.PI / 2;
    sky.position.y = h - 0.05;
    scene.add(sky);

    // door zones at the 8 wing angles
    const halfDoorA = Math.asin((DOOR_W / 2) / ROT_R) + 0.05;
    const doorAngles = WING_KEYS.map((k) => (ROOMS[k].angle || 0) * Math.PI / 180);
    const inDoor = (b) => doorAngles.some((d) => {
      let diff = Math.abs(((b - d + Math.PI) % (2 * Math.PI)) - Math.PI);
      return diff <= halfDoorA;
    });

    // circular wall built as short segments, skipping door zones
    const segs = 160;
    for (let i = 0; i < segs; i++) {
      const b0 = (i / segs) * Math.PI * 2;
      const b1 = ((i + 1) / segs) * Math.PI * 2;
      const bm = (b0 + b1) / 2;
      if (inDoor(bm)) continue;
      const p0 = [ROT_R * Math.cos(b0), -ROT_R * Math.sin(b0)];
      const p1 = [ROT_R * Math.cos(b1), -ROT_R * Math.sin(b1)];
      const dx = p1[0] - p0[0], dz = p1[1] - p0[1];
      const len = Math.hypot(dx, dz) + 0.02;
      const seg = addBox(scene, len, h, WALL_T, (p0[0] + p1[0]) / 2, h / 2, (p0[1] + p1[1]) / 2, wallMat);
      seg.rotation.y = -Math.atan2(dz, dx);
      // baseboard piece
      const bb = addBox(scene, len, 0.34, WALL_T + 0.04, (p0[0] + p1[0]) / 2, 0.17, (p0[1] + p1[1]) / 2, baseMat);
      bb.rotation.y = -Math.atan2(dz, dx);
    }

    // door lintels + portals + labels
    for (const key of WING_KEYS) {
      buildDoorPortal(scene, ROOMS[key], h);
    }

    // distribute the rotunda theories in the gaps between doors
    const runs = [];
    const sorted = doorAngles.slice().sort((a, b) => a - b);
    for (let i = 0; i < sorted.length; i++) {
      const start = sorted[i] + halfDoorA;
      const end = sorted[(i + 1) % sorted.length] + (i + 1 === sorted.length ? 2 * Math.PI : 0) - halfDoorA;
      const arc = end - start;
      if (arc <= 0) continue;
      const len = arc * ROT_R;
      runs.push({
        len,
        at: (s) => {
          const b = start + s / ROT_R;
          const r = ROT_R - 0.35; // sit proud of the curved wall (see backboard below)
          return { x: r * Math.cos(b), z: -r * Math.sin(b), ry: b - Math.PI / 2 };
        },
      });
    }
    const slots = distribute(runs, theories.length);
    theories.forEach((t, i) => {
      const p = slots[i];
      if (p) makeFramedArt(scene, t, room.accent, p.x, ART_Y, p.z, p.ry, raycastTargets,
        { backboard: true, backboardColor: room.wall, backboardDepth: 0.6 });
    });

    // bright central light
    const dome = new THREE.PointLight(0xfff3da, 1.4, 70, 1.2);
    dome.position.set(0, h - 0.6, 0);
    scene.add(dome);
  }

  // dark portal frame + name sign at a rotunda doorway, facing inward
  function buildDoorPortal(scene, wing, h) {
    const b = (wing.angle || 0) * Math.PI / 180;
    const g = new THREE.Group();
    g.position.set(ROT_R * Math.cos(b), 0, -ROT_R * Math.sin(b));
    g.rotation.y = b - Math.PI / 2; // local x → wall tangent, +z → inward
    scene.add(g);

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1c1812, roughness: 0.6 });
    const accentMat = new THREE.MeshStandardMaterial({ color: wing.accent, roughness: 0.5 });
    const postW = 0.5;
    // posts
    addBox(g, postW, DOOR_H + 0.3, WALL_T + 0.5, -(DOOR_W / 2 + postW / 2), (DOOR_H + 0.3) / 2, 0, frameMat);
    addBox(g, postW, DOOR_H + 0.3, WALL_T + 0.5, (DOOR_W / 2 + postW / 2), (DOOR_H + 0.3) / 2, 0, frameMat);
    // lintel
    addBox(g, DOOR_W + postW * 2, 0.55, WALL_T + 0.5, 0, DOOR_H + 0.3 + 0.275, 0, frameMat);
    // accent stripe over the lintel
    addBox(g, DOOR_W + postW * 2, 0.12, WALL_T + 0.52, 0, DOOR_H + 0.3 + 0.62, 0, accentMat);

    // name sign above, facing into the rotunda (+z)
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(4.6, 1.38),
      new THREE.MeshBasicMaterial({ map: texFromCanvas(GalleryArt.makeRoomSignCanvas(wing)) })
    );
    sign.position.set(0, DOOR_H + 1.55, WALL_T / 2 + 0.28);
    g.add(sign);
  }

  // ── corridor linking a rotunda doorway to its wing ──────────────────────
  function buildCorridor(scene, wing) {
    const b = (wing.angle || 0) * Math.PI / 180;
    const midR = ROT_R + CORRIDOR_LEN / 2;
    const g = new THREE.Group();
    g.position.set(midR * Math.cos(b), 0, -midR * Math.sin(b));
    g.rotation.y = b; // local +x → outward (radial), +z → lateral
    scene.add(g);

    const wallMat = new THREE.MeshStandardMaterial({ color: lighten(wing.wall, 0.04), roughness: 0.92 });
    const len = CORRIDOR_LEN + 1.2; // overlap rotunda & wing slightly
    const h = DOOR_H + 0.4;
    addBox(g, len, h, WALL_T, 0, h / 2, -(DOOR_W / 2), wallMat);
    addBox(g, len, h, WALL_T, 0, h / 2, DOOR_W / 2, wallMat);
    // floor + ceiling
    const fl = new THREE.Mesh(
      new THREE.PlaneGeometry(len, DOOR_W),
      new THREE.MeshStandardMaterial({ color: "#c4bdac", roughness: 0.95 })
    );
    fl.rotation.x = -Math.PI / 2;
    fl.position.y = 0.005;
    g.add(fl);
    const cl = new THREE.Mesh(
      new THREE.PlaneGeometry(len, DOOR_W),
      new THREE.MeshStandardMaterial({ color: lighten(wing.wall, 0.1), roughness: 1 })
    );
    cl.rotation.x = Math.PI / 2;
    cl.position.y = h;
    g.add(cl);
  }

  // ── central pedestal + slowly-rotating title ────────────────────────────
  function buildCenterPedestal(scene) {
    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(1.3, 1.5, 0.95, 36),
      new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.6 })
    );
    plinth.position.set(0, 0.475, 0);
    scene.add(plinth);
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(1.45, 1.3, 0.07, 36),
      new THREE.MeshStandardMaterial({ color: 0x8a6a2c, roughness: 0.4, metalness: 0.4 })
    );
    cap.position.set(0, 0.98, 0);
    scene.add(cap);

    const c = document.createElement("canvas");
    c.width = 1024; c.height = 384;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 1024, 384);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#1e1a13";
    ctx.font = "600 92px Georgia, serif";
    ctx.fillText("THE LEARNING", 512, 120);
    ctx.fillText("GALLERY", 512, 216);
    ctx.fillStyle = "#7a6a4c";
    ctx.font = "italic 34px Georgia, serif";
    ctx.fillText("press  G  for the guidebook", 512, 312);
    const titleMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true });
    const titleGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 0.86), titleMat);
      plane.position.set(Math.sin((i * Math.PI) / 2) * 0.95, 1.62, Math.cos((i * Math.PI) / 2) * 0.95);
      plane.rotation.y = (i * Math.PI) / 2;
      titleGroup.add(plane);
    }
    scene.add(titleGroup);
    scene.userData.titleGroup = titleGroup;
  }

  // ── walkable areas ──────────────────────────────────────────────────────
  function walkableBoxes() {
    const boxes = [];
    const margin = 0.55;

    boxes.push({
      shape: "circle", room: "atrium",
      cx: 0, cz: 0, radius: ROT_R - margin,
    });

    for (const key of WING_KEYS) {
      const r = ROOMS[key];
      const a = (r.angle || 0) * Math.PI / 180;
      boxes.push({
        shape: "rotated-rect", room: key,
        cx: r.center[0], cz: r.center[1],
        halfX: r.sizeX / 2 - margin, halfZ: r.sizeZ / 2 - margin,
        cosA: Math.cos(a), sinA: Math.sin(a),
      });
      // corridor (overlaps rotunda + wing inner edge for smooth passage)
      const innerR = ROT_R - 1.5;
      const outerR = Math.hypot(r.center[0], r.center[1]) - r.sizeX / 2 + 1.5;
      const midR = (innerR + outerR) / 2;
      boxes.push({
        shape: "rotated-rect", room: "corridor-" + key,
        cx: midR * Math.cos(a), cz: -midR * Math.sin(a),
        halfX: (outerR - innerR) / 2, halfZ: DOOR_W / 2 - 0.35,
        cosA: Math.cos(a), sinA: Math.sin(a),
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
      }
    }
    return null;
  }
  function isWalkable(boxes, x, z) {
    return currentRoom(boxes, x, z) !== null;
  }

  // ── main entry ──────────────────────────────────────────────────────────
  function buildWorld(scene) {
    const raycastTargets = [];

    const byRoom = {};
    for (const t of THEORIES) (byRoom[t.room] ||= []).push(t);

    buildRotunda(scene, ROOMS.atrium, byRoom.atrium || [], raycastTargets);
    buildCenterPedestal(scene);

    for (const key of WING_KEYS) {
      buildCorridor(scene, ROOMS[key]);
      buildWing(scene, ROOMS[key], byRoom[key] || [], raycastTargets);
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
