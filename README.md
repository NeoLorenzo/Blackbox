# Blackbox

Blackbox is a local-first task selector built to reduce backlog paralysis.

Instead of managing a visible list, you:
- capture tasks quickly,
- filter by current constraints,
- and surface one task to act on.

## Project Status
This app is currently no longer in development, probably for the foreseeable future. I just wanted to test some principles out for my private productivity dashboard. I could work on this further and try to ship it as a product, but recently I have recognized that as the barrier to entry to coding an app like this gets lower and lower, I don't see a point in creating software products that anyone could vibe code in a weekend. I believe we're entering a new phase of personalized software, and therefore I've decided to no longer work on this project, as I don't believe I have something to offer that nobody could do themselves regarding to-do list apps. Blackbox was fun, and what inspired it was the abandoned stasis project. I recognized that the over-complexity and over-engineering of that project was part of the reason that it fell through, so I decided i was going to make a radically simple app, swinging the pendulum the other way. This was an important lesson in design, and I picked up some things that I use in all of the software that I've created since then. This app has been publicly archived, and it will not be further developed. It is still fully usable, and people are welcome to use it and fork it and change it to their heart's desire.

## Current Scope
Implemented: phases 1-4
- Capture (`+ Task`)
- Calibration (`Draw Task`)
- Crucible tie-break (`Fate` / `Fight`)
- Focus (`Complete` / `Defer`)

Deferred: phases 5-6 (cloud sync and polish backlog)

## Tech Stack
- React 18
- Vite 5
- Plain CSS
- Local persistence via `localStorage`

## Local Development
Requirements:
- Node.js 18+ (Node 20 recommended)

Install:
```bash
npm install
```

Run dev server:
```bash
npm run dev
```

Production build:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## App Flow
1. Dashboard (`BLACKBOX`)
- `+ Task`
- `Draw Task`

2. Capture (`+ Task`)
- Title, optional description, and constraints
- `Create Task` button transitions into in-button air-lock:
  - `Undo?` with progress fill (3s)
  - then `Complete` glow/fade
- User stays on capture screen after successful add

3. Calibration (`Draw Task`)
- Multi-select constraints: time, energy, context
- Routes to Focus directly on 1 match
- Routes to Crucible on multiple matches

4. Crucible
- `Fate`: weighted spinner selection
- `Fight`: pairwise elimination with final-choice prompt

5. Focus
- `Complete` removes task
- `Defer` increments defer count and recycles task

## Data Model (Vault Task)
Each task includes:
- `id`
- `title`
- `description`
- `timeEst` (`5m`, `30m`, `60m+`, `Unkown`)
- `energy` (`Low`, `Medium`, `High`)
- `contexts` (`Phone`, `PC`, `Physical`)
- `deferCount`
- `createdAt`

Storage key:
- `blackbox.vault.v1`

## Audio
SFX are handled through Web Audio for low-latency playback (`src/lib/uiSounds.js`), with fallback to `HTMLAudio`.

Current assets:
- `back_arrow_click.wav`
- `task_addition_complete.wav`
- `undo_riser.wav`
- `UI_left_click.wav`

Current mappings:
- Back arrow navigation clicks
- Task-add complete glow
- Undo timer riser (starts on `Undo?`, hard-cuts at timer end or undo)
- UI left click on:
  - `+ Task`
  - `Draw Task`
  - `Next`
  - `Fate`
  - `Fight`

## Custom Cursor (Desktop)
Desktop pointer devices use a custom Blackbox cursor with:
- directional tail
- click pulse
- dark variant when hovering orange/signal elements

## Dev Utilities
Dashboard-only controls (top-right):
- `DEV: View Vault`
- `DEV: Export CSV`
- `DEV: Clear Vault`

## Deployment
Configured for GitHub Pages via GitHub Actions:
- Workflow: `.github/workflows/deploy-pages.yml`
- Vite base path adapts automatically in Actions builds
