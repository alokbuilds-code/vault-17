# VAULT 17

> An atmospheric mechanical puzzle and psychological mystery game built entirely in Vanilla Web technologies.

https://vault-17.vercel.app/


[![Status](https://img.shields.io/badge/status-complete-22c55e?style=flat-square)](https://github.com/)
[![Tech](https://img.shields.io/badge/stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-F59E0B?style=flat-square)](https://github.com/)
[![Dependencies](https://img.shields.io/badge/dependencies-zero-blue?style=flat-square)](https://github.com/)
[![Audio](https://img.shields.io/badge/audio-Web%20Audio%20API-7C3AED?style=flat-square)](https://github.com/)
[![License](https://img.shields.io/badge/license-MIT-64748B?style=flat-square)](LICENSE)

---

## 📌 Overview

**VAULT 17** is an underground industrial puzzle experience set at Level -03 of an abandoned research facility. There are no quest markers, no inventory slots, and no tutorials. Progression relies entirely on observation, mechanical deduction, and environmental storytelling.

The player operates authentic industrial equipment—calibrating pneumatic pressure lines, routing high-voltage bus circuits, and aligning concentric tumbler gates—to reach the central handwheel and decide the fate of what lies sealed within.

---

## ⚙️ Core Mechanics

* **Physical Machine Interactions**:
  * **Pneumatic Manifold**: Rotary brass handwheels that alter line pressure toward a precise 47 PSI equilibrium.
  * **Electrical Breakers**: A master knife switch and four subsystem breakers that must be balanced to supply exactly 220V without tripping the isolation bus.
  * **Concentric Brass Tumblers**: Multi-ring mechanical combination lock solvable through timestamp and facility level clues (`31 - 07`).
  * **Central Handwheel**: 4-ton radial bolt locking mechanism that unlocks only when all three subsystems are cleared.
* **Authentic CRT Archive Terminal**: Interactive monochrome green-phosphor terminal with readable maintenance logs, incident reports, and containment orders.
* **Synthesized Audio Engine (Web Audio API)**: Zero-latency physical sound synthesis producing gear ratchets, pneumatic pressure hisses, relay snaps, mechanical tumbler clicks (`CLICK → CLICK → CLUNK`), heavy door groans, and subterranean ambient drones without external audio files.
* **Branching Endings**:
  * `ENDING 01 — THE UNSEALED`: Unseal the 4-ton radial door and peer into the containment void.
  * `ENDING 02 — THE GUARDIAN`: Trip the emergency deadlock handle to permanently entomb the vault.
  * `ENDING 03 — INTERLOCK FAILURE`: Overpressurize or short-circuit subsystems into emergency lockup.
  * `ENDING 04 — THE ARCHIVIST`: Extract the facility dossier without disturbing the seal.
* **Zero Dependencies**: Pure HTML5, CSS3, and Vanilla JavaScript. Runs offline and out-of-the-box by opening `index.html`.

---

## 📂 File Structure

```text
vault-17/
├── index.html        # Semantic HTML5 layout, title screen, inspection stations, CRT terminal
├── style.css         # Industrial realism design system, mechanical animations, CRT shaders
├── script.js         # Physical audio engine, puzzle validation, state machine, save system
├── walkthrough.md    # Comprehensive puzzle solution and lore guide
└── README.md         # Project documentation
```

---


## 🎛️ Keyboard & Interaction Shortcuts

| Key / Action | Function |
| :--- | :--- |
| **Mouse Click / Drag** | Inspect stations, turn handwheels, toggle switches |
| **`Esc`** | Exit inspection station and return to chamber view |
| **`Config` (Topbar)** | Access audio sliders, CRT scanline toggles, and save management |

---

## 🎨 Visual Identity & Aesthetic

* **Aesthetic**: Industrial documentary realism, oxidized steel, heavy vault bolts, analog needle gauges, and vintage phosphor CRTs.
* **Palette**: Bunker void (`#040608`), Gunmetal (`#1C2430`), Industrial Amber (`#F59E0B`), CRT Phosphor Green (`#22C55E`).
* **Design Rule**: Zero generic SaaS cards, zero purple neon, zero decorative AI fluff. Every element corresponds to physical industrial machinery.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
