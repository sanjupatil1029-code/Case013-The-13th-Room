// CASE 013: Vintage Walkman / Microcassette Forensic Audio Player

export class CassettePlayer {
  constructor(container, audioEngine, onSecretDiscovered) {
    this.container = container;
    this.audio = audioEngine;
    this.onSecretDiscovered = onSecretDiscovered;

    this.isPlaying = false;
    this.isFilterActive = false; // Demodulation spectral filter
    this.currentTime = 0;
    this.duration = 18; // 18 seconds sequence
    this.timer = null;
    this.spliceDetected = false;

    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="cassette-modal-overlay">
        <div class="cassette-deck">
          <div class="deck-header">
            <span class="brand">RATHORE ESTATE AUDIO RECOVERY · MICRO-98</span>
            <button class="deck-close-btn" id="close-tape-btn">×</button>
          </div>

          <div class="cassette-body">
            <!-- Left and Right tape reels with rotating hubs -->
            <div class="tape-window">
              <div class="tape-reel left-reel" id="left-reel">
                <div class="reel-spokes"></div>
              </div>
              <div class="tape-bridge">
                <span class="tape-label">CASE 013 · RATHORE July '98</span>
                <span class="splice-marker" id="splice-indicator" title="Magnetic Splice Detected">SPLICE 02:13</span>
              </div>
              <div class="tape-reel right-reel" id="right-reel">
                <div class="reel-spokes"></div>
              </div>
            </div>

            <!-- Tape Counter & Spectral Visualizer -->
            <div class="deck-display">
              <div class="counter-box">
                <span class="counter-label">TAPE COUNTER</span>
                <span class="counter-val" id="tape-counter">02:13</span>
              </div>
              <div class="spectral-meter">
                <div class="freq-bar" style="height: 30%"></div>
                <div class="freq-bar" style="height: 60%"></div>
                <div class="freq-bar" style="height: 90%"></div>
                <div class="freq-bar" style="height: 45%"></div>
                <div class="freq-bar" style="height: 20%"></div>
              </div>
            </div>

            <!-- Audio Subtitles & Forensic Waveform -->
            <div class="audio-transcript-box" id="audio-subtitles">
              [Press PLAY to engage tape magnetic head]
            </div>

            <!-- Demodulation / Filter Toggle -->
            <div class="filter-controls">
              <label class="switch-container">
                <input type="checkbox" id="spectral-filter-toggle">
                <span class="slider"></span>
              </label>
              <div class="filter-desc">
                <strong>SPECTRAL DEMODULATOR (150Hz LOW-PASS)</strong>
                <span>Isolate sub-surface magnetic residue buried beneath splice</span>
              </div>
            </div>

            <!-- Control Buttons -->
            <div class="deck-controls">
              <button class="tape-btn" id="tape-rw">◀◀ REW</button>
              <button class="tape-btn play-btn" id="tape-play">▶ PLAY</button>
              <button class="tape-btn" id="tape-stop">■ STOP</button>
              <button class="tape-btn" id="tape-ff">FF ▶▶</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const closeBtn = this.container.querySelector('#close-tape-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.stop();
        this.container.style.display = 'none';
      });
    }

    const playBtn = this.container.querySelector('#tape-play');
    if (playBtn) playBtn.addEventListener('click', () => this.play());

    const stopBtn = this.container.querySelector('#tape-stop');
    if (stopBtn) stopBtn.addEventListener('click', () => this.stop());

    const rwBtn = this.container.querySelector('#tape-rw');
    if (rwBtn) rwBtn.addEventListener('click', () => this.rewind());

    const ffBtn = this.container.querySelector('#tape-ff');
    if (ffBtn) ffBtn.addEventListener('click', () => this.fastForward());

    const filterToggle = this.container.querySelector('#spectral-filter-toggle');
    if (filterToggle) {
      filterToggle.addEventListener('change', (e) => {
        this.isFilterActive = e.target.checked;
        if (this.isPlaying) {
          this.updatePlaybackContent();
        }
      });
    }
  }

  play() {
    this.audio.ensureContext();
    this.audio.playCassetteClick();
    this.audio.playTapeHiss(10);
    this.isPlaying = true;

    this.container.querySelector('#left-reel').classList.add('rotating');
    this.container.querySelector('#right-reel').classList.add('rotating');

    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.currentTime += 0.5;
      const counterEl = this.container.querySelector('#tape-counter');
      const mins = String(Math.floor(this.currentTime / 60)).padStart(2, '0');
      const secs = String(Math.floor(this.currentTime % 60)).padStart(2, '0');
      if (counterEl) counterEl.textContent = `02:${String(13 + Math.floor(this.currentTime)).padStart(2, '0')}`;

      this.updatePlaybackContent();

      if (this.currentTime >= this.duration) {
        this.stop();
      }
    }, 500);
  }

  updatePlaybackContent() {
    const subtitleEl = this.container.querySelector('#audio-subtitles');
    const spliceEl = this.container.querySelector('#splice-indicator');

    if (this.isFilterActive) {
      // Demodulation mode reveals the erased child!
      spliceEl.style.display = 'inline-block';
      this.audio.setSupernaturalIntensity(0.7);

      if (this.currentTime < 4) {
        subtitleEl.innerHTML = `<span class="demod-voice">[SUB-AUDIO ISOLATED]: "...Devendra erased my name... 1963..."</span>`;
      } else if (this.currentTime < 9) {
        subtitleEl.innerHTML = `<span class="demod-voice">"...Anand... they walled me behind the shrine... the room won't let us leave..."</span>`;
      } else if (this.currentTime < 14) {
        subtitleEl.innerHTML = `<span class="demod-voice">"...13 knocks... he sealed us in the dark... Anand Rathore..."</span>`;
        if (this.onSecretDiscovered) {
          this.onSecretDiscovered();
        }
      } else {
        subtitleEl.innerHTML = `<span class="demod-voice">[MAGNETIC SIGNAL FADES INTO UNNATURAL STATIC]</span>`;
      }
    } else {
      // Standard playback mode
      if (this.currentTime < 3) {
        subtitleEl.textContent = `[Analog Tape Hiss · 13 July 1998]`;
      } else if (this.currentTime < 8) {
        subtitleEl.innerHTML = `<em>"You counted twelve rooms because you were never supposed to find the thirteenth..."</em>`;
      } else if (this.currentTime < 14) {
        const knockNum = Math.floor(this.currentTime - 8) * 2 + 1;
        subtitleEl.innerHTML = `<span class="knock-text">[THIRTEEN HEAVY WOODEN KNOCKS RESONATING - #${Math.min(13, knockNum)}]</span>`;
        this.audio.playWoodenKnock(knockNum >= 13);
      } else {
        subtitleEl.textContent = `[Recording cuts abruptly to dead static · Case 013]`;
      }
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) clearInterval(this.timer);
    this.container.querySelector('#left-reel').classList.remove('rotating');
    this.container.querySelector('#right-reel').classList.remove('rotating');
  }

  rewind() {
    this.stop();
    this.currentTime = 0;
    this.audio.playCassetteClick();
    this.container.querySelector('#tape-counter').textContent = '02:13';
    this.container.querySelector('#audio-subtitles').textContent = '[Rewound to Tape Beginning]';
  }

  fastForward() {
    this.stop();
    this.currentTime = Math.min(this.duration - 2, this.currentTime + 5);
    this.audio.playCassetteClick();
  }

  open() {
    this.container.style.display = 'block';
  }
}
