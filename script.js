/**
 * VAULT 17 — Core Game Engine
 * Cinematic Mechanical Puzzle & Psychological Mystery
 * Vanilla JavaScript (ES6+) — Zero External Dependencies
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. ONLINE IMAGE ASSETS & RESILIENT FALLBACKS
  // ==========================================================================
  const ASSETS = {
    CHAMBER_MAIN: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1800&q=80',
    CHAMBER_FALLBACK: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=80'
  };

  // ==========================================================================
  // 2. WEB AUDIO API PHYSICAL SOUND SYNTHESIZER
  // ==========================================================================
  const AudioEngine = {
    ctx: null,
    masterGain: null,
    sfxGain: null,
    ambienceGain: null,
    droneGain: null,

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.ambienceGain = this.ctx.createGain();

      this.masterGain.gain.value = 0.8;
      this.sfxGain.gain.value = 0.9;
      this.ambienceGain.gain.value = 0.5;

      this.sfxGain.connect(this.masterGain);
      this.ambienceGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.startSubterraneanDrone();
    },

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },

    // Subterranean low-frequency machinery hum & air resonance
    startSubterraneanDrone() {
      if (!this.ctx) return;
      try {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc1.frequency.value = 42; // Deep subterranean hum
        osc2.type = 'sine';
        osc2.frequency.value = 84;

        filter.type = 'lowpass';
        filter.frequency.value = 130;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.22;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ambienceGain);

        osc1.start();
        osc2.start();
        this.droneGain = gain;
      } catch (e) {
        // Silent fallback
      }
    },

    // Valve rotation ratchet click
    playRatchetClick() {
      if (!this.ctx) return;
      this.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    },

    // Pneumatic pressure hiss / blow-off venting
    playPneumaticHiss(duration = 0.4) {
      if (!this.ctx) return;
      this.resume();
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 1.2;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start();
    },

    // Heavy Knife Switch & Breakers Clank
    playKnifeSwitch() {
      if (!this.ctx) return;
      this.resume();
      // Low metallic body
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);

      // High relay click
      const click = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      click.type = 'square';
      click.frequency.setValueAtTime(1100, this.ctx.currentTime);
      clickGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      click.connect(clickGain);
      clickGain.connect(this.sfxGain);

      click.start();
      click.stop(this.ctx.currentTime + 0.05);
    },

    // Mechanical Lock Tumbler Sequence: CLICK -> CLICK -> CLUNK!
    playTumblerSuccessSequence() {
      if (!this.ctx) return;
      this.resume();

      // Click 1 (t = 0)
      this.playMechanicalTick(540, 0);
      // Click 2 (t = 0.18s)
      this.playMechanicalTick(720, 0.18);
      // Heavy Clunk (t = 0.42s)
      setTimeout(() => {
        this.playHeavyClunk();
      }, 420);
    },

    playMechanicalTick(freq = 600, delay = 0) {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.28, this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + delay + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + 0.06);
    },

    // Heavy vault locking pin / bolt withdrawal clunk
    playHeavyClunk() {
      if (!this.ctx) return;
      this.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(75, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.45);

      gain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    },

    // Massive Vault Door Seal Release (Deep Sub-Bass Groan)
    playVaultUnsealGroan() {
      if (!this.ctx) return;
      this.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(18, this.ctx.currentTime + 1.2);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 180;

      gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    },

    // CRT Keystroke
    playCRTKey() {
      if (!this.ctx) return;
      this.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(850 + Math.random() * 80, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    }
  };

  // ==========================================================================
  // 3. GAME STATE DATA MODEL
  // ==========================================================================
  const GameState = {
    active: false,
    gameTimeSec: 197, // 03:17:17 AM

    // Lock Subsystems
    lock1_hydraulic: false, // 47 PSI stabilized
    lock2_solenoid: false,  // 220V calibrated
    lock3_tumbler: false,   // 31 - 07 aligned
    mainSealUnlocked: false,

    // Puzzle 1: Pressure
    pressurePSI: 0,
    valves: { A: false, B: false, C: false },
    valveHistory: [],
    pressureBlowoffsCount: 0,

    // Puzzle 2: Breakers
    knifeClosed: false,
    breakers: {
      b1_heater: false,   // 50V
      b2_logic: false,    // 120V
      b3_solenoid: false, // 100V
      b4_seal: false      // 80V
    },
    voltageTotal: 0,

    // Puzzle 3: Tumblers
    dial1_val: 0, // Target 31
    dial2_val: 0, // Target 07

    // Terminal
    activeFileId: 'log1',
    logsViewedCount: 1,

    // Statistics
    cluesFound: 0,
    totalInteractions: 0
  };

  // Facility Archive Terminal Files Database
  const ARCHIVE_FILES = {
    log1: {
      title: "1978_SPEC_B07.LOG // VAULT CONSTRUCTION ARCHIVE",
      body: `FACILITY 17 &bull; EXCAVATION COMMISSION // LEVEL -03
DATE: OCTOBER 14, 1978
DIRECTOR: DR. H. VANCE

Initial subterranean blast-work completed at depth: 140 meters.
Contractors installed the 4-ton cold-rolled manganese steel radial seal.
Primary engineering specs mandated triple-redundant pneumatic holding pins:
- Normal hydraulic operating baseline: 47 PSI.
- Circuit logic bus requires 220V regulated power.
- Vault door was designed for absolute bilateral isolation.
Note from Foreman: "Reinforcing bars exceed all industrial ballistic standards. This is not a depository for bullion or blueprints."`
    },
    log2: {
      title: "1984_CONTAINMENT.LOG // SPECIMEN SPECIFICATION",
      body: `SECURITY DIRECTIVE 84-C // CLEARANCE LEVEL 4 ONLY
DATE: AUGUST 03, 1984

Classification altered from 'Materials Storage' to 'Biological & Thermal Containment'.
Perimeter seal cooling coils must remain permanently active.
Internal chamber sensors indicate zero acoustic decay. Specimen shows metabolic dormancy under pressurized saline immersion.
WARNING: Under no circumstances should the central handwheel be disengaged while external facility power is unmonitored.
Key override combination registered: Level -03 incident coordinates.`
    },
    log3: {
      title: "INCIDENT_0317.LOG // EMERGENCY SHIFT DIARY",
      body: `EMERGENCY INCIDENT REPORT &bull; 03:17 AM
LOGGED BY: SENIOR DISPATCHER K. REEVES

02:11 AM — Internal core temperature began unprompted exponential rise (+14°C).
02:38 AM — Seismic vibration recorded in lower hoistway.
03:04 AM — Automated failsafes severed hydraulic return lines. Locking pins clamped.
03:17 AM — All exterior communications cut. Upper elevators halted.
Decision taken: The exterior security team sealed Vault 17 from the outside.
Whoever finds this terminal: DO NOT DRAW THE RADIAL BOLTS. The door was not sealed to keep intruders out. It was sealed to keep what is inside from escaping.`
    },
    log4: {
      title: "FINAL_DISPOSITION.LOG // PROTOCOL SUMMARY",
      body: `MEMORANDUM &bull; PERMANENT CONFINEMENT ORDER
Facility 17 is designated abandoned under martial quarantine.
Emergency override coordinates stamped onto placard: 31 - 07.
If containment failure is imminent, manual operator must engage the Emergency Deadlock Handle to permanently entomb Level -03 with liquid concrete ballast.`
    }
  };

  // ==========================================================================
  // 4. PUZZLE 1: PNEUMATIC PRESSURE EQUALIZER
  // ==========================================================================
  function updatePressureGauge() {
    const needle = document.getElementById('pressure-needle');
    const valDisplay = document.getElementById('gauge-pressure-val');

    // Clamp PSI between 0 and 65
    const psi = Math.max(0, Math.min(65, GameState.pressurePSI));
    if (valDisplay) valDisplay.textContent = Math.round(psi);

    // Map 0 - 65 PSI to needle angle: -120deg to +120deg
    const deg = -120 + (psi / 65) * 240;
    if (needle) needle.style.transform = `rotate(${deg}deg)`;

    // Update Telemetry Pill
    const txtPill = document.getElementById('txt-lock-1');
    const pill = document.getElementById('pill-lock-1');
    if (GameState.lock1_hydraulic) {
      if (txtPill) txtPill.textContent = "DISENGAGED (47 PSI)";
      if (pill) {
        pill.querySelector('.pill-led').className = 'pill-led led-green';
        txtPill.className = 'text-green';
      }
    } else {
      if (txtPill) txtPill.textContent = `LOCKED (${Math.round(psi)} PSI)`;
    }
  }

  function handleValveClick(valveId) {
    AudioEngine.playRatchetClick();
    GameState.valves[valveId] = !GameState.valves[valveId];
    GameState.totalInteractions++;

    const wheel = document.getElementById(`valve-btn-${valveId.toLowerCase()}`);
    const stateEl = document.getElementById(`valve-state-${valveId.toLowerCase()}`);

    if (GameState.valves[valveId]) {
      wheel?.classList.add('active');
      if (stateEl) stateEl.textContent = "PRIMED";
      GameState.valveHistory.push(valveId);
    } else {
      wheel?.classList.remove('active');
      if (stateEl) stateEl.textContent = "CLOSED";
    }

    // Evaluate Sequence: B -> A -> C
    // B primes to 25 PSI
    // A adds 14 PSI (39 PSI)
    // C adds 8 PSI (47 PSI exact!)
    if (GameState.valves.B && !GameState.valves.A && !GameState.valves.C) {
      GameState.pressurePSI = 25;
      AudioEngine.playPneumaticHiss(0.2);
    } else if (GameState.valves.B && GameState.valves.A && !GameState.valves.C) {
      GameState.pressurePSI = 39;
      AudioEngine.playPneumaticHiss(0.25);
    } else if (GameState.valves.B && GameState.valves.A && GameState.valves.C) {
      // Perfect sequence!
      GameState.pressurePSI = 47;
      AudioEngine.playPneumaticHiss(0.35);
      setHUDToast("PRESSURE STABILIZED AT 47 PSI // DEPRESS BLEED LEVER TO UNLOCK.");
    } else {
      // Out of order or overpressure -> blow off venting!
      GameState.pressurePSI = 62;
      AudioEngine.playPneumaticHiss(0.6);
      GameState.pressureBlowoffsCount++;

      setTimeout(() => {
        GameState.pressurePSI = 0;
        GameState.valves = { A: false, B: false, C: false };
        GameState.valveHistory = [];
        ['a', 'b', 'c'].forEach(v => {
          document.getElementById(`valve-btn-${v}`)?.classList.remove('active');
          const st = document.getElementById(`valve-state-${v}`);
          if (st) st.textContent = "CLOSED";
        });
        updatePressureGauge();
        setHUDToast("BLOW-OFF VENT TRIPPED: OVERPRESSURE VENTED. PRIMING SEQUENCE RESET.");
      }, 500);
    }

    updatePressureGauge();
  }

  function handleBleedLever() {
    if (GameState.pressurePSI === 47 && !GameState.lock1_hydraulic) {
      GameState.lock1_hydraulic = true;
      AudioEngine.playHeavyClunk();
      triggerScreenJolt();

      const btn = document.getElementById('btn-bleed-lever');
      if (btn) {
        btn.innerHTML = `<span class="lever-handle-bar"></span> <span class="text-green">✓ HYDRAULIC PINS RETRACTED (LOCK 01 DISENGAGED)</span>`;
        btn.style.borderColor = "var(--c-green-crt)";
      }

      setHUDToast("SUCCESS: HYDRAULIC PIN RETRACTED. LOCK 01 RELEASED.");
      checkAllLocksStatus();
      updatePressureGauge();
    } else if (GameState.lock1_hydraulic) {
      setHUDToast("HYDRAULIC PINS ARE ALREADY SAFELY DISENGAGED.");
    } else {
      AudioEngine.playPneumaticHiss(0.2);
      setHUDToast("COMMAND REJECTED: PRESSURE MUST EQUALIZE AT EXACTLY 47 PSI FIRST.");
    }
  }

  // ==========================================================================
  // 5. PUZZLE 2: ELECTRICAL BREAKER SUBSTATION
  // ==========================================================================
  function recalculateVoltage() {
    let sum = 0;
    if (GameState.breakers.b1_heater) sum += 50;
    if (GameState.breakers.b2_logic) sum += 120;
    if (GameState.breakers.b3_solenoid) sum += 100;
    if (GameState.breakers.b4_seal) sum += 80;

    GameState.voltageTotal = sum;

    const voltNum = document.getElementById('volt-readout-num');
    const needle = document.getElementById('volt-needle');

    if (voltNum) voltNum.textContent = `${GameState.voltageTotal} V`;

    // Map 0 - 350V to needle position percentage
    const pct = Math.min(100, (GameState.voltageTotal / 350) * 100);
    if (needle) needle.style.left = `${pct}%`;

    // Overload safety trip (> 240V)
    if (GameState.voltageTotal > 240 && GameState.knifeClosed) {
      GameState.knifeClosed = false;
      AudioEngine.playKnifeSwitch();
      setHUDToast("WARNING: ELECTRICAL OVERLOAD (>240V). ISOLATION BUS TRIPPED.");
      updateKnifeSwitchUI();
    }

    // Target check: 220V exact + knife closed!
    if (GameState.voltageTotal === 220 && GameState.knifeClosed && !GameState.lock2_solenoid) {
      GameState.lock2_solenoid = true;
      AudioEngine.playHeavyClunk();
      triggerScreenJolt();
      setHUDToast("SUCCESS: 220V SOLENOID POWERED. LOCK 02 COIL RELEASED.");
      checkAllLocksStatus();
    }

    // Telemetry update
    const txtPill = document.getElementById('txt-lock-2');
    const pill = document.getElementById('pill-lock-2');
    if (GameState.lock2_solenoid) {
      if (txtPill) {
        txtPill.textContent = "ENERGIZED (220V)";
        txtPill.className = "text-green";
      }
      if (pill) pill.querySelector('.pill-led').className = "pill-led led-green";
    } else {
      if (txtPill) txtPill.textContent = GameState.knifeClosed ? `${GameState.voltageTotal}V (UNREGULATED)` : "NO VOLTAGE";
    }
  }

  function updateKnifeSwitchUI() {
    const btn = document.getElementById('knife-switch-btn');
    const tag = document.getElementById('knife-status-tag');
    if (!btn || !tag) return;

    if (GameState.knifeClosed) {
      btn.classList.add('active');
      tag.textContent = "BUS CONNECTED (LIVE)";
      tag.style.color = "var(--c-amber)";
    } else {
      btn.classList.remove('active');
      tag.textContent = "BUS DISCONNECTED";
      tag.style.color = "var(--c-text-muted)";
    }
  }

  function toggleBreaker(key, btnId) {
    AudioEngine.playKnifeSwitch();
    GameState.breakers[key] = !GameState.breakers[key];
    const btn = document.getElementById(btnId);

    if (GameState.breakers[key]) {
      btn?.classList.add('active');
      if (btn) btn.textContent = "ON";
    } else {
      btn?.classList.remove('active');
      if (btn) btn.textContent = "OFF";
    }

    recalculateVoltage();
  }

  // ==========================================================================
  // 6. PUZZLE 3: CONCENTRIC TUMBLER COMBINATION
  // ==========================================================================
  function stepDial(dialNum, delta) {
    AudioEngine.playRatchetClick();
    GameState.totalInteractions++;

    if (dialNum === 1) {
      GameState.dial1_val = (GameState.dial1_val + delta + 60) % 60;
      const el = document.getElementById('tumbler-val-1');
      if (el) el.textContent = String(GameState.dial1_val).padStart(2, '0');
    } else {
      GameState.dial2_val = (GameState.dial2_val + delta + 60) % 60;
      const el = document.getElementById('tumbler-val-2');
      if (el) el.textContent = String(GameState.dial2_val).padStart(2, '0');
    }

    checkTumblerAlignment();
  }

  function checkTumblerAlignment() {
    const ind = document.getElementById('tumbler-pin-indicator');
    const isAligned = GameState.dial1_val === 31 && GameState.dial2_val === 7;

    if (ind) {
      if (isAligned) {
        ind.textContent = "● TUMBLERS ALIGNED (GATE CLEARED)";
        ind.className = "tumbler-pin-indicator text-green";
      } else {
        ind.textContent = "● TUMBLERS DISALIGNED";
        ind.className = "tumbler-pin-indicator text-critical";
      }
    }
  }

  function handleTumblerRelease() {
    const isAligned = GameState.dial1_val === 31 && GameState.dial2_val === 7;

    if (isAligned && !GameState.lock3_tumbler) {
      GameState.lock3_tumbler = true;
      AudioEngine.playTumblerSuccessSequence();
      triggerScreenJolt();

      const btnLabel = document.getElementById('tumbler-button-label');
      if (btnLabel) btnLabel.textContent = "✓ TUMBLER DETENT COLLAPSED (LOCK 03 UNSEALED)";

      const txtPill = document.getElementById('txt-lock-3');
      const pill = document.getElementById('pill-lock-3');
      if (txtPill) {
        txtPill.textContent = "DISENGAGED (31-07)";
        txtPill.className = "text-green";
      }
      if (pill) pill.querySelector('.pill-led').className = "pill-led led-green";

      setHUDToast("SUCCESS: MECHANICAL TUMBLERS DISENGAGED. LOCK 03 RELEASED.");
      checkAllLocksStatus();
    } else if (GameState.lock3_tumbler) {
      setHUDToast("TUMBLER MECHANISM IS ALREADY FULLY DISENGAGED.");
    } else {
      AudioEngine.playMechanicalTick(320);
      setHUDToast("RESISTANCE: TUMBLER SHEAR PINS REFUSE TO SEAT. VERIFY DIAL COORDINATES.");
    }
  }

  // ==========================================================================
  // 7. MAIN VAULT HANDWHEEL & FINAL RESOLUTION
  // ==========================================================================
  function checkAllLocksStatus() {
    const count = (GameState.lock1_hydraulic ? 1 : 0) + (GameState.lock2_solenoid ? 1 : 0) + (GameState.lock3_tumbler ? 1 : 0);
    const summary = document.getElementById('topbar-lock-summary');
    if (summary) summary.textContent = `LOCKS ENGAGED: ${3 - count} / 3`;

    // Station 06 checklist
    const c1 = document.getElementById('check-hyd');
    const c2 = document.getElementById('check-volt');
    const c3 = document.getElementById('check-tumb');

    if (c1 && GameState.lock1_hydraulic) c1.innerHTML = `<span class="text-green">[✓] Hydraulic Pins: Retracted</span>`;
    if (c2 && GameState.lock2_solenoid) c2.innerHTML = `<span class="text-green">[✓] Solenoid Circuit: 220V Energized</span>`;
    if (c3 && GameState.lock3_tumbler) c3.innerHTML = `<span class="text-green">[✓] Tumbler Gate: 31-07 Aligned</span>`;

    if (count === 3 && !GameState.mainSealUnlocked) {
      GameState.mainSealUnlocked = true;
      AudioEngine.playVaultUnsealGroan();
      triggerScreenJolt();

      const hubStatus = document.getElementById('wheel-hub-status');
      if (hubStatus) {
        hubStatus.textContent = "READY TO OPERATE";
        hubStatus.style.color = "var(--c-green-crt)";
      }

      const pillMain = document.getElementById('pill-lock-main');
      const txtMain = document.getElementById('txt-lock-main');
      if (pillMain) pillMain.querySelector('.pill-led').className = "pill-led led-green";
      if (txtMain) {
        txtMain.textContent = "UNCLOCKED";
        txtMain.className = "text-green";
      }

      // Populate Final Decisions in Station 06
      const decStrip = document.getElementById('final-decisions-strip');
      if (decStrip) {
        decStrip.innerHTML = `
          <div class="decision-actions-grid font-mono">
            <button class="btn-vault btn-vault-primary" id="btn-final-unseal">
              [ ROTATE WHEEL // UNSEAL VAULT 17 ]
            </button>
            <button class="btn-vault" id="btn-final-deadlock">
              [ PULL EMERGENCY DEADLOCK // PERMANENTLY ENTOMB ]
            </button>
          </div>
        `;

        document.getElementById('btn-final-unseal')?.addEventListener('click', triggerEnding01_Opened);
        document.getElementById('btn-final-deadlock')?.addEventListener('click', triggerEnding02_Sealed);
      }

      setHUDToast("CRITICAL ALERT: ALL THREE LOCKS DISENGAGED. CENTRAL WHEEL IS LIVE.");
    }
  }

  function handleMainWheelClick() {
    AudioEngine.playHeavyClunk();
    triggerScreenJolt();

    const wheel = document.getElementById('btn-massive-wheel');
    if (!GameState.mainSealUnlocked) {
      setHUDToast("COMMAND REJECTED: MASSIVE DOG CLAMPS ARE INTERLOCKED. DISENGAGE ALL 3 SUBSYSTEMS FIRST.");
    } else {
      wheel?.classList.add('wheel-rotating');
      setHUDToast("VAULT 17 SEAL IS DISENGAGED. CHOOSE OPERATIONAL DISPOSITION BELOW.");
    }
  }

  // ==========================================================================
  // 8. BRANCHING ENDINGS
  // ==========================================================================
  function triggerEnding01_Opened() {
    AudioEngine.playVaultUnsealGroan();
    triggerScreenJolt();
    closeAllModals();

    showEndingModal(
      "ENDING 01 // CONTAINMENT BREACHED",
      "THE UNSEALED",
      "The massive handwheel completed three heavy clockwise rotations. The twelve radial steel locking bolts withdrew into their housing with a resounding subterranean clank. The four-ton door crept outward, venting ice-cold preservation saline and ancient sulfur into the chamber. Whatever was quarantined on Level -03 in 1984 is now unsealed.",
      "BREACHED"
    );
    saveProgress("ENDING_01");
  }

  function triggerEnding02_Sealed() {
    AudioEngine.playHeavyClunk();
    triggerScreenJolt();
    closeAllModals();

    showEndingModal(
      "ENDING 02 // PERMANENT CONTAINMENT",
      "THE GUARDIAN",
      "Heeding the warnings left in the 03:17 incident log, you refused to pull back the final seal. You tripped the emergency deadlock lever, fracturing the hydraulic supply line and locking the dog clamps permanently in place. Vault 17 remains entombed in the deep silence of Level -03, protecting the world above from what lies dormant inside.",
      "PERMANENTLY SEALED"
    );
    saveProgress("ENDING_02");
  }

  function triggerEnding04_Archivist() {
    closeAllModals();
    showEndingModal(
      "ENDING 04 // DATA EXTRADITION",
      "THE ARCHIVIST",
      "Without disturbing the physical lock clamps, you connected your portable terminal to the Facility 17 mainframe and extracted the complete classified research dossier spanning 1978 to 1984. You retreat up the service hoistway into the night with the truth preserved, leaving the heavy steel threshold untouched.",
      "UNTOUCHED / ARCHIVED"
    );
    saveProgress("ENDING_04");
  }

  function showEndingModal(tag, title, body, outcome) {
    const modal = document.getElementById('ending-modal');
    const tagEl = document.getElementById('ending-tag');
    const titleEl = document.getElementById('ending-title');
    const bodyEl = document.getElementById('ending-body');
    const outEl = document.getElementById('end-outcome');

    if (tagEl) tagEl.textContent = tag;
    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.textContent = body;
    if (outEl) outEl.textContent = outcome;

    if (modal) modal.classList.add('active');
  }

  // ==========================================================================
  // 9. CRT TERMINAL OS
  // ==========================================================================
  function setupTerminalOS() {
    const links = document.querySelectorAll('.term-file-link');
    const title = document.getElementById('term-file-title');
    const body = document.getElementById('term-file-body');

    links.forEach(link => {
      link.addEventListener('click', () => {
        AudioEngine.playCRTKey();
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const fileId = link.dataset.file;
        const file = ARCHIVE_FILES[fileId];
        if (file) {
          if (title) title.textContent = file.title;
          if (body) body.textContent = file.body;
          GameState.logsViewedCount++;

          // Check if all 4 files viewed
          if (GameState.logsViewedCount >= 4) {
            setHUDToast("CLASSIFIED DOSSIER EXTRACTED // OPTIONAL ARCHIVIST EXTRACTION UNLOCKED.");
          }
        }
      });
    });

    // Default load log1
    if (title && body && ARCHIVE_FILES.log1) {
      title.textContent = ARCHIVE_FILES.log1.title;
      body.textContent = ARCHIVE_FILES.log1.body;
    }
  }

  // ==========================================================================
  // 10. INSPECTION MODAL SYSTEM & NAVIGATION
  // ==========================================================================
  function openStation(id) {
    AudioEngine.playKnifeSwitch();
    closeAllModals();
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  }

  function closeAllModals() {
    document.querySelectorAll('.inspection-overlay.active').forEach(m => m.classList.remove('active'));
  }

  function setHUDToast(msg) {
    const hud = document.getElementById('chamber-status-hud');
    const txt = document.getElementById('hud-status-text');
    if (hud && txt) {
      txt.textContent = msg;
    }
  }

  function triggerScreenJolt() {
    const body = document.body;
    body.classList.remove('screen-jolt');
    void body.offsetWidth;
    body.classList.add('screen-jolt');
    setTimeout(() => body.classList.remove('screen-jolt'), 400);
  }

  // ==========================================================================
  // 11. SAVE / LOAD / SETTINGS SYSTEM
  // ==========================================================================
  const SAVE_KEY = 'vault_17_incident_save_v1';

  function saveProgress(endingId) {
    try {
      const data = {
        ending: endingId,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      updateContinueBtn();
    } catch (e) {}
  }

  function updateContinueBtn() {
    const btn = document.getElementById('btn-title-continue');
    if (!btn) return;
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) btn.disabled = false;
    } catch (e) {}
  }

  function setupSettings() {
    const modal = document.getElementById('settings-modal');
    const openBtn = document.getElementById('btn-title-settings');
    const topbarBtn = document.getElementById('btn-topbar-settings');
    const closeBtn = document.getElementById('btn-close-settings');
    const saveBtn = document.getElementById('btn-save-cfg');
    const clearBtn = document.getElementById('btn-clear-save');

    function openCfg() {
      if (modal) modal.classList.add('active');
    }

    if (openBtn) openBtn.addEventListener('click', openCfg);
    if (topbarBtn) topbarBtn.addEventListener('click', openCfg);
    if (closeBtn) closeBtn.addEventListener('click', () => modal?.classList.remove('active'));

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const grainChk = document.getElementById('cfg-grain')?.checked;
        if (!grainChk) document.body.classList.add('no-grain');
        else document.body.classList.remove('no-grain');
        modal?.classList.remove('active');
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        localStorage.removeItem(SAVE_KEY);
        alert("Archive save records cleared.");
        updateContinueBtn();
        modal?.classList.remove('active');
      });
    }

    // Credits Modal
    const credModal = document.getElementById('credits-modal');
    document.getElementById('btn-title-credits')?.addEventListener('click', () => credModal?.classList.add('active'));
    document.getElementById('btn-close-credits')?.addEventListener('click', () => credModal?.classList.remove('active'));
    document.getElementById('btn-dismiss-credits')?.addEventListener('click', () => credModal?.classList.remove('active'));
  }

  // ==========================================================================
  // 12. CINEMATIC INTRO & LAUNCH
  // ==========================================================================
  function startCinematicIntro() {
    AudioEngine.init();
    AudioEngine.playKnifeSwitch();

    document.getElementById('title-screen')?.classList.remove('active-view');
    const overlay = document.getElementById('intro-overlay');
    if (!overlay) return;
    overlay.classList.add('active');

    const steps = ['intro-step-1', 'intro-step-2', 'intro-step-3', 'intro-step-4', 'intro-step-5'];
    steps.forEach((id, i) => {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.classList.add('show');
        if (i === 3) {
          AudioEngine.playHeavyClunk();
          triggerScreenJolt();
        } else {
          AudioEngine.playRatchetClick();
        }
      }, (i + 1) * 900);
    });

    setTimeout(() => {
      overlay.classList.remove('active');
      GameState.active = true;
      setHUDToast("VAULT 17 CHAMBER REACHED // EXAMINE SPECIFICATION PLACARD [05].");
    }, 5800);
  }

  // ==========================================================================
  // 13. EVENT LISTENERS SETUP
  // ==========================================================================
  function setupEventListeners() {
    // Title Buttons
    document.getElementById('btn-title-enter')?.addEventListener('click', startCinematicIntro);
    document.getElementById('btn-title-continue')?.addEventListener('click', startCinematicIntro);

    // Replay & Menu
    document.getElementById('btn-replay-game')?.addEventListener('click', () => location.reload());
    document.getElementById('btn-return-menu')?.addEventListener('click', () => location.reload());

    // Hotspot Triggers
    document.getElementById('hs-pressure')?.addEventListener('click', () => openStation('station-pressure'));
    document.getElementById('hs-breakers')?.addEventListener('click', () => openStation('station-breakers'));
    document.getElementById('hs-tumbler')?.addEventListener('click', () => openStation('station-tumbler'));
    document.getElementById('hs-terminal')?.addEventListener('click', () => openStation('station-terminal'));
    document.getElementById('hs-plate')?.addEventListener('click', () => openStation('station-plate'));
    document.getElementById('hs-wheel')?.addEventListener('click', () => {
      openStation('station-wheel');
      checkAllLocksStatus();
    });

    // Close Modals
    document.querySelectorAll('.btn-station-close').forEach(btn => {
      btn.addEventListener('click', () => closeAllModals());
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllModals();
    });

    // Station 01: Pressure System
    document.getElementById('valve-btn-a')?.addEventListener('click', () => handleValveClick('A'));
    document.getElementById('valve-btn-b')?.addEventListener('click', () => handleValveClick('B'));
    document.getElementById('valve-btn-c')?.addEventListener('click', () => handleValveClick('C'));
    document.getElementById('btn-bleed-lever')?.addEventListener('click', handleBleedLever);

    // Station 02: Breakers
    document.getElementById('knife-switch-btn')?.addEventListener('click', () => {
      AudioEngine.playKnifeSwitch();
      GameState.knifeClosed = !GameState.knifeClosed;
      updateKnifeSwitchUI();
      recalculateVoltage();
    });
    document.getElementById('brk-toggle-1')?.addEventListener('click', () => toggleBreaker('b1_heater', 'brk-toggle-1'));
    document.getElementById('brk-toggle-2')?.addEventListener('click', () => toggleBreaker('b2_logic', 'brk-toggle-2'));
    document.getElementById('brk-toggle-3')?.addEventListener('click', () => toggleBreaker('b3_solenoid', 'brk-toggle-3'));
    document.getElementById('brk-toggle-4')?.addEventListener('click', () => toggleBreaker('b4_seal', 'brk-toggle-4'));

    // Station 03: Tumbler
    document.getElementById('btn-dial1-dec')?.addEventListener('click', () => stepDial(1, -1));
    document.getElementById('btn-dial1-inc')?.addEventListener('click', () => stepDial(1, 1));
    document.getElementById('btn-dial2-dec')?.addEventListener('click', () => stepDial(2, -1));
    document.getElementById('btn-dial2-inc')?.addEventListener('click', () => stepDial(2, 1));
    document.getElementById('btn-tumbler-release')?.addEventListener('click', handleTumblerRelease);

    // Station 06: Main Wheel
    document.getElementById('btn-massive-wheel')?.addEventListener('click', handleMainWheelClick);

    setupTerminalOS();
    setupSettings();
    updateContinueBtn();
  }

  // ==========================================================================
  // 14. BOOTSTRAP
  // ==========================================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupEventListeners);
  } else {
    setupEventListeners();
  }

})();
