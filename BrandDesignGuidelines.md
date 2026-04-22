# Project Blackbox: Brand and Design Guidelines

This guideline reflects the current shipped UI language and visual behavior.

## 1. Product Tone
Blackbox should feel direct, minimal, and operational.
- Avoid motivational productivity language.
- Prefer short, action-first labels.
- Keep interfaces sparse: one main action per screen when possible.

## 2. Visual Direction

### 2.1 Color Tokens
- Void background: `#09090B`
- Elevated panels: `#18181B`
- Primary action signal: `#FF4500`
- Main text: `#FAFAFA`
- Secondary text: `#71717A`
- Warning/danger accent: `#F97316`

### 2.2 Typography
- Display/task emphasis: JetBrains Mono
- Body/UI labels: Inter

### 2.3 Shape and Motion
- Rounded cards/buttons with subtle borders.
- Functional motion over decorative motion.
- Capture commit animation is currently simplified to card fade-to-black in Air-Lock.
- Completion feedback is a white flush, then reset to calibration.

## 3. Current Label Set (Source of Truth)

### 3.1 Dashboard
- Heading: `BLACKBOX`
- Primary buttons: `+ Task`, `Draw Task`
- Dev corner controls:
  - `DEV: View Vault`
  - `DEV: Export CSV`
  - `DEV: Clear Vault`

### 3.2 Capture (`+ Task`)
- Title placeholder: `Task title`
- Description toggle: `+ Description` / `- Description`
- Description placeholder: `Task description`
- Constraint labels: `Time`, `REQUIRED ENERGY`, `Context`
- Submit button: `Create Task`

### 3.3 Air-Lock
- Heading: `Vault Commit Pending`
- Action: `Undo`

### 3.4 Calibration
- Heading: `Define Your Constraints`
- Constraint labels: `Time`, `CURRENT ENERGY`, `Context(s)`
- Primary action: `Next`
- Fallback copy:
  - `Analysis Failed`
  - `0 tasks matched. Adjust constraints and try again.`

### 3.5 Crucible
- Heading pattern: `<n> task(s) identified`
- Subtext: `Choose a tie breaker.`
- Options: `Fate`, `Fight`

### 3.6 Fate
- Main action: `Spin`
- Result label: `Locked Task`
- Continue action: `Enter Focus View`

### 3.7 Fight
- Heading: `Choose`
- Last round helper: `final choice`
- Behavior: user selects preferred task; loser shatters.

### 3.8 Focus
- Main actions: `Complete`, `Defer`
- Warning copy at high deferral:
  - `Operational neglect detected. Re-evaluate priority.`

## 4. Interaction Principles
- Back navigation should use arrow icon buttons, not text links.
- Task lists should stay hidden in normal flow; users receive one selected task at a time.
- Crucible should never reveal full candidate lists.
- Dev-only visibility tools remain visually secondary and corner-positioned.

## 5. Copy Style Rules
- Use concise sentence case.
- Prefer system-like feedback:
  - `Task dissolved into The Vault.`
  - `Task Cleared. Awaiting Calibration.`
  - `Task Deferred. Entropy incremented.`
- Avoid celebratory language and streak/gamification tone.
