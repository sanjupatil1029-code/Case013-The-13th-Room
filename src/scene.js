// CASE 013: Abandoned Indian Folk Horror House Environment Engine
// Authentic Rural Village & Haveli Architecture: Compact, Claustrophobic, Uneven Dehleez Thresholds,
// Low Sagging Rafters, Damp Chuna Plaster & Seelan, Mold, Hanging Yellow Bulbs, Brass Diyas, Zero Western Furniture.

import * as THREE from 'three';

export class HaveliScene {
  constructor(canvasContainer, onInteractObject, onPlayerMove) {
    this.container = canvasContainer;
    this.onInteract = onInteractObject;
    this.onPlayerMove = onPlayerMove;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Movement & Rooms State
    this.player = {
      position: new THREE.Vector3(0, 1.5, 6.2),
      speed: 3.8,
      lanternOn: true,
      lanternIntensity: 1.0,
      bobTimer: 0,
      isNear13thWall: false,
      isRoom13Open: false
    };

    this.keys = {};
    this.isPointerLocked = false;
    this.pitch = 0;
    this.yaw = 0;
    this.lastTime = performance.now();
    this.elapsedTime = 0;

    // Interactive Objects List & Raycaster
    this.interactables = [];
    this.hoveredObject = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(0, 0);

    // Dynamic Elements
    this.lanternLight = null;
    this.ambientLight = null;
    this.lightningLight = null;
    this.hangingBulbGroup = null;
    this.bulbLight = null;
    this.diyaLight = null;
    this.particles = null;
    this.mandalaDecal = null;

    this.init();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x030406);
    this.scene.fog = new THREE.FogExp2(0x05070a, 0.048);

    // 2. Camera setup - realistic low eye-level for claustrophobic Indian rooms
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(65, aspect, 0.1, 100);
    this.camera.position.set(0, 1.5, 6.2);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting - Very low light, yellow bulbs & diyas
    this.setupIndianHorrorLighting();

    // 5. Build the Complete Indian Folk Horror House
    this.buildIndianFolkHorrorHouse();

    // 6. Floating Dust & Soot Particles
    this.setupDustParticles();

    // 7. Event Listeners
    this.bindEvents();

    // 8. Animation Loop
    this.animate();
  }

  setupIndianHorrorLighting() {
    // Extremely dim ambient cool night light
    this.ambientLight = new THREE.AmbientLight(0x080c14, 0.35);
    this.scene.add(this.ambientLight);

    // Distant Lightning Flash Light
    this.lightningLight = new THREE.DirectionalLight(0x99bbff, 0.0);
    this.lightningLight.position.set(0, 20, 0);
    this.scene.add(this.lightningLight);

    // Player Kerosene Lantern / Hand Diya
    this.lanternLight = new THREE.PointLight(0xff9933, 2.4, 14, 2.0);
    this.lanternLight.castShadow = true;
    this.lanternLight.shadow.bias = -0.002;
    this.lanternLight.position.copy(this.camera.position);
    this.scene.add(this.lanternLight);
  }

  // =========================================================
  // PROCEDURAL HIGH-RES AUTHENTIC INDIAN TEXTURES
  // =========================================================
  generateFolkTextures() {
    // 1. Cracked Cement Wall with Peeling Lime (Chuna), Damp Seelan, Water Seepage & Mold
    const wallCanvas = document.createElement('canvas');
    wallCanvas.width = 1024;
    wallCanvas.height = 1024;
    const wCtx = wallCanvas.getContext('2d');

    // Base decaying plaster color (aged dull turmeric-lime / mud chuna)
    wCtx.fillStyle = '#3a342c';
    wCtx.fillRect(0, 0, 1024, 1024);

    // Underlying rough grey cement & red clay brick showing through peeled patches
    wCtx.fillStyle = '#272320';
    for (let i = 0; i < 15; i++) {
      const bx = Math.random() * 900;
      const by = Math.random() * 900;
      const bw = 60 + Math.random() * 120;
      const bh = 40 + Math.random() * 90;
      wCtx.fillRect(bx, by, bw, bh);
      // Faint brick texture
      wCtx.strokeStyle = 'rgba(60, 25, 20, 0.6)';
      wCtx.lineWidth = 2;
      wCtx.strokeRect(bx, by, bw, bh);
    }

    // Peeling Chuna (lime-wash flakes)
    wCtx.fillStyle = 'rgba(180, 172, 150, 0.45)';
    for (let i = 0; i < 6000; i++) {
      const px = Math.random() * 1024;
      const py = Math.random() * 1024;
      wCtx.fillRect(px, py, Math.random() * 6, Math.random() * 6);
    }

    // Damp Patches (Seelan) - Dark water stains creeping up from floor & down from ceiling
    const seelanGrad = wCtx.createLinearGradient(0, 1024, 0, 400);
    seelanGrad.addColorStop(0, 'rgba(18, 16, 12, 0.95)');
    seelanGrad.addColorStop(0.4, 'rgba(28, 26, 20, 0.7)');
    seelanGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    wCtx.fillStyle = seelanGrad;
    wCtx.fillRect(0, 400, 1024, 624);

    // Ceiling water seepage streaks running down
    wCtx.strokeStyle = 'rgba(15, 14, 11, 0.7)';
    wCtx.lineWidth = 4;
    for (let s = 0; s < 18; s++) {
      let sx = Math.random() * 1024;
      let sy = 0;
      wCtx.beginPath();
      wCtx.moveTo(sx, sy);
      while (sy < 450) {
        sx += (Math.random() - 0.5) * 14;
        sy += 15 + Math.random() * 20;
        wCtx.lineTo(sx, sy);
      }
      wCtx.stroke();
    }

    // Dark greenish-black mold patches in corners
    wCtx.fillStyle = 'rgba(12, 18, 10, 0.65)';
    for (let m = 0; m < 35; m++) {
      const mx = Math.random() * 1024;
      const my = 700 + Math.random() * 324;
      wCtx.beginPath();
      wCtx.arc(mx, my, 20 + Math.random() * 40, 0, Math.PI * 2);
      wCtx.fill();
    }

    // Hairline fractures and deep plaster cracks
    wCtx.strokeStyle = 'rgba(10, 8, 6, 0.9)';
    wCtx.lineWidth = 2.2;
    for (let c = 0; c < 12; c++) {
      let cx = Math.random() * 1024;
      let cy = Math.random() * 1024;
      wCtx.beginPath();
      wCtx.moveTo(cx, cy);
      for (let s = 0; s < 10; s++) {
        cx += (Math.random() - 0.5) * 55;
        cy += (Math.random() - 0.5) * 55;
        wCtx.lineTo(cx, cy);
      }
      wCtx.stroke();
    }

    // Ancient scratched tally marks (Groups of 5 scratches tallying up to 13)
    wCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    wCtx.lineWidth = 1.8;
    let tx = 480;
    let ty = 380;
    for (let group = 0; group < 2; group++) {
      for (let t = 0; t < 4; t++) {
        wCtx.beginPath();
        wCtx.moveTo(tx + t * 8, ty);
        wCtx.lineTo(tx + t * 8 + (Math.random() - 0.5) * 2, ty + 28);
        wCtx.stroke();
      }
      // Diagonal strike
      wCtx.beginPath();
      wCtx.moveTo(tx - 3, ty + 22);
      wCtx.lineTo(tx + 28, ty + 6);
      wCtx.stroke();
      tx += 44;
    }
    // 3 extra scratches to total 13
    for (let t = 0; t < 3; t++) {
      wCtx.beginPath();
      wCtx.moveTo(tx + t * 8, ty);
      wCtx.lineTo(tx + t * 8, ty + 28);
      wCtx.stroke();
    }

    // Faded red vermilion/sindoor thumb marks (thaapa)
    wCtx.fillStyle = 'rgba(140, 25, 25, 0.45)';
    wCtx.beginPath();
    wCtx.arc(420, 390, 8, 0, Math.PI * 2);
    wCtx.fill();

    const wallTex = new THREE.CanvasTexture(wallCanvas);
    wallTex.wrapS = THREE.RepeatWrapping;
    wallTex.wrapT = THREE.RepeatWrapping;
    wallTex.repeat.set(2, 1);

    // 2. Broken Terracotta & Cracked Red Oxide Floor
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;
    const fCtx = floorCanvas.getContext('2d');

    // Traditional red oxide base
    fCtx.fillStyle = '#321c17';
    fCtx.fillRect(0, 0, 1024, 1024);

    // Broken square tiles with uneven dirt grout
    const tileSize = 128;
    for (let y = 0; y < 1024; y += tileSize) {
      for (let x = 0; x < 1024; x += tileSize) {
        const isBroken = (x + y) % 3 === 0;
        fCtx.fillStyle = isBroken ? '#261612' : '#3d221c';
        fCtx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

        // Tile edge chipping & dirt
        fCtx.strokeStyle = 'rgba(10, 8, 6, 0.8)';
        fCtx.lineWidth = 3;
        fCtx.strokeRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
      }
    }

    // Floor cracks running across tiles
    fCtx.strokeStyle = 'rgba(12, 8, 5, 0.9)';
    fCtx.lineWidth = 2.5;
    for (let fc = 0; fc < 8; fc++) {
      let fx = Math.random() * 1024;
      let fy = Math.random() * 1024;
      fCtx.beginPath();
      fCtx.moveTo(fx, fy);
      for (let s = 0; s < 12; s++) {
        fx += (Math.random() - 0.5) * 70;
        fy += (Math.random() - 0.5) * 70;
        fCtx.lineTo(fx, fy);
      }
      fCtx.stroke();
    }

    const floorTex = new THREE.CanvasTexture(floorCanvas);
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(3, 3);

    // 3. Sagging Wooden Rafters (Kadi-Chhat) Ceiling Texture
    const ceilCanvas = document.createElement('canvas');
    ceilCanvas.width = 512;
    ceilCanvas.height = 512;
    const cCtx = ceilCanvas.getContext('2d');
    cCtx.fillStyle = '#1c1712';
    cCtx.fillRect(0, 0, 512, 512);

    // Dark wood grain beams
    for (let y = 0; y < 512; y += 48) {
      cCtx.fillStyle = '#110c08';
      cCtx.fillRect(0, y, 512, 16);
      cCtx.fillStyle = 'rgba(5, 4, 3, 0.7)';
      cCtx.fillRect(0, y + 14, 512, 4);
    }
    const ceilTex = new THREE.CanvasTexture(ceilCanvas);
    ceilTex.wrapS = THREE.RepeatWrapping;
    ceilTex.wrapT = THREE.RepeatWrapping;
    ceilTex.repeat.set(2, 4);

    return {
      dampWall: new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.92, metalness: 0.05 }),
      brokenFloor: new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.55, metalness: 0.2 }),
      rafterCeiling: new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.85 }),
      agedTeak: new THREE.MeshStandardMaterial({ color: 0x1d130a, roughness: 0.7 }),
      rustedIron: new THREE.MeshStandardMaterial({ color: 0x16171a, metalness: 0.85, roughness: 0.5 }),
      agedBrass: new THREE.MeshStandardMaterial({ color: 0xba8a38, metalness: 0.88, roughness: 0.35 }),
      terracottaClay: new THREE.MeshStandardMaterial({ color: 0x5a2b1f, roughness: 0.85 })
    };
  }

  // =========================================================
  // BUILD COMPLETE INDIAN FOLK HORROR HOUSE
  // =========================================================
  buildIndianFolkHorrorHouse() {
    const mats = this.generateFolkTextures();
    const texLoader = new THREE.TextureLoader();

    // 1. THE ENTRANCE HALL (Compact, Claustrophobic, Uneven Dehleez, Sagging Rafters)
    this.buildEntranceHall(mats);

    // 2. THE ASYMMETRICAL CORRIDORS & STAIRCASE (Crooked turns, low arches, uneven steps)
    this.buildLabyrinthCorridor(mats, texLoader);

    // 3. THE 13TH CHAMBER (The secret prison chamber built to contain the curse)
    this.buildTheThirteenthChamber(mats, texLoader);
  }

  buildEntranceHall(mats) {
    const hall = new THREE.Group();
    hall.position.set(0, 0, 4.5);

    // --- LOW CEILING WITH DARK WOODEN BEAMS (kadi-chhat) ---
    // Height is strictly 2.9m (low, oppressive)
    const ceilGeo = new THREE.PlaneGeometry(8, 7.5);
    const ceiling = new THREE.Mesh(ceilGeo, mats.rafterCeiling);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 2.9, 0);
    hall.add(ceiling);

    // Heavy wooden transverse kadi beams
    for (let b = -3; b <= 3; b += 1.2) {
      const beamGeo = new THREE.BoxGeometry(8, 0.22, 0.18);
      const beam = new THREE.Mesh(beamGeo, mats.agedTeak);
      beam.position.set(0, 2.8, b);
      beam.castShadow = true;
      hall.add(beam);
    }

    // --- UNEVEN FLOOR & RAISED WOODEN THRESHOLD (Dehleez) ---
    // Sunken floor with cracked broken red oxide tiles
    const floorGeo = new THREE.PlaneGeometry(8, 7.5);
    const floor = new THREE.Mesh(floorGeo, mats.brokenFloor);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 0);
    floor.receiveShadow = true;
    hall.add(floor);

    // Raised Entrance Dehleez (0.16m high carved wooden doorstep at South entrance)
    const dehleezGeo = new THREE.BoxGeometry(2.4, 0.16, 0.35);
    const dehleez = new THREE.Mesh(dehleezGeo, mats.agedTeak);
    dehleez.position.set(0, 0.08, 3.5);
    dehleez.castShadow = true;
    hall.add(dehleez);

    // --- CRACKED CEMENT WALLS WITH SEELAN & MOLD ---
    // South Wall (Entrance Doorway)
    const southWallLeft = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.9, 0.35), mats.dampWall);
    southWallLeft.position.set(-2.6, 1.45, 3.6);
    hall.add(southWallLeft);

    const southWallRight = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.9, 0.35), mats.dampWall);
    southWallRight.position.set(2.6, 1.45, 3.6);
    hall.add(southWallRight);

    // Heavy Indian Village Entrance Door (Kapaat with iron saankal / kundi)
    const doorFrameGeo = new THREE.BoxGeometry(2.4, 2.3, 0.2);
    const doorFrame = new THREE.Mesh(doorFrameGeo, mats.agedTeak);
    doorFrame.position.set(0, 1.35, 3.65);
    hall.add(doorFrame);

    // Ward charm above door: Dried neem leaves & black thread Nazar Battu
    const charmGeo = new THREE.BoxGeometry(0.8, 0.06, 0.06);
    const charm = new THREE.Mesh(charmGeo, mats.agedTeak);
    charm.position.set(0, 2.35, 3.6);
    hall.add(charm);

    // West Wall (angled slightly for non-symmetrical organic construction)
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.9, 7.5), mats.dampWall);
    westWall.position.set(-3.8, 1.45, 0);
    westWall.rotation.y = 0.03; // Intentional subtle asymmetry
    hall.add(westWall);

    // East Wall
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.9, 7.5), mats.dampWall);
    eastWall.position.set(3.8, 1.45, 0);
    hall.add(eastWall);

    // --- CARVED WALL NICHES (Taaq) WITH OIL LAMPS (Diyas) ---
    // Recessed niche on West Wall with burning mitti ka diya
    const nicheFrame = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6, 0.5), mats.agedTeak);
    nicheFrame.position.set(-3.65, 1.5, 1.2);
    hall.add(nicheFrame);

    const clayDiya = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.08, 12), mats.terracottaClay);
    clayDiya.position.set(-3.6, 1.35, 1.2);
    hall.add(clayDiya);

    const diyaGlow = new THREE.PointLight(0xff7711, 1.5, 5, 2);
    diyaGlow.position.set(-3.5, 1.45, 1.2);
    hall.add(diyaGlow);

    // --- THE HANGING YELLOW BULB (Swinging & Flickering) ---
    this.hangingBulbGroup = new THREE.Group();
    this.hangingBulbGroup.position.set(0, 2.8, 0.5);

    // Frayed cloth wire
    const wireGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.9, 8);
    const wire = new THREE.Mesh(wireGeo, mats.rustedIron);
    wire.position.set(0, -0.45, 0);
    this.hangingBulbGroup.add(wire);

    // Socket
    const socketGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12);
    const socket = new THREE.Mesh(socketGeo, mats.rustedIron);
    socket.position.set(0, -0.9, 0);
    this.hangingBulbGroup.add(socket);

    // Yellow bulb glass mesh
    const bulbGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffdd66 });
    const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
    bulbMesh.position.set(0, -0.96, 0);
    this.hangingBulbGroup.add(bulbMesh);

    // Dynamic Yellow Light (Casts deep, shifting shadows across the broken room)
    this.bulbLight = new THREE.PointLight(0xffaa22, 2.0, 11, 1.6);
    this.bulbLight.castShadow = true;
    this.bulbLight.shadow.bias = -0.003;
    this.bulbLight.position.set(0, -0.98, 0);
    this.hangingBulbGroup.add(this.bulbLight);

    hall.add(this.hangingBulbGroup);

    // --- DEEPLY INDIAN FOLK HORROR FURNISHINGS (NO WESTERN DESKS) ---
    // 1. Traditional Low Wooden Platform (Chowki / Baithak)
    const chowkiTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 1.1), mats.agedTeak);
    chowkiTop.position.set(2.2, 0.32, 0.8);
    chowkiTop.castShadow = true;
    hall.add(chowkiTop);

    // Carved stubby legs
    for (let lx of [-0.75, 0.75]) {
      for (let lz of [-0.4, 0.4]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.28, 8), mats.agedTeak);
        leg.position.set(2.2 + lx, 0.14, 0.8 + lz);
        hall.add(leg);
      }
    }

    // On the Chowki: Brass Pooja Thali with Sindoor & Bell
    const thaliGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.02, 24);
    const thali = new THREE.Mesh(thaliGeo, mats.agedBrass);
    thali.position.set(1.8, 0.4, 0.8);
    hall.add(thali);

    const bellGeo = new THREE.ConeGeometry(0.06, 0.14, 12);
    const bell = new THREE.Mesh(bellGeo, mats.agedBrass);
    bell.position.set(1.8, 0.48, 0.8);
    hall.add(bell);

    // The 1998 Microcassette Recorder resting on the Chowki (Clue 5)
    const tapeGeo = new THREE.BoxGeometry(0.45, 0.1, 0.6);
    const tapePlayer = new THREE.Mesh(tapeGeo, mats.rustedIron);
    tapePlayer.position.set(2.4, 0.44, 0.8);
    tapePlayer.rotation.y = 0.2;
    tapePlayer.castShadow = true;
    hall.add(tapePlayer);

    tapePlayer.userData = {
      clueId: 'clue_05',
      name: 'The 1998 Microcassette Recorder',
      prompt: '[E] Play Microcassette Recording'
    };
    this.interactables.push(tapePlayer);

    // Haveli Parchment Blueprint (Clue 3)
    const bpGeo = new THREE.PlaneGeometry(0.65, 0.5);
    const bpMat = new THREE.MeshStandardMaterial({ color: 0x223545, roughness: 0.8 });
    const blueprint = new THREE.Mesh(bpGeo, bpMat);
    blueprint.rotation.x = -Math.PI / 2;
    blueprint.position.set(2.4, 0.39, 1.15);
    hall.add(blueprint);

    blueprint.userData = {
      clueId: 'clue_03',
      name: 'Haveli Floor Plan Blueprint',
      prompt: '[E] Inspect Architectural Floor Plan'
    };
    this.interactables.push(blueprint);

    // 2. Iron-Strapped Antique Wooden Chest (Sandook) in the dark corner
    const sandook = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.75, 0.85), mats.agedTeak);
    sandook.position.set(-2.8, 0.38, -1.8);
    sandook.rotation.y = -0.3;
    sandook.castShadow = true;
    hall.add(sandook);

    // Rusted iron bands around the sandook
    const bandGeo = new THREE.BoxGeometry(1.42, 0.77, 0.08);
    const band1 = new THREE.Mesh(bandGeo, mats.rustedIron);
    band1.position.set(-2.8, 0.38, -1.8);
    band1.rotation.y = -0.3;
    hall.add(band1);

    // 3. Earthen Clay Matka (water pot) wrapped in sacred red thread in dark corner
    const matkaGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const matka = new THREE.Mesh(matkaGeo, mats.terracottaClay);
    matka.position.set(-3.2, 0.28, 2.8);
    hall.add(matka);

    // 4. Traditional Carved Indian Wooden Jharokha Frame with the 1998 Family Portrait (Clue 6)
    const jharokha = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.45, 0.15), mats.agedTeak);
    jharokha.position.set(-3.6, 1.6, -0.4);
    jharokha.rotation.y = Math.PI / 2;
    hall.add(jharokha);

    const texLoader = new THREE.TextureLoader();
    const portraitTex = texLoader.load('/assets/rathore_family_portrait.jpg');
    const portraitPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.25), new THREE.MeshStandardMaterial({ map: portraitTex, roughness: 0.6 }));
    portraitPlane.position.set(-3.51, 1.6, -0.4);
    portraitPlane.rotation.y = Math.PI / 2;
    hall.add(portraitPlane);

    jharokha.userData = {
      clueId: 'clue_06',
      name: 'Rathore Ancestral Portrait (1998)',
      prompt: '[E] Inspect Portrait / [C] Take Polaroid'
    };
    this.interactables.push(jharokha);

    // 5. 13th Bell Mounting Hook (Clue 10)
    const hookGeo = new THREE.TorusGeometry(0.14, 0.025, 8, 16, Math.PI * 1.5);
    const hook = new THREE.Mesh(hookGeo, mats.rustedIron);
    hook.position.set(0, 2.65, 0.2);
    hook.rotation.z = Math.PI;
    hall.add(hook);

    hook.userData = {
      clueId: 'clue_10',
      name: 'The 13th Bell Mounting Hook',
      prompt: '[E] Inspect the 13th Courtyard Bell'
    };
    this.interactables.push(hook);

    // Narrow claustrophobic doorway leading forward (North) into the crooked haveli corridor
    const northPortalGeo = new THREE.BoxGeometry(1.3, 2.3, 0.35);
    const northPortal = new THREE.Mesh(northPortalGeo, mats.agedTeak);
    northPortal.position.set(0, 1.15, -3.7);
    hall.add(northPortal);

    this.scene.add(hall);
  }

  buildLabyrinthCorridor(mats, texLoader) {
    // Non-symmetrical, claustrophobic corridor that turns irregularly
    const corridor = new THREE.Group();
    corridor.position.set(0, 0, -14);

    // Low ceiling (2.8m)
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(5, 20), mats.rafterCeiling);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, 2.8, 0);
    corridor.add(ceil);

    // Uneven broken floor with steps
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(5, 20), mats.brokenFloor);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 0);
    corridor.add(floor);

    // Walls with damp seelan, water stains & cracked cement
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.8, 20), mats.dampWall);
    leftWall.position.set(-2.5, 1.4, 0);
    corridor.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.8, 20), mats.dampWall);
    rightWall.position.set(2.5, 1.4, 0);
    corridor.add(rightWall);

    // Wall Niche with clay diya casting amber glow along the dark corridor
    const diyaGlow2 = new THREE.PointLight(0xff7711, 1.6, 6, 2);
    diyaGlow2.position.set(-2.2, 1.4, -4);
    corridor.add(diyaGlow2);

    // The Grandfather Clock frozen at 2:13 AM (Clue 1)
    const clockBody = new THREE.Group();
    clockBody.position.set(2.1, 1.5, -2);

    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.6, 0.45), mats.agedTeak);
    clockBody.add(cabinet);

    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 24), new THREE.MeshStandardMaterial({ color: 0xeee2c0 }));
    face.rotation.x = Math.PI / 2;
    face.position.set(0, 0.7, 0.24);
    clockBody.add(face);

    // Hands set to 2:13
    const hHand = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.12, 0.01), mats.agedBrass);
    hHand.position.set(0.03, 0.73, 0.26);
    hHand.rotation.z = -Math.PI / 3;
    clockBody.add(hHand);

    const mHand = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.18, 0.01), mats.agedBrass);
    mHand.position.set(0.04, 0.76, 0.26);
    mHand.rotation.z = -Math.PI * 0.42;
    clockBody.add(mHand);

    corridor.add(clockBody);

    cabinet.userData = {
      clueId: 'clue_01',
      name: 'Grandfather Clock (Stopped at 2:13 AM)',
      prompt: '[E] Inspect Clock Face & Hinges'
    };
    this.interactables.push(cabinet);

    // Rajput Brass Key with Housekeeper Prints (Clue 8) hidden in alcove
    const keyGeo = new THREE.TorusGeometry(0.09, 0.022, 8, 16);
    const brassKey = new THREE.Mesh(keyGeo, mats.agedBrass);
    brassKey.position.set(-2.2, 1.3, -4);
    corridor.add(brassKey);

    brassKey.userData = {
      clueId: 'clue_08',
      name: 'Antique Rajput Brass Key',
      prompt: '[E] Collect Brass Key with Fingerprints'
    };
    this.interactables.push(brassKey);

    // Sealed Wall at the end of corridor (-24m) concealing Room 13
    const sealedWall = new THREE.Mesh(new THREE.BoxGeometry(5, 2.8, 0.4), mats.dampWall);
    sealedWall.position.set(0, 1.4, -9.8);
    corridor.add(sealedWall);

    // Hidden Mandala Ward Decal on the Sealed Wall
    const mandalaTex = texLoader.load('/assets/mandala.png');
    const mandalaMat = new THREE.MeshStandardMaterial({
      map: mandalaTex,
      transparent: true,
      opacity: 0.15,
      emissive: new THREE.Color(0xb87333),
      emissiveIntensity: 0.2
    });
    this.mandalaDecal = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), mandalaMat);
    this.mandalaDecal.position.set(0, 1.4, -9.58);
    corridor.add(this.mandalaDecal);

    this.mandalaDecal.userData = {
      clueId: 'clue_08',
      name: 'The Sealed 13th Room Partition',
      prompt: '[E] Examine Sealed Masonry (Requires Brass Key & Chapter 4)'
    };
    this.interactables.push(this.mandalaDecal);

    this.scene.add(corridor);
  }

  buildTheThirteenthChamber(mats, texLoader) {
    // The Cursed Chamber built to contain the supernatural entity (z: -32)
    const chamber = new THREE.Group();
    chamber.position.set(0, 0, -32);

    // Claustrophobic low vault (2.7m)
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), mats.rafterCeiling);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, 2.7, 0);
    chamber.add(ceil);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), mats.brokenFloor);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 0);
    chamber.add(floor);

    // Walls with damp seepage and black mold
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(7, 2.7, 0.35), mats.dampWall);
    backWall.position.set(0, 1.35, -3.5);
    chamber.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.7, 7), mats.dampWall);
    leftWall.position.set(-3.5, 1.35, 0);
    chamber.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.7, 7), mats.dampWall);
    rightWall.position.set(3.5, 1.35, 0);
    chamber.add(rightWall);

    // Low wooden chauki altar
    const chauki = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 1.0), mats.agedTeak);
    chauki.position.set(0, 0.18, -1.8);
    chauki.castShadow = true;
    chamber.add(chauki);

    // Perpetual Brass Diya (burning with mustard oil flame since 1998)
    const diyaMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.08, 0.14, 16), mats.agedBrass);
    diyaMesh.position.set(0, 0.42, -1.8);
    chamber.add(diyaMesh);

    this.diyaLight = new THREE.PointLight(0xff6600, 2.2, 9, 2);
    this.diyaLight.position.set(0, 0.65, -1.8);
    this.diyaLight.castShadow = true;
    chamber.add(this.diyaLight);

    // Meera's Diary on Chauki (Clue 2)
    const diaryGeo = new THREE.BoxGeometry(0.42, 0.08, 0.58);
    const diaryMat = new THREE.MeshStandardMaterial({ color: 0x3d2015, roughness: 0.5 });
    const diary = new THREE.Mesh(diaryGeo, diaryMat);
    diary.position.set(-0.45, 0.4, -1.8);
    diary.rotation.y = 0.2;
    chamber.add(diary);

    diary.userData = {
      clueId: 'clue_02',
      name: "Meera Rathore's Journal (Final July 14 Entry)",
      prompt: "[E] Read Meera's Final Diary Entries"
    };
    this.interactables.push(diary);

    // The 1963 Child Talisman / Mandala (Clue 11)
    const talisMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 24), mats.agedBrass);
    talisMesh.position.set(0.45, 0.38, -1.8);
    chamber.add(talisMesh);

    talisMesh.userData = {
      clueId: 'clue_11',
      name: 'The 1963 Erased Child Talisman',
      prompt: '[E] Retrieve Anand’s 1963 Birth Talisman'
    };
    this.interactables.push(talisMesh);

    chauki.userData = {
      clueId: 'clue_13',
      name: 'The 13th Room Altar & Twin Shadows',
      prompt: '[E] Inspect the July 1998 Altar & Final Records'
    };
    this.interactables.push(chauki);

    this.scene.add(chamber);
  }

  setupDustParticles() {
    const particleCount = 550;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = Math.random() * 2.8;
      positions[i + 2] = (Math.random() - 0.5) * 44 - 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xdd9944,
      size: 0.045,
      transparent: true,
      opacity: 0.5
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  openRoom13() {
    this.player.isRoom13Open = true;
    if (this.mandalaDecal) {
      this.mandalaDecal.material.opacity = 0.95;
      this.mandalaDecal.material.emissiveIntensity = 2.4;
    }
  }

  triggerLightning() {
    if (!this.lightningLight) return;
    this.lightningLight.intensity = 3.6;
    setTimeout(() => {
      this.lightningLight.intensity = 0.2;
      setTimeout(() => {
        this.lightningLight.intensity = 2.8;
        setTimeout(() => {
          this.lightningLight.intensity = 0.0;
        }, 110);
      }, 60);
    }, 130);
  }

  bindEvents() {
    // Keyboard Input
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'KeyL') {
        this.toggleLantern();
      }
      if (e.code === 'KeyE') {
        this.triggerInteraction();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Mouse Look (Drag or PointerLock)
    let isMouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    window.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'CANVAS') {
        isMouseDown = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    });

    window.addEventListener('mouseup', () => {
      isMouseDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPointerLocked) {
        const movementX = e.movementX || 0;
        const movementY = e.movementY || 0;
        this.yaw -= movementX * 0.0022;
        this.pitch -= movementY * 0.0022;
        this.pitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.pitch));
      } else if (isMouseDown) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        this.yaw -= deltaX * 0.003;
        this.pitch -= deltaY * 0.003;
        this.pitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.pitch));
      }
    });

    window.addEventListener('resize', () => {
      if (!this.camera || !this.renderer) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  toggleLantern() {
    this.player.lanternOn = !this.player.lanternOn;
    this.lanternLight.intensity = this.player.lanternOn ? 2.4 * this.player.lanternIntensity : 0.0;
  }

  triggerInteraction() {
    if (this.hoveredObject && this.onInteract) {
      this.onInteract(this.hoveredObject.userData);
    }
  }

  checkRaycast() {
    this.mouse.set(0, 0); // Aim with center reticle
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactables, true);

    if (intersects.length > 0 && intersects[0].distance < 6.0) {
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

      // Restrict boundaries along the narrow, compact cursed haveli corridors
      const minZ = this.player.isRoom13Open ? -36 : -23.5;
      if (nextX > -3.2 && nextX < 3.2 && nextZ > minZ && nextZ < 7.8) {
        this.player.position.x = nextX;
        this.player.position.z = nextZ;
        isMoving = true;
      }

      // Uneven floor height: subtle step up/down over dehleez thresholds
      let floorElev = 0;
      if (this.player.position.z > 6.8) floorElev = 0.16; // Dehleez step-up
      else if (this.player.position.z < -9 && this.player.position.z > -11) floorElev = 0.12; // Corridor step-up

      this.player.bobTimer += delta * 8.0;
      this.camera.position.y = 1.5 + floorElev + Math.sin(this.player.bobTimer) * 0.045;
    } else {
      let floorElev = 0;
      if (this.player.position.z > 6.8) floorElev = 0.16;
      else if (this.player.position.z < -9 && this.player.position.z > -11) floorElev = 0.12;
      this.camera.position.y = 1.5 + floorElev;
    }

    // Update camera orientation and position
    this.camera.rotation.set(0, 0, 0);
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
    this.camera.position.x = this.player.position.x;
    this.camera.position.z = this.player.position.z;

    // Lantern dynamic follow & tremble
    if (this.lanternLight && this.player.lanternOn) {
      const flicker = 1.0 + (Math.random() - 0.5) * 0.12;
      this.lanternLight.intensity = 2.4 * this.player.lanternIntensity * flicker;
      this.lanternLight.position.set(
        this.player.position.x + Math.sin(this.yaw) * 0.3,
        this.camera.position.y - 0.25 + Math.cos(this.player.bobTimer) * 0.03,
        this.player.position.z + Math.cos(this.yaw) * 0.3
      );
    }

    // Determine current zone based on depth along the cursed haveli
    let zone = 'Grand Entrance Hall (Dehleez)';
    let roomKey = 'colonnade';

    if (this.player.position.z <= -24.5) {
      zone = 'The 13th Chamber';
      roomKey = 'shrine';
    } else if (this.player.position.z <= -8.5) {
      zone = 'Claustrophobic Corridor';
      roomKey = 'corridor';
    } else if (this.player.position.z <= 1.0) {
      zone = 'Decaying Inner Hall';
      roomKey = 'staircase';
    }

    // Proximity to Sealed 13th Room Partition
    const distTo13thWall = Math.abs(this.player.position.z - (-23.8));
    if (distTo13thWall < 4.5 && this.player.lanternOn) {
      this.player.isNear13thWall = true;
      if (this.mandalaDecal) {
        const proximityIntensity = Math.min(1.0, (4.5 - distTo13thWall) / 3.0);
        this.mandalaDecal.material.opacity = 0.2 + proximityIntensity * 0.75;
        this.mandalaDecal.material.emissiveIntensity = 0.3 + proximityIntensity * 1.6;
      }
    } else {
      this.player.isNear13thWall = false;
      if (this.mandalaDecal && !this.player.isRoom13Open) {
        this.mandalaDecal.material.opacity = 0.15;
        this.mandalaDecal.material.emissiveIntensity = 0.2;
      }
    }

    if (this.onPlayerMove && isMoving) {
      this.onPlayerMove({ position: this.player.position, zone, roomKey });
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const now = performance.now();
    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    this.elapsedTime += delta;

    this.updatePlayer(delta);

    // Dynamic Yellow Bulb Swinging (Pendulum physics) & Electrical Flicker
    if (this.hangingBulbGroup && this.bulbLight) {
      const swingAngle = Math.sin(this.elapsedTime * 1.6) * 0.12;
      this.hangingBulbGroup.rotation.z = swingAngle;

      // Realistic random electrical filament flicker
      let flickerIntensity = 2.0 + Math.sin(this.elapsedTime * 7.5) * 0.2;
      if (Math.random() < 0.035) {
        flickerIntensity = 0.35 + Math.random() * 0.5; // sudden electrical dip
      }
      this.bulbLight.intensity = flickerIntensity;
    }

    // Diya flame flicker
    if (this.diyaLight) {
      this.diyaLight.intensity = 2.2 + Math.sin(this.elapsedTime * 14) * 0.4 + Math.random() * 0.1;
    }

    // Ambient soot & dust drift
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= delta * 0.06;
        if (positions[i] < 0) positions[i] = 2.8;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
