import { useMemo, useState } from "react";
import { pickWeightedTask } from "../lib/tasks";

export default function FateWheel({ pool, onDone, onBack }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const segmentSize = 360 / Math.max(pool.length, 1);
  const wheelGradient = useMemo(() => {
    if (!pool.length) {
      return "conic-gradient(#2a2a30 0deg 360deg)";
    }
    const steps = pool.map((_, index) => {
      const start = index * segmentSize;
      const end = (index + 1) * segmentSize;
      const color = index % 2 === 0 ? "#18181b" : "#24242a";
      return `${color} ${start}deg ${end}deg`;
    });
    return `conic-gradient(${steps.join(",")})`;
  }, [pool, segmentSize]);

  function spinWheel() {
    if (spinning || pool.length === 0) {
      return;
    }
    const winner = pickWeightedTask(pool);
    const winnerIndex = pool.findIndex((task) => task.id === winner.id);
    const turns = 5 + Math.floor(Math.random() * 3);
    const centerOffset = winnerIndex * segmentSize + segmentSize / 2;
    const stopAt = turns * 360 + (360 - centerOffset);

    setSpinning(true);
    setSelectedTask(null);
    setRotation((prev) => prev + stopAt);

    window.setTimeout(() => {
      setSpinning(false);
      setSelectedTask(winner);
    }, 3800);
  }

  return (
    <section className="screen fate-screen">
      <header className="screen-header">
        <button className="text-button back-button" onClick={onBack}>&larr;</button>
      </header>

      <div className="wheel-shell">
        <div className="wheel-pointer" />
        <div
          className={`wheel ${spinning ? "wheel-spinning" : ""}`}
          style={{ transform: `rotate(${rotation}deg)`, backgroundImage: wheelGradient }}
        >
          {pool.map((task, index) => (
            <span
              key={task.id}
              className="wheel-label"
              style={{ transform: `rotate(${index * segmentSize}deg) translateY(-39%)` }}
            >
              {task.title.slice(0, 20)}
            </span>
          ))}
        </div>
      </div>

      <button className="action action-primary" disabled={spinning} onClick={spinWheel}>
        {spinning ? "Spinning..." : "Spin"}
      </button>

      {selectedTask && (
        <section className="result-card">
          <span className="ghost">Locked Task</span>
          <h3>{selectedTask.title}</h3>
          <button className="action action-secondary" onClick={() => onDone(selectedTask)}>
            Enter Focus View
          </button>
        </section>
      )}
    </section>
  );
}



