// CASE 013: Web Audio API Procedural Sound Engine
// Realistic Rajasthan Haveli Monsoon, Bells, Clocks, Tape Player, Knocks, and Paranormal Drone

class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.rainGain = null;
    this.clockGain = null;
    this.droneGain = null;
    this.initialized = false;
    this.isMuted = false;
    this.clockInterval = null;
    this.isRaining = true;
  }

  init() {
    if (this.initialized) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.startRainAndThunder();
    this.startDrone();
    this.startClock();

    this.initialized = true;
  }

  ensureContext() {
    if (!this.initialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  // Monsoon Rain & Thunder Generator
  startRainAndThunder() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise for deep rainfall
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const rainNoise = this.ctx.createBufferSource();
    rainNoise.buffer = buffer;
    rainNoise.loop = true;

    // Filter for roof / stone splashing
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    rainNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);
    rainNoise.start(0);

    this.rainGain = rainGain;

    // Periodic thunder rumble
    this.scheduleNextThunder();
  }

  scheduleNextThunder() {
    const delay = 15000 + Math.random() * 25000;
    setTimeout(() => {
      this.playThunder();
      this.scheduleNextThunder();
    }, delay);
  }

  playThunder(intensity = 1.0) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(75, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 3.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, t);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.28 * intensity, t + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 4.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 4.6);
  }

  // Grandfather Clock Tick (2:13 AM)
  startClock() {
    if (this.clockInterval) clearInterval(this.clockInterval);
    let tick = true;
    this.clockInterval = setInterval(() => {
      if (this.initialized) {
        this.playClockTick(tick);
        tick = !tick;
      }
    }, 1000);
  }

  playClockTick(isTick = true) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isTick ? 720 : 540, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.05);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, t);
    filter.Q.setValueAtTime(3.5, t);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  stopClockGlitch() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
    if (!this.ctx) return;
    // Screech of clock gears seizing up
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.linearRampToValueAtTime(80, t + 0.4);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  // Ambient Supernatural Drone
  startDrone() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55, t); // A1 note
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(55.6, t); // slight detune beats

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(190, t);

    droneGain.gain.setValueAtTime(0.04, t);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);

    this.droneGain = droneGain;
    this.droneFilter = filter;
  }

  setSupernaturalIntensity(level) {
    // level: 0.0 to 1.0
    if (!this.ctx || !this.droneGain || !this.droneFilter) return;
    const t = this.ctx.currentTime;
    const targetGain = 0.04 + level * 0.18;
    const targetFreq = 190 + level * 420;
    this.droneGain.gain.setTargetAtTime(targetGain, t, 0.4);
    this.droneFilter.frequency.setTargetAtTime(targetFreq, t, 0.4);
  }

  // The 13 Bells of the Rathore Haveli Courtyard
  playThirteenBells(onStrokeCallback = null) {
    if (!this.ctx) return;
    let stroke = 1;

    const ringNext = () => {
      this.playHaveliBell(stroke === 13 ? 1.4 : 1.0, stroke === 13);
      if (onStrokeCallback) onStrokeCallback(stroke);
      stroke++;
      if (stroke <= 13) {
        setTimeout(ringNext, 1200);
      }
    };
    ringNext();
  }

  playHaveliBell(pitchMult = 1.0, isThirteenth = false) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const baseFreq = isThirteenth ? 213 : 246; // Deeper eerie 213Hz for 13th bell

    // Metal bell modal synthesis: fundamental + non-harmonic overtones
    const partials = [1, 2.76, 4.07, 5.43, 6.71];
    const amplitudes = [0.25, 0.18, 0.12, 0.08, 0.04];
    const decays = [3.8, 2.5, 1.8, 1.2, 0.8];

    partials.forEach((mult, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * mult * pitchMult, t);

      gain.gain.setValueAtTime(amplitudes[idx], t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + decays[idx]);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + decays[idx] + 0.1);
    });
  }

  // The 13 Knocks from the sealed 13th room wall
  playThirteenKnocks(onKnockCallback = null) {
    if (!this.ctx) return;
    let knockCount = 1;

    const knockNext = () => {
      this.playWoodenKnock(knockCount === 13);
      if (onKnockCallback) onKnockCallback(knockCount);
      knockCount++;
      if (knockCount <= 13) {
        setTimeout(knockNext, 450);
      }
    };
    knockNext();
  }

  playWoodenKnock(isFinal = false) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isFinal ? 110 : 135, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.08);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, t);
    filter.Q.setValueAtTime(4, t);

    gain.gain.setValueAtTime(isFinal ? 0.35 : 0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.0005, t + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Player Footsteps
  playFootstep(surface = 'wood') {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.1, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(surface === 'wood' ? 450 : 800, t);
    filter.Q.setValueAtTime(3, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(t);
  }

  // Polaroid Camera Sounds
  playCameraShutter() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    // Shutter click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.06);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.09);

    // Motor whir ejecting photo
    setTimeout(() => {
      if (!this.ctx) return;
      const t2 = this.ctx.currentTime;
      const mOsc = this.ctx.createOscillator();
      const mGain = this.ctx.createGain();
      mOsc.type = 'sawtooth';
      mOsc.frequency.setValueAtTime(180, t2);
      mGain.gain.setValueAtTime(0.08, t2);
      mGain.gain.linearRampToValueAtTime(0.01, t2 + 0.7);

      mOsc.connect(mGain);
      mGain.connect(this.masterGain);
      mOsc.start(t2);
      mOsc.stop(t2 + 0.75);
    }, 120);
  }

  // Cassette Tape Mechanics & Whispers
  playCassetteClick() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, t);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  playTapeHiss(duration = 2.0) {
    if (!this.ctx) return;
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.06;
    }
    const hiss = this.ctx.createBufferSource();
    hiss.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3500, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    hiss.connect(filter);
    filter.connect(this.masterGain);
    hiss.start();
  }

  // Paper rustle / Clue pickup
  playPaperRustle() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.15, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.12;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2400, t);

    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start(t);
  }

  // Brass Key turn
  playKeyTurn() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(950, t + 0.12);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.16);
  }
}

export const audio = new AudioManager();
