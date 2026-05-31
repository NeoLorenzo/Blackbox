# Project Blackbox: Brand and Design Guidelines

This guide reflects the current live app.

## 1. Product Tone
Blackbox should feel minimal, direct, and operational.
- Keep language short and action-first.
- Avoid motivational copy.
- Keep focus on one next action at a time.

## 2. Visual Direction

### 2.1 Tokens
- Void: `#09090B`
- Elevated: `#18181B`
- Signal: `#FF4500`
- Main text: `#FAFAFA`
- Secondary text: `#71717A`
- Danger: `#F97316`

### 2.2 Typography
- Display/task emphasis: JetBrains Mono
- UI/body: Inter

### 2.3 Motion Principles (Current)
- Motion should communicate state transitions, not decoration.
- Capture commit uses button-native progression:
  - `Undo?` fill over 3 seconds
  - `Complete` glow pulse
  - quick fade back to idle
- Completion in focus uses white-flush reset feedback.

## 3. Current Label Set

### 3.1 Dashboard
- Heading: `BLACKBOX`
- Main actions: `+ Task`, `Draw Task`
- Dev controls (screen-level, top-right, subtle):
  - `DEV: View Vault`
  - `DEV: Export CSV`
  - `DEV: Clear Vault`

### 3.2 Capture
- Title placeholder: `Task title`
- Description toggle: `+ Description` / `- Description`
- Description placeholder: `Task description`
- Constraint labels: `Time`, `REQUIRED ENERGY`, `Context`
- Primary button states: `Create Task` -> `Undo?` -> `Complete`

### 3.3 Calibration
- Heading: `Define Your Constraints`
- Labels: `Time`, `CURRENT ENERGY`, `Context(s)`
- Primary action: `Next`
- Fallback:
  - `Analysis Failed`
  - `0 tasks matched. Adjust constraints and try again.`

### 3.4 Crucible/Fate/Fight
- Crucible heading pattern: `<n> task(s) identified`
- Crucible subtext: `Choose a tie breaker.`
- Options: `Fate`, `Fight`
- Fate action: `Spin`
- Fate result: `Locked Task` + `Enter Focus View`
- Fight helper in last round: `final choice`

### 3.5 Focus
- Actions: `Complete`, `Defer`
- Warning copy for high defer count:
  - `Operational neglect detected. Re-evaluate priority.`

## 4. Interaction Rules
- Back navigation uses arrow icon buttons.
- Full task lists remain hidden in normal decision flow.
- Fight only exposes pairwise choices.
- After capture commit, user stays on capture to continue adding tasks.
- During undo timer, capture form remains editable.

## 5. Copy Style
Use system-like feedback:
- `Task dissolved into The Vault.`
- `Task Cleared. Awaiting Calibration.`
- `Task Deferred. Entropy incremented.`

Avoid celebratory tone and streak language.
