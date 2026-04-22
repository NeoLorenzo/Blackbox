import { CONTEXT_OPTIONS, ENERGY_OPTIONS, TIME_OPTIONS } from "../lib/constants";

function SegmentButton({ selected, label, onClick }) {
  return (
    <button className={`segment ${selected ? "segment-active" : ""}`} onClick={onClick}>
      {label}
    </button>
  );
}

export default function CalibrationView({
  constraints,
  onUpdateConstraints,
  onRun,
  onBack,
  fallbackState,
  vaultSize
}) {
  return (
    <section className="screen calibration-screen">
      <header className="screen-header">
        <button className="text-button back-button" onClick={onBack}>&larr;</button>
      </header>

      <h2>Define Your Constraints</h2>

      <div className="constraint-group">
        <label>Time</label>
        <div className="segments">
          {TIME_OPTIONS.map((option) => (
            <SegmentButton
              key={option}
              label={option}
              selected={constraints.timeLimits.includes(option)}
              onClick={() => {
                const exists = constraints.timeLimits.includes(option);
                const next = exists
                  ? constraints.timeLimits.filter((item) => item !== option)
                  : [...constraints.timeLimits, option];
                onUpdateConstraints({ timeLimits: next });
              }}
            />
          ))}
        </div>
      </div>

      <div className="constraint-group">
        <label>CURRENT ENERGY</label>
        <div className="segments">
          {ENERGY_OPTIONS.map((option) => (
            <SegmentButton
              key={option}
              label={option}
              selected={constraints.energies.includes(option)}
              onClick={() => {
                const exists = constraints.energies.includes(option);
                const next = exists
                  ? constraints.energies.filter((item) => item !== option)
                  : [...constraints.energies, option];
                onUpdateConstraints({ energies: next });
              }}
            />
          ))}
        </div>
      </div>

      <div className="constraint-group">
        <label>Context(s)</label>
        <div className="segments">
          {CONTEXT_OPTIONS.map((option) => (
            <SegmentButton
              key={option}
              label={option}
              selected={constraints.contexts.includes(option)}
              onClick={() => {
                const exists = constraints.contexts.includes(option);
                const nextContexts = exists
                  ? constraints.contexts.filter((item) => item !== option)
                  : [...constraints.contexts, option];
                onUpdateConstraints({ contexts: nextContexts });
              }}
            />
          ))}
        </div>
      </div>

      {fallbackState && (
        <section className="fallback">
          <strong>Analysis Failed</strong>
          <p>0 tasks matched. Adjust constraints and try again.</p>
        </section>
      )}

      <button
        className="action action-primary"
        disabled={
          !constraints.timeLimits.length ||
          !constraints.energies.length ||
          !constraints.contexts.length ||
          vaultSize === 0
        }
        onClick={onRun}
      >
        Next
      </button>
    </section>
  );
}

