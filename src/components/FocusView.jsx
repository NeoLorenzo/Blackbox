export default function FocusView({ task, onExecute, onDefer }) {
  if (!task) {
    return (
      <section className="screen focus-screen">
        <h2>No task locked.</h2>
      </section>
    );
  }

  return (
    <section className="screen focus-screen singularity">
      <div className="peripheral">Phase 4 · Focus View</div>
      {task.deferCount >= 3 && (
        <div className="neglect-nudge">Operational neglect detected. Re-evaluate priority.</div>
      )}
      <article className="focus-card">
        <h2>{task.title}</h2>
        {task.description && <p>{task.description}</p>}
      </article>
      <div className="focus-actions">
        <button className="action action-primary" onClick={() => onExecute(task)}>
          Complete
        </button>
        <button className="action action-secondary" onClick={() => onDefer(task)}>
          Defer
        </button>
      </div>
    </section>
  );
}
