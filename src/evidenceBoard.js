// CASE 013: Interactive Evidence Board with 3-Layer Clues, Red String Connections & Deductions

export class EvidenceBoard {
  constructor(container, clues, deductions, onDeductionSolved) {
    this.container = container;
    this.clues = clues;
    this.deductions = deductions;
    this.onDeductionSolved = onDeductionSolved;

    this.selectedClueForConnection = null;
    this.activeConnections = []; // [{ from: 'clue_01', to: 'clue_07' }]
    this.cluePositions = {}; // Stores x, y coords for SVG red thread lines

    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="evidence-board-overlay">
        <div class="board-header">
          <div class="case-badge">
            <span class="stamp">CASE FILE 013</span>
            <h2>RAJASTHAN POLICE ARCHIVES · FROZEN JULY 1998</h2>
          </div>
          <div class="board-stats">
            <span id="clues-found-count">CLUES: 0/13</span>
            <span id="deductions-count">DEDUCTIONS: 0/6</span>
            <button class="board-close-btn" id="close-board-btn">BACK TO HAVELI [TAB]</button>
          </div>
        </div>

        <div class="corkboard-surface" id="corkboard">
          <!-- SVG yarn lines container -->
          <svg class="yarn-svg-layer" id="yarn-layer"></svg>

          <!-- Pinned Clues Grid -->
          <div class="pinned-clues-container" id="clues-container"></div>

          <!-- Solved Deductions Sidebar -->
          <div class="deductions-panel" id="deductions-panel">
            <h3>FORENSIC DEDUCTIONS</h3>
            <div id="deductions-list" class="deductions-list">
              <p class="empty-hint">Connect contradictory or related clues with red thread to formulate deductions.</p>
            </div>
          </div>
        </div>

        <!-- Clue 3-Layer Detail Modal -->
        <div class="clue-inspect-modal" id="clue-modal" style="display:none;">
          <div class="modal-card">
            <button class="modal-close" id="close-clue-modal">×</button>
            <div class="modal-header">
              <span class="modal-icon" id="m-icon"></span>
              <h3 id="m-title"></h3>
              <span class="modal-loc" id="m-location"></span>
            </div>

            <div id="m-image-wrap" style="display: none; text-align: center; margin: 8px 0 14px 0;">
              <img id="m-image" src="" alt="Clue Visual" style="max-height: 220px; max-width: 100%; border: 2px solid #8b6508; border-radius: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.85); object-fit: contain;" />
            </div>
            
            <div class="layer-tabs">
              <button class="layer-tab active" data-layer="physical">LAYER 1: PHYSICAL</button>
              <button class="layer-tab" data-layer="documentary">LAYER 2: DOCUMENTARY</button>
              <button class="layer-tab" data-layer="paranormal">LAYER 3: PARANORMAL</button>
            </div>

            <div class="layer-content-box" id="layer-content">
              <!-- Rendered dynamic content -->
            </div>

            <div class="modal-actions">
              <button class="pin-string-btn" id="m-connect-btn">CONNECT RED THREAD</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const closeBtn = this.container.querySelector('#close-board-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.container.style.display = 'none';
      });
    }

    const closeClueModal = this.container.querySelector('#close-clue-modal');
    if (closeClueModal) {
      closeClueModal.addEventListener('click', () => {
        this.container.querySelector('#clue-modal').style.display = 'none';
      });
    }

    // Modal Tabs
    const tabs = this.container.querySelectorAll('.layer-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.showLayer(e.target.dataset.layer);
      });
    });

    const connectBtn = this.container.querySelector('#m-connect-btn');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        if (this.currentInspectedClue) {
          this.startOrCompleteConnection(this.currentInspectedClue.id);
          this.container.querySelector('#clue-modal').style.display = 'none';
        }
      });
    }

    window.addEventListener('resize', () => {
      this.drawYarnLines();
    });
  }

  render() {
    const cluesContainer = this.container.querySelector('#clues-container');
    const cluesFound = this.clues.filter(c => c.unlocked);
    const cluesCountEl = this.container.querySelector('#clues-found-count');
    if (cluesCountEl) cluesCountEl.textContent = `CLUES: ${cluesFound.length}/13`;

    cluesContainer.innerHTML = '';

    this.clues.forEach((clue) => {
      const card = document.createElement('div');
      card.className = `clue-polaroid ${clue.unlocked ? 'discovered' : 'locked'} ${this.selectedClueForConnection === clue.id ? 'connecting' : ''}`;
      card.id = `clue-card-${clue.id}`;

      if (clue.unlocked) {
        const photoBg = clue.image ? `style="background-image: url('${clue.image}'); background-size: cover; background-position: center;"` : 
          (clue.id === 'clue_06' ? `style="background-image: url('/assets/rathore_family_portrait.jpg'); background-size: cover; background-position: center;"` : '');
        card.innerHTML = `
          <div class="pushpin" data-id="${clue.id}"></div>
          <div class="polaroid-photo" ${photoBg}>
            ${photoBg ? '' : `<span class="icon">${clue.icon}</span>`}
          </div>
          <div class="polaroid-caption">
            <h4>${clue.name}</h4>
            <span class="location">${clue.room}</span>
          </div>
        `;
        card.addEventListener('click', (e) => {
          if (e.target.classList.contains('pushpin')) {
            this.startOrCompleteConnection(clue.id);
          } else {
            this.inspectClue(clue);
          }
        });
      } else {
        card.innerHTML = `
          <div class="pushpin locked-pin"></div>
          <div class="polaroid-photo locked-photo">
            <span class="lock-icon">🔒</span>
          </div>
          <div class="polaroid-caption">
            <h4>UNEXPLORED LEAD</h4>
            <span class="location">${clue.room}</span>
          </div>
        `;
      }

      cluesContainer.appendChild(card);
    });

    this.renderDeductions();
    setTimeout(() => this.drawYarnLines(), 100);
  }

  inspectClue(clue) {
    this.currentInspectedClue = clue;
    const modal = this.container.querySelector('#clue-modal');
    modal.style.display = 'flex';

    this.container.querySelector('#m-icon').textContent = clue.icon;
    this.container.querySelector('#m-title').textContent = clue.name;
    this.container.querySelector('#m-location').textContent = `FOUND AT: ${clue.room.toUpperCase()}`;

    const imgWrap = this.container.querySelector('#m-image-wrap');
    const imgEl = this.container.querySelector('#m-image');
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

    // Reset tabs
    const tabs = this.container.querySelectorAll('.layer-tab');
    tabs.forEach(t => t.classList.remove('active'));
    tabs[0].classList.add('active');

    // Quick shortcut for Meera's Pictorial Spell Diagram
    let spellBtn = this.container.querySelector('#m-view-spell-btn');
    if (clue.id === 'clue_02') {
      if (!spellBtn) {
        spellBtn = document.createElement('button');
        spellBtn.id = 'm-view-spell-btn';
        spellBtn.className = 'pin-string-btn';
        spellBtn.style.cssText = 'background: #7a2228; border: 1px solid #ffd700; color: #fff; margin-left: 10px; font-weight: bold; cursor: pointer;';
        spellBtn.textContent = '📜 VIEW PICTORIAL SPELL';
        spellBtn.onclick = () => {
          this.close();
          const meeraModal = document.getElementById('meera-spell-modal');
          if (meeraModal) meeraModal.style.display = 'flex';
        };
        this.container.querySelector('.modal-actions')?.appendChild(spellBtn);
      } else {
        spellBtn.style.display = 'inline-block';
      }
    } else if (spellBtn) {
      spellBtn.style.display = 'none';
    }

    this.showLayer('physical');
  }

  showLayer(layerName) {
    if (!this.currentInspectedClue) return;
    const box = this.container.querySelector('#layer-content');
    const clue = this.currentInspectedClue;

    if (layerName === 'physical') {
      box.innerHTML = `
        <div class="layer-body">
          <div class="layer-badge physical-badge">PHYSICAL EVIDENCE</div>
          <p class="layer-text">${clue.physical}</p>
          <div class="forensic-meta">
            <span>FORENSIC LOG: TANGIBLE ARTIFACT</span>
            <span>DATE CODED: JULY 1998</span>
          </div>
        </div>
      `;
    } else if (layerName === 'documentary') {
      box.innerHTML = `
        <div class="layer-body">
          <div class="layer-badge doc-badge">DOCUMENTARY RECORD</div>
          <p class="layer-text">${clue.documentary}</p>
          <div class="forensic-meta">
            <span>ARCHIVE: CONTRADICTS OFFICIAL POLICE DOSSIER</span>
          </div>
        </div>
      `;
    } else if (layerName === 'paranormal') {
      box.innerHTML = `
        <div class="layer-body">
          <div class="layer-badge para-badge">PARANORMAL ANOMALY</div>
          <p class="layer-text eerie-text">${clue.paranormal}</p>
          <div class="forensic-meta">
            <span>UNRESOLVED PHENOMENON · NON-EUCLIDEAN</span>
          </div>
        </div>
      `;
    }
  }

  startOrCompleteConnection(clueId) {
    if (!this.selectedClueForConnection) {
      this.selectedClueForConnection = clueId;
      this.render();
    } else if (this.selectedClueForConnection === clueId) {
      // Cancel
      this.selectedClueForConnection = null;
      this.render();
    } else {
      const clueA = this.selectedClueForConnection;
      const clueB = clueId;
      this.selectedClueForConnection = null;

      // Add connection
      this.activeConnections.push({ from: clueA, to: clueB });
      this.checkDeductionMatch(clueA, clueB);
      this.render();
    }
  }

  checkDeductionMatch(idA, idB) {
    const matchingDeduction = this.deductions.find(d => {
      if (d.solved) return false;
      if ((d.clueA === idA && d.clueB === idB) || (d.clueA === idB && d.clueB === idA)) return true;
      // Also allow connecting clue_04 (Mason Ramu Statement) with clue_13 (Confession Book) for ded_06
      if (d.id === 'ded_06' && ((idA === 'clue_04' && idB === 'clue_13') || (idA === 'clue_13' && idB === 'clue_04'))) return true;
      return false;
    });

    if (matchingDeduction) {
      matchingDeduction.solved = true;
      if (this.onDeductionSolved) {
        this.onDeductionSolved(matchingDeduction);
      }
    }
  }

  renderDeductions() {
    const panel = this.container.querySelector('#deductions-list');
    const solvedDeductions = this.deductions.filter(d => d.solved);
    const countEl = this.container.querySelector('#deductions-count');
    if (countEl) countEl.textContent = `DEDUCTIONS: ${solvedDeductions.length}/6`;

    if (solvedDeductions.length === 0) {
      panel.innerHTML = `<p class="empty-hint">Pin two contradictory clues together with red string to reveal hidden truths.</p>`;
      return;
    }

    panel.innerHTML = '';
    solvedDeductions.forEach(ded => {
      const item = document.createElement('div');
      item.className = 'deduction-card solved';
      item.innerHTML = `
        <div class="deduction-tag">DEDUCTION VERIFIED</div>
        <h4>${ded.title}</h4>
        <p>${ded.summary}</p>
      `;
      panel.appendChild(item);
    });
  }

  drawYarnLines() {
    const svg = this.container.querySelector('#yarn-layer');
    if (!svg) return;
    svg.innerHTML = '';

    const boardRect = this.container.querySelector('#corkboard').getBoundingClientRect();

    this.activeConnections.forEach(conn => {
      const elFrom = this.container.querySelector(`#clue-card-${conn.from} .pushpin`);
      const elTo = this.container.querySelector(`#clue-card-${conn.to} .pushpin`);

      if (elFrom && elTo) {
        const r1 = elFrom.getBoundingClientRect();
        const r2 = elTo.getBoundingClientRect();

        const x1 = r1.left + r1.width / 2 - boardRect.left;
        const y1 = r1.top + r1.height / 2 - boardRect.top;
        const x2 = r2.left + r2.width / 2 - boardRect.left;
        const y2 = r2.top + r2.height / 2 - boardRect.top;

        // Draw curved red yarn path
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 + 18; // slight gravity sag

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`);
        path.setAttribute('stroke', '#c72424');
        path.setAttribute('stroke-width', '2.5');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('filter', 'drop-shadow(0 2px 3px rgba(0,0,0,0.6))');
        svg.appendChild(path);
      }
    });
  }

  open() {
    this.container.style.display = 'block';
    this.render();
  }

  close() {
    this.container.style.display = 'none';
  }
}
