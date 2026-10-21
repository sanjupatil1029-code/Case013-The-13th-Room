// CASE 013: THE 13TH ROOM - 2-Story Rajasthani Haveli with 13 Distinct Rooms
// Features: Enhanced Bright Illumination, Grand Central Staircase with Smooth Ramp,
// Glowing Detective Evidence Beacons, Magic-Sealed 13th Room with Floating Tantric Runes,
// Ornate Rajasthani Infrastructure (Jharokhas, Scalloped Arches, Chandeliers, Toshakhana)

import * as THREE from 'three';

export class HaveliScene {
  constructor(containerEl, onInteraction, onPlayerMove) {
    this.container = containerEl;
    this.onInteraction = onInteraction;
    this.onPlayerMove = onPlayerMove;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Player State & Movement
    this.player = {
      position: new THREE.Vector3(0, 0, 18.0), // Starts at Room 1: Grand Entrance Pol
      floorY: 0.0,
      currentFloor: 0, // 0 = Ground Floor, 1 = Second Floor
      speed: 5.2,
      bobTimer: 0,
      lanternOn: true,
      lanternIntensity: 1.0,
      isNear13thWall: false,
      isRoom13Open: false,
      currentRoomKey: 'room_01'
    };

    // Camera Look Controls
    this.yaw = Math.PI; // Face North into the haveli
    this.pitch = 0;
    this.keys = {};
    this.isPointerLocked = false;

    // Interactive objects & Visuals
    this.interactables = [];
    this.evidenceBeacons = [];
    this.hoveredObject = null;
    this.mashaals = [];
    this.chandeliers = [];
    this.magicRunes = [];
    this.magicBarrierMesh = null;
    this.mandalaDecal = null;

    // Animation & Clocks
    this.lastTime = performance.now();
    this.pendulumAngle = 0;
    this.grandfatherClockPendulum = null;

    this.init();
  }

  init() {
    // 1. Scene Setup & Light Atmospheric Fog (Thinned for crystal-clear visibility)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0e0c0a);
    this.scene.fog = new THREE.FogExp2(0x15120e, 0.011);

    // 2. Camera Setup
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(68, aspect, 0.1, 80);
    this.camera.position.set(this.player.position.x, 1.6, this.player.position.z);
    this.scene.add(this.camera);

    // 3. Renderer Setup with graceful WebGL fallback
    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false
      });
    } catch (err) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: false,
        failIfMajorPerformanceCaveat: false
      });
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    try {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
    } catch (e) {}
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15; // Enhanced exposure for bright viewing

    if (this.container) {
      this.container.appendChild(this.renderer.domElement);
    }

    // 4. Bright Ambient & Interior Bounce Lighting (Substantially Brightened)
    const ambientLight = new THREE.AmbientLight(0x40362c, 1.8);
    this.scene.add(ambientLight);

    // Overhead Golden Moonlight Wash
    const moonLight = new THREE.DirectionalLight(0x708099, 0.85);
    moonLight.position.set(5, 25, 10);
    this.scene.add(moonLight);

    // 5. Player High-Beam Kerosene Lantern (Wide bright coverage)
    this.lanternLight = new THREE.PointLight(0xffbe55, 3.6, 18.0, 1.5);
    this.lanternLight.position.set(0, 1.4, 18.0);
    this.scene.add(this.lanternLight);

    // 6. Build Materials & Procedural Textures
    this.mats = this.generateFolkTextures();

    // 7. Build Full 2-Story 13-Room Haveli
    this.buildThirteenRoomHaveli();

    // 8. Event Listeners
    this.bindEvents();

    // 9. Start Render Loop
    this.render();
  }

  // =========================================================
  // PROCEDURAL FOLK TEXTURES & MATERIALS
  // =========================================================
  generateFolkTextures() {
    // Wall Texture: Aged lime plaster (Chuna) with moisture seelan & mold
    const wallCanvas = document.createElement('canvas');
    wallCanvas.width = 1024;
    wallCanvas.height = 1024;
    const wCtx = wallCanvas.getContext('2d');
    wCtx.fillStyle = '#847668';
    wCtx.fillRect(0, 0, 1024, 1024);

    // Stucco grain
    for (let i = 0; i < 6000; i++) {
      const alpha = Math.random() * 0.12;
      const gray = Math.floor(Math.random() * 80 + 110);
      wCtx.fillStyle = `rgba(${gray}, ${gray - 10}, ${gray - 18}, ${alpha})`;
      wCtx.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
    }

    // Seelan dampness tide-lines
    const seelan = wCtx.createLinearGradient(0, 1024, 0, 600);
    seelan.addColorStop(0, 'rgba(28, 22, 16, 0.88)');
    seelan.addColorStop(0.5, 'rgba(55, 46, 34, 0.55)');
    seelan.addColorStop(1, 'rgba(132, 118, 104, 0)');
    wCtx.fillStyle = seelan;
    wCtx.fillRect(0, 600, 1024, 424);

    const wallTex = new THREE.CanvasTexture(wallCanvas);
    wallTex.wrapS = THREE.RepeatWrapping;
    wallTex.wrapT = THREE.RepeatWrapping;
    wallTex.repeat.set(2, 1);

    // Floor Texture: Broken red oxide & terracotta flagstones
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;
    const fCtx = floorCanvas.getContext('2d');
    fCtx.fillStyle = '#52281b';
    fCtx.fillRect(0, 0, 1024, 1024);

    const tileSize = 128;
    for (let x = 0; x < 1024; x += tileSize) {
      for (let y = 0; y < 1024; y += tileSize) {
        const shade = Math.floor((Math.random() - 0.5) * 35);
        fCtx.fillStyle = `rgb(${78 + shade}, ${38 + Math.floor(shade * 0.5)}, ${26 + Math.floor(shade * 0.3)})`;
        fCtx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
        fCtx.fillStyle = 'rgba(18, 10, 6, 0.9)';
        fCtx.strokeRect(x, y, tileSize, tileSize);
      }
    }

    const floorTex = new THREE.CanvasTexture(floorCanvas);
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(4, 4);

    // Ceiling Texture: Heavy dark timber rafters (Kadi-chhat)
    const ceilCanvas = document.createElement('canvas');
    ceilCanvas.width = 512;
    ceilCanvas.height = 512;
    const cCtx = ceilCanvas.getContext('2d');
    cCtx.fillStyle = '#3a2e22';
    cCtx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 48) {
      cCtx.fillStyle = '#221810';
      cCtx.fillRect(0, y, 512, 16);
      cCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      cCtx.fillRect(0, y + 16, 512, 4);
    }
    const ceilTex = new THREE.CanvasTexture(ceilCanvas);
    ceilTex.wrapS = THREE.RepeatWrapping;
    ceilTex.wrapT = THREE.RepeatWrapping;
    ceilTex.repeat.set(3, 3);

    // Persian Carpet Texture: Deep maroon with gold floral border
    const carpetCanvas = document.createElement('canvas');
    carpetCanvas.width = 512;
    carpetCanvas.height = 512;
    const cpCtx = carpetCanvas.getContext('2d');
    cpCtx.fillStyle = '#6b1724';
    cpCtx.fillRect(0, 0, 512, 512);
    // Gold ornamental border
    cpCtx.strokeStyle = '#d4af37';
    cpCtx.lineWidth = 14;
    cpCtx.strokeRect(16, 16, 480, 480);
    cpCtx.strokeStyle = '#3d0a12';
    cpCtx.lineWidth = 6;
    cpCtx.strokeRect(32, 32, 448, 448);
    // Center medallion
    cpCtx.fillStyle = '#d4af37';
    cpCtx.beginPath();
    cpCtx.arc(256, 256, 60, 0, Math.PI * 2);
    cpCtx.fill();
    cpCtx.fillStyle = '#8b1c2e';
    cpCtx.beginPath();
    cpCtx.arc(256, 256, 45, 0, Math.PI * 2);
    cpCtx.fill();

    const carpetTex = new THREE.CanvasTexture(carpetCanvas);
    carpetTex.wrapS = THREE.RepeatWrapping;
    carpetTex.wrapT = THREE.RepeatWrapping;

    return {
      dampWall: new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.85, metalness: 0.05 }),
      brokenFloor: new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.55, metalness: 0.15 }),
      rafterCeiling: new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.85 }),
      sandstone: new THREE.MeshStandardMaterial({ color: 0xb38d64, roughness: 0.88, metalness: 0.05 }),
      agedTeak: new THREE.MeshStandardMaterial({ color: 0x362316, roughness: 0.8 }),
      rustedIron: new THREE.MeshStandardMaterial({ color: 0x2a201a, roughness: 0.7, metalness: 0.85 }),
      brassGold: new THREE.MeshStandardMaterial({ color: 0xd4a042, roughness: 0.3, metalness: 0.9 }),
      marbleWhite: new THREE.MeshStandardMaterial({ color: 0xe8e2d8, roughness: 0.35, metalness: 0.1 }),
      crimsonVelvet: new THREE.MeshStandardMaterial({ color: 0x851722, roughness: 0.88 }),
      emeraldVelvet: new THREE.MeshStandardMaterial({ color: 0x1a462c, roughness: 0.88 }),
      royalGoldSilk: new THREE.MeshStandardMaterial({ color: 0xd6a038, roughness: 0.6 }),
      sheeshamWood: new THREE.MeshStandardMaterial({ color: 0x2e190d, roughness: 0.72 }),
      darkGranite: new THREE.MeshStandardMaterial({ color: 0x1d1a18, roughness: 0.9 }),
      persianCarpet: new THREE.MeshStandardMaterial({ map: carpetTex, roughness: 0.85 }),
      flameCore: new THREE.MeshBasicMaterial({ color: 0xffea66 }),
      flameGlow: new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.85 }),
      beaconGlow: new THREE.MeshBasicMaterial({ color: 0xffb833, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending })
    };
  }

  // =========================================================
  // HELPER: CREATE FLAMING WALL MASHAAL (High Lumens)
  // =========================================================
  createMashaal(x, y, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;

    // 1. Cast-iron wall bracket
    const bracketPlate = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.3, 0.04), this.mats.rustedIron);
    group.add(bracketPlate);

    const bracketArm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.38), this.mats.rustedIron);
    bracketArm.rotation.x = Math.PI / 4;
    bracketArm.position.set(0, 0.1, 0.14);
    group.add(bracketArm);

    const ironRing = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.02, 8, 16), this.mats.rustedIron);
    ironRing.rotation.x = Math.PI / 2;
    ironRing.position.set(0, 0.24, 0.26);
    group.add(ironRing);

    // 2. Wooden Torch shaft
    const torchShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.52, 8), this.mats.agedTeak);
    torchShaft.position.set(0, 0.3, 0.26);
    group.add(torchShaft);

    // 3. Glowing Flame Mesh
    const flameGeo = new THREE.ConeGeometry(0.09, 0.3, 8);
    const flameMesh = new THREE.Mesh(flameGeo, this.mats.flameCore);
    flameMesh.position.set(0, 0.6, 0.26);
    group.add(flameMesh);

    const flameOuter = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.36, 8), this.mats.flameGlow);
    flameOuter.position.set(0, 0.58, 0.26);
    group.add(flameOuter);

    // 4. Bright Dynamic Fire PointLight (Intensity 3.8, Distance 14m)
    const light = new THREE.PointLight(0xff7216, 3.8, 14.0, 1.8);
    light.position.set(0, 0.65, 0.3);
    group.add(light);

    this.mashaals.push({
      light,
      flameMesh,
      flameOuter,
      baseIntensity: 3.8,
      seed: Math.random() * 100
    });

    this.scene.add(group);
    return group;
  }

  // =========================================================
  // HELPER: CREATE GRAND HANGING BRASS DIYA CHANDELIER
  // =========================================================
  createHangingChandelier(x, y, z, intensity = 4.5, distance = 22.0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Brass chain hanging down
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.4), this.mats.rustedIron);
    chain.position.y = 1.2;
    group.add(chain);

    // Multi-tier brass ring
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.04, 8, 24), this.mats.brassGold);
    ring1.rotation.x = Math.PI / 2;
    group.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.035, 8, 20), this.mats.brassGold);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -0.3;
    group.add(ring2);

    // 8 glowing brass diya cups
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const diya = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.1, 8), this.mats.brassGold);
      diya.position.set(Math.cos(angle) * 0.9, 0.05, Math.sin(angle) * 0.9);
      group.add(diya);

      const fMesh = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 6), this.mats.flameCore);
      fMesh.position.set(Math.cos(angle) * 0.9, 0.14, Math.sin(angle) * 0.9);
      group.add(fMesh);
    }

    // Powerful warm central point light illuminating the high hall
    const light = new THREE.PointLight(0xffbe55, intensity, distance, 1.8);
    light.position.set(0, -0.2, 0);
    group.add(light);

    this.chandeliers.push({ light, baseIntensity: intensity, seed: Math.random() * 50 });
    this.scene.add(group);
    return group;
  }

  // =========================================================
  // HELPER: ATTACH GLOWING DETECTIVE EVIDENCE BEACON
  // =========================================================
  attachEvidenceBeacon(mesh, clueId, colorHex = 0xffb833) {
    const beaconGroup = new THREE.Group();
    beaconGroup.position.copy(mesh.position);

    // 1. Vertical pulsing light column
    const colGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.8, 12, 1, true);
    const colMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const colMesh = new THREE.Mesh(colGeo, colMat);
    colMesh.position.y = 0.9;
    beaconGroup.add(colMesh);

    // 2. Floating diamond investigative glyph
    const glyphGeo = new THREE.OctahedronGeometry(0.12, 0);
    const glyphMat = new THREE.MeshBasicMaterial({ color: 0xffea77 });
    const glyph = new THREE.Mesh(glyphGeo, glyphMat);
    glyph.position.y = 1.9;
    beaconGroup.add(glyph);

    // 3. Ground target ring
    const ringGeo = new THREE.RingGeometry(0.35, 0.45, 20);
    const ringMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    beaconGroup.add(ring);

    this.scene.add(beaconGroup);
    this.evidenceBeacons.push({
      group: beaconGroup,
      clueId,
      colMat,
      glyph,
      baseY: glyph.position.y,
      seed: Math.random() * 20
    });
  }

  // =========================================================
  // WALL BUILDERS
  // =========================================================
  createWallWithDoor(x, y, z, width, height, thickness, isHorizontal, doorOffset = 0, doorWidth = 2.0, doorHeight = 2.8) {
    const wallGroup = new THREE.Group();
    wallGroup.position.set(x, y, z);
    if (!isHorizontal) wallGroup.rotation.y = Math.PI / 2;

    const leftPartWidth = Math.max(0.1, (width - doorWidth) / 2 + doorOffset);
    const rightPartWidth = Math.max(0.1, width - doorWidth - leftPartWidth);
    const headerHeight = height - doorHeight;

    if (leftPartWidth > 0.2) {
      const leftMesh = new THREE.Mesh(new THREE.BoxGeometry(leftPartWidth, height, thickness), this.mats.dampWall);
      leftMesh.position.set(-width / 2 + leftPartWidth / 2, height / 2, 0);
      wallGroup.add(leftMesh);
    }
    if (rightPartWidth > 0.2) {
      const rightMesh = new THREE.Mesh(new THREE.BoxGeometry(rightPartWidth, height, thickness), this.mats.dampWall);
      rightMesh.position.set(width / 2 - rightPartWidth / 2, height / 2, 0);
      wallGroup.add(rightMesh);
    }
    if (headerHeight > 0.2) {
      const headerMesh = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, headerHeight, thickness), this.mats.dampWall);
      headerMesh.position.set(-width / 2 + leftPartWidth + doorWidth / 2, doorHeight + headerHeight / 2, 0);
      wallGroup.add(headerMesh);
    }

    // Carved Rajasthani Teak Lintel Arch
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(doorWidth + 0.35, 0.28, thickness + 0.12), this.mats.agedTeak);
    lintel.position.set(-width / 2 + leftPartWidth + doorWidth / 2, doorHeight + 0.05, 0);
    wallGroup.add(lintel);

    this.scene.add(wallGroup);
    return wallGroup;
  }

  createSolidWall(x, y, z, width, height, thickness, isHorizontal) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, thickness), this.mats.dampWall);
    wall.position.set(x, y + height / 2, z);
    if (!isHorizontal) wall.rotation.y = Math.PI / 2;
    this.scene.add(wall);
    return wall;
  }

  // =========================================================
  // AUTHENTIC RAJASTHANI PERIOD FURNITURE GENERATORS
  // =========================================================
  createDiwanBaithak(x, y, z, rotY = 0, velvetColor = 0x851722) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;

    // Carved wooden platform base
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 1.2), this.mats.agedTeak);
    base.position.y = 0.175;
    group.add(base);

    // Turned bracket feet
    const footGeo = new THREE.CylinderGeometry(0.06, 0.04, 0.15, 8);
    [[-1.1, -0.5], [1.1, -0.5], [-1.1, 0.5], [1.1, 0.5]].forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(footGeo, this.mats.brassGold);
      foot.position.set(fx, 0.075, fz);
      group.add(foot);
    });

    // Plush velvet mattress
    const velvetMat = new THREE.MeshStandardMaterial({ color: velvetColor, roughness: 0.88 });
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.22, 1.15), velvetMat);
    mattress.position.y = 0.44;
    group.add(mattress);

    // Cylindrical bolster cushions (masnads) at each end
    const masnadGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.05, 12);
    const leftMasnad = new THREE.Mesh(masnadGeo, this.mats.royalGoldSilk);
    leftMasnad.rotation.x = Math.PI / 2;
    leftMasnad.position.set(-1.0, 0.64, 0);
    group.add(leftMasnad);

    const rightMasnad = new THREE.Mesh(masnadGeo, this.mats.royalGoldSilk);
    rightMasnad.rotation.x = Math.PI / 2;
    rightMasnad.position.set(1.0, 0.64, 0);
    group.add(rightMasnad);

    // Backrest pillow cushions
    for (let bx = -0.55; bx <= 0.55; bx += 0.55) {
      const backPillow = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.3, 0.18), velvetMat);
      backPillow.position.set(bx, 0.64, -0.42);
      group.add(backPillow);
    }

    this.scene.add(group);
    return group;
  }

  createCharpai(x, y, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;

    // 4 turned wooden legs
    const legGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.46, 8);
    [[-0.95, -0.48], [0.95, -0.48], [-0.95, 0.48], [0.95, 0.48]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, this.mats.agedTeak);
      leg.position.set(lx, 0.23, lz);
      group.add(leg);
    });

    // 4 wooden perimeter rails
    const longRail = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.08, 0.06), this.mats.agedTeak);
    longRail.position.set(0, 0.44, -0.48);
    group.add(longRail);
    const longRail2 = longRail.clone();
    longRail2.position.set(0, 0.44, 0.48);
    group.add(longRail2);

    const shortRail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 1.0), this.mats.agedTeak);
    shortRail.position.set(-0.95, 0.44, 0);
    group.add(shortRail);
    const shortRail2 = shortRail.clone();
    shortRail2.position.set(0.95, 0.44, 0);
    group.add(shortRail2);

    // Woven rope webbing (nawaar)
    const webbing = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.04, 0.94), this.mats.sandstone);
    webbing.position.set(0, 0.45, 0);
    group.add(webbing);

    // Folded cotton quilt / khes
    const quilt = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.07, 0.75), this.mats.crimsonVelvet);
    quilt.position.set(-0.45, 0.5, 0);
    group.add(quilt);

    this.scene.add(group);
    return group;
  }

  createAlmirah(x, y, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;

    // Main cabinet body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 0.65), this.mats.agedTeak);
    body.position.y = 1.25;
    group.add(body);

    // Arched crown molding
    const crown = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.16, 0.72), this.mats.agedTeak);
    crown.position.y = 2.55;
    group.add(crown);

    // Brass jali door panels
    const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.66, 2.05, 0.04), this.mats.brassGold);
    doorL.position.set(-0.36, 1.2, 0.33);
    group.add(doorL);

    const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.66, 2.05, 0.04), this.mats.brassGold);
    doorR.position.set(0.36, 1.2, 0.33);
    group.add(doorR);

    // Iron ring pull handles
    const ringGeo = new THREE.TorusGeometry(0.04, 0.01, 6, 12);
    const ringL = new THREE.Mesh(ringGeo, this.mats.rustedIron);
    ringL.position.set(-0.08, 1.2, 0.36);
    group.add(ringL);
    const ringR = new THREE.Mesh(ringGeo, this.mats.rustedIron);
    ringR.position.set(0.08, 1.2, 0.36);
    group.add(ringR);

    this.scene.add(group);
    return group;
  }

  createWritingDesk(x, y, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;

    // Desktop
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.09, 1.1), this.mats.agedTeak);
    deskTop.position.y = 0.8;
    group.add(deskTop);

    // Two drawer pedestals
    const pedL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.75, 1.0), this.mats.agedTeak);
    pedL.position.set(-0.72, 0.38, 0);
    group.add(pedL);
    const pedR = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.75, 1.0), this.mats.agedTeak);
    pedR.position.set(0.72, 0.38, 0);
    group.add(pedR);

    // Back modesty panel
    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.04), this.mats.agedTeak);
    backPanel.position.set(0, 0.45, -0.45);
    group.add(backPanel);

    // Roll-top curved upper organizer
    const organizer = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.38, 0.35), this.mats.agedTeak);
    organizer.position.set(0, 1.03, -0.34);
    group.add(organizer);

    // Open ledger & brass inkwell
    const ledger = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.28), this.mats.marbleWhite);
    ledger.position.set(-0.25, 0.86, 0.1);
    group.add(ledger);

    const inkwell = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.06, 12), this.mats.brassGold);
    inkwell.position.set(0.4, 0.87, -0.05);
    group.add(inkwell);

    this.scene.add(group);
    return group;
  }

  createCarvedChair(x, y, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;

    // 4 legs
    const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8);
    [[-0.26, -0.26], [0.26, -0.26], [-0.26, 0.26], [0.26, 0.26]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, this.mats.agedTeak);
      leg.position.set(lx, 0.225, lz);
      group.add(leg);
    });

    // Seat with velvet cushion
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.06, 0.58), this.mats.agedTeak);
    seat.position.y = 0.46;
    group.add(seat);
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.06, 0.54), this.mats.crimsonVelvet);
    cushion.position.y = 0.51;
    group.add(cushion);

    // Tall carved backrest with arched crown
    const backPosts = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.8, 0.05), this.mats.agedTeak);
    backPosts.position.set(0, 0.92, -0.26);
    group.add(backPosts);

    this.scene.add(group);
    return group;
  }

  createUrliWithFlowers(x, y, z) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Fluted brass urli bowl
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.26, 0.22, 16), this.mats.brassGold);
    bowl.position.y = 0.11;
    group.add(bowl);

    // Water plane inside
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x1a4038, roughness: 0.1, metalness: 0.8 });
    const water = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.02, 16), waterMat);
    water.position.y = 0.18;
    group.add(water);

    // 8 floating yellow & orange marigolds
    const flowerYellow = new THREE.MeshBasicMaterial({ color: 0xf5a623 });
    const flowerOrange = new THREE.MeshBasicMaterial({ color: 0xe65100 });
    for (let f = 0; f < 8; f++) {
      const fAng = (f / 8) * Math.PI * 2;
      const fDist = 0.15 + (f % 2) * 0.14;
      const petal = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 8), f % 2 === 0 ? flowerYellow : flowerOrange);
      petal.position.set(Math.cos(fAng) * fDist, 0.2, Math.sin(fAng) * fDist);
      group.add(petal);
    }

    this.scene.add(group);
    return group;
  }

  createBajotTable(x, y, z, width = 1.0, depth = 0.8) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Carved tabletop
    const top = new THREE.Mesh(new THREE.BoxGeometry(width, 0.07, depth), this.mats.agedTeak);
    top.position.y = 0.38;
    group.add(top);

    // Turned bracket feet
    const footGeo = new THREE.CylinderGeometry(0.045, 0.035, 0.35, 8);
    const hx = width / 2 - 0.08;
    const hz = depth / 2 - 0.08;
    [[-hx, -hz], [hx, -hz], [-hx, hz], [hx, hz]].forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(footGeo, this.mats.agedTeak);
      foot.position.set(fx, 0.175, fz);
      group.add(foot);
    });

    this.scene.add(group);
    return group;
  }

  createMandirShrine(x, y, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;

    // 3-tiered white marble base
    const plinth1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.25, 1.4), this.mats.marbleWhite);
    plinth1.position.y = 0.125;
    group.add(plinth1);
    const plinth2 = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.22, 1.2), this.mats.marbleWhite);
    plinth2.position.y = 0.34;
    group.add(plinth2);

    // 4 marble pillars
    const pillarGeo = new THREE.CylinderGeometry(0.06, 0.07, 1.5, 8);
    [[-0.85, -0.45], [0.85, -0.45], [-0.85, 0.45], [0.85, 0.45]].forEach(([px, pz]) => {
      const pil = new THREE.Mesh(pillarGeo, this.mats.marbleWhite);
      pil.position.set(px, 1.15, pz);
      group.add(pil);
    });

    // Marble canopy roof with shikhara dome
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.16, 1.1), this.mats.marbleWhite);
    canopy.position.y = 1.95;
    group.add(canopy);

    const dome = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.9, 12), this.mats.marbleWhite);
    dome.position.y = 2.45;
    group.add(dome);

    const kalash = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), this.mats.brassGold);
    kalash.position.y = 2.95;
    group.add(kalash);

    // Brass murtis (deities) inside sanctum
    const idolGeo = new THREE.CylinderGeometry(0.1, 0.14, 0.45, 8);
    const idol = new THREE.Mesh(idolGeo, this.mats.brassGold);
    idol.position.set(0, 0.68, 0);
    group.add(idol);

    // Tiered brass aarti diya tree
    const diyaTree = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.35, 8), this.mats.brassGold);
    diyaTree.position.set(0.6, 0.62, 0.25);
    group.add(diyaTree);

    // Velvet puja thali
    const thali = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 16), this.mats.brassGold);
    thali.position.set(-0.5, 0.46, 0.25);
    group.add(thali);

    this.scene.add(group);
    return group;
  }

  createFourPosterBed(x, y, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;

    // 4 tall carved teak posts
    const postGeo = new THREE.CylinderGeometry(0.065, 0.075, 2.7, 8);
    [[-1.15, -0.9], [1.15, -0.9], [-1.15, 0.9], [1.15, 0.9]].forEach(([px, pz]) => {
      const post = new THREE.Mesh(postGeo, this.mats.agedTeak);
      post.position.set(px, 1.35, pz);
      group.add(post);
    });

    // Top horizontal canopy cross-rails
    const railX1 = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.08, 0.06), this.mats.agedTeak);
    railX1.position.set(0, 2.66, -0.9);
    group.add(railX1);
    const railX2 = railX1.clone();
    railX2.position.set(0, 2.66, 0.9);
    group.add(railX2);

    const railZ1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 1.84), this.mats.agedTeak);
    railZ1.position.set(-1.15, 2.66, 0);
    group.add(railZ1);
    const railZ2 = railZ1.clone();
    railZ2.position.set(1.15, 2.66, 0);
    group.add(railZ2);

    // Carved Headboard
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 1.8), this.mats.agedTeak);
    headboard.position.set(-1.15, 1.05, 0);
    group.add(headboard);

    // Bedframe & Mattress
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.38, 1.75), this.mats.crimsonVelvet);
    mattress.position.y = 0.45;
    group.add(mattress);

    // Pillows
    for (let pz = -0.5; pz <= 0.5; pz += 0.5) {
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.15, 0.42), this.mats.royalGoldSilk);
      pillow.position.set(-0.85, 0.68, pz);
      group.add(pillow);
    }

    this.scene.add(group);
    return group;
  }

  createShringarMez(x, y, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;

    // Vanity table with turned legs
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.8), this.mats.agedTeak);
    tableTop.position.y = 0.8;
    group.add(tableTop);

    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.76, 8);
    [[-0.72, -0.32], [0.72, -0.32], [-0.72, 0.32], [0.72, 0.32]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, this.mats.agedTeak);
      leg.position.set(lx, 0.38, lz);
      group.add(leg);
    });

    // Carved Arched Mirror Frame on top
    const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.05), this.mats.brassGold);
    mirrorFrame.position.set(0, 1.45, -0.34);
    group.add(mirrorFrame);

    const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.76, 0.94), this.mats.marbleWhite);
    mirrorGlass.position.set(0, 1.45, -0.31);
    group.add(mirrorGlass);

    // Perfume attar bottles & jewelry box
    const attarGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.1, 8);
    const attar = new THREE.Mesh(attarGeo, this.mats.brassGold);
    attar.position.set(0.45, 0.89, -0.15);
    group.add(attar);

    const jewelryBox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.16), this.mats.agedTeak);
    jewelryBox.position.set(-0.45, 0.9, -0.15);
    group.add(jewelryBox);

    this.scene.add(group);
    return group;
  }

  createWeaponRack(x, y, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;

    // Dark teak wall backboard
    const backboard = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 0.08), this.mats.agedTeak);
    backboard.position.y = 1.0;
    group.add(backboard);

    // Two crossed curved Rajput Talwars
    const bladeGeo = new THREE.BoxGeometry(0.04, 1.2, 0.02);
    const talwar1 = new THREE.Mesh(bladeGeo, this.mats.rustedIron);
    talwar1.rotation.z = Math.PI / 4;
    talwar1.position.set(0, 1.0, 0.06);
    group.add(talwar1);

    const talwar2 = new THREE.Mesh(bladeGeo, this.mats.rustedIron);
    talwar2.rotation.z = -Math.PI / 4;
    talwar2.position.set(0, 1.0, 0.06);
    group.add(talwar2);

    // Circular brass engraved Dhal shield in the center
    const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.06, 16), this.mats.brassGold);
    shield.rotation.x = Math.PI / 2;
    shield.position.set(0, 1.0, 0.1);
    group.add(shield);

    this.scene.add(group);
    return group;
  }

  createTreasureSandook(x, y, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;

    // Dark heavy teak chest
    const chest = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.72, 0.8), this.mats.agedTeak);
    chest.position.y = 0.36;
    group.add(chest);

    // Domed lid
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.4, 16, 1, false, 0, Math.PI), this.mats.agedTeak);
    lid.rotation.z = Math.PI / 2;
    lid.position.set(0, 0.72, 0);
    group.add(lid);

    // Iron reinforcement straps
    [-0.45, 0, 0.45].forEach(sx => {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.74, 0.82), this.mats.rustedIron);
      strap.position.set(sx, 0.37, 0);
      group.add(strap);
    });

    // Heavy iron padlock
    const lock = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 0.08), this.mats.brassGold);
    lock.position.set(0, 0.65, 0.43);
    group.add(lock);

    this.scene.add(group);
    return group;
  }

  // =========================================================
  // BUILD COMPLETE 13-ROOM 2-STORY RAJASTHANI HAVELI
  // =========================================================
  buildThirteenRoomHaveli() {
    const texLoader = new THREE.TextureLoader();

    // -------------------------------------------------------
    // FLOOR & CEILING SLABS
    // -------------------------------------------------------
    // Ground Floor (-18 to +18 in X, -16 to +20 in Z)
    const groundFloorMesh = new THREE.Mesh(new THREE.PlaneGeometry(36, 38), this.mats.brokenFloor);
    groundFloorMesh.rotation.x = -Math.PI / 2;
    groundFloorMesh.position.set(0, 0, 2);
    groundFloorMesh.receiveShadow = true;
    this.scene.add(groundFloorMesh);

    // Ground Floor Ceilings (Height 3.8m)
    const ceilNorth = new THREE.Mesh(new THREE.PlaneGeometry(36, 16), this.mats.rafterCeiling);
    ceilNorth.rotation.x = Math.PI / 2;
    ceilNorth.position.set(0, 3.8, -8);
    this.scene.add(ceilNorth);

    const ceilWest = new THREE.Mesh(new THREE.PlaneGeometry(12, 22), this.mats.rafterCeiling);
    ceilWest.rotation.x = Math.PI / 2;
    ceilWest.position.set(-12, 3.8, 10);
    this.scene.add(ceilWest);

    const ceilEast = new THREE.Mesh(new THREE.PlaneGeometry(12, 22), this.mats.rafterCeiling);
    ceilEast.rotation.x = Math.PI / 2;
    ceilEast.position.set(12, 3.8, 10);
    this.scene.add(ceilEast);

    // Second Floor Floor Slabs at y = 4.0
    const floor2West = new THREE.Mesh(new THREE.PlaneGeometry(10, 22), this.mats.brokenFloor);
    floor2West.rotation.x = -Math.PI / 2;
    floor2West.position.set(-12, 4.0, 10);
    this.scene.add(floor2West);

    const floor2East = new THREE.Mesh(new THREE.PlaneGeometry(10, 22), this.mats.brokenFloor);
    floor2East.rotation.x = -Math.PI / 2;
    floor2East.position.set(12, 4.0, 10);
    this.scene.add(floor2East);

    const floor2North = new THREE.Mesh(new THREE.PlaneGeometry(34, 16), this.mats.brokenFloor);
    floor2North.rotation.x = -Math.PI / 2;
    floor2North.position.set(0, 4.0, -8);
    this.scene.add(floor2North);

    const walkwaySouth = new THREE.Mesh(new THREE.PlaneGeometry(18, 6), this.mats.brokenFloor);
    walkwaySouth.rotation.x = -Math.PI / 2;
    walkwaySouth.position.set(0, 4.0, 15);
    this.scene.add(walkwaySouth);

    // Second Floor Mezzanine North Landing Slab (y = 4.0)
    const mezzNorth = new THREE.Mesh(new THREE.PlaneGeometry(16, 4), this.mats.brokenFloor);
    mezzNorth.rotation.x = -Math.PI / 2;
    mezzNorth.position.set(0, 4.0, 2.5);
    this.scene.add(mezzNorth);

    // Top Ceiling over 2nd Floor (y = 7.6)
    const topCeil = new THREE.Mesh(new THREE.PlaneGeometry(36, 38), this.mats.rafterCeiling);
    topCeil.rotation.x = Math.PI / 2;
    topCeil.position.set(0, 7.6, 2);
    this.scene.add(topCeil);

    // -------------------------------------------------------
    // ROOM 1: GRAND ENTRANCE POL (Hathi Pol, Ground Floor, z: 14 to 20)
    // -------------------------------------------------------
    this.createSolidWall(-10.5, 0, 19.8, 15, 3.8, 0.5, true);
    this.createSolidWall(10.5, 0, 19.8, 15, 3.8, 0.5, true);

    // Fortified Studded Teak Gates
    const gateFrame = new THREE.Mesh(new THREE.BoxGeometry(4.4, 3.8, 0.4), this.mats.sandstone);
    gateFrame.position.set(0, 1.9, 19.8);
    this.scene.add(gateFrame);

    const leftGate = new THREE.Mesh(new THREE.BoxGeometry(1.7, 3.4, 0.12), this.mats.agedTeak);
    leftGate.position.set(-0.95, 1.7, 19.7);
    this.scene.add(leftGate);
    const rightGate = new THREE.Mesh(new THREE.BoxGeometry(1.7, 3.4, 0.12), this.mats.agedTeak);
    rightGate.position.set(0.95, 1.7, 19.7);
    this.scene.add(rightGate);

    // Gate Studs
    for (let gx = -1.6; gx <= 1.6; gx += 0.4) {
      if (Math.abs(gx) < 0.1) continue;
      for (let gy = 0.5; gy <= 3.0; gy += 0.5) {
        const stud = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), this.mats.brassGold);
        stud.position.set(gx, gy, 19.62);
        this.scene.add(stud);
      }
    }

    this.createMashaal(-2.4, 2.0, 19.4, 0);
    this.createMashaal(2.4, 2.0, 19.4, 0);

    // Wide Entrance Archway leading into Courtyard
    this.createWallWithDoor(0, 0, 14.0, 16, 3.8, 0.4, true, 0, 4.4, 3.4);

    // Furniture in Entrance Pol
    this.createBajotTable(-2.6, 0, 17.0, 1.1, 0.7);
    this.createBajotTable(2.6, 0, 17.0, 1.1, 0.7);
    this.createUrliWithFlowers(2.6, 0.4, 17.0);

    // Clue 05: Tape Recorder & Dispatch Notice on Carved Center Chowki
    const chowki = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.8), this.mats.agedTeak);
    chowki.position.set(0, 0.25, 17.0);
    this.scene.add(chowki);

    const tapePlayer = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 0.24), this.mats.rustedIron);
    tapePlayer.position.set(0, 0.54, 17.0);
    tapePlayer.userData = {
      clueId: 'clue_05',
      name: 'The 1998 Microcassette Recorder & Dispatch Notice',
      prompt: '[E] Play Microcassette Recording [Lead 1]'
    };
    this.interactables.push(tapePlayer);
    this.scene.add(tapePlayer);
    this.attachEvidenceBeacon(tapePlayer, 'clue_05');

    // -------------------------------------------------------
    // ROOM 2: CENTRAL AANGAN COURTYARD & GRAND CENTRAL STAIRCASE
    // -------------------------------------------------------
    // Colonnade Pillars along perimeter of open courtyard atrium
    const pillarPositions = [
      [-6.5, 5.0], [-6.5, 8.5], [-6.5, 12.0],
      [6.5, 5.0], [6.5, 8.5], [6.5, 12.0],
      [-3.0, 13.5], [3.0, 13.5]
    ];
    pillarPositions.forEach(([px, pz]) => {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.7), this.mats.sandstone);
      base.position.set(px, 0.2, pz);
      this.scene.add(base);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 3.2, 12), this.mats.sandstone);
      shaft.position.set(px, 1.8, pz);
      this.scene.add(shaft);

      const capital = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.7), this.mats.sandstone);
      capital.position.set(px, 3.6, pz);
      this.scene.add(capital);

      // 2nd floor pillar extension
      const shaft2 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 3.4, 12), this.mats.sandstone);
      shaft2.position.set(px, 5.8, pz);
      this.scene.add(shaft2);
    });

    // Grand Hanging Brass Diya Chandelier in Courtyard Atrium
    this.createHangingChandelier(0, 6.2, 8.5, 5.0, 24.0);

    // Mashaals on courtyard colonnade
    this.createMashaal(-6.2, 2.1, 6.0, Math.PI / 2);
    this.createMashaal(6.2, 2.1, 6.0, -Math.PI / 2);

    // =======================================================
    // GRAND CENTRAL IMPERIAL STAIRCASE (IN THE MIDDLE OF HAVELI)
    // Runs from z = 9.5 (ground) climbing North up to z = 3.2 (floor 2 landing)
    // Width: 5.2m (x = -2.6 to +2.6). Effortless linear climb!
    // =======================================================
    const centralStepCount = 20;
    for (let i = 0; i < centralStepCount; i++) {
      const t = i / centralStepCount;
      const stepZ = 9.5 - t * 6.3;
      const stepY = t * 4.0;
      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.22, 0.36), this.mats.sandstone);
      stepMesh.position.set(0, stepY + 0.11, stepZ);
      stepMesh.receiveShadow = true;
      this.scene.add(stepMesh);
    }

    // Carved Sandstone Balustrades along left and right sides of central stairs
    const stairAngle = Math.atan2(4.0, 6.3);
    const railLength = Math.sqrt(4.0 * 4.0 + 6.3 * 6.3) + 0.4;

    const leftStairRail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.95, railLength), this.mats.sandstone);
    leftStairRail.position.set(-2.65, 2.35, 6.35);
    leftStairRail.rotation.x = stairAngle;
    this.scene.add(leftStairRail);

    const rightStairRail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.95, railLength), this.mats.sandstone);
    rightStairRail.position.set(2.65, 2.35, 6.35);
    rightStairRail.rotation.x = stairAngle;
    this.scene.add(rightStairRail);

    // Bottom Newel Posts with Brass Finials & Torches
    [-2.65, 2.65].forEach(nx => {
      const newel = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.1, 0.35), this.mats.sandstone);
      newel.position.set(nx, 0.55, 9.6);
      this.scene.add(newel);

      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), this.mats.brassGold);
      finial.position.set(nx, 1.18, 9.6);
      this.scene.add(finial);

      this.createMashaal(nx, 1.3, 9.65, 0);
    });

    // Courtyard Marble Lotus Fountain Basin (South of stairs)
    const fountainPool = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.45, 8), this.mats.marbleWhite);
    fountainPool.position.set(0, 0.225, 11.8);
    this.scene.add(fountainPool);

    const poolWater = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.05, 16), new THREE.MeshStandardMaterial({ color: 0x1a453f, roughness: 0.1, metalness: 0.8 }));
    poolWater.position.set(0, 0.38, 11.8);
    this.scene.add(poolWater);

    const fountainCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.8, 8), this.mats.brassGold);
    fountainCenter.position.set(0, 0.65, 11.8);
    this.scene.add(fountainCenter);

    // Fluted Brass Urlis with Floating Marigolds along ground walkways
    this.createUrliWithFlowers(-4.8, 0, 8.5);
    this.createUrliWithFlowers(4.8, 0, 8.5);

    // Wide Archway from Courtyard into Diwan-e-Aam
    this.createWallWithDoor(0, 0, 3.0, 16, 3.8, 0.4, true, 0, 4.4, 3.2);

    // -------------------------------------------------------
    // ROOM 3: DIWAN-E-AAM (Ground Floor, z: -5.8 to 3.0)
    // -------------------------------------------------------
    this.createSolidWall(0, 0, -5.8, 16, 3.8, 0.4, true); // North wall
    this.createWallWithDoor(-7.8, 0, -1.0, 8.0, 3.8, 0.4, false, 0, 3.0, 3.0); // West to Thakur's Study
    this.createWallWithDoor(7.8, 0, -1.0, 8.0, 3.8, 0.4, false, 0, 3.0, 3.0);  // East to Royal Hall

    this.createHangingChandelier(0, 3.4, -1.2, 3.6, 16.0);
    this.createMashaal(-4.5, 2.2, -5.6, 0);
    this.createMashaal(4.5, 2.2, -5.6, 0);

    // Persian Carpet in Diwan-e-Aam
    const diwanCarpet = new THREE.Mesh(new THREE.PlaneGeometry(7.0, 4.6), this.mats.persianCarpet);
    diwanCarpet.rotation.x = -Math.PI / 2;
    diwanCarpet.position.set(0, 0.02, -1.2);
    this.scene.add(diwanCarpet);

    // Royal Diwan Baithaks
    this.createDiwanBaithak(-3.8, 0, -1.2, Math.PI / 2, 0x851722); // Crimson velvet
    this.createDiwanBaithak(3.8, 0, -1.2, -Math.PI / 2, 0x1a462c); // Emerald velvet

    // Low Carved Tea Bajot Table with Brass Samovar
    this.createBajotTable(0, 0, -1.2, 1.4, 0.9);
    const samovar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.45, 12), this.mats.brassGold);
    samovar.position.set(0, 0.65, -1.2);
    this.scene.add(samovar);

    // Tall Rajasthani Almirah with Brass Jali Doors
    this.createAlmirah(5.8, 0, -5.3, 0);

    // Clue 01: Grandfather Clock Stopped at 2:13 AM
    const clockGroup = new THREE.Group();
    clockGroup.position.set(0, 0, -5.5);

    const clockBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.6, 0.42), this.mats.agedTeak);
    clockBody.position.y = 1.3;
    clockGroup.add(clockBody);

    const clockFace = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.05, 16), this.mats.brassGold);
    clockFace.rotation.x = Math.PI / 2;
    clockFace.position.set(0, 1.85, 0.22);
    clockGroup.add(clockFace);

    const pendulumRod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.75), this.mats.brassGold);
    pendulumRod.position.set(0, 0.95, 0.12);
    const pendulumBob = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 16), this.mats.brassGold);
    pendulumBob.position.set(0, 0.58, 0.12);
    pendulumBob.rotation.x = Math.PI / 2;
    pendulumRod.add(pendulumBob);
    clockGroup.add(pendulumRod);
    this.grandfatherClockPendulum = pendulumRod;

    clockBody.userData = {
      clueId: 'clue_01',
      name: 'Grandfather Clock (Stopped at 2:13 AM)',
      prompt: '[E] Inspect Clock Face & Pry-Marks [Lead 2]'
    };
    this.interactables.push(clockBody);
    this.scene.add(clockGroup);
    this.attachEvidenceBeacon(clockBody, 'clue_01');

    // -------------------------------------------------------
    // ROOM 4: THAKUR VIKRAM'S PRIVATE STUDY (Ground Floor West)
    // -------------------------------------------------------
    this.createSolidWall(-16.0, 0, -1.0, 10, 3.8, 0.4, false); // West outer
    this.createSolidWall(-12.0, 0, -5.8, 8, 3.8, 0.4, true);  // North wall
    this.createWallWithDoor(-12.0, 0, 3.5, 8, 3.8, 0.4, true, 0, 2.8, 2.8); // South to Kamla's

    this.createMashaal(-15.8, 2.1, -1.0, Math.PI / 2);
    this.createMashaal(-12.0, 2.1, -5.6, 0);

    // Executive Roll-Top Desk & High-Backed Throne Chair
    this.createWritingDesk(-12.0, 0, -1.5, 0);
    this.createCarvedChair(-12.0, 0, -2.4, 0);

    // Clue 07: 3:00 AM Renovation Order
    const orderDoc = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.03, 0.5), this.mats.marbleWhite);
    orderDoc.position.set(-11.8, 0.88, -1.5);
    orderDoc.userData = {
      clueId: 'clue_07',
      name: 'The 3:00 AM Renovation Order',
      prompt: '[E] Inspect Midnight Masonry Order [Lead 3]'
    };
    this.interactables.push(orderDoc);
    this.scene.add(orderDoc);
    this.attachEvidenceBeacon(orderDoc, 'clue_07');

    // Bookcases packed with revenue rolls
    const bookcase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 0.5), this.mats.agedTeak);
    bookcase.position.set(-14.2, 1.2, -5.4);
    this.scene.add(bookcase);

    // Iron-banded royal treasure sandook
    this.createTreasureSandook(-15.0, 0, 1.5, Math.PI / 2);

    // Antique Brass Telescope on Wooden Tripod Stand
    const tripod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.25, 1.3, 3), this.mats.agedTeak);
    tripod.position.set(-9.2, 0.65, 1.8);
    this.scene.add(tripod);
    const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.9, 12), this.mats.brassGold);
    scope.rotation.z = -Math.PI / 4;
    scope.position.set(-9.2, 1.35, 1.8);
    this.scene.add(scope);

    // -------------------------------------------------------
    // ROOM 5: KAMLA BAI'S QUARTERS (Ground Floor Southwest)
    // -------------------------------------------------------
    this.createSolidWall(-16.0, 0, 10.0, 12, 3.8, 0.4, false); // West outer
    this.createSolidWall(-12.0, 0, 16.0, 8, 3.8, 0.4, true);  // South outer
    this.createWallWithDoor(-8.0, 0, 10.0, 12, 3.8, 0.4, false, 0, 3.2, 3.0); // East to courtyard

    this.createMashaal(-15.8, 2.1, 10.0, Math.PI / 2);

    // Traditional Charpai (Woven Rope Cot)
    this.createCharpai(-13.5, 0, 13.0, 0);

    // Earthen Clay Chulha Hearth & Tea Kettle
    const chulha = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.6), this.mats.sandstone);
    chulha.position.set(-14.5, 0.175, 6.0);
    this.scene.add(chulha);
    const kettle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.22, 12), this.mats.rustedIron);
    kettle.position.set(-14.5, 0.45, 6.0);
    this.scene.add(kettle);

    // Low Chowki with Brass Kerosene Lamp
    this.createBajotTable(-10.5, 0, 6.0, 0.8, 0.6);
    const kLamp = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.28, 8), this.mats.brassGold);
    kLamp.position.set(-10.5, 0.52, 6.0);
    this.scene.add(kLamp);

    // Antique Brass-Studded Trunk with Clue 08: Rajput Brass Key
    const trunk = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.65, 0.75), this.mats.agedTeak);
    trunk.position.set(-11.5, 0.32, 9.5);
    this.scene.add(trunk);

    const brassKey = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.09), this.mats.brassGold);
    brassKey.position.set(-11.5, 0.68, 9.5);
    brassKey.userData = {
      clueId: 'clue_08',
      name: 'Antique Rajput Brass Key (Stained with Mortar)',
      prompt: '[E] Collect Brass Key [Lead 4]'
    };
    this.interactables.push(brassKey);
    this.scene.add(brassKey);
    this.attachEvidenceBeacon(brassKey, 'clue_08');

    // -------------------------------------------------------
    // EAST WING GROUND FLOOR: ROYAL ANCESTRAL HALL / DIWAN-E-KHAS
    // -------------------------------------------------------
    this.createSolidWall(16.0, 0, 5.0, 22, 3.8, 0.4, false); // East outer
    this.createSolidWall(12.0, 0, 16.0, 8, 3.8, 0.4, true);  // South outer
    this.createSolidWall(12.0, 0, -5.8, 8, 3.8, 0.4, true);  // North outer
    this.createWallWithDoor(8.0, 0, 10.0, 12, 3.8, 0.4, false, 0, 3.2, 3.0); // West to courtyard

    this.createMashaal(15.8, 2.1, 10.0, -Math.PI / 2);
    this.createMashaal(15.8, 2.1, 0, -Math.PI / 2);

    this.createDiwanBaithak(12.5, 0, 12.0, Math.PI / 2, 0xd6a038); // Royal gold silk
    this.createAlmirah(15.4, 0, 5.5, -Math.PI / 2);
    this.createUrliWithFlowers(12.0, 0, 0);

    // -------------------------------------------------------
    // ROOM 6: GRAND CENTRAL STAIRCASE & ANCESTRAL GALLERY
    // Top Landing of the Central Stairs at Second Floor Mezzanine
    // -------------------------------------------------------
    // Balustrades surrounding the open central courtyard atrium
    const railMat = this.mats.sandstone;
    const railSouth = new THREE.Mesh(new THREE.BoxGeometry(13.0, 0.95, 0.15), railMat);
    railSouth.position.set(0, 4.5, 12.0);
    this.scene.add(railSouth);

    const railWest = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.95, 8.0), railMat);
    railWest.position.set(-6.5, 4.5, 8.0);
    this.scene.add(railWest);

    const railEast = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.95, 8.0), railMat);
    railEast.position.set(6.5, 4.5, 8.0);
    this.scene.add(railEast);

    // North high wall of Mezzanine behind the portrait
    this.createSolidWall(0, 4.0, 0.8, 16, 3.6, 0.4, true);

    // Clue 06: Rathore Family Portrait Mounted Centrally at the Top Landing (x = 0, y = 5.6, z = 1.0)
    const jharokhaGroup = new THREE.Group();
    jharokhaGroup.position.set(0, 5.6, 1.0);

    const jharokhaFrame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.9, 0.16), this.mats.agedTeak);
    jharokhaGroup.add(jharokhaFrame);

    const portraitTex = texLoader.load('/assets/rathore_family_portrait.jpg');
    const portraitPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.9, 2.6),
      new THREE.MeshStandardMaterial({ map: portraitTex, roughness: 0.6 })
    );
    portraitPlane.position.z = 0.09;
    jharokhaGroup.add(portraitPlane);

    jharokhaFrame.userData = {
      clueId: 'clue_06',
      name: 'Rathore Ancestral Portrait (1998)',
      prompt: '[E] Inspect Portrait / [C] Take Polaroid [Lead 5]'
    };
    this.interactables.push(jharokhaFrame);
    this.scene.add(jharokhaGroup);
    this.attachEvidenceBeacon(jharokhaFrame, 'clue_06');

    // Flanking brass sconces for the portrait
    this.createMashaal(-1.6, 5.8, 1.0, 0);
    this.createMashaal(1.6, 5.8, 1.0, 0);

    // -------------------------------------------------------
    // ROOM 7: ARCHITECT ARVIND JOSHI'S STUDIO (Floor 2 Northeast)
    // -------------------------------------------------------
    this.createSolidWall(16.0, 4.0, 0, 10, 3.6, 0.4, false); // East outer
    this.createSolidWall(12.0, 4.0, -5.8, 8, 3.6, 0.4, true);  // North wall
    this.createSolidWall(12.0, 4.0, 5.0, 8, 3.6, 0.4, true);   // South wall
    this.createWallWithDoor(8.0, 4.0, 0, 10, 3.6, 0.4, false, 0, 3.0, 2.8); // West with arch

    this.createMashaal(15.8, 5.8, 0, -Math.PI / 2);

    const draftTable = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.9, 1.2), this.mats.agedTeak);
    draftTable.position.set(12.0, 4.45, -1.0);
    this.scene.add(draftTable);

    // Clue 03: Blueprints & Torn Page 7
    const blueprintMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.02, 0.65), this.mats.marbleWhite);
    blueprintMesh.position.set(12.0, 4.92, -1.0);
    blueprintMesh.userData = {
      clueId: 'clue_03',
      name: 'Haveli Floor Plan Blueprint & Torn Page 7',
      prompt: '[E] Inspect Architectural Void Calculations [Lead 6]'
    };
    this.interactables.push(blueprintMesh);
    this.scene.add(blueprintMesh);
    this.attachEvidenceBeacon(blueprintMesh, 'clue_03');

    // Theodolite on wooden tripod
    const theoTripod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.25, 1.3, 3), this.mats.agedTeak);
    theoTripod.position.set(14.5, 4.65, 2.5);
    this.scene.add(theoTripod);
    const theoHead = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.18), this.mats.brassGold);
    theoHead.position.set(14.5, 5.35, 2.5);
    this.scene.add(theoHead);

    // Wicker basket with rolled blueprints
    const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 0.6, 12), this.mats.sandstone);
    basket.position.set(10.0, 4.3, 2.5);
    this.scene.add(basket);

    // -------------------------------------------------------
    // ROOM 8: 1998 POLICE INVESTIGATION OFFICE (Floor 2 Northwest)
    // -------------------------------------------------------
    this.createSolidWall(-16.0, 4.0, 10.0, 12, 3.6, 0.4, false); // West outer
    this.createSolidWall(-12.0, 4.0, 16.0, 8, 3.6, 0.4, true);  // South outer
    this.createWallWithDoor(-8.0, 4.0, 10.0, 12, 3.6, 0.4, false, 0, 3.0, 2.8); // East with arch

    this.createMashaal(-15.8, 5.8, 10.0, Math.PI / 2);

    const policeDesk = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.8, 1.0), this.mats.agedTeak);
    policeDesk.position.set(-12.0, 4.4, 10.0);
    this.scene.add(policeDesk);

    // Vintage Typewriter & Banker Lamp
    const typewriter = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.32), this.mats.rustedIron);
    typewriter.position.set(-12.4, 4.88, 10.0);
    this.scene.add(typewriter);

    const bLamp = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.24, 8), this.mats.brassGold);
    bLamp.position.set(-11.3, 4.92, 9.8);
    this.scene.add(bLamp);

    // Clue 04: Missing Carbon Statement
    const carbonStatement = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.02, 0.48), this.mats.marbleWhite);
    carbonStatement.position.set(-11.8, 4.82, 10.0);
    carbonStatement.userData = {
      clueId: 'clue_04',
      name: "The Missing Carbon Statement of Mason Ramu",
      prompt: '[E] Read Suppressed Police Witness Statement [Lead 7]'
    };
    this.interactables.push(carbonStatement);
    this.scene.add(carbonStatement);
    this.attachEvidenceBeacon(carbonStatement, 'clue_04');

    // Evidence cardboard archive boxes
    const box1 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.5), this.mats.sandstone);
    box1.position.set(-14.5, 4.22, 13.5);
    this.scene.add(box1);
    const box2 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.5), this.mats.sandstone);
    box2.position.set(-14.5, 4.67, 13.5);
    this.scene.add(box2);

    // -------------------------------------------------------
    // ROOM 9: FAMILY MANDIR & SACRED SHRINE (Floor 2 West)
    // -------------------------------------------------------
    this.createSolidWall(-16.0, 4.0, -1.0, 10, 3.6, 0.4, false); // West outer
    this.createSolidWall(-12.0, 4.0, -5.8, 8, 3.6, 0.4, true);  // North wall
    this.createWallWithDoor(-8.0, 4.0, -1.0, 10, 3.6, 0.4, false, 0, 3.0, 2.8); // East with arch

    this.createMashaal(-15.8, 5.8, -1.0, Math.PI / 2);

    // Grand Carved White Marble Mandir Shrine
    this.createMandirShrine(-12.0, 4.0, -1.5, Math.PI / 2);

    // Clue 10: 13th Bell Mounting Hook
    const bellHook = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.025, 8, 16, Math.PI * 1.5), this.mats.rustedIron);
    bellHook.position.set(-12.0, 6.2, -1.5);
    bellHook.rotation.z = Math.PI;
    bellHook.userData = {
      clueId: 'clue_10',
      name: 'The 13th Bell Mounting Hook',
      prompt: '[E] Inspect Phantom Bell Tolls'
    };
    this.interactables.push(bellHook);
    this.scene.add(bellHook);

    // Clue 11: 1963 Child Talisman
    const talisman = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 16), this.mats.brassGold);
    talisman.position.set(-12.0, 4.54, -1.5);
    talisman.userData = {
      clueId: 'clue_11',
      name: 'The 1963 Erased Child Talisman (Anand)',
      prompt: '[E] Collect Anand\'s Birth Talisman [Lead 8]'
    };
    this.interactables.push(talisman);
    this.scene.add(talisman);
    this.attachEvidenceBeacon(talisman, 'clue_11');

    // Prayer Asana Velvet Mats
    const asanaMat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.8), this.mats.crimsonVelvet);
    asanaMat.position.set(-10.5, 4.02, -1.5);
    this.scene.add(asanaMat);

    // -------------------------------------------------------
    // ROOM 10: MEERA RATHORE'S BEDCHAMBER (Floor 2 North Wing)
    // -------------------------------------------------------
    this.createSolidWall(-7.8, 4.0, -10.0, 8.2, 3.6, 0.4, false); // West wall
    this.createSolidWall(-2.6, 4.0, -14.0, 10.5, 3.6, 0.4, true); // North wall
    this.createWallWithDoor(-2.6, 4.0, -5.8, 10.5, 3.6, 0.4, true, 0, 3.0, 2.8); // South doorway

    this.createMashaal(-2.6, 5.8, -13.8, 0);

    // Royal Four-Poster Canopied Teak Bed (Sheesham)
    this.createFourPosterBed(-5.2, 4.0, -10.5, 0);

    // Carved Dressing Vanity Table (Shringar Mez)
    this.createShringarMez(0, 4.0, -13.0, 0);

    // Clue 02: Meera's Diary with wet ink on the vanity table
    const diary = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, 0.24), this.mats.agedTeak);
    diary.position.set(0, 4.88, -12.9);
    diary.userData = {
      clueId: 'clue_02',
      name: "Meera Rathore's Journal (Final July 14 Entry & Pictorial Spell)",
      prompt: "[E] Open Meera's Diary & Study Pictorial Spell [Lead 9]"
    };
    this.interactables.push(diary);
    this.scene.add(diary);
    this.attachEvidenceBeacon(diary, 'clue_02');

    // Warm hanging brass chandelier & wall mashaal for bright room illumination
    this.createHangingChandelier(0, 6.2, -10.5, 4.2, 18.0);
    this.createMashaal(2.4, 5.8, -10.0, -Math.PI / 2);

    // Carved Rajasthani Almirah Wardrobe
    this.createAlmirah(-5.2, 4.0, -6.5, Math.PI);

    // -------------------------------------------------------
    // ROOM 11: ROYAL TOSHAKHANA (Armory & Treasury, Floor 2 West End)
    // -------------------------------------------------------
    this.createSolidWall(-16.0, 4.0, -10.0, 8.2, 3.6, 0.4, false); // West outer
    this.createSolidWall(-12.0, 4.0, -14.0, 8.0, 3.6, 0.4, true); // North wall
    this.createWallWithDoor(-7.8, 4.0, -10.0, 8.2, 3.6, 0.4, false, 0, 2.8, 2.8); // East doorway to Meera's

    this.createMashaal(-15.8, 5.8, -10.0, Math.PI / 2);

    // Weapon Display Racks on walls with Rajput Talwars and Dhal Shields
    this.createWeaponRack(-15.8, 4.0, -10.0, Math.PI / 2);
    this.createWeaponRack(-12.0, 4.0, -13.8, 0);

    // Heavy Iron-Banded Royal Treasure Chests (Sandook)
    this.createTreasureSandook(-12.0, 4.0, -12.0, 0);

    // Armor Dummy with Chainmail and Plumed Helmet
    const dummyBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.5), this.mats.agedTeak);
    dummyBase.position.set(-9.5, 4.1, -12.5);
    this.scene.add(dummyBase);
    const armorBody = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 1.1, 8), this.mats.rustedIron);
    armorBody.position.set(-9.5, 4.8, -12.5);
    this.scene.add(armorBody);
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), this.mats.brassGold);
    helmet.position.set(-9.5, 5.5, -12.5);
    this.scene.add(helmet);

    // -------------------------------------------------------
    // ROOM 12: UPPER JHAROKHA TERRACE (Wind Pavilion, Floor 2 South)
    // -------------------------------------------------------
    this.createSolidWall(-10.5, 4.0, 19.8, 15, 3.6, 0.4, true);
    this.createSolidWall(10.5, 4.0, 19.8, 15, 3.6, 0.4, true);

    const terraceChhatri = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.2, 8), this.mats.sandstone);
    terraceChhatri.position.set(0, 7.8, 17.0);
    this.scene.add(terraceChhatri);

    this.createMashaal(-3.5, 5.8, 18.0, 0);
    this.createMashaal(3.5, 5.8, 18.0, 0);

    // Low Marble Divan with Royal Velvet Bolsters facing monsoon wind
    this.createDiwanBaithak(0, 4.0, 18.0, 0, 0x851722);

    // Carved Stone Balustrade Chowki
    this.createBajotTable(-2.5, 4.0, 16.5, 0.9, 0.6);

    // -------------------------------------------------------
    // ROOM 13: THE THIRTEENTH ROOM (SEALED WITH ANCIENT TANTRIC MAGIC)
    // -------------------------------------------------------
    // Eastern Magic Corridor leading to the barrier
    this.createWallWithDoor(5.2, 4.0, -5.8, 5.2, 3.6, 0.4, true, 0, 2.8, 2.8);
    this.createSolidWall(5.2, 4.0, -14.0, 5.2, 3.6, 0.4, true);

    // Clue 12: Wall Inscription "CASE 013 IS OPEN"
    const wallInscription = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.65, 0.05), this.mats.sandstone);
    wallInscription.position.set(5.2, 5.5, -6.15);
    wallInscription.userData = {
      clueId: 'clue_12',
      name: 'Fresh Wall Inscription ("CASE 013 IS OPEN")',
      prompt: '[E] Examine Charcoal Wall Inscription'
    };
    this.interactables.push(wallInscription);
    this.scene.add(wallInscription);
    this.attachEvidenceBeacon(wallInscription, 'clue_12', 0xff3344);

    // --- THE TANTRIC MAGIC SEAL ---
    // Glowing magical barrier plane filling the doorway at x = 7.85
    const magicBarrierGeo = new THREE.PlaneGeometry(2.6, 3.4);
    const magicBarrierMat = new THREE.MeshBasicMaterial({
      color: 0x990033,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const magicBarrier = new THREE.Mesh(magicBarrierGeo, magicBarrierMat);
    magicBarrier.position.set(7.85, 5.7, -10.0);
    magicBarrier.rotation.y = -Math.PI / 2;
    this.scene.add(magicBarrier);
    this.magicBarrierMesh = magicBarrier;

    // Glowing Blood Mandala Decal
    const mandalaTex = texLoader.load('/assets/mandala.png');
    const decalMat = new THREE.MeshBasicMaterial({
      map: mandalaTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    this.mandalaDecal = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), decalMat);
    this.mandalaDecal.position.set(7.82, 5.7, -10.0);
    this.mandalaDecal.rotation.y = -Math.PI / 2;
    this.mandalaDecal.userData = {
      clueId: 'clue_08',
      name: 'Tantric Magic Seal of Room 13',
      prompt: '[E] Shatter the Magic Seal with the Bloodline Talisman & Brass Key [Lead 10]'
    };
    this.interactables.push(this.mandalaDecal);
    this.scene.add(this.mandalaDecal);

    // 4 Orbiting Mystical Tantric Runes around the seal
    for (let r = 0; r < 4; r++) {
      const runeGeo = new THREE.OctahedronGeometry(0.12, 0);
      const runeMat = new THREE.MeshBasicMaterial({ color: 0xff3355 });
      const runeMesh = new THREE.Mesh(runeGeo, runeMat);
      this.magicRunes.push({ mesh: runeMesh, angle: (r / 4) * Math.PI * 2 });
      this.scene.add(runeMesh);
    }

    // Magic barrier point light
    this.magicLight = new THREE.PointLight(0xff1144, 4.0, 9.0);
    this.magicLight.position.set(7.5, 5.7, -10.0);
    this.scene.add(this.magicLight);

    // Inside Room 13 (x: 8.0 to 16.0, z: -14.0 to -5.8)
    this.createSolidWall(16.0, 4.0, -10.0, 8.0, 3.6, 0.4, false); // East outer
    this.createSolidWall(12.0, 4.0, -14.0, 8.0, 3.6, 0.4, true);  // North outer
    this.createSolidWall(12.0, 4.0, -5.8, 8.0, 3.6, 0.4, true);   // South wall

    // Ancient Tantric Black Stone Altar
    const room13Altar = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.8, 1.2), this.mats.darkGranite);
    room13Altar.position.set(12.0, 4.4, -10.0);
    this.scene.add(room13Altar);

    // 13 Earthen Oil Diyas forming a sacrificial circle on the floor
    for (let d = 0; d < 13; d++) {
      const dAng = (d / 13) * Math.PI * 2;
      const dMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 0.05, 8), this.mats.sandstone);
      dMesh.position.set(12.0 + Math.cos(dAng) * 1.8, 4.03, -10.0 + Math.sin(dAng) * 1.8);
      this.scene.add(dMesh);
      const dFlame = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 6), this.mats.flameCore);
      dFlame.position.set(12.0 + Math.cos(dAng) * 1.8, 4.09, -10.0 + Math.sin(dAng) * 1.8);
      this.scene.add(dFlame);
    }

    // 1720 AD Inscribed Copper Plate on the altar
    const copperPlate = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.02, 0.35), this.mats.brassGold);
    copperPlate.position.set(12.0, 4.82, -10.2);
    this.scene.add(copperPlate);

    // Clue 13: The 1998 Rathore Confession Book (The Killer's Puzzled Ledger)
    const bookGroup = new THREE.Group();
    bookGroup.position.set(12.0, 4.82, -10.0);

    const bookCoverMat = new THREE.MeshStandardMaterial({ color: 0x5a111a, roughness: 0.65 });
    const bookCover = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.06, 0.4), bookCoverMat);
    bookGroup.add(bookCover);

    const bookPages = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.38), this.mats.parchmentPaper);
    bookPages.position.set(0.01, 0.005, 0);
    bookGroup.add(bookPages);

    const brassCorners = [
      [-0.25, -0.19], [0.25, -0.19], [-0.25, 0.19], [0.25, 0.19]
    ];
    brassCorners.forEach(([cx, cz]) => {
      const corner = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.05), this.mats.brassGold);
      corner.position.set(cx, 0, cz);
      bookGroup.add(corner);
    });

    bookGroup.userData = {
      clueId: 'clue_13',
      name: "The 1998 Rathore Confession Book (The Killer's Puzzled Ledger)",
      prompt: "[E] Inspect Confession Book & Puzzled Murder Evidence [Lead 10]"
    };
    this.interactables.push(bookGroup);
    this.scene.add(bookGroup);
    this.attachEvidenceBeacon(bookGroup, 'clue_13', 0xffd700);

    // Diya lamp beside the confession book
    const diyaLight = new THREE.PointLight(0xff7711, 3.5, 8.0);
    diyaLight.position.set(12.6, 4.98, -10.0);
    this.scene.add(diyaLight);

    const diyaMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.06, 16), this.mats.brassGold);
    diyaMesh.position.set(12.6, 4.75, -10.0);
    this.scene.add(diyaMesh);

    this.createMashaal(15.8, 5.8, -10.0, -Math.PI / 2);
  }

  // =========================================================
  // SHATTER MAGIC SEAL (Open Room 13)
  // =========================================================
  openRoom13() {
    this.player.isRoom13Open = true;

    // Golden Flash explosion effect
    if (this.magicLight) {
      this.magicLight.color.setHex(0xffdd44);
      this.magicLight.intensity = 8.0;
    }

    if (this.magicBarrierMesh) {
      let fadeOut = 1.0;
      const fadeInterval = setInterval(() => {
        fadeOut -= 0.05;
        if (fadeOut <= 0) {
          clearInterval(fadeInterval);
          this.magicBarrierMesh.visible = false;
          if (this.mandalaDecal) this.mandalaDecal.visible = false;
          this.magicRunes.forEach(r => (r.mesh.visible = false));
          if (this.magicLight) this.magicLight.intensity = 1.0;
        } else {
          this.magicBarrierMesh.material.opacity = fadeOut * 0.65;
          if (this.mandalaDecal) this.mandalaDecal.material.opacity = fadeOut * 0.85;
        }
      }, 30);
    }
  }

  // =========================================================
  // EVENT BINDINGS
  // =========================================================
  bindEvents() {
    window.addEventListener('resize', () => {
      if (!this.renderer || !this.camera) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'KeyE') {
        this.checkInteraction();
      }
      if (e.code === 'KeyL') {
        this.toggleLantern();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    const canvasEl = this.renderer.domElement;
    canvasEl.addEventListener('click', () => {
      if (!this.isPointerLocked) {
        canvasEl.requestPointerLock?.().catch(() => {});
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === canvasEl;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPointerLocked) return;
      const sensitivity = 0.0022;
      this.yaw -= e.movementX * sensitivity;
      this.pitch -= e.movementY * sensitivity;
      this.pitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.pitch));
    });
  }

  toggleLantern() {
    this.player.lanternOn = !this.player.lanternOn;
    if (this.lanternLight) {
      this.lanternLight.visible = this.player.lanternOn;
    }
  }

  checkInteraction() {
    if (this.hoveredObject && this.hoveredObject.userData?.clueId) {
      this.onInteraction(this.hoveredObject.userData);
    }
  }

  triggerInteraction() {
    return this.checkInteraction();
  }

  updateRaycaster() {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);

    const intersects = raycaster.intersectObjects(this.interactables, true);
    if (intersects.length > 0 && intersects[0].distance < 5.2) {
      let root = intersects[0].object;
      while (root && !root.userData?.clueId && root.parent) {
        root = root.parent;
      }
      if (root && root.userData?.clueId) {
        this.hoveredObject = root;
        document.body.style.cursor = 'pointer';
        return root.userData;
      }
    }
    this.hoveredObject = null;
    document.body.style.cursor = 'default';
    return null;
  }

  // =========================================================
  // SMOOTH CENTRAL STAIR RAMP & 13-ROOM COLLISION CHECK
  // =========================================================
  checkWalkablePosition(x, z, currentY) {
    // 1. GRAND CENTRAL IMPERIAL STAIRCASE (Middle of Haveli Courtyard)
    // Runs North along z from 9.6 down to 3.0, width x: [-2.7, 2.7].
    // Math ramp provides seamless, effortless climb from Ground y=0 to Second Floor y=4.0!
    if (x >= -2.7 && x <= 2.7 && z >= 3.0 && z <= 9.6) {
      const t = Math.max(0, Math.min(1, (9.6 - z) / 6.6));
      const elevation = t * 4.0;
      return { walkable: true, y: elevation, floor: elevation >= 2.0 ? 1 : 0 };
    }

    // 2. SECOND FLOOR (y = 4.0)
    if (currentY >= 2.5) {
      // Room 13: THE THIRTEENTH ROOM (x: 7.8 to 16.2, z: -14.5 to -5.8)
      if (x >= 7.8 && x <= 16.2 && z >= -14.5 && z <= -5.8) {
        if (this.player.isRoom13Open) return { walkable: true, y: 4.0, floor: 1 };
        // If sealed, blocked at magic barrier plane (x = 7.85)
        return { walkable: false, y: 4.0, floor: 1 };
      }

      // Eastern Magic Corridor leading to Room 13 barrier
      if (x >= 2.5 && x <= 7.9 && z >= -14.5 && z <= -5.5) return { walkable: true, y: 4.0, floor: 1 };

      // Room 10: Meera's Bedchamber (North-Center)
      if (x >= -7.8 && x <= 2.8 && z >= -14.5 && z <= -5.5) return { walkable: true, y: 4.0, floor: 1 };

      // Room 11: Royal Toshakhana (Armory, North-West)
      if (x >= -16.2 && x <= -7.5 && z >= -14.5 && z <= -5.5) return { walkable: true, y: 4.0, floor: 1 };

      // Room 9: Family Mandir & Sacred Shrine (Mid-West)
      if (x >= -16.2 && x <= -7.5 && z >= -5.8 && z <= 3.8) return { walkable: true, y: 4.0, floor: 1 };

      // Room 8: 1998 Police Investigation Office (South-West)
      if (x >= -16.2 && x <= -7.5 && z >= 3.5 && z <= 16.2) return { walkable: true, y: 4.0, floor: 1 };

      // Room 7: Architect Arvind Joshi's Drafting Studio (Mid-East)
      if (x >= 7.5 && x <= 16.2 && z >= -5.8 && z <= 5.2) return { walkable: true, y: 4.0, floor: 1 };

      // Room 12: Upper Jharokha Terrace (Wind Pavilion, South)
      if (x >= -7.8 && x <= 7.8 && z >= 13.5 && z <= 19.5) return { walkable: true, y: 4.0, floor: 1 };

      // Second Floor Central Mezzanine Hallway & Ancestral Portrait Landing (North of Courtyard)
      if (x >= -7.8 && x <= 7.8 && z >= 1.5 && z <= 4.5) return { walkable: true, y: 4.0, floor: 1 };

      // North Corridor connecting Mezzanine Landing to Room 10, 9 & 11
      if (x >= -7.8 && x <= 7.8 && z >= -5.8 && z <= 2.0) return { walkable: true, y: 4.0, floor: 1 };

      // Second Floor Balcony Walkways surrounding Central Courtyard Atrium
      // West Balcony:
      if (x >= -7.8 && x <= -5.0 && z >= 3.0 && z <= 14.5) return { walkable: true, y: 4.0, floor: 1 };
      // East Balcony:
      if (x >= 5.0 && x <= 7.8 && z >= 3.0 && z <= 14.5) return { walkable: true, y: 4.0, floor: 1 };
      // South Balcony:
      if (x >= -7.8 && x <= 7.8 && z >= 11.5 && z <= 14.5) return { walkable: true, y: 4.0, floor: 1 };

      // East Upper Gallery / corridor to Room 7
      if (x >= 7.5 && x <= 16.2 && z >= 4.5 && z <= 16.2) return { walkable: true, y: 4.0, floor: 1 };

      return { walkable: false, y: 4.0, floor: 1 };
    }

    // 3. GROUND FLOOR (y = 0.0)
    // Room 1: Grand Entrance Pol (South)
    if (x >= -4.2 && x <= 4.2 && z >= 13.5 && z <= 19.5) return { walkable: true, y: 0.0, floor: 0 };

    // Room 2: Central Aangan Courtyard & Flanking Ground Corridors
    // (West courtyard corridor)
    if (x >= -7.8 && x <= -2.6 && z >= 2.8 && z <= 14.2) return { walkable: true, y: 0.0, floor: 0 };
    // (East courtyard corridor)
    if (x >= 2.6 && x <= 7.8 && z >= 2.8 && z <= 14.2) return { walkable: true, y: 0.0, floor: 0 };
    // (South courtyard fountain area)
    if (x >= -7.8 && x <= 7.8 && z >= 9.4 && z <= 14.2) return { walkable: true, y: 0.0, floor: 0 };
    // (North ground passage into Diwan-e-Aam)
    if (x >= -7.8 && x <= 7.8 && z >= 2.5 && z <= 3.8) return { walkable: true, y: 0.0, floor: 0 };

    // Room 3: Diwan-e-Aam (Reception)
    if (x >= -7.8 && x <= 7.8 && z >= -5.8 && z <= 3.5) return { walkable: true, y: 0.0, floor: 0 };

    // Room 4: Thakur Vikram's Private Study (North-West)
    if (x >= -16.2 && x <= -7.5 && z >= -5.8 && z <= 3.8) return { walkable: true, y: 0.0, floor: 0 };

    // Room 5: Kamla Bai's Quarters (South-West)
    if (x >= -16.2 && x <= -7.5 && z >= 3.5 && z <= 16.2) return { walkable: true, y: 0.0, floor: 0 };

    // East Wing Ground Hall: Royal Ancestral Hall / Diwan-e-Khas (East)
    if (x >= 7.5 && x <= 16.2 && z >= -5.8 && z <= 16.2) return { walkable: true, y: 0.0, floor: 0 };

    return { walkable: false, y: currentY, floor: 0 };
  }

  // =========================================================
  // IDENTIFY 13 ROOMS BY COORDINATES & FLOOR
  // =========================================================
  identifyCurrentRoom(x, z, floor) {
    if (floor === 1) {
      if (x >= 7.8 && z <= -5.8) return { key: 'room_13', name: 'Room 13: THE THIRTEENTH ROOM', floorName: 'SECOND FLOOR' };
      if (x >= 2.5 && z <= -5.5) return { key: 'sealed_corridor', name: 'Eastern Magic Corridor', floorName: 'SECOND FLOOR' };
      if (x >= -16.2 && x <= -7.5 && z <= -5.5) return { key: 'room_11', name: 'Room 11: Royal Toshakhana (Armory)', floorName: 'SECOND FLOOR' };
      if (x <= 2.8 && z <= -5.5) return { key: 'room_10', name: "Room 10: Meera's Bedchamber", floorName: 'SECOND FLOOR' };
      if (x <= -7.5 && z <= 3.8) return { key: 'room_09', name: 'Room 9: Family Mandir & Sacred Shrine', floorName: 'SECOND FLOOR' };
      if (x <= -7.5 && z > 3.8) return { key: 'room_08', name: 'Room 8: 1998 Police Investigation Office', floorName: 'SECOND FLOOR' };
      if (x >= 7.5 && z <= 5.2 && z >= -5.8) return { key: 'room_07', name: "Room 7: Arvind's Drafting Studio", floorName: 'SECOND FLOOR' };
      if (z >= 13.5) return { key: 'room_12', name: 'Room 12: Upper Jharokha Terrace (Wind Pavilion)', floorName: 'SECOND FLOOR' };
      return { key: 'room_06', name: 'Room 6: Grand Central Staircase & Ancestral Gallery', floorName: 'SECOND FLOOR' };
    } else {
      if (x >= -2.7 && x <= 2.7 && z >= 3.0 && z <= 9.6) return { key: 'room_06', name: 'Room 6: Grand Central Staircase & Ancestral Gallery', floorName: 'STAIRWAY' };
      if (x <= -7.5 && z <= 3.8) return { key: 'room_04', name: "Room 4: Thakur Vikram's Study", floorName: 'GROUND FLOOR' };
      if (x <= -7.5 && z > 3.8) return { key: 'room_05', name: "Room 5: Kamla Bai's Quarters", floorName: 'GROUND FLOOR' };
      if (x >= 7.5) return { key: 'diwan_khas', name: 'Diwan-e-Khas (Royal Ancestral Hall)', floorName: 'GROUND FLOOR' };
      if (z <= 3.5 && z >= -5.8) return { key: 'room_03', name: 'Room 3: Diwan-e-Aam (Reception)', floorName: 'GROUND FLOOR' };
      if (z >= 13.5) return { key: 'room_01', name: 'Room 1: Grand Entrance Pol', floorName: 'GROUND FLOOR' };
      return { key: 'room_02', name: 'Room 2: Central Aangan Courtyard', floorName: 'GROUND FLOOR' };
    }
  }

  // =========================================================
  // ANIMATION & RENDER LOOP
  // =========================================================
  render() {
    requestAnimationFrame(() => this.render());

    const now = performance.now();
    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    // 1. Update Player Movement & Camera
    this.updatePlayer(delta);

    // 2. Animate Mashaals with Vivid Fire Flickering
    const timeSec = now * 0.005;
    for (let i = 0; i < this.mashaals.length; i++) {
      const m = this.mashaals[i];
      const flicker = 0.85 + 0.3 * Math.sin(timeSec * 3.2 + m.seed) * Math.cos(timeSec * 5.4 + m.seed * 2);
      m.light.intensity = m.baseIntensity * flicker;
      const s = 0.95 + 0.18 * Math.sin(timeSec * 8.0 + m.seed);
      m.flameMesh.scale.set(s, s * (1.0 + 0.12 * Math.cos(timeSec * 12.0)), s);
      m.flameOuter.scale.set(s * 1.1, s * 1.05, s * 1.1);
    }

    // 3. Animate Chandeliers with subtle warm pulse
    for (let i = 0; i < this.chandeliers.length; i++) {
      const ch = this.chandeliers[i];
      ch.light.intensity = ch.baseIntensity * (0.94 + 0.08 * Math.sin(timeSec * 1.5 + ch.seed));
    }

    // 4. Animate Evidence Beacons (Gentle Pulsing Halos & Rotating Glyphs)
    for (let i = 0; i < this.evidenceBeacons.length; i++) {
      const b = this.evidenceBeacons[i];
      const pulse = 0.35 + 0.25 * Math.sin(timeSec * 3.5 + b.seed);
      b.colMat.opacity = pulse;
      b.glyph.rotation.y += 0.025;
      b.glyph.rotation.x += 0.015;
      b.glyph.position.y = b.baseY + Math.sin(timeSec * 2.5 + b.seed) * 0.08;
    }

    // 5. Animate Magic Tantric Runes orbiting the Room 13 seal
    if (!this.player.isRoom13Open) {
      for (let r = 0; r < this.magicRunes.length; r++) {
        const rune = this.magicRunes[r];
        rune.angle += 0.02;
        const rad = 1.35;
        rune.mesh.position.set(
          7.85,
          5.7 + Math.sin(rune.angle) * rad,
          -10.0 + Math.cos(rune.angle) * rad
        );
        rune.mesh.rotation.x += 0.03;
        rune.mesh.rotation.y += 0.04;
      }
      if (this.mandalaDecal) {
        this.mandalaDecal.rotation.z += 0.005; // Slowly rotates the blood mandala
      }
    }

    // 6. Animate Clock Pendulum twitching backwards at 2:13 AM
    if (this.grandfatherClockPendulum) {
      this.pendulumAngle = Math.sin(now * 0.003) * 0.16;
      this.grandfatherClockPendulum.rotation.z = this.pendulumAngle;
    }

    // 7. Update Raycaster for Context Prompts
    this.updateRaycaster();

    // 8. Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  updatePlayer(delta) {
    const moveVector = new THREE.Vector3();
    const speed = this.player.speed * delta;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveVector.z -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveVector.z += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveVector.x -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveVector.x += 1;

    let isMoving = false;
    if (moveVector.lengthSq() > 0) {
      moveVector.normalize();
      moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);

      const nextX = this.player.position.x + moveVector.x * speed;
      const nextZ = this.player.position.z + moveVector.z * speed;

      // 1. Try full movement (nextX, nextZ)
      const colBoth = this.checkWalkablePosition(nextX, nextZ, this.player.floorY);
      if (colBoth.walkable) {
        this.player.position.x = nextX;
        this.player.position.z = nextZ;
        this.player.floorY = colBoth.y;
        this.player.currentFloor = colBoth.floor;
        isMoving = true;
      } else {
        // 2. Smooth Wall Slide along X axis
        const colX = this.checkWalkablePosition(nextX, this.player.position.z, this.player.floorY);
        if (colX.walkable) {
          this.player.position.x = nextX;
          this.player.floorY = colX.y;
          this.player.currentFloor = colX.floor;
          isMoving = true;
        } else {
          // 3. Smooth Wall Slide along Z axis
          const colZ = this.checkWalkablePosition(this.player.position.x, nextZ, this.player.floorY);
          if (colZ.walkable) {
            this.player.position.z = nextZ;
            this.player.floorY = colZ.y;
            this.player.currentFloor = colZ.floor;
            isMoving = true;
          }
        }
      }

      this.player.bobTimer += delta * 8.0;
      this.camera.position.y = this.player.floorY + 1.58 + Math.sin(this.player.bobTimer) * 0.04;
    } else {
      this.camera.position.y = this.player.floorY + 1.58;
    }

    this.camera.rotation.set(0, 0, 0);
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
    this.camera.position.x = this.player.position.x;
    this.camera.position.z = this.player.position.z;

    // Lantern dynamic follow
    if (this.lanternLight && this.player.lanternOn) {
      const flicker = 1.0 + (Math.random() - 0.5) * 0.1;
      this.lanternLight.intensity = 3.6 * this.player.lanternIntensity * flicker;
      this.lanternLight.position.set(
        this.player.position.x + Math.sin(this.yaw) * 0.35,
        this.camera.position.y - 0.2 + Math.cos(this.player.bobTimer) * 0.03,
        this.player.position.z + Math.cos(this.yaw) * 0.35
      );
    }

    // Room 13 Tantric Barrier Proximity
    if (this.player.currentFloor === 1) {
      const distTo13th = this.player.position.distanceTo(new THREE.Vector3(7.85, 4.0, -10.0));
      if (distTo13th < 5.0) {
        this.player.isNear13thWall = true;
        if (this.magicLight) {
          const prox = Math.min(1.0, (5.0 - distTo13th) / 3.0);
          this.magicLight.intensity = 3.0 + prox * 3.5;
        }
      } else {
        this.player.isNear13thWall = false;
        if (this.magicLight && !this.player.isRoom13Open) {
          this.magicLight.intensity = 3.0;
        }
      }
    } else {
      this.player.isNear13thWall = false;
    }

    // Room identifier trigger
    const currentRoom = this.identifyCurrentRoom(this.player.position.x, this.player.position.z, this.player.currentFloor);
    if (currentRoom.key !== this.player.currentRoomKey) {
      this.player.currentRoomKey = currentRoom.key;
      if (this.onPlayerMove) {
        this.onPlayerMove({
          position: this.player.position,
          roomKey: currentRoom.key,
          roomName: currentRoom.name,
          floorName: currentRoom.floorName
        });
      }
    }
  }
}
