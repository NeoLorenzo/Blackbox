const STORAGE_KEY = "blackbox.vault.v1";

function validateTaskShape(task) {
  return (
    task &&
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.timeEst === "string" &&
    typeof task.energy === "string" &&
    Array.isArray(task.contexts)
  );
}

export function loadVault() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(validateTaskShape);
  } catch {
    return [];
  }
}

export function saveVault(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function upsertTask(tasks, updatedTask) {
  const existingIndex = tasks.findIndex((task) => task.id === updatedTask.id);
  if (existingIndex === -1) {
    return [...tasks, updatedTask];
  }
  const next = [...tasks];
  next[existingIndex] = updatedTask;
  return next;
}

export function removeTask(tasks, taskId) {
  return tasks.filter((task) => task.id !== taskId);
}
