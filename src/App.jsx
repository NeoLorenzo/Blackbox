import { useEffect, useRef, useState } from "react";
import CalibrationView from "./components/CalibrationView";
import CrucibleChoice from "./components/CrucibleChoice";
import Dashboard from "./components/Dashboard";
import DumpView from "./components/DumpView";
import FateWheel from "./components/FateWheel";
import FightBracket from "./components/FightBracket";
import FocusView from "./components/FocusView";
import CustomCursor from "./components/CustomCursor";
import VaultView from "./components/VaultView";
import { VIEW } from "./lib/constants";
import { loadVault, removeTask, saveVault, upsertTask } from "./lib/storage";
import { buildTask, filterTasks, similarityScore } from "./lib/tasks";
import {
  initUiSounds,
  playBackArrowSound,
  startUndoRiserSound,
  stopUndoRiserSound
} from "./lib/uiSounds";

const AIRLOCK_DURATION_MS = 3000;
const AIRLOCK_COMPLETE_GLOW_MS = 820;
const AIRLOCK_COMPLETE_FADE_MS = 320;
const AIRLOCK_COMPLETE_VISUAL_MS = AIRLOCK_COMPLETE_GLOW_MS + AIRLOCK_COMPLETE_FADE_MS;

export default function App() {
  const [vault, setVault] = useState(() => loadVault());
  const [view, setView] = useState(VIEW.DASHBOARD);
  const [constraints, setConstraints] = useState({
    timeLimits: ["30m"],
    energies: ["Low"],
    contexts: ["PC"]
  });
  const [pool, setPool] = useState([]);
  const [focusTask, setFocusTask] = useState(null);
  const [fallbackState, setFallbackState] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [airlockState, setAirlockState] = useState("idle");
  const [airlockProgress, setAirlockProgress] = useState(0);
  const [whiteFlush, setWhiteFlush] = useState(false);

  const airlockCommitTimeoutRef = useRef(null);
  const airlockTickerRef = useRef(null);
  const airlockCompleteTimeoutRef = useRef(null);
  const airlockFadeTimeoutRef = useRef(null);

  useEffect(() => {
    saveVault(vault);
  }, [vault]);

  useEffect(() => {
    initUiSounds();
  }, []);

  useEffect(() => {
    return () => {
      clearAirlockTimers();
    };
  }, []);

  function clearAirlockTimers() {
    if (airlockCommitTimeoutRef.current) {
      window.clearTimeout(airlockCommitTimeoutRef.current);
      airlockCommitTimeoutRef.current = null;
    }
    if (airlockTickerRef.current) {
      window.clearInterval(airlockTickerRef.current);
      airlockTickerRef.current = null;
    }
    if (airlockCompleteTimeoutRef.current) {
      window.clearTimeout(airlockCompleteTimeoutRef.current);
      airlockCompleteTimeoutRef.current = null;
    }
    if (airlockFadeTimeoutRef.current) {
      window.clearTimeout(airlockFadeTimeoutRef.current);
      airlockFadeTimeoutRef.current = null;
    }
    stopUndoRiserSound();
  }

  function beginAirlock(input) {
    if (airlockState !== "idle") {
      return;
    }
    clearAirlockTimers();
    const task = buildTask(input);
    const startAt = Date.now();
    setAirlockState("pending");
    setAirlockProgress(0);
    startUndoRiserSound(AIRLOCK_DURATION_MS);

    airlockTickerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startAt;
      setAirlockProgress((elapsed / AIRLOCK_DURATION_MS) * 100);
    }, 80);

    airlockCommitTimeoutRef.current = window.setTimeout(() => {
      clearAirlockTimers();
      setAirlockProgress(100);
      setVault((current) => [...current, task]);
      setAirlockState("complete");
      setStatusText("Task dissolved into The Vault.");
      airlockCompleteTimeoutRef.current = window.setTimeout(() => {
        setAirlockState("fading");
        airlockFadeTimeoutRef.current = window.setTimeout(() => {
          setAirlockState("idle");
          setAirlockProgress(0);
        }, AIRLOCK_COMPLETE_FADE_MS);
      }, AIRLOCK_COMPLETE_GLOW_MS);
    }, AIRLOCK_DURATION_MS);
  }

  function undoAirlock() {
    clearAirlockTimers();
    setAirlockState("idle");
    setAirlockProgress(0);
    setStatusText("Air-Lock reversed.");
  }

  function routePool(nextPool) {
    if (nextPool.length === 0) {
      setFallbackState(true);
      return;
    }

    setFallbackState(false);
    setPool(nextPool);
    if (nextPool.length === 1) {
      setFocusTask(nextPool[0]);
      setView(VIEW.FOCUS);
      return;
    }
    setView(VIEW.CRUCIBLE);
  }

  function runCalibration() {
    const strictPool = filterTasks(vault, constraints);
    routePool(strictPool);
  }

  function calculateSimilarity(title) {
    if (!title || !title.trim()) {
      return 0;
    }
    return vault.reduce((max, task) => {
      return Math.max(max, similarityScore(title, task.title));
    }, 0);
  }

  function handleExecute(task) {
    setWhiteFlush(true);
    window.setTimeout(() => {
      setVault((current) => removeTask(current, task.id));
      setFocusTask(null);
      setPool([]);
      setView(VIEW.CALIBRATION);
      setWhiteFlush(false);
      setStatusText("Task Cleared. Awaiting Calibration.");
    }, 700);
  }

  function handleDefer(task) {
    const deferred = {
      ...task,
      deferCount: (task.deferCount || 0) + 1,
      createdAt: Date.now()
    };
    setVault((current) => upsertTask(current, deferred));
    setFocusTask(null);
    setStatusText("Task Deferred. Entropy incremented.");
    setView(VIEW.CALIBRATION);
  }

  function toCsvCell(value) {
    const text = value == null ? "" : String(value);
    if (/[",\n\r]/.test(text)) {
      return `"${text.replace(/"/g, "\"\"")}"`;
    }
    return text;
  }

  function exportVaultCsv() {
    const headers = [
      "id",
      "title",
      "description",
      "timeEst",
      "energy",
      "contexts",
      "deferCount",
      "createdAt"
    ];
    const rows = vault.map((task) => [
      task.id,
      task.title,
      task.description || "",
      task.timeEst,
      task.energy,
      Array.isArray(task.contexts) ? task.contexts.join("|") : "",
      task.deferCount || 0,
      task.createdAt ? new Date(task.createdAt).toISOString() : ""
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.map(toCsvCell).join(","))].join("\n");
    const dateTag = new Date().toISOString().slice(0, 10);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `blackbox-vault-${dateTag}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusText(`Exported ${vault.length} task${vault.length === 1 ? "" : "s"} to CSV.`);
  }

  function clearVault() {
    const shouldClear = window.confirm("Delete all tasks in the Vault? This cannot be undone.");
    if (!shouldClear) {
      return;
    }
    setVault([]);
    setPool([]);
    setFocusTask(null);
    setFallbackState(false);
    setStatusText("Vault cleared.");
  }

  function goBack(nextView) {
    playBackArrowSound();
    setView(nextView);
  }

  return (
    <div className="app-root">
      <CustomCursor />
      {statusText && <div className="system-banner">{statusText}</div>}
      {view === VIEW.DASHBOARD && (
        <div className="app-dev-controls">
          <button className="text-button dev-vault-button" onClick={() => setView(VIEW.VAULT)}>
            DEV: View Vault
          </button>
          <button className="text-button dev-vault-button" onClick={exportVaultCsv}>
            DEV: Export CSV
          </button>
          <button
            className="text-button dev-vault-button dev-vault-button-danger"
            onClick={clearVault}
          >
            DEV: Clear Vault
          </button>
        </div>
      )}

      <main className={`app-shell view-${view}`}>
        {view === VIEW.DASHBOARD && (
          <Dashboard onDump={() => setView(VIEW.DUMP)} onCalibrate={() => setView(VIEW.CALIBRATION)} />
        )}

        {view === VIEW.VAULT && <VaultView tasks={vault} onBack={() => goBack(VIEW.DASHBOARD)} />}

        {view === VIEW.DUMP && (
          <DumpView
            onBack={() => {
              if (airlockState === "idle") {
                goBack(VIEW.DASHBOARD);
              }
            }}
            onSend={beginAirlock}
            onUndo={undoAirlock}
            airlockState={airlockState}
            airlockProgress={airlockProgress}
            completeVisualDurationMs={AIRLOCK_COMPLETE_VISUAL_MS}
            calculateSimilarity={calculateSimilarity}
          />
        )}

        {view === VIEW.CALIBRATION && (
          <CalibrationView
            constraints={constraints}
            vaultSize={vault.length}
            fallbackState={fallbackState}
            onBack={() => goBack(VIEW.DASHBOARD)}
            onRun={runCalibration}
            onUpdateConstraints={(partial) =>
              setConstraints((current) => ({
                ...current,
                ...partial
              }))
            }
          />
        )}

        {view === VIEW.CRUCIBLE && (
          <CrucibleChoice
            poolSize={pool.length}
            onBack={() => goBack(VIEW.CALIBRATION)}
            onFate={() => setView(VIEW.FATE)}
            onFight={() => setView(VIEW.FIGHT)}
          />
        )}

        {view === VIEW.FATE && (
          <FateWheel
            pool={pool}
            onBack={() => goBack(VIEW.CRUCIBLE)}
            onDone={(task) => {
              setFocusTask(task);
              setView(VIEW.FOCUS);
            }}
          />
        )}

        {view === VIEW.FIGHT && (
          <FightBracket
            pool={pool}
            onBack={() => goBack(VIEW.CRUCIBLE)}
            onDone={(task) => {
              setFocusTask(task);
              setView(VIEW.FOCUS);
            }}
          />
        )}

        {view === VIEW.FOCUS && (
          <FocusView task={focusTask} onExecute={handleExecute} onDefer={handleDefer} />
        )}
      </main>

      {whiteFlush && <div className="white-flush" />}
    </div>
  );
}
