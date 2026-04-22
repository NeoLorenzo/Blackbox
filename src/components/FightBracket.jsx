import { useEffect, useMemo, useState } from "react";
import { shuffle } from "../lib/tasks";

function TaskCard({ task, side, onSelect, disabled, losing }) {
  return (
    <article className={`fight-card-shell fight-${side}`}>
      <button
        type="button"
        className={`fight-card fight-${side} ${losing ? "fight-losing" : ""}`}
        onClick={onSelect}
        disabled={disabled}
      >
        <strong>{task.title}</strong>
        {task.description && <p>{task.description.slice(0, 80)}</p>}
      </button>
    </article>
  );
}

export default function FightBracket({ pool, onDone, onBack }) {
  const initialOrder = useMemo(() => shuffle(pool), [pool]);
  const [champion, setChampion] = useState(initialOrder[0] || null);
  const [queue, setQueue] = useState(initialOrder.slice(1));
  const [losingSide, setLosingSide] = useState(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const order = shuffle(pool);
    setChampion(order[0] || null);
    setQueue(order.slice(1));
    setLosingSide(null);
    setAnimating(false);
  }, [pool]);

  const challenger = queue[0] || null;
  const isFinalRound = Boolean(challenger) && queue.length === 1;

  useEffect(() => {
    if (champion && !challenger && !animating) {
      onDone(champion);
    }
  }, [animating, champion, challenger, onDone]);

  function resolveRound(winnerSide) {
    if (!champion || !challenger || animating) {
      return;
    }
    const winner = winnerSide === "left" ? champion : challenger;
    const loser = winnerSide === "left" ? "right" : "left";
    const finalRound = queue.length === 1;
    setLosingSide(loser);
    setAnimating(true);

    window.setTimeout(() => {
      if (finalRound) {
        setChampion(winner);
        setQueue([]);
        setLosingSide(null);
        setAnimating(false);
        onDone(winner);
        return;
      }
      setChampion(winner);
      setQueue((current) => current.slice(1));
      setLosingSide(null);
      setAnimating(false);
    }, 360);
  }

  if (!champion) {
    return (
      <section className="screen fight-screen">
        <p className="copy">No operational pool available.</p>
      </section>
    );
  }

  return (
    <section className="screen fight-screen">
      <header className="screen-header">
        <button className="text-button back-button" onClick={onBack}>
          &larr;
        </button>
      </header>

      <h2>Choose</h2>
      {challenger ? (
        <>
          {isFinalRound && <p className="ghost fight-final-choice">final choice</p>}
          <div className="fight-stage">
            <TaskCard
              task={champion}
              side="left"
              disabled={animating}
              losing={losingSide === "left"}
              onSelect={() => resolveRound("left")}
            />
            <TaskCard
              task={challenger}
              side="right"
              disabled={animating}
              losing={losingSide === "right"}
              onSelect={() => resolveRound("right")}
            />
          </div>
        </>
      ) : (
        <p className="copy">Preparing final view...</p>
      )}
    </section>
  );
}
