# App Overview

Blackbox is a local-first task selector designed to reduce backlog overwhelm. Tasks are captured quickly, filtered by current constraints, and surfaced as a single next action.

## Current Scope
- Implemented: phases 1 to 4 (capture through focus)
- Deferred: phases 5 and 6 (cloud sync and long-tail polish)

## Main Screen
Dashboard heading: `BLACKBOX`

Primary actions:
- `+ Task` opens capture.
- `Draw Task` opens calibration.

Dev controls are intentionally discreet and screen-level (outside the dashboard card), fixed in the top-right while on the dashboard:
- `DEV: View Vault`
- `DEV: Export CSV`
- `DEV: Clear Vault`

## Phase 1: Task Capture (`+ Task`)
Capture is designed for speed and low friction:
- Title placeholder: `Task title`
- Optional details toggle: `+ Description` / `- Description`
- Description placeholder: `Task description`
- Constraints:
  - `Time`: `5m`, `30m`, `60m+`, `Unkown`
  - `REQUIRED ENERGY`: `Low`, `Medium`, `High`
  - `Context`: `Phone`, `PC`, `Physical`
- Primary button (idle): `Create Task`

Behavior:
- Title max length: 100
- Character count appears only when at limit
- Similar-title warning appears for high overlap
- Title input auto-resizes (non-scrollable)

## Air-Lock (Button-Native)
Air-lock no longer uses a modal/overlay.

Instead, the capture button itself becomes the undo mechanism:
- On submit, button changes to `Undo?`
- Button fill animates orange over a 3-second timer
- On successful commit, button changes to `Complete` with glow
- `Complete` fades out and resets back to `Create Task`

Important UX detail:
- During the undo timer, users can already type/configure the next task in the form.
- After success, users remain on the capture screen (no automatic return to dashboard).

## Phase 2: Calibration (`Draw Task`)
Calibration defines current constraints before drawing.

Labels:
- `Time`
- `CURRENT ENERGY`
- `Context(s)`

Behavior:
- Multi-select in all three groups
- Matching logic: OR within each group, AND across groups
- `Next` disabled if any group is empty or vault is empty
- Zero-match fallback:
  - `Analysis Failed`
  - `0 tasks matched. Adjust constraints and try again.`

## Phase 3: Crucible (Tie Break)
When multiple tasks match:
- Heading: `<n> task(s) identified`
- Subtext: `Choose a tie breaker.`
- Options: `Fate`, `Fight`

### Fate
- Spinner button: `Spin`
- Weighted selection (age + defer count)
- Result card: `Locked Task` + `Enter Focus View`

### Fight
- Head-to-head chooser with heading `Choose`
- User picks preferred task each round
- Losing card shatters
- Final round helper text: `final choice`
- Final selection routes directly to Focus (no champion interstitial)

## Phase 4: Focus
Focus shows one task with two actions:
- `Complete`
- `Defer`

Behavior:
- `Complete`: white flush + remove task + return to calibration
- `Defer`: increment `deferCount`, refresh `createdAt`, return to calibration
- Neglect warning appears when `deferCount >= 3`

## Temporary Dev Vault View
`DEV: View Vault` opens a temporary visibility screen for validation:
- Shows task metadata, defer count, and capture time
- Sorted newest-first
- Intended for development/testing, not final hidden-vault UX
