/* ============================================================
   PARAVANAR TRIPARTITE GOVERNANCE BOARD — SCRIPT
   Theme Toggle · Blockchain Evidence · IoT Dashboard · Animations
   ============================================================ */

(function () {
    'use strict';

    // ── DYNAMIC BACKGROUND TRANSITION ──
    const cleanBg = document.getElementById('bg-layer-clean');
    
    function updateBackground() {
        if (!cleanBg) return;
        // Calculate scroll percentage
        const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollMax <= 0) return;
        
        let ratio = window.scrollY / scrollMax;
        // Use a power curve so it stays polluted for a bit, then transitions rapidly to clean
        ratio = Math.pow(ratio, 1.5);
        
        cleanBg.style.opacity = Math.min(Math.max(ratio, 0), 1).toFixed(3);
    }

    // ── NAVIGATION ──
    const nav = document.getElementById('main-nav');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // Scroll effects
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
        updateActiveNav();
        updateScrollProgress();
        updateBackground(); // Update the dynamic background layer
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile nav on link click
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('active'));
    });

    // Active nav highlight
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
            }
        });
    }

    // Scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    }

    // ── INTERSECTION OBSERVER (Animations) ──
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Trigger counters
                entry.target.querySelectorAll('.counter:not(.counted)').forEach(animateCounter);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

    // Counter animation
    function animateCounter(el) {
        el.classList.add('counted');
        const target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target) || target === 0) return;
        const duration = 1800;
        const start = performance.now();
        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    // Also animate hero counters on load
    setTimeout(() => {
        document.querySelectorAll('.hero-stat-value .counter:not(.counted), .hero-pillars .counter:not(.counted)').forEach(animateCounter);
    }, 800);

    // ── LIVE TIME DISPLAY ──
    function updateLiveTimes() {
        const now = new Date();
        const timeStr = now.toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
        document.querySelectorAll('.live-time').forEach(el => {
            el.textContent = timeStr;
        });
    }
    updateLiveTimes();
    setInterval(updateLiveTimes, 5000);

    // ── HERO PARTICLES ──
    const particleContainer = document.getElementById('hero-particles');
    if (particleContainer) {
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            const size = Math.random() * 3 + 1;
            Object.assign(p.style, {
                position: 'absolute',
                width: size + 'px', height: size + 'px',
                background: `rgba(var(--accent-primary-rgb), ${Math.random() * 0.4 + 0.1})`,
                borderRadius: '50%',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `float ${8 + Math.random() * 12}s ease-in-out infinite`,
                animationDelay: -Math.random() * 10 + 's',
            });
            particleContainer.appendChild(p);
        }
        const style = document.createElement('style');
        style.textContent = `@keyframes float { 0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; } 25% { transform: translate(${Math.random()*30-15}px, -${Math.random()*30}px) scale(1.2); } 50% { transform: translate(${Math.random()*20-10}px, -${Math.random()*20}px) scale(0.8); opacity: 0.3; } 75% { transform: translate(-${Math.random()*25}px, ${Math.random()*15}px) scale(1.1); } }`;
        document.head.appendChild(style);
    }

    // ============================================================
    // BLOCKCHAIN EVIDENCE FRAMEWORK
    // ============================================================

    const STORAGE_KEY = 'ptgb-evidence-chain';
    const ARCHIVE_KEY = 'ptgb-evidence-archives';

    // SHA-256 hashing
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Generate NFC Tag ID
    function generateNFCTag() {
        const hex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
        return `NFC-${hex()}${hex()}-${hex()}${hex()}-${hex()}${hex()}`;
    }

    // Load chain from localStorage
    function loadChain() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function getSelectedChain() {
        const select = document.getElementById('ledger-view-select');
        if (!select || select.value === 'active' || !select.value) {
            return loadChain();
        }
        const index = parseInt(select.value, 10);
        const archives = JSON.parse(localStorage.getItem(ARCHIVE_KEY) || '[]');
        if (archives[index]) {
            return archives[index].chain;
        }
        return [];
    }

    function renderArchiveSelect() {
        const select = document.getElementById('ledger-view-select');
        if (!select) return;
        const archives = JSON.parse(localStorage.getItem(ARCHIVE_KEY) || '[]');
        
        let html = `<option value="active">Active Ledger</option>`;
        archives.forEach((arc, i) => {
            html += `<option value="${i}">${arc.name} (${new Date(arc.date).toLocaleDateString()})</option>`;
        });
        
        const prevVal = select.value;
        select.innerHTML = html;
        if (prevVal && select.querySelector(`option[value="${prevVal}"]`)) {
            select.value = prevVal;
        }
    }

    // Save chain to localStorage
    function saveChain(chain) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chain));
    }

    // Create a new block
    async function createBlock(data) {
        const chain = loadChain();
        const index = chain.length;
        const timestamp = new Date().toISOString();
        const previousHash = index > 0 ? chain[index - 1].hash : '0'.repeat(64);
        const nfcTag = data.nfcTag || generateNFCTag();

        const blockData = {
            index,
            timestamp,
            station: data.station,
            submitter: data.submitter,
            nfcTag,
            readings: {
                mercury: parseFloat(data.mercury) || 0,
                selenium: parseFloat(data.selenium) || 0,
                lead: parseFloat(data.lead) || 0,
                pH: parseFloat(data.pH) || 0,
                dissolvedOxygen: parseFloat(data.dissolvedOxygen) || 0,
            },
            previousHash,
        };

        const blockString = JSON.stringify(blockData);
        const hash = await sha256(blockString);

        const block = { ...blockData, hash };
        chain.push(block);
        saveChain(chain);

        // Add custody entry
        addCustodyEntry(block);

        return block;
    }

    // Verify entire chain
    async function verifyChain() {
        const chain = getSelectedChain();
        if (chain.length === 0) return { valid: true, results: [], message: 'Chain is empty — no blocks to verify.' };

        const results = [];
        let allValid = true;

        for (let i = 0; i < chain.length; i++) {
            const block = chain[i];
            const { hash, ...blockData } = block;
            const computedHash = await sha256(JSON.stringify(blockData));
            const hashValid = computedHash === hash;

            let linkValid = true;
            if (i > 0) {
                linkValid = block.previousHash === chain[i - 1].hash;
            } else {
                linkValid = block.previousHash === '0'.repeat(64);
            }

            const blockValid = hashValid && linkValid;
            if (!blockValid) allValid = false;

            results.push({
                index: block.index,
                station: block.station,
                hashValid,
                linkValid,
                valid: blockValid,
                computedHash,
                storedHash: hash,
            });
        }

        return {
            valid: allValid,
            results,
            message: allValid
                ? `✅ Chain integrity VERIFIED — all ${chain.length} blocks are valid and properly linked.`
                : `❌ Chain integrity FAILED — tampering detected!`,
        };
    }

    // ── TAB INTERFACE ──
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tab-' + tabId).classList.add('active');
            if (tabId === 'ledger') renderLedger();
            if (tabId === 'custody') renderCustodyLog();
        });
    });

    // ── SUBMIT FORM ──
    const readingForm = document.getElementById('reading-form');
    const nfcTagInput = document.getElementById('nfc-tag');
    const submitResult = document.getElementById('submit-result');
    const generateMockBtn = document.getElementById('generate-mock-btn');

    // Auto-fill NFC tag
    nfcTagInput.value = generateNFCTag();
    readingForm.addEventListener('reset', () => {
        setTimeout(() => { nfcTagInput.value = generateNFCTag(); }, 10);
    });

    readingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submit-reading-btn');
        btn.disabled = true;
        btn.textContent = '⏳ Hashing...';

        try {
            const block = await createBlock({
                station: document.getElementById('station-select').value,
                submitter: document.getElementById('submitter-name').value,
                mercury: document.getElementById('hg-value').value,
                selenium: document.getElementById('se-value').value,
                lead: document.getElementById('pb-value').value,
                pH: document.getElementById('ph-value').value,
                dissolvedOxygen: document.getElementById('do-value').value,
                nfcTag: nfcTagInput.value,
            });

            submitResult.classList.remove('hidden', 'error');
            submitResult.classList.add('success');
            submitResult.innerHTML = `
                <div>✅ <strong>Block #${block.index} added to evidence chain</strong></div>
                <div style="margin-top:10px">
                    <span class="hash-label">SHA-256 Hash:</span><br>
                    <span class="hash-value">${block.hash}</span>
                </div>
                <div style="margin-top:6px">
                    <span class="hash-label">Previous Hash:</span><br>
                    <span class="hash-value">${block.previousHash}</span>
                </div>
                <div style="margin-top:6px">
                    <span class="hash-label">NFC Tag:</span> <span class="hash-value">${block.nfcTag}</span>
                </div>
                <div style="margin-top:6px">
                    <span class="hash-label">Timestamp:</span> <span class="hash-value">${block.timestamp}</span>
                </div>
                <div style="margin-top:6px">
                    <span class="hash-label">Station:</span> <span class="hash-value">${block.station}</span>
                    &nbsp;|&nbsp;
                    <span class="hash-label">By:</span> <span class="hash-value">${block.submitter}</span>
                </div>
            `;

            // Update block count
            updateBlockCount();
            // Reset form
            readingForm.reset();
            nfcTagInput.value = generateNFCTag();

        } catch (err) {
            submitResult.classList.remove('hidden', 'success');
            submitResult.classList.add('error');
            submitResult.innerHTML = `❌ Error: ${err.message}`;
        }

        btn.disabled = false;
        btn.textContent = '🔗 Hash & Submit to Chain';
    });

    // Generate mock data
    generateMockBtn.addEventListener('click', () => {
        const stations = ['STN-01', 'STN-02', 'STN-03', 'STN-04', 'STN-05', 'STN-06'];
        const names = ['M. Selvam', 'K. Lakshmi', 'R. Prabhu', 'S. Devi', 'A. Kumar', 'P. Meena'];
        document.getElementById('station-select').value = stations[Math.floor(Math.random() * stations.length)];
        document.getElementById('submitter-name').value = names[Math.floor(Math.random() * names.length)];
        document.getElementById('hg-value').value = (Math.random() * 0.25 + 0.001).toFixed(3);
        document.getElementById('se-value').value = (Math.random() * 24 + 0.5).toFixed(2);
        document.getElementById('pb-value').value = (Math.random() * 2.1 + 0.01).toFixed(3);
        document.getElementById('ph-value').value = (Math.random() * 3 + 5).toFixed(1);
        document.getElementById('do-value').value = (Math.random() * 6 + 2).toFixed(1);
        nfcTagInput.value = generateNFCTag();
    });

    // ── LEDGER RENDERING ──
    function renderLedger() {
        const chain = getSelectedChain();
        const ledgerEl = document.getElementById('ledger-chain');
        const countEl = document.getElementById('ledger-count');
        countEl.textContent = chain.length + ' block' + (chain.length !== 1 ? 's' : '');

        if (chain.length === 0) {
            ledgerEl.innerHTML = `<div class="ledger-empty"><div class="empty-icon">🔗</div><p>No blocks on chain yet. Submit a reading to create the genesis block.</p></div>`;
            return;
        }

        ledgerEl.innerHTML = chain.slice().reverse().map(block => `
            <div class="block-card">
                <div class="block-header">
                    <span class="block-index">Block #${block.index}${block.index === 0 ? ' (Genesis)' : ''}</span>
                    <span class="block-station">${block.station}</span>
                    <span class="block-time">${new Date(block.timestamp).toLocaleString()}</span>
                </div>
                <div style="font-size:0.72rem;color:var(--text-tertiary);margin-bottom:6px">
                    By: ${block.submitter} &nbsp;|&nbsp; NFC: ${block.nfcTag}
                </div>
                <div class="block-data">
                    <div class="block-datum"><span class="block-datum-label">Mercury</span><span class="block-datum-value">${block.readings.mercury} mg/L</span></div>
                    <div class="block-datum"><span class="block-datum-label">Selenium</span><span class="block-datum-value">${block.readings.selenium} mg/kg</span></div>
                    <div class="block-datum"><span class="block-datum-label">Lead</span><span class="block-datum-value">${block.readings.lead} mg/L</span></div>
                    <div class="block-datum"><span class="block-datum-label">pH</span><span class="block-datum-value">${block.readings.pH}</span></div>
                    <div class="block-datum"><span class="block-datum-label">DO</span><span class="block-datum-value">${block.readings.dissolvedOxygen} mg/L</span></div>
                </div>
                <div class="block-hashes">
                    <div class="block-hash-row"><span class="label">Hash:</span><span class="value">${block.hash}</span></div>
                    <div class="block-hash-row"><span class="label">Prev:</span><span class="value">${block.previousHash}</span></div>
                </div>
            </div>
        `).join('');
    }

    // ── VERIFY CHAIN ──
    const verifyBtn = document.getElementById('verify-chain-btn');
    const verifyResultEl = document.getElementById('verify-result');
    const verifyBlocksEl = document.getElementById('verify-blocks');

    verifyBtn.addEventListener('click', async () => {
        verifyBtn.disabled = true;
        verifyBtn.textContent = '⏳ Computing hashes...';
        verifyResultEl.classList.add('hidden');
        verifyBlocksEl.innerHTML = '';

        // Simulate a brief delay for UX
        await new Promise(r => setTimeout(r, 500));

        const result = await verifyChain();

        verifyResultEl.classList.remove('hidden', 'success', 'failure');
        verifyResultEl.classList.add(result.valid ? 'success' : 'failure');
        verifyResultEl.textContent = result.message;

        if (result.results.length > 0) {
            verifyBlocksEl.innerHTML = result.results.map(r => `
                <div class="verify-block-item">
                    <span>Block #${r.index} — ${r.station}</span>
                    <span>Hash: ${r.hashValid ? '✅' : '❌'} &nbsp; Link: ${r.linkValid ? '✅' : '❌'}</span>
                    <span class="${r.valid ? 'verify-ok' : 'verify-fail'}">${r.valid ? 'VALID' : 'TAMPERED'}</span>
                </div>
            `).join('');
        }

        verifyBtn.disabled = false;
        verifyBtn.textContent = '🔍 Verify Entire Chain';
    });

    // ── EXPORT LEDGER ──
    document.getElementById('export-ledger-btn').addEventListener('click', () => {
        const chain = getSelectedChain();
        const blob = new Blob([JSON.stringify(chain, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const select = document.getElementById('ledger-view-select');
        const prefix = (select && select.value !== 'active') ? `archived-ledger-${select.value}` : 'evidence-chain';
        const a = document.createElement('a');
        a.href = url;
        a.download = `ptgb-${prefix}-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // ── ARCHIVE LEDGER ──
    document.getElementById('archive-ledger-btn').addEventListener('click', () => {
        const currentChain = loadChain();
        if (currentChain.length === 0) {
            alert('Active ledger is already empty.');
            return;
        }

        // Save to archives
        const archives = JSON.parse(localStorage.getItem(ARCHIVE_KEY) || '[]');
        archives.push({
            name: "Archived Ledger " + (archives.length + 1),
            date: new Date().toISOString(),
            chain: currentChain
        });
        localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archives));

        // Clear active chain
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('ptgb-custody-log');
        
        // Re-render select and UI
        renderArchiveSelect();
        const select = document.getElementById('ledger-view-select');
        if (select) select.value = 'active';
        
        renderLedger();
        updateBlockCount();
        renderCustodyLog();
        
        // Clear verification results if they exist
        const verifyResultEl = document.getElementById('verify-result');
        const verifyBlocksEl = document.getElementById('verify-blocks');
        if (verifyResultEl) {
            verifyResultEl.className = 'verify-result hidden';
            verifyResultEl.textContent = '';
        }
        if (verifyBlocksEl) verifyBlocksEl.innerHTML = '';

        // Clear submit results if they exist
        const submitResult = document.getElementById('submit-result');
        if (submitResult) {
            submitResult.className = 'submit-result hidden';
            submitResult.innerHTML = '';
        }
        
        // Brief visual feedback on the button
        const btn = document.getElementById('archive-ledger-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Archived!';
        setTimeout(() => { btn.innerHTML = originalText; }, 2000);
    });

    const viewSelect = document.getElementById('ledger-view-select');
    if (viewSelect) {
        viewSelect.addEventListener('change', () => {
            renderLedger();
            // Optional: reset verification UI when switching views
            const verifyResultEl = document.getElementById('verify-result');
            const verifyBlocksEl = document.getElementById('verify-blocks');
            if (verifyResultEl) verifyResultEl.className = 'verify-result hidden';
            if (verifyBlocksEl) verifyBlocksEl.innerHTML = '';
        });
    }

    // ── CUSTODY LOG ──
    const CUSTODY_KEY = 'ptgb-custody-log';

    function addCustodyEntry(block) {
        const log = JSON.parse(localStorage.getItem(CUSTODY_KEY) || '[]');
        const events = [
            { icon: '🧪', text: `Sample collected at ${block.station}`, tag: block.nfcTag, time: block.timestamp },
            { icon: '🏷️', text: `NFC seal applied: ${block.nfcTag}`, tag: block.nfcTag, time: new Date(new Date(block.timestamp).getTime() + 120000).toISOString() },
            { icon: '🚚', text: `Sample in transit to NABL lab`, tag: block.nfcTag, time: new Date(new Date(block.timestamp).getTime() + 3600000).toISOString() },
            { icon: '🔬', text: `Lab received — AAS analysis: Hg=${block.readings.mercury} mg/L`, tag: block.nfcTag, time: new Date(new Date(block.timestamp).getTime() + 7200000).toISOString() },
            { icon: '🔗', text: `Block #${block.index} added to chain — Hash: ${block.hash.slice(0, 16)}...`, tag: block.nfcTag, time: new Date(new Date(block.timestamp).getTime() + 7500000).toISOString() },
        ];
        log.push(...events);
        // Keep last 50 entries
        while (log.length > 50) log.shift();
        localStorage.setItem(CUSTODY_KEY, JSON.stringify(log));
    }

    function renderCustodyLog() {
        const log = JSON.parse(localStorage.getItem(CUSTODY_KEY) || '[]');
        const container = document.getElementById('custody-entries');
        if (log.length === 0) {
            container.innerHTML = '<div class="ledger-empty" style="padding:24px"><p>No custody events recorded. Submit a reading to generate custody trail.</p></div>';
            return;
        }
        container.innerHTML = log.slice().reverse().slice(0, 25).map(entry => `
            <div class="custody-entry">
                <span class="custody-entry-icon">${entry.icon}</span>
                <span class="custody-entry-text">${entry.text}</span>
                <span class="custody-entry-tag">${entry.tag}</span>
                <span class="custody-entry-time">${new Date(entry.time).toLocaleString()}</span>
            </div>
        `).join('');
    }

    // ── UPDATE BLOCK COUNT ──
    function updateBlockCount() {
        const chain = loadChain();
        const countDisplays = document.querySelectorAll('#block-count-display .counter');
        countDisplays.forEach(el => {
            el.setAttribute('data-count', chain.length);
            el.textContent = chain.length;
        });
    }

    // Initialize
    renderArchiveSelect();
    updateBlockCount();
    renderCustodyLog();

    // ── EVIDENCE BAR ANIMATION ──
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.evidence-card, .capex-breakdown').forEach(el => {
        el.setAttribute('data-animate', '');
        barObserver.observe(el);
    });

    // ============================================================
    // SIMULATION MODE LOGIC
    // ============================================================
    const simBtn = document.getElementById('sim-btn');
    const simModal = document.getElementById('sim-modal');
    const simClose = document.getElementById('sim-close');
    const simMap = document.querySelector('.sim-map');
    const simScanner = document.getElementById('sim-scanner');
    const simStatusText = document.getElementById('sim-status-text');
    const simProgress = document.getElementById('sim-progress');
    const hudBoxes = document.querySelectorAll('.hud-box');
    
    // HUD Data Elements
    const hudDischarge = document.getElementById('hud-discharge');
    const hudTss = document.getElementById('hud-tss');
    const hudHash = document.getElementById('hud-hash');
    const hudVerify = document.getElementById('hud-verify');

    let simTimeout1, simTimeout2, simTimeout3, simTimeout4, simTimeout5;

    function resetSimulation() {
        simMap.classList.remove('scanning');
        simScanner.classList.remove('active');
        hudBoxes.forEach(box => box.style.opacity = '0');
        simStatusText.textContent = "INITIALIZING SYSTEMS...";
        simProgress.style.width = '0%';
        hudDischarge.textContent = '-- m³/s';
        hudTss.textContent = '-- mg/L';
        hudHash.textContent = 'PENDING';
        hudVerify.textContent = 'AWAITING SCAN';
        clearTimeout(simTimeout1);
        clearTimeout(simTimeout2);
        clearTimeout(simTimeout3);
        clearTimeout(simTimeout4);
        clearTimeout(simTimeout5);
    }

    function runSimulation() {
        simProgress.style.width = '10%';
        
        simTimeout1 = setTimeout(() => {
            simStatusText.textContent = "SCANNING NLCIL EXTRACTION ZONES...";
            simMap.classList.add('scanning');
            simScanner.classList.add('active');
            simProgress.style.width = '35%';
            hudBoxes[0].style.opacity = '1';
        }, 1500);

        simTimeout2 = setTimeout(() => {
            hudDischarge.textContent = '4,200 m³/s';
            hudTss.textContent = '45 mg/L';
            hudDischarge.style.color = '#34d399';
            hudTss.style.color = '#34d399';
        }, 2500);

        simTimeout3 = setTimeout(() => {
            simStatusText.textContent = "VERIFYING TNPCB SENSORS & BLOCKCHAIN...";
            simProgress.style.width = '65%';
            hudBoxes[1].style.opacity = '1';
            hudHash.textContent = 'GENERATING...';
        }, 4000);

        simTimeout4 = setTimeout(() => {
            hudHash.textContent = '0x9a4f...3c12';
            hudHash.style.color = '#38bdf8';
            hudVerify.textContent = 'COMMUNITY VERIFIED';
            hudVerify.style.color = '#34d399';
            simProgress.style.width = '90%';
        }, 5500);

        simTimeout5 = setTimeout(() => {
            simStatusText.textContent = "SIMULATION COMPLETE: ALL SYSTEMS NOMINAL.";
            simProgress.style.width = '100%';
            simScanner.classList.remove('active');
        }, 7500);
    }

    if (simBtn && simModal && simClose) {
        simBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetSimulation();
            simModal.classList.add('active');
            runSimulation();
        });

        simClose.addEventListener('click', () => {
            simModal.classList.remove('active');
            resetSimulation();
        });

        // Close on clicking backdrop
        simModal.addEventListener('click', (e) => {
            if (e.target === simModal) {
                simModal.classList.remove('active');
                resetSimulation();
            }
        });
    }

})();
