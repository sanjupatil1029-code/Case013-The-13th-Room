// CASE 013: THE 13TH ROOM - Game Master Controller & State Progression

import { HaveliScene } from './scene.js';
import { audio } from './audio.js';
import { suspectsData, cluesData, deductionsData, chaptersData, endingsData, investigationSteps, haveliRooms } from './gameData.js';
import { EvidenceBoard } from './evidenceBoard.js';
import { CassettePlayer } from './cassettePlayer.js';
import { PolaroidCamera } from './polaroidCamera.js';
import { SuspectDossier } from './suspectDossier.js';

class GameController {
  constructor() {
    this.currentChapterIndex = 0;
    this.currentLeadIndex = 1;
    this.investigationSteps = investigationSteps;
    this.lastRoomKey = null;
    this.roomToastTimeout = null;

    this.clues = cluesData;
    this.deductions = deductionsData;
    this.suspects = suspectsData;
    this.inventory = new Set();
    this.hasUnlockedRoom13 = false;

    // Tantric Unsealing Spell & Ritual State
    this.ritualCurrentStep = 0;
    this.ritualSequence = ['agni', 'vayu', 'jala', 'prithvi'];
    this.ritualRuneNames = {
      agni: '🔥 AGNI',
      vayu: '💨 VAYU',
      jala: '🌊 JALA',
      prithvi: '🪨 PRITHVI'
    };

    this.scene = null;
    this.evidenceBoard = null;
    this.cassettePlayer = null;
    this.polaroidCamera = null;
    this.suspectDossier = null;

    this.init();
  }

  init() {
    // 1. Initialize 3D Scene
    const canvasContainer = document.getElementById('canvas-container');
    this.scene = new HaveliScene(
      canvasContainer,
      (clueData) => this.handleObjectInteraction(clueData),
      (moveData) => this.handlePlayerMovement(moveData)
    );

    // 2. Initialize Subsystems
    this.evidenceBoard = new EvidenceBoard(
      document.getElementById('evidence-board-root'),
      this.clues,
      this.deductions,
      (deduction) => this.handleDeductionSolved(deduction)
    );

    this.cassettePlayer = new CassettePlayer(
      document.getElementById('cassette-player-root'),
      audio,
      () => this.handleCassetteSecretDiscovered()
    );

    this.polaroidCamera = new PolaroidCamera(
      document.getElementById('polaroid-camera-root'),
      this.scene,
      audio,
      (photoResult) => this.handlePhotoTaken(photoResult)
    );

    this.suspectDossier = new SuspectDossier(
      document.getElementById('suspect-dossier-root'),
      this.suspects,
      this.clues,
      this.deductions,
      (suspect) => this.handleSuspectConfronted(suspect)
    );

    // 3. Bind UI, Landing Page & Toolbars
    this.bindHUD();
    this.bindLandingPage();
    this.updateLeadObjectiveHUD();

    // Continuous raycasting loop for interaction prompt
    setInterval(() => {
      this.updateInteractionPrompt();
    }, 100);
  }

  bindLandingPage() {
    const landingEl = document.getElementById('landing-page-overlay');
    const enterBtn = document.getElementById('landing-enter-btn');
    const playTapeBtn = document.getElementById('landing-play-tape-btn');
    const viewInteriorBtn = document.getElementById('landing-view-interior-btn');
    const caseBriefBtn = document.getElementById('landing-case-brief-btn');

    const interiorModal = document.getElementById('interior-showcase-modal');
    const closeInteriorBtn = document.getElementById('close-interior-modal-btn');
    const interiorToolbarBtn = document.getElementById('btn-interior-view');

    // Enter Haveli Transition
    enterBtn?.addEventListener('click', () => {
      audio.ensureContext();
      audio.playThunder(1.2);
      audio.playHaveliBell(1.0, false);

      if (landingEl) {
        landingEl.style.opacity = '0';
        setTimeout(() => {
          landingEl.style.display = 'none';
          this.showChapterBanner(0);
        }, 1100);
      }
    });

    // Preview Cassette Tape on Landing Page
    playTapeBtn?.addEventListener('click', () => {
      audio.ensureContext();
      audio.playCassetteClick();
      audio.playTapeHiss(8);
      playTapeBtn.textContent = '▶ PLAYING TAPE...';
      playTapeBtn.style.color = '#ff4444';

      setTimeout(() => {
        audio.playThirteenKnocks((k) => {
          playTapeBtn.textContent = `▶ KNOCK ${k}/13`;
        });
        setTimeout(() => {
          playTapeBtn.textContent = '▶ REPLAY TAPE';
          playTapeBtn.style.color = '#fff';
        }, 7500);
      }, 2000);
    });

    // View Haveli Interior Modal (Uploaded Images)
    const roomData = {
      colonnade: {
        title: 'RATHORE HAVELI · GRAND ENTRANCE COLONNADE',
        img: '/assets/room_colonnade.jpg',
        desc: '<strong>ARCHITECTURAL & FORENSIC LOG:</strong><br/>• High vaulted Rajput timber colonnades and iron chandeliers.<br/>• The entrance gates sealed at 02:13 AM behind the investigator.<br/>• The acoustic resonance amplifies thunder from the Thar desert monsoon.'
      },
      staircase: {
        title: 'RATHORE HAVELI · GRAND DECAYING STAIRCASE',
        img: '/assets/haveli_interior.jpg',
        desc: '<strong>ARCHITECTURAL & FORENSIC LOG:</strong><br/>• 300-year-old carved timber double staircase with worn crimson runner.<br/>• Peeling turquoise lime plaster concealing decades of family secrets.<br/>• High arched windows looking out into the pitch-black Rajasthan rain.'
      },
      corridor: {
        title: 'RATHORE HAVELI · SEALED EASTERN CORRIDOR',
        img: '/assets/room_corridor.jpg',
        desc: '<strong>ARCHITECTURAL & FORENSIC LOG:</strong><br/>• Narrow stone corridor where all grandfather clocks stopped at 2:13 AM.<br/>• Arvind Joshi recorded a 1.4-meter acoustic hollow behind the south wall.<br/>• Fresh charcoal scrawl: "CASE 013 IS OPEN".'
      },
      shrine: {
        title: 'RATHORE HAVELI · VAULTED SHRINE & 13TH CHAMBER',
        img: '/assets/room_shrine.jpg',
        desc: '<strong>ARCHITECTURAL & FORENSIC LOG:</strong><br/>• Deep gothic rib vaulting, ancestral pooja altar, and bronze diya lamp.<br/>• The brass oil lamp has burned perpetually with no smoke since July 14, 1998.<br/>• Twin shadows are cast upon the stone wall when illuminated.'
      }
    };

    this.updateInteriorDisplay = (roomKey) => {
      const data = roomData[roomKey] || roomData.staircase;
      const titleEl = document.getElementById('interior-room-title');
      const imgEl = document.getElementById('interior-modal-img');
      const descEl = document.getElementById('interior-modal-desc');

      if (titleEl) titleEl.textContent = data.title;
      if (imgEl) imgEl.src = data.img;
      if (descEl) descEl.innerHTML = data.desc;

      const tabs = interiorModal?.querySelectorAll('.int-tab-btn');
      tabs?.forEach(t => {
        t.classList.toggle('active', t.dataset.room === roomKey);
      });
    };

    interiorModal?.querySelectorAll('.int-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.updateInteriorDisplay(e.target.dataset.room);
      });
    });

    const openInterior = () => {
      audio.ensureContext();
      audio.playPaperRustle();
      if (interiorModal) {
        interiorModal.style.display = 'flex';
        if (this.currentRoomKey) {
          this.updateInteriorDisplay(this.currentRoomKey);
        }
      }
    };

    viewInteriorBtn?.addEventListener('click', openInterior);
    interiorToolbarBtn?.addEventListener('click', openInterior);

    closeInteriorBtn?.addEventListener('click', () => {
      if (interiorModal) interiorModal.style.display = 'none';
    });

    // Case Dossier preview on landing
    caseBriefBtn?.addEventListener('click', () => {
      audio.ensureContext();
      this.toggleSuspectDossier();
    });

    // 'I' Key to view Haveli Interior
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyI' && !this.isAnyInputFocused()) {
        if (interiorModal.style.display === 'flex') {
          interiorModal.style.display = 'none';
        } else {
          openInterior();
        }
      }
    });
  }

  bindHUD() {
    // Audio context resume on first click
    window.addEventListener('click', () => {
      audio.ensureContext();
    }, { once: true });

    // Pointer Lock for realistic FPS
    const canvasEl = this.scene.renderer.domElement;
    canvasEl.addEventListener('click', () => {
      if (!this.isAnyModalOpen()) {
        if (this.scene.hoveredObject) {
          this.scene.checkInteraction();
        } else {
          try {
            const p = canvasEl.requestPointerLock();
            if (p && p.catch) p.catch(() => {});
          } catch (e) {}
        }
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.scene.isPointerLocked = (document.pointerLockElement === canvasEl);
    });

    // Toolbar buttons
    document.getElementById('btn-haveli-map')?.addEventListener('click', () => {
      this.toggleHaveliMap();
    });

    document.getElementById('btn-board')?.addEventListener('click', () => {
      this.toggleEvidenceBoard();
    });

    document.getElementById('btn-dossier')?.addEventListener('click', () => {
      this.toggleSuspectDossier();
    });

    document.getElementById('btn-tape')?.addEventListener('click', () => {
      this.toggleCassettePlayer();
    });

    document.getElementById('btn-camera')?.addEventListener('click', () => {
      this.toggleCamera();
    });

    document.getElementById('btn-lantern')?.addEventListener('click', () => {
      this.scene.toggleLantern();
      audio.playKeyTurn();
    });

    // Map Floor Switcher Tabs & Close Button
    document.getElementById('close-map-btn')?.addEventListener('click', () => {
      this.toggleHaveliMap();
    });

    document.getElementById('map-tab-ground')?.addEventListener('click', () => {
      this.currentMapFloor = 0;
      this.renderHaveliMap();
    });

    document.getElementById('map-tab-second')?.addEventListener('click', () => {
      this.currentMapFloor = 1;
      this.renderHaveliMap();
    });

    // Global Keybindings
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyM' && !this.isAnyInputFocused()) {
        this.toggleHaveliMap();
      }
      if (e.code === 'Tab') {
        e.preventDefault();
        this.toggleEvidenceBoard();
      }
      if (e.code === 'KeyT' && !this.isAnyInputFocused()) {
        this.toggleCassettePlayer();
      }
      if (e.code === 'KeyQ' && !this.isAnyInputFocused()) {
        this.triggerDetectiveFocus();
      }
      if (e.code === 'Escape') {
        const spellModal = document.getElementById('meera-spell-modal');
        if (spellModal && spellModal.style.display === 'flex') spellModal.style.display = 'none';
        const ritualModal = document.getElementById('blood-seal-ritual-modal');
        if (ritualModal && ritualModal.style.display === 'flex') ritualModal.style.display = 'none';
        const confessionModal = document.getElementById('confession-book-modal');
        if (confessionModal && confessionModal.style.display === 'flex') confessionModal.style.display = 'none';
        const killerModal = document.getElementById('killer-identified-modal');
        if (killerModal && killerModal.style.display === 'flex') killerModal.style.display = 'none';
      }
    });

    document.getElementById('btn-focus')?.addEventListener('click', () => {
      this.triggerDetectiveFocus();
    });

    // Room 13 Confession Book Modal Controls
    document.getElementById('close-confession-modal-btn')?.addEventListener('click', () => {
      const modal = document.getElementById('confession-book-modal');
      if (modal) modal.style.display = 'none';
    });

    const openBoardFromLedger = () => {
      const modal = document.getElementById('confession-book-modal');
      if (modal) modal.style.display = 'none';
      this.evidenceBoard.open();
    };
    document.getElementById('btn-ledger-open-board')?.addEventListener('click', openBoardFromLedger);
    document.getElementById('btn-ledger-footer-open-board')?.addEventListener('click', openBoardFromLedger);

    // Killer Identified Cinematic Modal Controls
    document.getElementById('btn-accuse-vikram-now')?.addEventListener('click', () => {
      const modal = document.getElementById('killer-identified-modal');
      if (modal) modal.style.display = 'none';
      this.showEndingSelection();
    });

    document.getElementById('btn-close-killer-modal')?.addEventListener('click', () => {
      const modal = document.getElementById('killer-identified-modal');
      if (modal) modal.style.display = 'none';
      this.evidenceBoard.open();
    });

    // Meera's Pictorial Spell Modal Controls
    document.getElementById('tab-spell-diagram')?.addEventListener('click', () => {
      document.getElementById('tab-spell-diagram').classList.add('active');
      document.getElementById('tab-diary-entry').classList.remove('active');
      document.getElementById('spell-diagram-container').style.display = 'block';
      document.getElementById('spell-journal-container').style.display = 'none';
    });
    document.getElementById('tab-diary-entry')?.addEventListener('click', () => {
      document.getElementById('tab-diary-entry').classList.add('active');
      document.getElementById('tab-spell-diagram').classList.remove('active');
      document.getElementById('spell-diagram-container').style.display = 'none';
      document.getElementById('spell-journal-container').style.display = 'block';
    });
    document.getElementById('close-spell-modal-btn')?.addEventListener('click', () => {
      document.getElementById('meera-spell-modal').style.display = 'none';
    });
    document.getElementById('btn-proceed-to-room13')?.addEventListener('click', () => {
      document.getElementById('meera-spell-modal').style.display = 'none';
      this.notifyDiscovery('🎯 OBJECTIVE: Proceed to the Eastern Corridor on Floor 2 and break the Blood Seal!');
    });

    // Preview Rune Chimes from Pictorial Diagram
    document.querySelectorAll('.rune-glyph').forEach((glyph) => {
      glyph.addEventListener('click', () => {
        const rune = glyph.dataset.rune;
        const idx = this.ritualSequence.indexOf(rune);
        if (idx >= 0) audio.playRuneChant(idx);
      });
    });

    // Room 13 Tantric Blood Seal Ritual Buttons
    ['agni', 'vayu', 'jala', 'prithvi'].forEach((rune) => {
      document.getElementById(`rune-btn-${rune}`)?.addEventListener('click', () => {
        this.handleRuneClicked(rune);
      });
    });
    document.getElementById('central-strike-btn')?.addEventListener('click', () => {
      this.strikeCentralBindu();
    });
    document.getElementById('close-ritual-modal-btn')?.addEventListener('click', () => {
      document.getElementById('blood-seal-ritual-modal').style.display = 'none';
    });
    document.getElementById('ritual-view-diary-btn')?.addEventListener('click', () => {
      document.getElementById('blood-seal-ritual-modal').style.display = 'none';
      this.openMeeraSpellModal();
    });

    // Inspection Modal Close
    document.getElementById('close-inspect-btn')?.addEventListener('click', () => {
      document.getElementById('inspect-modal').style.display = 'none';
    });

    // Final Confrontation Action Button in Chapter 5
    document.getElementById('resolve-case-btn')?.addEventListener('click', () => {
      this.showEndingSelection();
    });
  }

  isAnyInputFocused() {
    return document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA');
  }

  isAnyModalOpen() {
    const landing = document.getElementById('landing-page-overlay');
    const interior = document.getElementById('interior-showcase-modal');
    const haveliMap = document.getElementById('haveli-map-modal');
    const confessionModal = document.getElementById('confession-book-modal');
    const killerModal = document.getElementById('killer-identified-modal');
    const spellModal = document.getElementById('meera-spell-modal');
    const ritualModal = document.getElementById('blood-seal-ritual-modal');
    return (
      (landing && landing.style.display !== 'none') ||
      (interior && interior.style.display === 'flex') ||
      (haveliMap && haveliMap.style.display === 'flex') ||
      (confessionModal && confessionModal.style.display === 'flex') ||
      (killerModal && killerModal.style.display === 'flex') ||
      (spellModal && spellModal.style.display === 'flex') ||
      (ritualModal && ritualModal.style.display === 'flex') ||
      document.getElementById('evidence-board-root').style.display === 'block' ||
      document.getElementById('suspect-dossier-root').style.display === 'block' ||
      document.getElementById('cassette-player-root').style.display === 'block' ||
      this.polaroidCamera.isOpen ||
      document.getElementById('inspect-modal').style.display === 'flex' ||
      document.getElementById('chapter-banner-modal').style.display === 'flex' ||
      document.getElementById('ending-modal').style.display === 'flex'
    );
  }

  toggleEvidenceBoard() {
    const el = document.getElementById('evidence-board-root');
    if (el.style.display === 'block') {
      this.evidenceBoard.close();
    } else {
      audio.playPaperRustle();
      this.evidenceBoard.open();
    }
  }

  toggleSuspectDossier() {
    const el = document.getElementById('suspect-dossier-root');
    if (el.style.display === 'block') {
      this.suspectDossier.close();
    } else {
      audio.playPaperRustle();
      this.suspectDossier.open();
    }
  }

  toggleCassettePlayer() {
    const el = document.getElementById('cassette-player-root');
    if (el.style.display === 'block') {
      this.cassettePlayer.stop();
      el.style.display = 'none';
    } else {
      this.cassettePlayer.open();
    }
  }

  toggleCamera() {
    if (this.polaroidCamera.isOpen) {
      this.polaroidCamera.close();
    } else {
      this.polaroidCamera.open();
    }
  }

  toggleHaveliMap() {
    const el = document.getElementById('haveli-map-modal');
    if (!el) return;
    if (el.style.display === 'flex') {
      el.style.display = 'none';
    } else {
      audio.playPaperRustle();
      this.currentMapFloor = this.scene.player.currentFloor || 0;
      el.style.display = 'flex';
      this.renderHaveliMap();
    }
  }

  renderHaveliMap() {
    const svgEl = document.getElementById('haveli-svg-map');
    if (!svgEl) return;
    const floor = this.currentMapFloor || 0;

    // Update Tab UI
    document.getElementById('map-tab-ground')?.classList.toggle('active', floor === 0);
    document.getElementById('map-tab-second')?.classList.toggle('active', floor === 1);

    // Update Telemetry
    const currentLead = this.investigationSteps[this.currentLeadIndex - 1];
    const roomTitle = document.getElementById('hud-location-name')?.textContent || 'GRAND ENTRANCE POL';
    const tRoom = document.getElementById('map-current-room');
    const tCoords = document.getElementById('map-current-coords');
    if (tRoom) tRoom.textContent = roomTitle;
    if (tCoords) {
      const heading = this.getCompassBearing();
      tCoords.textContent = `FLOOR: ${this.scene.player.currentFloor === 0 ? 'GROUND' : 'SECOND'} · HEADING: ${heading}`;
    }

    if (currentLead) {
      const lTitle = document.getElementById('map-lead-title');
      const lDesc = document.getElementById('map-lead-desc');
      if (lTitle) lTitle.textContent = `LEAD ${this.currentLeadIndex}: ${currentLead.title.toUpperCase()}`;
      if (lDesc) lDesc.textContent = `${currentLead.room} · ${currentLead.hint}`;
    }

    // Render Rooms Directory
    const dirEl = document.getElementById('map-rooms-directory');
    if (dirEl) {
      dirEl.innerHTML = haveliRooms.map(r => {
        const isCurrent = r.id === this.currentRoomKey;
        const isTarget = currentLead && currentLead.room.toLowerCase().includes(r.name.toLowerCase());
        return `
          <div class="room-dir-item ${isCurrent ? 'current-room' : ''}" data-floor="${r.floor.includes('Ground') ? 0 : 1}">
            <span><strong style="color: #ffd700;">#${r.num.toString().padStart(2, '0')}</strong> ${r.name}</span>
            <span class="room-num-badge">${isTarget ? '🎯 TARGET' : (isCurrent ? 'YOU' : r.floor.split(' ')[0])}</span>
          </div>
        `;
      }).join('');

      dirEl.querySelectorAll('.room-dir-item').forEach(item => {
        item.addEventListener('click', () => {
          const targetFloor = parseInt(item.dataset.floor, 10);
          if (this.currentMapFloor !== targetFloor) {
            this.currentMapFloor = targetFloor;
            this.renderHaveliMap();
          }
        });
      });
    }

    // Compute player marker on SVG
    const playerX = 400 + this.scene.player.position.x * 19.0;
    const playerY = 320 + this.scene.player.position.z * 15.0;
    const yawDeg = (this.scene.yaw * 180 / Math.PI) + 180;

    // Target lead marker
    let targetSvg = '';
    if (currentLead && currentLead.targetLocation) {
      const leadOnThisFloor = (floor === 0 && currentLead.floor.includes('Ground')) || (floor === 1 && (currentLead.floor.includes('Second') || currentLead.floor.includes('Mezzanine')));
      if (leadOnThisFloor) {
        const tx = 400 + currentLead.targetLocation.x * 19.0;
        const ty = 320 + currentLead.targetLocation.z * 15.0;
        targetSvg = `
          <g transform="translate(${tx}, ${ty})">
            <circle r="18" fill="none" stroke="#ff7711" stroke-width="2" stroke-dasharray="4,4">
              <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite"/>
            </circle>
            <circle r="8" fill="#ff7711" opacity="0.9" />
            <circle r="4" fill="#ffffff" />
            <text y="-22" text-anchor="middle" fill="#ff9944" font-size="11" font-weight="bold" font-family="monospace">🎯 TARGET LEAD ${this.currentLeadIndex}</text>
          </g>
        `;
      }
    }

    // Player Pin
    let playerSvg = '';
    if (this.scene.player.currentFloor === floor) {
      playerSvg = `
        <g id="svg-player-pin" transform="translate(${playerX}, ${playerY})">
          <g transform="rotate(${yawDeg})">
            <polygon points="0,0 -20,-45 20,-45" fill="rgba(255, 215, 0, 0.25)" stroke="rgba(255, 215, 0, 0.6)" stroke-width="1.5" />
          </g>
          <circle r="14" fill="none" stroke="#ffd700" stroke-width="2" opacity="0.8">
            <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1.0;0.2;1.0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle r="7" fill="#ffd700" stroke="#000" stroke-width="1.5" />
          <text y="22" text-anchor="middle" fill="#ffd700" font-size="10" font-weight="bold" font-family="monospace">YOU</text>
        </g>
      `;
    }

    if (floor === 0) {
      // Ground Floor Blueprint
      svgEl.innerHTML = `
        <defs>
          <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(180, 140, 60, 0.08)" stroke-width="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#100d0a" />
        <rect width="100%" height="100%" fill="url(#gridPattern)" />

        <rect x="70" y="40" width="660" height="600" fill="none" stroke="#5a4210" stroke-width="5" />
        <rect x="74" y="44" width="652" height="592" fill="rgba(30, 24, 18, 0.4)" />

        <!-- Room 01: Grand Entrance Pol -->
        <rect x="290" y="520" width="220" height="116" fill="rgba(110, 80, 40, 0.25)" stroke="#8b6508" stroke-width="2" />
        <text x="400" y="565" text-anchor="middle" fill="#f5c879" font-size="13" font-weight="bold">ROOM 01: GRAND ENTRANCE POL</text>
        <text x="400" y="585" text-anchor="middle" fill="#a09080" font-size="10">Hathi Pol Gates · Tape Recorder [Clue 05]</text>

        <!-- Room 02: Central Aangan Courtyard -->
        <rect x="210" y="240" width="380" height="280" fill="rgba(70, 50, 30, 0.2)" stroke="#8b6508" stroke-width="2" stroke-dasharray="6,4" />
        <text x="400" y="270" text-anchor="middle" fill="#ffd700" font-size="14" font-weight="bold">ROOM 02: CENTRAL AANGAN COURTYARD</text>
        <text x="400" y="288" text-anchor="middle" fill="#c0b090" font-size="10">Open-Sky Sandstone Atrium · Hanging Diya Jhumar Chandelier</text>

        <!-- Lotus Fountain -->
        <circle cx="400" cy="485" r="24" fill="rgba(26, 69, 63, 0.6)" stroke="#4da898" stroke-width="2" />
        <text x="400" y="489" text-anchor="middle" fill="#6fe3cf" font-size="9">Lotus Fountain</text>

        <!-- GRAND CENTRAL IMPERIAL STAIRCASE IN THE MIDDLE -->
        <g id="svg-central-stairs">
          <rect x="340" y="300" width="120" height="160" fill="rgba(140, 95, 30, 0.4)" stroke="#ffd700" stroke-width="2.5" />
          ${Array.from({ length: 12 }).map((_, i) => `
            <line x1="340" y1="${460 - i * 13}" x2="460" y2="${460 - i * 13}" stroke="#d4af37" stroke-width="1.5" />
          `).join('')}
          <text x="400" y="380" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="bold">▲ GRAND CENTRAL</text>
          <text x="400" y="396" text-anchor="middle" fill="#ffd700" font-size="10" font-weight="bold">IMPERIAL STAIRS</text>
          <text x="400" y="412" text-anchor="middle" fill="#dfd0b0" font-size="9">[Climb to 2nd Floor]</text>
        </g>

        <!-- Room 03: Diwan-e-Aam -->
        <rect x="210" y="50" width="380" height="190" fill="rgba(130, 30, 40, 0.2)" stroke="#8b6508" stroke-width="2" />
        <text x="400" y="125" text-anchor="middle" fill="#f5c879" font-size="13" font-weight="bold">ROOM 03: DIWAN-E-AAM (RECEPTION)</text>
        <text x="400" y="145" text-anchor="middle" fill="#a09080" font-size="10">Stopped Grandfather Clock 02:13 AM [Clue 01] · Persian Carpets</text>
        <text x="400" y="165" text-anchor="middle" fill="#887766" font-size="9">Royal Diwan Baithaks · Carved Teak Almirah</text>

        <!-- Room 04: Thakur Vikram's Study -->
        <rect x="80" y="50" width="130" height="230" fill="rgba(60, 40, 30, 0.3)" stroke="#8b6508" stroke-width="2" />
        <text x="145" y="130" text-anchor="middle" fill="#f5c879" font-size="11" font-weight="bold">ROOM 04:</text>
        <text x="145" y="148" text-anchor="middle" fill="#f5c879" font-size="11" font-weight="bold">THAKUR'S STUDY</text>
        <text x="145" y="172" text-anchor="middle" fill="#a09080" font-size="9">3:00 AM Order</text>
        <text x="145" y="186" text-anchor="middle" fill="#a09080" font-size="9">[Clue 07]</text>

        <!-- Room 05: Kamla Bai's Quarters -->
        <rect x="80" y="280" width="130" height="270" fill="rgba(60, 40, 30, 0.3)" stroke="#8b6508" stroke-width="2" />
        <text x="145" y="380" text-anchor="middle" fill="#f5c879" font-size="11" font-weight="bold">ROOM 05:</text>
        <text x="145" y="398" text-anchor="middle" fill="#f5c879" font-size="11" font-weight="bold">KAMLA BAI'S</text>
        <text x="145" y="416" text-anchor="middle" fill="#f5c879" font-size="11" font-weight="bold">QUARTERS</text>
        <text x="145" y="440" text-anchor="middle" fill="#a09080" font-size="9">Brass Key Trunk</text>
        <text x="145" y="454" text-anchor="middle" fill="#a09080" font-size="9">[Clue 08]</text>

        <!-- Diwan-e-Khas / East Hall -->
        <rect x="590" y="50" width="130" height="500" fill="rgba(80, 50, 20, 0.2)" stroke="#8b6508" stroke-width="2" />
        <text x="655" y="280" text-anchor="middle" fill="#f5c879" font-size="11" font-weight="bold">DIWAN-E-KHAS</text>
        <text x="655" y="300" text-anchor="middle" fill="#a09080" font-size="9">Royal Ancestral</text>
        <text x="655" y="315" text-anchor="middle" fill="#a09080" font-size="9">Hall & Urli Gallery</text>

        <!-- Doorways -->
        <rect x="360" y="516" width="80" height="8" fill="#100d0a" />
        <rect x="350" y="236" width="100" height="8" fill="#100d0a" />
        <rect x="206" y="110" width="8" height="60" fill="#100d0a" />
        <rect x="206" y="380" width="8" height="70" fill="#100d0a" />
        <rect x="586" y="380" width="8" height="70" fill="#100d0a" />

        ${targetSvg}
        ${playerSvg}
      `;
    } else {
      // Second Floor Blueprint
      const isRoom13Unlocked = this.scene.player.isRoom13Open;
      svgEl.innerHTML = `
        <defs>
          <pattern id="gridPattern2" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(180, 140, 60, 0.08)" stroke-width="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#100d0a" />
        <rect width="100%" height="100%" fill="url(#gridPattern2)" />

        <rect x="70" y="40" width="660" height="600" fill="none" stroke="#5a4210" stroke-width="5" />
        <rect x="74" y="44" width="652" height="592" fill="rgba(30, 24, 18, 0.4)" />

        <!-- Open Courtyard Atrium -->
        <rect x="270" y="270" width="260" height="240" fill="#090705" stroke="#7a5518" stroke-width="2" stroke-dasharray="4,4" />
        <text x="400" y="385" text-anchor="middle" fill="#665544" font-size="12" font-style="italic">OPEN COURTYARD ATRIUM</text>
        <text x="400" y="405" text-anchor="middle" fill="#554433" font-size="10">[Overlooking Marble Lotus Fountain]</text>

        <!-- Room 06: Grand Central Staircase & Gallery Landing -->
        <rect x="320" y="210" width="160" height="60" fill="rgba(140, 95, 30, 0.35)" stroke="#ffd700" stroke-width="2" />
        <text x="400" y="235" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="bold">ROOM 06: ANCESTRAL GALLERY</text>
        <text x="400" y="252" text-anchor="middle" fill="#ffd700" font-size="10">Rathore Family Portrait [Clue 06]</text>

        <!-- Room 10: Meera's Bedchamber -->
        <rect x="230" y="50" width="210" height="160" fill="rgba(110, 30, 45, 0.25)" stroke="#8b6508" stroke-width="2" />
        <text x="335" y="115" text-anchor="middle" fill="#f5c879" font-size="12" font-weight="bold">ROOM 10: MEERA'S</text>
        <text x="335" y="132" text-anchor="middle" fill="#f5c879" font-size="12" font-weight="bold">BEDCHAMBER</text>
        <text x="335" y="152" text-anchor="middle" fill="#a09080" font-size="9">Wet-Ink Diary [Clue 02]</text>
        <text x="335" y="166" text-anchor="middle" fill="#a09080" font-size="9">Canopied 4-Poster Bed</text>

        <!-- Room 11: Royal Toshakhana -->
        <rect x="80" y="50" width="150" height="160" fill="rgba(70, 40, 20, 0.3)" stroke="#8b6508" stroke-width="2" />
        <text x="155" y="115" text-anchor="middle" fill="#f5c879" font-size="11" font-weight="bold">ROOM 11:</text>
        <text x="155" y="132" text-anchor="middle" fill="#f5c879" font-size="11" font-weight="bold">TOSHAKHANA</text>
        <text x="155" y="152" text-anchor="middle" fill="#a09080" font-size="9">Rajput Weapons</text>
        <text x="155" y="166" text-anchor="middle" fill="#a09080" font-size="9">Royal Sandooks</text>

        <!-- Room 09: Family Mandir -->
        <rect x="80" y="210" width="150" height="150" fill="rgba(90, 60, 20, 0.25)" stroke="#8b6508" stroke-width="2" />
        <text x="155" y="265" text-anchor="middle" fill="#f5c879" font-size="11" font-weight="bold">ROOM 09:</text>
        <text x="155" y="282" text-anchor="middle" fill="#f5c879" font-size="11" font-weight="bold">FAMILY MANDIR</text>
        <text x="155" y="302" text-anchor="middle" fill="#a09080" font-size="9">13th Bell Hook [10]</text>
        <text x="155" y="316" text-anchor="middle" fill="#a09080" font-size="9">Child Talisman [11]</text>

        <!-- Room 08: 1998 Police Desk -->
        <rect x="80" y="360" width="150" height="190" fill="rgba(50, 45, 40, 0.3)" stroke="#8b6508" stroke-width="2" />
        <text x="155" y="435" text-anchor="middle" fill="#f5c879" font-size="11" font-weight="bold">ROOM 08: POLICE</text>
        <text x="155" y="452" text-anchor="middle" fill="#f5c879" font-size="11" font-weight="bold">DESK (1998)</text>
        <text x="155" y="475" text-anchor="middle" fill="#a09080" font-size="9">Carbon Statement</text>
        <text x="155" y="489" text-anchor="middle" fill="#a09080" font-size="9">[Clue 04]</text>

        <!-- Room 07: Arvind's Studio -->
        <rect x="580" y="210" width="140" height="160" fill="rgba(60, 50, 40, 0.3)" stroke="#8b6508" stroke-width="2" />
        <text x="650" y="270" text-anchor="middle" fill="#f5c879" font-size="11" font-weight="bold">ROOM 07:</text>
        <text x="650" y="288" text-anchor="middle" fill="#f5c879" font-size="11" font-weight="bold">ARVIND'S STUDIO</text>
        <text x="650" y="310" text-anchor="middle" fill="#a09080" font-size="9">Impossible Blueprints</text>
        <text x="650" y="324" text-anchor="middle" fill="#a09080" font-size="9">[Clue 03]</text>

        <!-- Room 12: Upper Jharokha Terrace -->
        <rect x="230" y="510" width="340" height="126" fill="rgba(80, 50, 30, 0.25)" stroke="#8b6508" stroke-width="2" />
        <text x="400" y="560" text-anchor="middle" fill="#f5c879" font-size="13" font-weight="bold">ROOM 12: UPPER JHAROKHA TERRACE</text>
        <text x="400" y="580" text-anchor="middle" fill="#a09080" font-size="10">Wind Pavilion Facing Desert Monsoon · Stone Chhatris</text>

        <!-- Eastern Magic Corridor -->
        <rect x="440" y="50" width="140" height="160" fill="rgba(80, 20, 30, 0.25)" stroke="#8b6508" stroke-width="2" />
        <text x="510" y="115" text-anchor="middle" fill="#ff7788" font-size="10" font-weight="bold">EASTERN</text>
        <text x="510" y="130" text-anchor="middle" fill="#ff7788" font-size="10" font-weight="bold">CORRIDOR</text>
        <text x="510" y="150" text-anchor="middle" fill="#d08090" font-size="9">Wall Inscription</text>
        <text x="510" y="164" text-anchor="middle" fill="#d08090" font-size="9">[Clue 12]</text>

        <!-- The Magic Seal Line -->
        <line x1="580" y1="50" x2="580" y2="210" stroke="${isRoom13Unlocked ? '#44ff88' : '#ff0033'}" stroke-width="5" stroke-dasharray="${isRoom13Unlocked ? 'none' : '6,4'}" />

        <!-- ROOM 13: THE THIRTEENTH ROOM -->
        <rect x="580" y="50" width="140" height="160" fill="${isRoom13Unlocked ? 'rgba(80, 160, 100, 0.25)' : 'rgba(160, 10, 25, 0.35)'}" stroke="${isRoom13Unlocked ? '#44ff88' : '#ff1144'}" stroke-width="2.5" />
        <text x="650" y="105" text-anchor="middle" fill="${isRoom13Unlocked ? '#66ff99' : '#ff4466'}" font-size="11" font-weight="bold">ROOM 13:</text>
        <text x="650" y="122" text-anchor="middle" fill="${isRoom13Unlocked ? '#66ff99' : '#ff4466'}" font-size="11" font-weight="bold">13TH ROOM</text>
        <text x="650" y="145" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="bold">${isRoom13Unlocked ? '✨ UNLOCKED' : '🔒 BLOOD SEAL'}</text>
        <text x="650" y="162" text-anchor="middle" fill="#d0a0b0" font-size="9">Diya Altar [Clue 13]</text>

        ${targetSvg}
        ${playerSvg}
      `;
    }
  }

  updateMapPlayerPosition() {
    const el = document.getElementById('haveli-map-modal');
    if (!el || el.style.display !== 'flex') return;

    if (this.currentMapFloor !== this.scene.player.currentFloor) {
      this.currentMapFloor = this.scene.player.currentFloor;
      this.renderHaveliMap();
      return;
    }

    const playerX = 400 + this.scene.player.position.x * 19.0;
    const playerY = 320 + this.scene.player.position.z * 15.0;
    const yawDeg = (this.scene.yaw * 180 / Math.PI) + 180;

    const pin = document.getElementById('svg-player-pin');
    if (pin) {
      pin.setAttribute('transform', `translate(${playerX}, ${playerY})`);
      const cone = pin.querySelector('g');
      if (cone) cone.setAttribute('transform', `rotate(${yawDeg})`);
    }

    const tCoords = document.getElementById('map-current-coords');
    if (tCoords) {
      const heading = this.getCompassBearing();
      tCoords.textContent = `FLOOR: ${this.scene.player.currentFloor === 0 ? 'GROUND' : 'SECOND'} · HEADING: ${heading}`;
    }
  }

  getCompassBearing() {
    const rad = (this.scene.yaw % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const deg = (rad * 180 / Math.PI);
    if (deg >= 337.5 || deg < 22.5) return 'SOUTH';
    if (deg >= 22.5 && deg < 67.5) return 'SOUTH-WEST';
    if (deg >= 67.5 && deg < 112.5) return 'WEST';
    if (deg >= 112.5 && deg < 157.5) return 'NORTH-WEST';
    if (deg >= 157.5 && deg < 202.5) return 'NORTH';
    if (deg >= 202.5 && deg < 247.5) return 'NORTH-EAST';
    if (deg >= 247.5 && deg < 292.5) return 'EAST';
    return 'SOUTH-EAST';
  }

  triggerDetectiveFocus() {
    audio.playPaperRustle();
    const currentLead = this.investigationSteps[this.currentLeadIndex - 1];
    if (!currentLead) return;

    const pPos = this.scene.player.position;
    const target = currentLead.targetLocation;
    const dx = target.x - pPos.x;
    const dz = target.z - pPos.z;
    const dist = Math.round(Math.sqrt(dx * dx + dz * dz));

    this.notifyDiscovery(`👁️ DETECTIVE FOCUS: Target is in ${currentLead.room} [${dist}m away]! Follow the glowing golden beacon.`);

    // Boost beacon glow temporarily
    if (this.scene && this.scene.evidenceBeacons) {
      this.scene.evidenceBeacons.forEach(b => {
        if (b.colMat) b.colMat.opacity = 0.95;
      });
      setTimeout(() => {
        if (this.scene && this.scene.evidenceBeacons) {
          this.scene.evidenceBeacons.forEach(b => {
            if (b.colMat) b.colMat.opacity = 0.45;
          });
        }
      }, 3500);
    }
  }

  updateInteractionPrompt() {
    if (this.isAnyModalOpen()) {
      document.getElementById('interaction-prompt').style.display = 'none';
      document.querySelector('.crosshair-container')?.classList.remove('active');
      return;
    }

    const hovered = this.scene.updateRaycaster ? this.scene.updateRaycaster() : null;
    const promptEl = document.getElementById('interaction-prompt');
    const crosshair = document.querySelector('.crosshair-container');

    if (hovered && hovered.prompt) {
      promptEl.textContent = hovered.prompt;
      promptEl.style.display = 'block';
      crosshair?.classList.add('active');
    } else {
      promptEl.style.display = 'none';
      crosshair?.classList.remove('active');
    }
  }

  handlePlayerMovement(moveData) {
    if (moveData && moveData.roomName) {
      this.currentRoomKey = moveData.roomKey;

      const locEl = document.getElementById('hud-location-name');
      if (locEl) {
        locEl.textContent = `${moveData.roomName.toUpperCase()} · ${moveData.floorName}`;
      }

      // Show room entry splash toast if room changed
      if (moveData.roomKey !== this.lastRoomKey) {
        const toast = document.getElementById('room-toast');
        const tTitle = document.getElementById('room-toast-title');
        const tSub = document.getElementById('room-toast-sub');
        if (toast && tTitle && tSub) {
          tTitle.textContent = moveData.roomName.toUpperCase();
          tSub.textContent = `${moveData.floorName} · RAJASTHANI HAVELI`;
          toast.style.display = 'block';
          toast.style.opacity = '1.0';
          clearTimeout(this.roomToastTimeout);
          this.roomToastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { toast.style.display = 'none'; }, 600);
          }, 3000);
        }
        this.lastRoomKey = moveData.roomKey;
      }

      // Compass navigation indicator toward active lead
      const currentLead = this.investigationSteps[this.currentLeadIndex - 1];
      if (currentLead && currentLead.targetLocation) {
        const pPos = this.scene.player.position;
        const target = currentLead.targetLocation;
        const dx = target.x - pPos.x;
        const dz = target.z - pPos.z;
        const dist = Math.round(Math.sqrt(dx * dx + dz * dz));

        let direction = '';
        if (currentLead.floor.includes('Second') && this.scene.player.currentFloor === 0) {
          direction = 'UPSTAIRS (STAIRCASE)';
        } else if (currentLead.floor.includes('Ground') && this.scene.player.currentFloor === 1) {
          direction = 'DOWNSTAIRS';
        } else {
          const angle = Math.atan2(dx, -dz);
          const deg = (angle * 180 / Math.PI + 360) % 360;
          if (deg >= 337.5 || deg < 22.5) direction = 'NORTH';
          else if (deg >= 22.5 && deg < 67.5) direction = 'NORTH-EAST';
          else if (deg >= 67.5 && deg < 112.5) direction = 'EAST';
          else if (deg >= 112.5 && deg < 157.5) direction = 'SOUTH-EAST';
          else if (deg >= 157.5 && deg < 202.5) direction = 'SOUTH';
          else if (deg >= 202.5 && deg < 247.5) direction = 'SOUTH-WEST';
          else if (deg >= 247.5 && deg < 292.5) direction = 'WEST';
          else direction = 'NORTH-WEST';
        }

        const compassEl = document.getElementById('hud-nav-compass');
        if (compassEl) {
          compassEl.textContent = `🧭 LEAD: ${direction} [${dist}m]`;
        }
      }

      // Update Live Map Marker if open
      this.updateMapPlayerPosition();
    }

    // Spatial triggers (e.g. stepping near 13th room wall)
    if (this.scene.player.isNear13thWall && !this.hasUnlockedRoom13) {
      if (this.inventory.has('clue_02')) {
        document.getElementById('interaction-prompt').textContent = '[E] PERFORM TANTRIC BLOOD SEAL RITUAL [PICTORIAL SPELL]';
      } else {
        document.getElementById('interaction-prompt').textContent = '[E] THE CHAMBER IS BLOOD-SEALED (Requires Meera\'s Spell)';
      }
      document.getElementById('interaction-prompt').style.display = 'block';
    }
  }

  updateLeadObjectiveHUD() {
    const lead = this.investigationSteps[this.currentLeadIndex - 1];
    if (!lead) return;

    const chapTitle = document.getElementById('current-chapter-title');
    if (chapTitle) chapTitle.textContent = `LEAD ${lead.step} OF 10: ${lead.title.toUpperCase()}`;

    const leadCount = document.getElementById('hud-lead-counter');
    if (leadCount) leadCount.textContent = `INVESTIGATION LEAD ${lead.step} / 10`;

    const leadTitle = document.getElementById('hud-lead-title');
    if (leadTitle) leadTitle.textContent = lead.title.toUpperCase();

    const objText = document.getElementById('hud-objective-text');
    if (objText) objText.textContent = lead.objective;

    const hintText = document.getElementById('hud-objective-hint');
    if (hintText) hintText.textContent = `Hint: ${lead.hint}`;
  }

  handleObjectInteraction(objectData) {
    // Check if this is the Sealed 13th Room Wall interaction
    if ((objectData.clueId === 'clue_08' && this.scene.player.isNear13thWall) || objectData.clueId === 'room_13_seal') {
      this.openBloodSealRitualModal();
      return;
    }

    const clue = this.clues.find(c => c.id === objectData.clueId);
    if (!clue) return;

    // Check if this is Meera's Diary in Room 10
    if (clue.id === 'clue_02') {
      this.openMeeraSpellModal();
      return;
    }

    // Check if this is the Confession Book in Room 13
    if (clue.id === 'clue_13') {
      this.openConfessionBookModal();
      return;
    }

    // Mark clue unlocked & add to inventory
    clue.unlocked = true;
    this.inventory.add(clue.id);
    this.evidenceBoard.render();
    this.suspectDossier.render();

    audio.playPaperRustle();

    // Check if this interaction fulfills the current lead
    const currentLead = this.investigationSteps[this.currentLeadIndex - 1];
    if (currentLead && currentLead.targetClueId === clue.id) {
      this.showLeadBreakthroughModal(currentLead);
    } else {
      this.showInspectionModal(clue);
    }

    this.evaluateChapterMilestones();
  }

  showLeadBreakthroughModal(completedLead) {
    const modal = document.getElementById('lead-breakthrough-modal');
    if (!modal) {
      this.showInspectionModal(this.clues.find(c => c.id === completedLead.targetClueId));
      return;
    }

    audio.playKeyTurn();

    document.getElementById('breakthrough-title').textContent = `LEAD ${completedLead.step} SOLVED: ${completedLead.title.toUpperCase()}`;
    document.getElementById('breakthrough-resolution').textContent = completedLead.leadResolution;

    const nextLead = this.investigationSteps[this.currentLeadIndex];
    if (nextLead) {
      document.getElementById('breakthrough-next-obj').textContent = nextLead.objective;
    } else {
      document.getElementById('breakthrough-next-obj').textContent = 'All evidence gathered! Approach the Sealed Eastern Corridor to enter the 13th Room.';
    }

    modal.style.display = 'flex';

    const closeBtn = document.getElementById('breakthrough-close-btn');
    const closeAction = () => {
      modal.style.display = 'none';
      if (this.currentLeadIndex < this.investigationSteps.length) {
        this.currentLeadIndex++;
      }
      this.updateLeadObjectiveHUD();
      closeBtn.removeEventListener('click', closeAction);
    };
    closeBtn.addEventListener('click', closeAction);
  }

  showInspectionModal(clue) {
    const modal = document.getElementById('inspect-modal');
    modal.style.display = 'flex';

    document.getElementById('inspect-icon').textContent = clue.icon;
    document.getElementById('inspect-title').textContent = clue.name;
    document.getElementById('inspect-room').textContent = `LOCATION: ${clue.room.toUpperCase()}`;
    document.getElementById('inspect-physical').textContent = clue.physical;
    document.getElementById('inspect-doc').textContent = clue.documentary;
    document.getElementById('inspect-para').textContent = clue.paranormal;

    const imgWrap = document.getElementById('inspect-image-wrap');
    const imgEl = document.getElementById('inspect-image');
    if (imgWrap && imgEl) {
      if (clue.image) {
        imgEl.src = clue.image;
        imgWrap.style.display = 'block';
      } else if (clue.id === 'clue_06') {
        imgEl.src = '/assets/rathore_family_portrait.jpg';
        imgWrap.style.display = 'block';
      } else {
        imgWrap.style.display = 'none';
      }
    }

    // Trigger thunder or clock glitch for atmospheric beats
    if (clue.id === 'clue_01') {
      audio.stopClockGlitch();
    } else if (clue.id === 'clue_10') {
      audio.playThirteenBells();
    } else if (clue.id === 'clue_02') {
      const actionsEl = modal.querySelector('.modal-actions');
      if (actionsEl && !document.getElementById('inspect-view-spell-btn')) {
        const btn = document.createElement('button');
        btn.id = 'inspect-view-spell-btn';
        btn.className = 'spell-tab-btn active';
        btn.style.cssText = 'background: #7a2228; border: 1px solid #ffd700; color: #fff; padding: 6px 14px; border-radius: 4px; font-weight: bold; cursor: pointer; margin-left: 12px; font-size: 11px;';
        btn.textContent = '📜 VIEW PICTORIAL SPELL DIAGRAM';
        btn.onclick = () => {
          modal.style.display = 'none';
          this.openMeeraSpellModal();
        };
        actionsEl.appendChild(btn);
      }
    }
  }

  handlePhotoTaken(photoData) {
    if (photoData.anomaly === 'portrait_extra_figure') {
      const clue = this.clues.find(c => c.id === 'clue_06');
      if (clue) clue.unlocked = true;
      this.evidenceBoard.render();
      this.notifyDiscovery('SPECTRAL ANOMALY IDENTIFIED: Extra figure revealed in 1998 portrait!');
    } else if (photoData.anomaly === 'eastern_doorway_ghost') {
      const clue = this.clues.find(c => c.id === 'clue_03');
      if (clue) clue.unlocked = true;
      this.evidenceBoard.render();
      this.notifyDiscovery('ARCHITECTURAL VOID DETECTED: 1.4m hollow space behind eastern wall!');
    }
    this.evaluateChapterMilestones();
  }

  handleCassetteSecretDiscovered() {
    const clue = this.clues.find(c => c.id === 'clue_05');
    if (clue) clue.unlocked = true;
    this.evidenceBoard.render();
    this.notifyDiscovery('DEMODULATION COMPLETE: Erased name "Anand" uncovered beneath 13 knocks!');
    this.evaluateChapterMilestones();
  }

  handleDeductionSolved(deduction) {
    audio.playHaveliBell(1.2, true);
    this.notifyDiscovery(`DEDUCTION VERIFIED: ${deduction.title}!`);
    this.evidenceBoard.render();
    this.suspectDossier.render();
    this.evaluateChapterMilestones();

    // WHEN DEDUCTION 6 IS FORMED BY CONNECTING THE RED THREAD, EXPOSE THE KILLER!
    if (deduction.id === 'ded_06') {
      this.suspectDossier.confrontedSuspects.add('vikram');
      this.suspectDossier.render();
      setTimeout(() => {
        this.showKillerIdentifiedModal();
      }, 400);
    }
  }

  showKillerIdentifiedModal() {
    const modal = document.getElementById('killer-identified-modal');
    if (!modal) return;

    audio.playThunder(1.4);
    audio.playHaveliBell(1.5, true);
    if (this.scene && this.scene.triggerLightning) {
      this.scene.triggerLightning();
    }

    // Close underlying modals
    this.evidenceBoard.close();
    const confessionModal = document.getElementById('confession-book-modal');
    if (confessionModal) confessionModal.style.display = 'none';

    modal.style.display = 'flex';
    if (document.exitPointerLock) document.exitPointerLock();

    // Reveal and illuminate Resolve Case HUD button
    const resolveBtn = document.getElementById('resolve-case-btn');
    if (resolveBtn) {
      resolveBtn.style.display = 'block';
      resolveBtn.textContent = '⚖️ ACCUSE THAKUR VIKRAM [KILLER IDENTIFIED]';
    }

    this.notifyDiscovery('⚡ THE RED THREAD REVEALS THE TRUTH: THAKUR VIKRAM IS IDENTIFIED AS THE KILLER!');
    this.evaluateChapterMilestones();
  }

  handleSuspectConfronted(suspect) {
    audio.playThunder(1.2);
    this.scene.triggerLightning();
    this.notifyDiscovery(`SUSPECT BROKEN: ${suspect.name}'s alibi has collapsed!`);
    this.evaluateChapterMilestones();
  }

  unlock13thChamber() {
    if (this.hasUnlockedRoom13) return;
    this.hasUnlockedRoom13 = true;

    audio.playKeyTurn();
    audio.playThirteenKnocks();
    this.scene.openRoom13();

    this.notifyDiscovery('THE 13TH CHAMBER IS BREACHED: The impossible door has opened! Enter and inspect the Sacred Altar.');
    this.showChapterBanner(4); // Advance to Chapter 5
  }

  // =========================================================
  // ROOM 13 CONFESSION BOOK / THE ACCUSATION DETAILS MODAL
  // =========================================================
  openConfessionBookModal() {
    const modal = document.getElementById('confession-book-modal');
    if (!modal) return;

    // Unlock clue_13 and pin to Evidence Board
    const clue13 = this.clues.find(c => c.id === 'clue_13');
    if (clue13) clue13.unlocked = true;
    this.inventory.add('clue_13');

    // DO NOT auto-solve deduction 6! The player must connect the red thread on the Evidence Board!
    this.evidenceBoard.render();
    this.suspectDossier.render();

    audio.playPaperRustle();

    modal.style.display = 'flex';
    if (document.exitPointerLock) document.exitPointerLock();

    this.notifyDiscovery("📖 ACCUSE DETAILS UNCOVERED: The Confession Book is pinned to the Evidence Board [TAB]. Connect the red line to expose the killer!");
    this.evaluateChapterMilestones();
  }

  // =========================================================
  // MEERA'S DIARY & PICTORIAL TANTRIC SPELL MODAL
  // =========================================================
  openMeeraSpellModal() {
    const modal = document.getElementById('meera-spell-modal');
    if (!modal) return;

    // Unlock clue_02
    const clue02 = this.clues.find(c => c.id === 'clue_02');
    if (clue02) clue02.unlocked = true;
    this.inventory.add('clue_02');
    this.evidenceBoard.render();
    this.suspectDossier.render();

    audio.playPaperRustle();

    // Advance to Lead 10 if on Lead 9
    if (this.currentLeadIndex === 9) {
      this.currentLeadIndex = 10;
      this.updateLeadObjectiveHUD();
    }

    modal.style.display = 'flex';
    if (document.exitPointerLock) document.exitPointerLock();
  }

  // =========================================================
  // INTERACTIVE BLOOD SEAL UNSEALING RITUAL (Room 13)
  // =========================================================
  openBloodSealRitualModal() {
    if (!this.inventory.has('clue_02')) {
      this.notifyDiscovery("⚠️ THE BLOOD SEAL REPELS YOU! Retrieve Meera's Pictorial Spell from Room 10 first.");
      audio.playThunder(0.5);
      return;
    }

    const modal = document.getElementById('blood-seal-ritual-modal');
    if (!modal) return;

    this.resetRitualState();
    modal.style.display = 'flex';
    if (document.exitPointerLock) document.exitPointerLock();
  }

  resetRitualState() {
    this.ritualCurrentStep = 0;
    for (let i = 1; i <= 4; i++) {
      const slot = document.getElementById(`slot-${i}`);
      if (slot) {
        slot.classList.remove('active');
        const valEl = slot.querySelector('.slot-val');
        if (valEl) valEl.textContent = '?';
      }
    }
    const keySlot = document.getElementById('slot-key');
    if (keySlot) keySlot.classList.remove('unlocked');

    ['agni', 'vayu', 'jala', 'prithvi'].forEach(rune => {
      const btn = document.getElementById(`rune-btn-${rune}`);
      if (btn) btn.classList.remove('activated');
    });

    const strikeBtn = document.getElementById('central-strike-btn');
    if (strikeBtn) {
      strikeBtn.classList.remove('ready');
      strikeBtn.classList.add('locked');
      strikeBtn.disabled = true;
      const icon = document.getElementById('strike-key-icon');
      if (icon) icon.textContent = '🔒';
      const txt = document.getElementById('strike-btn-text');
      if (txt) txt.textContent = 'SEAL LOCKED';
    }

    const feedback = document.getElementById('ritual-feedback-msg');
    if (feedback) {
      feedback.classList.remove('error-shake');
      feedback.textContent = 'Click the first elemental rune to initiate the unsealing chant...';
    }
  }

  handleRuneClicked(runeName) {
    const expectedRune = this.ritualSequence[this.ritualCurrentStep];
    const feedback = document.getElementById('ritual-feedback-msg');

    if (runeName === expectedRune) {
      // Correct rune in sequence!
      const btn = document.getElementById(`rune-btn-${runeName}`);
      if (btn) btn.classList.add('activated');

      const slot = document.getElementById(`slot-${this.ritualCurrentStep + 1}`);
      if (slot) {
        slot.classList.add('active');
        const valEl = slot.querySelector('.slot-val');
        if (valEl) valEl.textContent = this.ritualRuneNames[runeName].split(' ')[0]; // E.g. 🔥
      }

      audio.playRuneChant(this.ritualCurrentStep);
      this.ritualCurrentStep++;

      if (this.ritualCurrentStep === 4) {
        // All 4 runes activated!
        const keySlot = document.getElementById('slot-key');
        if (keySlot) keySlot.classList.add('unlocked');

        const strikeBtn = document.getElementById('central-strike-btn');
        if (strikeBtn) {
          strikeBtn.classList.remove('locked');
          strikeBtn.classList.add('ready');
          strikeBtn.disabled = false;
          const icon = document.getElementById('strike-key-icon');
          if (icon) icon.textContent = '🗝️';
          const txt = document.getElementById('strike-btn-text');
          if (txt) txt.textContent = 'STRIKE CENTRAL BINDU';
        }

        if (feedback) {
          feedback.classList.remove('error-shake');
          feedback.innerHTML = '<span style="color: #ffd700;">✨ ALL 4 RUNES BURN IN HARMONY! Strike the central bindu with Kamla\'s Brass Key!</span>';
        }
      } else {
        if (feedback) {
          feedback.classList.remove('error-shake');
          feedback.textContent = `✓ ${this.ritualRuneNames[runeName]} awakened! Invoke the next elemental rune...`;
        }
      }
    } else {
      // Wrong rune! Rejection shockwave
      audio.playThunder(0.5);
      if (feedback) {
        feedback.classList.add('error-shake');
        feedback.textContent = `⚠️ THE RUNES REJECT YOUR CHANT! Follow Meera's Diary: Agni (Fire) → Vayu (Wind) → Jala (Water) → Prithvi (Earth).`;
      }
      setTimeout(() => {
        this.resetRitualState();
      }, 900);
    }
  }

  strikeCentralBindu() {
    const strikeBtn = document.getElementById('central-strike-btn');
    if (!strikeBtn || strikeBtn.disabled) return;

    strikeBtn.disabled = true;
    audio.playSealShatter();

    const modal = document.getElementById('blood-seal-ritual-modal');
    if (modal) {
      modal.style.transition = 'opacity 0.8s';
      modal.style.opacity = '0';
      setTimeout(() => {
        modal.style.display = 'none';
        modal.style.opacity = '1';
      }, 800);
    }

    this.scene.openRoom13();
    this.unlock13thChamber();
  }

  evaluateChapterMilestones() {
    const unlockedClues = this.clues.filter(c => c.unlocked).length;
    const solvedDeductions = this.deductions.filter(d => d.solved).length;

    // Chapter 1 -> Chapter 2
    if (this.currentChapterIndex === 0 && unlockedClues >= 2) {
      this.showChapterBanner(1);
    }
    // Chapter 2 -> Chapter 3
    else if (this.currentChapterIndex === 1 && (unlockedClues >= 4 || this.inventory.has('clue_02'))) {
      this.showChapterBanner(2);
    }
    // Chapter 3 -> Chapter 4
    else if (this.currentChapterIndex === 2 && solvedDeductions >= 2) {
      this.showChapterBanner(3);
    }
    // Chapter 4 -> Chapter 5
    else if (this.currentChapterIndex === 3 && this.hasUnlockedRoom13) {
      this.showChapterBanner(4);
    }

    // In Chapter 5, show Resolve Case button
    if (this.currentChapterIndex === 4) {
      const resolveBtn = document.getElementById('resolve-case-btn');
      if (resolveBtn) resolveBtn.style.display = 'block';
    }
  }

  showChapterBanner(index) {
    this.currentChapterIndex = index;
    const chapter = chaptersData[index];
    if (!chapter) return;

    // Update Top HUD
    document.getElementById('current-chapter-title').textContent = `CH ${chapter.chapter}: ${chapter.title.toUpperCase()}`;
    document.getElementById('hud-objective-text').textContent = chapter.objective;

    // Show Cinematic Banner Modal
    const bannerModal = document.getElementById('chapter-banner-modal');
    bannerModal.style.display = 'flex';

    document.getElementById('banner-tag').textContent = `CHAPTER ${chapter.chapter} OF 5`;
    document.getElementById('banner-title').textContent = chapter.title;
    document.getElementById('banner-objective').textContent = chapter.objective;
    document.getElementById('banner-cliffhanger').textContent = chapter.cliffhanger;

    audio.playThunder(0.8);

    const proceedBtn = document.getElementById('banner-proceed-btn');
    proceedBtn.onclick = () => {
      bannerModal.style.display = 'none';
      if (index === 0) {
        audio.playThirteenBells();
      }
    };
  }

  showEndingSelection() {
    const solvedDeductions = this.deductions.filter(d => d.solved).length;
    const unlockedClues = this.clues.filter(c => c.unlocked).length;

    let endingKey = 'C';

    if (unlockedClues === 13 && solvedDeductions === 6) {
      endingKey = 'SECRET';
    } else if (solvedDeductions >= 4 && this.inventory.has('clue_04')) {
      endingKey = 'A';
    } else if (solvedDeductions >= 2) {
      endingKey = 'B';
    } else {
      endingKey = 'C';
    }

    this.displayEndingScreen(endingKey);
  }

  displayEndingScreen(endingKey) {
    const ending = endingsData[endingKey];
    const modal = document.getElementById('ending-modal');
    modal.style.display = 'flex';

    document.getElementById('ending-code-el').textContent = ending.code.toUpperCase();
    document.getElementById('ending-title-el').textContent = ending.title;
    document.getElementById('ending-narrative-el').textContent = ending.narrative;

    audio.setSupernaturalIntensity(1.0);
    audio.playThirteenKnocks();

    document.getElementById('restart-case-btn').onclick = () => {
      window.location.reload();
    };
  }

  notifyDiscovery(text) {
    const toast = document.createElement('div');
    toast.className = 'discovery-toast';
    toast.textContent = `★ ${text}`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 50);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => toast.remove(), 500);
    }, 4500);
  }
}

// Global Toast styling added dynamically
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  .discovery-toast {
    position: fixed;
    top: 75px;
    left: 50%;
    transform: translate(-50%, -20px);
    background: #14171f;
    border: 1px solid #cfa349;
    border-left: 4px solid #bb2026;
    color: #f5eedc;
    padding: 10px 24px;
    font-size: 13px;
    font-weight: bold;
    letter-spacing: 1.2px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.85);
    z-index: 140;
    opacity: 0;
    transition: all 0.4s ease;
    pointer-events: none;
  }
`;
document.head.appendChild(toastStyle);

// Initialize when DOM ready
window.addEventListener('DOMContentLoaded', () => {
  new GameController();
});
