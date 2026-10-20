// CASE 013: Suspect Dossiers & Contradiction Interrogation System

export class SuspectDossier {
  constructor(container, suspects, clues, deductions, onContradictionBreak) {
    this.container = container;
    this.suspects = suspects;
    this.clues = clues;
    this.deductions = deductions;
    this.onContradictionBreak = onContradictionBreak;

    this.currentSuspectId = 'vikram';
    this.confrontedSuspects = new Set();

    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="dossier-overlay" id="dossier-modal" style="display: none;">
        <div class="dossier-window">
          <div class="dossier-sidebar">
            <div class="sidebar-header">
              <span class="confidential-stamp">CONFIDENTIAL</span>
              <h3>PERSONS OF INTEREST</h3>
            </div>
            <div class="suspect-nav-list" id="suspect-list"></div>
            <button class="dossier-close-btn" id="close-dossier-btn">CLOSE DOSSIER [P]</button>
          </div>

          <div class="dossier-main" id="suspect-detail">
            <!-- Dynamic suspect detail rendered here -->
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const closeBtn = this.container.querySelector('#close-dossier-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyP') {
        if (this.container.style.display === 'block') {
          this.close();
        } else {
          this.open();
        }
      }
    });
  }

  open() {
    this.container.style.display = 'block';
    const modal = this.container.querySelector('#dossier-modal');
    if (modal) modal.style.display = 'block';
    this.render();
  }

  close() {
    this.container.style.display = 'none';
    const modal = this.container.querySelector('#dossier-modal');
    if (modal) modal.style.display = 'none';
  }

  render() {
    const listEl = this.container.querySelector('#suspect-list');
    listEl.innerHTML = '';

    this.suspects.forEach(s => {
      const isConfronted = this.confrontedSuspects.has(s.id);
      const item = document.createElement('div');
      item.className = `suspect-nav-item ${s.id === this.currentSuspectId ? 'active' : ''} ${isConfronted ? 'broken' : ''}`;
      item.innerHTML = `
        <div class="nav-thumb" style="background-image: url('${s.image}')"></div>
        <div class="nav-info">
          <h4>${s.name}</h4>
          <span class="role">${s.title}</span>
          ${isConfronted ? '<span class="status-badge solved">ALIBI SHATTERED</span>' : '<span class="status-badge pending">UNCONFRONTED</span>'}
        </div>
      `;
      item.addEventListener('click', () => {
        this.currentSuspectId = s.id;
        this.render();
      });
      listEl.appendChild(item);
    });

    this.renderSuspectDetail();
  }

  renderSuspectDetail() {
    const detailEl = this.container.querySelector('#suspect-detail');
    const s = this.suspects.find(item => item.id === this.currentSuspectId);
    if (!s) return;

    const hasContradictionClue = this.clues.find(c => c.id === s.contradictionClue && c.unlocked);
    const isConfronted = this.confrontedSuspects.has(s.id);

    detailEl.innerHTML = `
      <div class="dossier-sheet">
        <div class="sheet-header">
          <div class="dossier-photo-wrap">
            <img src="${s.image}" class="dossier-photo" alt="${s.name}" />
            <div class="photo-fingerprint"></div>
          </div>
          <div class="header-text">
            <h2>${s.name.toUpperCase()}</h2>
            <div class="sub-meta">
              <span>DESIGNATION: ${s.title.toUpperCase()}</span>
              <span>AGE: ${s.age}</span>
              <span>STATUS: ${s.status.toUpperCase()}</span>
            </div>
            <p class="overview">${s.overview}</p>
          </div>
        </div>

        <div class="dossier-grid">
          <div class="dossier-card">
            <h4>SUSPECTED MOTIVE</h4>
            <p>${s.motive}</p>
          </div>

          <div class="dossier-card">
            <h4>INCRIMINATING EVIDENCE</h4>
            <p>${s.suspiciousEvidence}</p>
          </div>

          <div class="dossier-card dark-secret">
            <h4>CLASSIFIED FAMILY SECRET</h4>
            <p>${isConfronted ? s.secret : '🔒 [CONFRONT SUSPECT WITH CONTRADICTION CLUE TO UNLOCK]'}</p>
          </div>
        </div>

        <div class="interrogation-log">
          <h4>HISTORICAL RECORDINGS & INTERROGATION TRANSCRIPTS</h4>
          <div class="transcript-bubbles">
            ${s.interrogation.map(entry => `
              <div class="dialogue-line">
                <strong class="speaker">${entry.speaker}:</strong>
                <span class="line-text">"${entry.text}"</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="confrontation-action-bar">
          ${isConfronted ? `
            <div class="confronted-banner">
              ✓ ALIBI DEMOLISHED · CONTRADICTION ENTERED INTO POLICE RECORD
            </div>
          ` : `
            <button class="confront-btn ${hasContradictionClue ? 'unlocked' : 'disabled'}" id="confront-trigger">
              ${hasContradictionClue ? `⚡ CONFRONT WITH EVIDENCE: ${hasContradictionClue.name}` : `🔒 REQUIRED CLUE MISSING TO CHALLENGE ALIBI`}
            </button>
          `}
        </div>
      </div>
    `;

    const confrontBtn = detailEl.querySelector('#confront-trigger');
    if (confrontBtn && hasContradictionClue && !isConfronted) {
      confrontBtn.addEventListener('click', () => {
        this.confrontedSuspects.add(s.id);
        this.render();
        if (this.onContradictionBreak) {
          this.onContradictionBreak(s);
        }
      });
    }
  }
}
