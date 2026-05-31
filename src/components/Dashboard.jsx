import { playUiLeftClickSound } from "../lib/uiSounds";

export default function Dashboard({ onDump, onCalibrate }) {
  return (
    <section className="screen">
      <h1>BLACKBOX</h1>

      <div className="dashboard-actions">
        <button
          className="action action-secondary"
          onClick={() => {
            playUiLeftClickSound();
            onDump();
          }}
        >
          + Task
        </button>
        <button
          className="action action-primary"
          onClick={() => {
            playUiLeftClickSound();
            onCalibrate();
          }}
        >
          Draw Task
        </button>
      </div>
    </section>
  );
}
