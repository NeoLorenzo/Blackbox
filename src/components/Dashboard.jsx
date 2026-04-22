export default function Dashboard({ onDump, onCalibrate }) {
  return (
    <section className="screen">
      <h1>BLACKBOX</h1>

      <div className="dashboard-actions">
        <button className="action action-secondary" onClick={onDump}>
          + Task
        </button>
        <button className="action action-primary" onClick={onCalibrate}>
          Draw Task
        </button>
      </div>
    </section>
  );
}
