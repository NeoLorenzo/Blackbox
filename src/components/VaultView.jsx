function formatTimestamp(timestamp) {
  if (!timestamp) {
    return "Unknown";
  }
  return new Date(timestamp).toLocaleString();
}

export default function VaultView({ tasks, onBack }) {
  const orderedTasks = [...tasks].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <section className="screen vault-screen">
      <header className="screen-header">
        <button className="text-button back-button" onClick={onBack}>&larr;</button>
        <span className="ghost">Vault View (Temporary)</span>
      </header>

      <h2>The Vault</h2>
      <p className="copy">Temporary visibility mode for testing and validation.</p>

      {orderedTasks.length === 0 ? (
        <section className="result-card">
          <strong>The Vault is empty.</strong>
        </section>
      ) : (
        <div className="vault-list">
          {orderedTasks.map((task) => (
            <article key={task.id} className="vault-item">
              <div className="status-row">
                <strong>{task.title}</strong>
                <span className="ghost">Defers: {task.deferCount || 0}</span>
              </div>
              <p className="copy">
                {task.timeEst} · {task.energy} · {task.contexts.join(", ")}
              </p>
              {task.description ? <p>{task.description}</p> : null}
              <span className="ghost">Captured: {formatTimestamp(task.createdAt)}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}


