import { playUiLeftClickSound } from "../lib/uiSounds";

export default function CrucibleChoice({ poolSize, onFate, onFight, onBack }) {
  const taskLabel = poolSize === 1 ? "task" : "tasks";

  return (
    <section className="screen crucible-screen">
      <header className="screen-header">
        <button className="text-button back-button" onClick={onBack}>&larr;</button>
      </header>

      <h2>
        {poolSize} {taskLabel} identified
      </h2>
      <p className="copy">Choose a tie breaker.</p>

      <div className="crucible-actions">
        <button
          className="action action-primary"
          onClick={() => {
            playUiLeftClickSound();
            onFate();
          }}
        >
          Fate
        </button>
        <button
          className="action action-primary"
          onClick={() => {
            playUiLeftClickSound();
            onFight();
          }}
        >
          Fight
        </button>
      </div>
    </section>
  );
}
