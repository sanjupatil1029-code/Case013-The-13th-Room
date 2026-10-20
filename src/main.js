// CASE 013: THE 13TH ROOM - Game Master Controller & State Progression

import { HaveliScene } from './scene.js';
import { audio } from './audio.js';
import { suspectsData, cluesData, deductionsData, chaptersData, endingsData } from './gameData.js';
import { EvidenceBoard } from './evidenceBoard.js';
import { CassettePlayer } from './cassettePlayer.js';
import { PolaroidCamera } from './polaroidCamera.js';
import { SuspectDossier } from './suspectDossier.js';

class GameController {
  constructor() {
    this.currentChapterIndex = 0;
    this.clues = cluesData;
    this.deductions = deductionsData;
    this.suspects = suspectsData;
    this.inventory = new Set();
    this.hasUnlockedRoom13 = false;

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
      (pos) => this.handlePlayerMovement(pos)
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
          this.scene.triggerInteraction();
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

    // Global Keybindings
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Tab') {
        e.preventDefault();
        this.toggleEvidenceBoard();
      }
      if (e.code === 'KeyT' && !this.isAnyInputFocused()) {
        this.toggleCassettePlayer();
      }
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
    return (
      (landing && landing.style.display !== 'none') ||
      (interior && interior.style.display === 'flex') ||
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

  updateInteractionPrompt() {
    if (this.isAnyModalOpen()) {
      document.getElementById('interaction-prompt').style.display = 'none';
      document.querySelector('.crosshair-container')?.classList.remove('active');
      return;
    }

    const hovered = this.scene.checkRaycast();
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
    if (moveData && moveData.zone) {
      this.currentZone = moveData.zone;
      this.currentZoneImage = moveData.zoneImage;
      this.currentZoneDesc = moveData.zoneDesc;

      // Map zone to roomKey
      if (moveData.zone.includes('Colonnade')) {
        this.currentRoomKey = 'colonnade';
      } else if (moveData.zone.includes('Staircase')) {
        this.currentRoomKey = 'staircase';
      } else if (moveData.zone.includes('Corridor')) {
        this.currentRoomKey = 'corridor';
      } else if (moveData.zone.includes('Shrine') || moveData.zone.includes('13th')) {
        this.currentRoomKey = 'shrine';
      }

      const locEl = document.getElementById('hud-location-name');
      if (locEl && locEl.textContent !== moveData.zone.toUpperCase()) {
        locEl.textContent = moveData.zone.toUpperCase();
      }

      const interiorModal = document.getElementById('interior-showcase-modal');
      if (interiorModal && interiorModal.style.display === 'flex' && this.updateInteriorDisplay) {
        this.updateInteriorDisplay(this.currentRoomKey);
      }
    }

    // Spatial triggers (e.g. stepping near 13th room wall)
    if (this.scene.player.isNear13thWall && this.currentChapterIndex >= 3 && !this.hasUnlockedRoom13) {
      document.getElementById('interaction-prompt').textContent = '[E] UNLOCK 13TH CHAMBER WITH BRASS KEY';
      document.getElementById('interaction-prompt').style.display = 'block';
    }
  }

  handleObjectInteraction(objectData) {
    const clue = this.clues.find(c => c.id === objectData.clueId);
    if (!clue) return;

    // Check if this is the Sealed 13th Room Wall interaction
    if (objectData.clueId === 'clue_08' && this.scene.player.isNear13thWall) {
      if (this.inventory.has('clue_08') || this.currentChapterIndex >= 3) {
        this.unlock13thChamber();
        return;
      }
    }

    // Mark clue unlocked & add to inventory
    clue.unlocked = true;
    this.inventory.add(clue.id);
    this.evidenceBoard.render();
    this.suspectDossier.render();

    audio.playPaperRustle();

    // Show Detail Inspection Modal
    this.showInspectionModal(clue);

    // Check Chapter progression milestones
    this.evaluateChapterMilestones();
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

    // Mark Clue 13 unlocked
    const clue13 = this.clues.find(c => c.id === 'clue_13');
    if (clue13) clue13.unlocked = true;
    this.evidenceBoard.render();

    this.notifyDiscovery('THE 13TH CHAMBER IS BREACHED: The impossible door has opened.');
    this.showChapterBanner(4); // Advance to Chapter 5
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
