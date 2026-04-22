# Development Roadmap: Blackbox (Current Status)

This roadmap has been updated to match the current app state.

## Phase 1: Foundation and Local Persistence
- [x] React + Vite app scaffolded
- [x] Core dark visual system tokens defined in CSS
- [x] Typography integrated (JetBrains Mono + Inter)
- [x] Local vault persistence implemented via `localStorage`

## Phase 2: Capture and Commit
- [x] Task capture flow implemented (`+ Task`)
- [x] Title cap and duplicate-risk warning implemented
- [x] Optional description toggle implemented
- [x] Required constraint selection implemented for capture
- [x] Air-Lock buffer implemented (5s + Undo)
- [x] Commit animation simplified to fade-to-black card transition

## Phase 3: Calibration and Tie-Breaking
- [x] Calibration UI implemented (`Draw Task`)
- [x] Multi-select constraints enabled for all categories
- [x] Local filtering logic implemented (OR within category, AND across categories)
- [x] Zero-result fallback implemented
- [x] Crucible split implemented (`Fate` / `Fight`)
- [x] Fate spinner and weighted selection implemented
- [x] Fight tournament flow implemented with shatter feedback
- [x] Fight final round helper (`final choice`) implemented
- [x] Fight now routes directly to Focus on final selection

## Phase 4: Focus and Resolution
- [x] Focus view implemented with single-task presentation
- [x] `Complete` action implemented (white flush + removal)
- [x] `Defer` action implemented (defer count increment + timestamp refresh)
- [x] Neglect warning implemented for `deferCount >= 3`

## Development Utilities (Current)
- [x] Temporary vault visibility screen (`DEV: View Vault`)
- [x] Vault CSV export (`DEV: Export CSV`)
- [x] Full vault clear action with confirmation (`DEV: Clear Vault`)

## Phase 5: Cloud Integration (Deferred)
- [ ] Add authentication and user-scoped data model
- [ ] Replace local-only storage with sync-capable data layer
- [ ] Add migration path from existing local vault data

## Phase 6: Polish and Hardening (Deferred)
- [ ] Accessibility audit and keyboard interaction pass
- [ ] Motion quality and performance tuning on low-end mobile devices
- [ ] Automated test coverage for core flow state transitions
- [ ] Copy and encoding cleanup pass across all views
