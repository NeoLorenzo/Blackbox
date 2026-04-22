export default function AirlockOverlay({ task, progress, onUndo }) {
  const bounded = Math.min(100, Math.max(0, progress));
  const inserting = bounded >= 80;

  return (
    <div className="airlock-overlay" role="dialog" aria-live="polite">
      <div className="airlock-card">
        <span className="ghost">Phase 2 · Air-Lock</span>
        <h3>Vault Commit Pending</h3>

        <div className="deposit-scene">
          <div className={`deposit-task-card ${inserting ? "deposit-task-card-animate" : ""}`}>
            <span>{task.title}</span>
          </div>
        </div>

        <div className="airlock-meter">
          <div className="airlock-meter-fill dissolve" style={{ width: `${bounded}%` }} />
        </div>
        <div className="status-row">
          <span className="ghost">{Math.ceil((100 - bounded) / 20)}s</span>
          <button className="text-button" onClick={onUndo}>
            Undo
          </button>
        </div>
      </div>
    </div>
  );
}
