# Technical Specifications: Blackbox

This document reflects current implementation.

## 1. Architecture

Blackbox is a local-first React single-page app.

### 1.1 Stack
- Frontend: React 18 + Vite 5
- Language: JavaScript (ES modules)
- Styling: CSS (`src/styles/app.css`)
- Persistence: browser `localStorage`

### 1.2 Deployment
- Repository: GitHub (`NeoLorenzo/Blackbox`)
- Hosting: GitHub Pages via GitHub Actions workflow (`.github/workflows/deploy-pages.yml`)
- Vite base path is set dynamically for Pages builds.

### 1.3 Runtime Model
- App state is managed in `src/App.jsx`.
- Vault is loaded at startup and saved on vault mutation.
- No cloud data layer is active in current scope.

## 2. Data Model

### 2.1 Task Entity

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Timestamp + random suffix. |
| `title` | `string` | Required, trimmed, max 100 chars. |
| `description` | `string` | Optional. |
| `timeEst` | `enum` | `5m`, `30m`, `60m+`, `Unkown`. |
| `energy` | `enum` | `Low`, `Medium`, `High`. |
| `contexts` | `string[]` | `Phone`, `PC`, `Physical`. |
| `deferCount` | `number` | Incremented on defer. |
| `createdAt` | `number` | Epoch ms timestamp. |

Persistence key:
- `blackbox.vault.v1`

## 3. View State Machine

`VIEW` constants:
- `dashboard`
- `vault`
- `dump`
- `calibration`
- `crucible`
- `fate`
- `fight`
- `focus`

## 4. Core Mechanics

### 4.1 Capture (`dump`)
- Requires title, time, energy, and at least one context.
- Description is optional via toggle.
- Similarity warnings:
  - `>= 0.95`: near-identical
  - `>= 0.65`: potential overlap

### 4.2 Button-Native Air-Lock
- Duration: `AIRLOCK_DURATION_MS = 3000`
- No modal/overlay in active flow.
- Primary button state machine:
  - `Create Task` (idle)
  - `Undo?` (pending timer + orange fill)
  - `Complete` (glow)
  - `fading` transition then back to idle
- While pending, users can continue editing form fields for the next task.
- Successful commit keeps user on the dump screen.

### 4.3 Calibration Filtering
Inputs:
- `timeLimits` (multi-select)
- `energies` (multi-select)
- `contexts` (multi-select)

Logic:
- OR within category
- AND across categories

Routing:
- 0 matches: fallback state (`Analysis Failed`)
- 1 match: direct to focus
- 2+ matches: route to crucible

### 4.4 Fate
- Weighted picker (`pickWeightedTask`)
- Weight per task:
  - `1 + deferCount * 0.75 + ageHours / 12`
- Spin animation resolves in ~3.8s.

### 4.5 Fight
- Shuffle pool, then resolve champion vs challenger rounds.
- User selects preferred task each round.
- Losing card shatter animation.
- Last round shows `final choice`.
- Final selection routes directly to focus (no champion interstitial).

### 4.6 Focus
- `Complete`:
  - white flush
  - remove task from vault
  - return to calibration
- `Defer`:
  - increment `deferCount`
  - refresh `createdAt`
  - return to calibration
- Warning banner when `deferCount >= 3`.

## 5. Dev Utilities

Available on dashboard view, fixed in top-right outside dashboard card:
- `DEV: View Vault`
- `DEV: Export CSV`
- `DEV: Clear Vault`

CSV columns:
- `id,title,description,timeEst,energy,contexts,deferCount,createdAt`

## 6. Visual System

Color tokens:
- Void: `#09090B`
- Elevated: `#18181B`
- Signal: `#FF4500`
- Text: `#FAFAFA`
- Ghost: `#71717A`
- Danger: `#F97316`

Typography:
- Display: JetBrains Mono
- Body/UI: Inter

## 7. Scope Boundary

Implemented scope is phases 1-4.
Phases 5-6 remain deferred.
