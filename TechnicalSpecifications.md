# Technical Specifications: Blackbox

This document reflects the current implementation state of the app.

## 1. Architecture

Blackbox is currently a local-first single-page React app.

### 1.1 Tech Stack
- Frontend: React 18 + Vite 5
- Language: JavaScript (ES modules)
- Styling: plain CSS (`src/styles/app.css`)
- Persistence: browser `localStorage`

### 1.2 Runtime Model
- App state is held in React component state in `src/App.jsx`.
- Vault data is loaded on startup and persisted on every vault change.
- No backend/cloud sync is active in the current build.

## 2. Data Model

### 2.1 Task Entity

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique ID generated from timestamp + random suffix. |
| `title` | `string` | Required; trimmed; capped at 100 chars. |
| `description` | `string` | Optional details text. |
| `timeEst` | `enum` | `5m`, `30m`, `60m+`, `Unkown` (spelling matches UI). |
| `energy` | `enum` | `Low`, `Medium`, `High`. |
| `contexts` | `string[]` | Any of `Phone`, `PC`, `Physical`. |
| `deferCount` | `number` | Increments on defer. |
| `createdAt` | `number` | Epoch ms timestamp. |

### 2.2 Persistence Key
- `blackbox.vault.v1`

## 3. View State Machine

Declared in `VIEW` constants:
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
- Form requires non-empty title, one time selection, one energy selection, and at least one context.
- Description is optional and hidden behind `+ Description` toggle.
- Title duplicate warnings use similarity checks:
  - `>= 0.95`: near-identical warning
  - `>= 0.65`: overlap warning

### 4.2 Air-Lock Buffer
- `AIRLOCK_DURATION_MS = 5000`
- During air-lock:
  - Progress updates on interval.
  - `Undo` cancels commit.
- On commit:
  - Task appended to vault.
  - Status banner updates.
  - App returns to dashboard.

### 4.3 Calibration Filtering
Inputs:
- `timeLimits` (multi-select)
- `energies` (multi-select)
- `contexts` (multi-select)

Matching rules:
- OR within each category (`includes` / `some`)
- AND across categories

Routing:
- 0 matches: fallback state (`Analysis Failed`)
- 1 match: direct to focus
- 2+ matches: route to crucible

### 4.4 Fate Selection
- Uses weighted picking (`pickWeightedTask`)
- Weight formula per task:
  - `1 + deferCount * 0.75 + ageHours / 12`
- Spin animation duration is 3.8s before lock-in.

### 4.5 Fight Selection
- Pool is shuffled, then resolved as champion vs queue[0].
- User picks preferred card each round.
- Losing card gets shatter animation.
- Last round displays `final choice` helper text.
- After the final tap, routing goes directly to focus (no champion confirmation screen).

### 4.6 Focus Actions
- `Complete`:
  - White-flush effect
  - Removes task from vault
  - Returns to calibration
- `Defer`:
  - Increments `deferCount`
  - Resets `createdAt` to now
  - Returns to calibration
- Warning banner appears when `deferCount >= 3`.

## 5. Dev Utilities (Dashboard Corner)

Available controls:
- `DEV: View Vault`: opens temporary vault inspection screen.
- `DEV: Export CSV`: downloads all vault tasks as CSV.
- `DEV: Clear Vault`: confirmation prompt, then clears entire vault.

CSV columns:
- `id,title,description,timeEst,energy,contexts,deferCount,createdAt`

## 6. Visual System (Implemented)

Core tokens in CSS:
- Void: `#09090B`
- Elevated: `#18181B`
- Signal: `#FF4500`
- Text: `#FAFAFA`
- Ghost: `#71717A`
- Danger: `#F97316`

Typography:
- Display: JetBrains Mono
- UI/body: Inter

## 7. Current Scope Boundary

Implemented product scope is phases 1 through 4 only.
Phases 5 and 6 (cloud sync and deeper polish backlog) are intentionally out of scope in the current app state.
