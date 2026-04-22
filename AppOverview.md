# App Overview

Blackbox is a local-first task selector designed to reduce backlog overwhelm. Tasks are captured quickly, hidden in a vault, filtered by current constraints, and surfaced as a single next action.

## Current Scope
- Implemented: phases 1 to 4 (capture through focus)
- Not implemented: phases 5 and 6 (cloud sync and polish backlog)

## Main Screen
The dashboard heading is `BLACKBOX`.

Primary actions:
- `+ Task` opens task capture.
- `Draw Task` opens constraint calibration.

Dev controls in the top-right corner:
- `DEV: View Vault`
- `DEV: Export CSV`
- `DEV: Clear Vault`

## Phase 1: Task Capture (`+ Task`)
The capture screen is intentionally compact and fast:
- Title field placeholder: `Task title`
- Optional details toggle: `+ Description` / `- Description`
- Description placeholder: `Task description`
- Constraint fields:
  - `Time`: `5m`, `30m`, `60m+`, `Unkown`
  - `REQUIRED ENERGY`: `Low`, `Medium`, `High`
  - `Context`: `Phone`, `PC`, `Physical`
- Submit button: `Create Task`

Behavior:
- Title is capped at 100 characters.
- Character count appears when the title hits the limit.
- Duplicate-title risk warnings appear when similarity is high.
- Title input auto-resizes and does not scroll.

## Air-Lock Commit
After `Create Task`, an air-lock overlay appears for 5 seconds:
- Header: `Vault Commit Pending`
- Progress bar with countdown and `Undo`
- Card transition: fades to black before commit

If not undone, the task is committed to the vault and the app returns to the dashboard.

## Phase 2: Calibration (`Draw Task`)
Calibration asks users to define current constraints before drawing a task.

Labels:
- `Time`
- `CURRENT ENERGY`
- `Context(s)`

Behavior:
- All three groups are multi-select.
- Matching logic is OR within each group and AND across groups.
- `Next` is disabled when any group has no selection or the vault is empty.
- Zero-match state shows:
  - `Analysis Failed`
  - `0 tasks matched. Adjust constraints and try again.`

## Phase 3: Crucible (Tie Break)
When multiple tasks match calibration:
- Heading format: `<n> task(s) identified`
- Subtext: `Choose a tie breaker.`
- Options: `Fate` and `Fight`

### Fate
- Spinner UI with `Spin` button
- Weighted selection based on defer count and task age
- Result card shows `Locked Task` and `Enter Focus View`

### Fight
- One-on-one card comparison with heading `Choose`
- User picks preferred task each round
- Losing card uses a shatter animation
- On the last round, the UI shows `final choice`
- Final selection routes directly to Focus (no champion interstitial screen)

## Phase 4: Focus
Focus view shows one task and two actions:
- `Complete`
- `Defer`

Behavior:
- `Complete` triggers white-flush feedback and removes the task from the vault.
- `Defer` increments `deferCount`, refreshes `createdAt`, and returns to calibration.
- If `deferCount >= 3`, a neglect warning banner appears.

## Temporary Dev Vault View
`DEV: View Vault` opens a temporary validation screen:
- Heading: `The Vault`
- Tasks sorted by newest first
- Shows title, constraints, description (if present), defer count, and capture timestamp

The vault screen is for development visibility, not the intended end-user hidden-vault behavior.
