// CASE 013: Forensic Polaroid Camera & Spectral Developing System
import * as THREE from 'three';

export class PolaroidCamera {
  constructor(container, sceneInstance, audioEngine, onPhotoTaken) {
    this.container = container;
    this.scene = sceneInstance;
    this.audio = audioEngine;
    this.onPhotoTaken = onPhotoTaken;

    this.isOpen = false;
    this.filmCount = 8;
    this.photos = [];

    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="camera-viewfinder-overlay" id="camera-overlay" style="display: none;">
        <div class="viewfinder-frame">
          <div class="crosshairs"></div>
          <div class="exposure-readout">
            <span class="iso">ISO 400</span>
            <span class="speed">1/60s</span>
            <span class="aperture">f/2.8</span>
            <span class="film-count" id="film-counter">EXP: 8 REMAINING</span>
          </div>
          <div class="target-indicator" id="camera-target-hint">[AIM AT EVIDENCE]</div>
          <div class="camera-actions">
            <button class="shutter-btn" id="shutter-trigger">SNAP PHOTO</button>
            <button class="cam-cancel-btn" id="cam-close-btn">LOWER CAMERA [C]</button>
          </div>
        </div>

        <div class="flash-screen" id="camera-flash"></div>

        <!-- Ejected Developing Polaroid Preview -->
        <div class="developing-polaroid" id="ejected-photo" style="display: none;">
          <div class="polaroid-frame-inner">
            <div class="photo-image-area" id="polaroid-image">
              <div class="spectral-manifestation" id="spectral-overlay"></div>
            </div>
            <div class="polaroid-stamp" id="polaroid-timestamp">13 JULY 1998 · 02:13 AM</div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const shutter = this.container.querySelector('#shutter-trigger');
    if (shutter) shutter.addEventListener('click', () => this.snapPhoto());

    const closeBtn = this.container.querySelector('#cam-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyC') {
        if (this.isOpen) this.close();
        else this.open();
      }
      if (this.isOpen && e.code === 'Space') {
        this.snapPhoto();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.container.querySelector('#camera-overlay').style.display = 'flex';
    this.updateTargetHint();
  }

  close() {
    this.isOpen = false;
    this.container.querySelector('#camera-overlay').style.display = 'none';
  }

  updateTargetHint() {
    const hintEl = this.container.querySelector('#camera-target-hint');
    if (!hintEl) return;

    if (this.scene.player.position.distanceTo(new THREE.Vector3(0, 4.0, 1.0)) < 7.0) {
      hintEl.textContent = 'TARGET LOCKED: ANCESTRAL PORTRAIT (SPECTRAL ANOMALY)';
    } else if (this.scene.player.isNear13thWall) {
      hintEl.textContent = 'TARGET LOCKED: TANTRIC MAGIC SEAL (ANCIENT BLOOD WARD)';
    } else if (this.scene.player.currentFloor === 1 && this.scene.player.position.x >= 8 && this.scene.player.position.z <= -6) {
      hintEl.textContent = 'TARGET LOCKED: THE 13TH CHAMBER (PARANORMAL RESIDUE)';
    } else {
      hintEl.textContent = '[EXPOSURE READY · CASE 013]';
    }
  }

  snapPhoto() {
    if (this.filmCount <= 0) return;
    this.filmCount--;

    const filmEl = this.container.querySelector('#film-counter');
    if (filmEl) filmEl.textContent = `EXP: ${this.filmCount} REMAINING`;

    // 1. Audio and Flash FX
    this.audio.playCameraShutter();
    const flashEl = this.container.querySelector('#camera-flash');
    flashEl.style.opacity = '1.0';
    setTimeout(() => {
      flashEl.style.opacity = '0.0';
    }, 150);

    // 2. Determine what was captured
    let anomaly = 'none';
    let label = 'HAVELI INTERIOR';

    const playerPos = this.scene.player.position;
    if (playerPos.distanceTo(new THREE.Vector3(0, 4.0, 1.0)) < 7.5) {
      anomaly = 'portrait_extra_figure';
      label = 'ANCESTRAL PORTRAIT · EXTRA FIGURE';
    } else if (this.scene.player.isNear13thWall) {
      anomaly = 'eastern_doorway_ghost';
      label = 'TANTRIC MAGIC SEAL · BLOOD MANDALA';
    } else if (this.scene.player.currentFloor === 1 && playerPos.x >= 8 && playerPos.z <= -6) {
      anomaly = 'twin_shadows';
      label = 'ROOM 13 · TWIN SHADOWS';
    }

    // 3. Show developing polaroid animation
    const ejected = this.container.querySelector('#ejected-photo');
    const photoImg = this.container.querySelector('#polaroid-image');
    const spectral = this.container.querySelector('#spectral-overlay');
    const stamp = this.container.querySelector('#polaroid-timestamp');

    ejected.style.display = 'block';
    ejected.classList.remove('developed');
    photoImg.style.background = '#151515';
    spectral.style.opacity = '0';
    stamp.textContent = label;

    // Apply captured backdrop
    if (anomaly === 'portrait_extra_figure') {
      photoImg.style.backgroundImage = `url('/assets/rathore_family_portrait.jpg')`;
      spectral.innerHTML = `<div class="ghost-silhouette" title="Erased child standing behind chair">👻</div>`;
    } else if (anomaly === 'eastern_doorway_ghost') {
      photoImg.style.backgroundImage = `url('/assets/mandala.png')`;
      spectral.innerHTML = `<div class="mandala-ghost-glow"></div>`;
    } else {
      photoImg.style.backgroundImage = `url('/assets/haveli_exterior.png')`;
    }
    photoImg.style.backgroundSize = 'cover';

    // Developing over 2.5s
    setTimeout(() => {
      ejected.classList.add('developed');
      if (anomaly !== 'none') {
        spectral.style.opacity = '0.85';
        this.audio.setSupernaturalIntensity(0.8);
      }
    }, 1200);

    if (this.onPhotoTaken) {
      this.onPhotoTaken({ anomaly, label });
    }

    // Auto-dismiss preview after 4 seconds
    setTimeout(() => {
      ejected.style.display = 'none';
    }, 4500);
  }
}
