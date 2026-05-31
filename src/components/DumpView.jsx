import { useEffect, useMemo, useRef, useState } from "react";
import { CONTEXT_OPTIONS, ENERGY_OPTIONS, TIME_OPTIONS } from "../lib/constants";
import { playTaskAdditionCompleteSound } from "../lib/uiSounds";

const EMPTY_FORM = {
  title: "",
  description: "",
  timeEst: "30m",
  energy: "Low",
  contexts: ["PC"]
};

function ConstraintPill({ selected, label, onClick, disabled }) {
  return (
    <button
      type="button"
      className={`pill ${selected ? "pill-active" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export default function DumpView({
  onSend,
  onUndo,
  onBack,
  calculateSimilarity,
  airlockState,
  airlockProgress,
  completeVisualDurationMs
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [showDescription, setShowDescription] = useState(false);
  const titleRef = useRef(null);

  const isAirlockPending = airlockState === "pending";
  const isAirlockFading = airlockState === "fading";
  const isAirlockComplete = airlockState === "complete";
  const titleLength = form.title.length;
  const canSubmit =
    form.title.trim().length > 0 &&
    form.contexts.length > 0 &&
    Boolean(form.timeEst) &&
    Boolean(form.energy);

  const duplicateRisk = useMemo(() => {
    const similarity = calculateSimilarity(form.title);
    if (!form.title.trim()) {
      return null;
    }
    if (similarity >= 0.95) {
      return "Repetition warning: near-identical title detected in The Vault.";
    }
    if (similarity >= 0.65) {
      return "Potential overlap detected. Confirm this task is distinct.";
    }
    return null;
  }, [calculateSimilarity, form.title]);

  useEffect(() => {
    if (!titleRef.current) {
      return;
    }
    titleRef.current.style.height = "auto";
    titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
  }, [form.title]);

  useEffect(() => {
    if (airlockState === "complete") {
      playTaskAdditionCompleteSound(completeVisualDurationMs);
    }
  }, [airlockState, completeVisualDurationMs]);

  function handlePrimaryAction() {
    if (isAirlockPending) {
      onUndo();
      return;
    }
    if (!canSubmit) {
      return;
    }
    onSend(form);
    setForm(EMPTY_FORM);
    setShowDescription(false);
  }

  return (
    <section className="screen dump-screen">
      <header className="screen-header">
        <button className="text-button back-button" onClick={onBack}>
          &larr;
        </button>
      </header>

      <textarea
        ref={titleRef}
        className="input title-input"
        maxLength={100}
        rows={1}
        value={form.title}
        onInput={() => {
          if (!titleRef.current) {
            return;
          }
          titleRef.current.style.height = "auto";
          titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
        }}
        onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
        placeholder="Task title"
      />

      {(titleLength >= 100 || duplicateRisk) && (
        <div className="status-row">
          <span className="ghost">{titleLength >= 100 ? `${titleLength}/100` : ""}</span>
          {duplicateRisk && <span className="warning">{duplicateRisk}</span>}
        </div>
      )}

      <div className="detail-quick-actions">
        <button
          type="button"
          className="text-button detail-action"
          onClick={() => setShowDescription((current) => !current)}
        >
          {showDescription ? "- Description" : "+ Description"}
        </button>
      </div>

      {showDescription && (
        <section className="details-panel">
          <textarea
            className="input"
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            placeholder="Task description"
          />
        </section>
      )}

      <div className="constraint-group">
        <label>Time</label>
        <div className="pill-grid">
          {TIME_OPTIONS.map((option) => (
            <ConstraintPill
              key={option}
              label={option}
              selected={form.timeEst === option}
              onClick={() => setForm((current) => ({ ...current, timeEst: option }))}
            />
          ))}
        </div>
      </div>

      <div className="constraint-group">
        <label>REQUIRED ENERGY</label>
        <div className="pill-grid">
          {ENERGY_OPTIONS.map((option) => (
            <ConstraintPill
              key={option}
              label={option}
              selected={form.energy === option}
              onClick={() => setForm((current) => ({ ...current, energy: option }))}
            />
          ))}
        </div>
      </div>

      <div className="constraint-group">
        <label>Context</label>
        <div className="pill-grid">
          {CONTEXT_OPTIONS.map((option) => {
            const selected = form.contexts.includes(option);
            return (
              <ConstraintPill
                key={option}
                label={option}
                selected={selected}
                onClick={() =>
                  setForm((current) => {
                    const contexts = selected
                      ? current.contexts.filter((item) => item !== option)
                      : [...current.contexts, option];
                    return { ...current, contexts };
                  })
                }
              />
            );
          })}
        </div>
      </div>

      <button
        className={`action action-airlock ${
          isAirlockPending ? "action-airlock-pending" : ""
        } ${isAirlockComplete || isAirlockFading ? "action-airlock-complete" : ""} ${
          isAirlockFading ? "action-airlock-fading" : ""
        }`}
        style={{ "--airlock-progress": `${Math.min(100, Math.max(0, airlockProgress || 0))}%` }}
        disabled={isAirlockComplete || isAirlockFading || (!isAirlockPending && !canSubmit)}
        onClick={handlePrimaryAction}
      >
        <span>
          {isAirlockPending ? "Undo?" : isAirlockComplete || isAirlockFading ? "Complete" : "Create Task"}
        </span>
      </button>
    </section>
  );
}
