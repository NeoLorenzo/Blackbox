# Development Roadmap: Blackbox (Current Status)

This roadmap is aligned to the current implementation.

## Phase 1: Foundation and Local Persistence
- [x] React + Vite scaffold completed
- [x] Core dark visual tokens established
- [x] JetBrains Mono + Inter typography integrated
- [x] Vault persistence via `localStorage`

## Phase 2: Capture and Commit
- [x] Capture flow via `+ Task`
- [x] Title length cap and duplicate-risk warning
- [x] Optional description toggle
- [x] Required constraints at capture
- [x] Button-native air-lock with undo timer
- [x] Undo timer reduced to 3 seconds
- [x] `Create Task -> Undo? -> Complete` button state sequence
- [x] Complete glow + fade reset animation
- [x] User remains on capture screen after successful commit
- [x] Form remains editable while undo timer is running

## Phase 3: Calibration and Tie-Breaking
- [x] Calibration UI via `Draw Task`
- [x] Multi-select constraints in all categories
- [x] Local filtering (OR within category, AND across categories)
- [x] Zero-result fallback
- [x] Crucible split (`Fate` / `Fight`)
- [x] Fate weighted spin flow
- [x] Fight bracket with shatter feedback
- [x] Fight last-round helper (`final choice`)
- [x] Fight routes directly to Focus on final selection

## Phase 4: Focus and Resolution
- [x] Focus single-task view
- [x] `Complete` white flush + remove
- [x] `Defer` updates defer count and timestamp
- [x] Neglect warning for `deferCount >= 3`

## Deployment and Dev Utilities
- [x] GitHub repo connected (`NeoLorenzo/Blackbox`)
- [x] GitHub Pages deployment via Actions workflow
- [x] Dev controls moved to screen-level top-right (dashboard view)
- [x] `DEV: View Vault`
- [x] `DEV: Export CSV`
- [x] `DEV: Clear Vault`

## Phase 5: Cloud Integration (Deferred)
- [ ] Add auth and user-scoped data model
- [ ] Add sync-capable backend data layer
- [ ] Add migration path from local vault

## Phase 6: Polish and Hardening (Deferred)
- [ ] Accessibility audit and keyboard pass
- [ ] Mobile motion/performance tuning
- [ ] Automated tests for core state transitions
- [ ] Final content and encoding cleanup
