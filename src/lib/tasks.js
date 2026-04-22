import { CONTEXT_OPTIONS } from "./constants";

function clampTitle(title) {
  return title.trim().slice(0, 100);
}

export function buildTask(input) {
  const now = Date.now();

  return {
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    title: clampTitle(input.title),
    description: (input.description || "").trim(),
    timeEst: input.timeEst,
    energy: input.energy,
    contexts: [...new Set((input.contexts || []).filter((ctx) => CONTEXT_OPTIONS.includes(ctx)))],
    deferCount: 0,
    createdAt: now
  };
}

export function filterTasks(tasks, constraints) {
  const selectedTimeLimits = constraints.timeLimits || [];
  const selectedEnergies = constraints.energies || [];
  const selectedContexts = constraints.contexts || [];

  return tasks.filter((task) => {
    const timeMatch =
      selectedTimeLimits.length === 0 ? true : selectedTimeLimits.includes(task.timeEst);
    const energyMatch =
      selectedEnergies.length === 0 ? true : selectedEnergies.includes(task.energy);
    const contextMatch =
      selectedContexts.length === 0
        ? true
        : task.contexts.some((ctx) => selectedContexts.includes(ctx));
    return timeMatch && energyMatch && contextMatch;
  });
}

export function similarityScore(a, b) {
  const titleA = a.toLowerCase().trim();
  const titleB = b.toLowerCase().trim();
  if (!titleA || !titleB) {
    return 0;
  }
  if (titleA === titleB) {
    return 1;
  }
  const shorter = titleA.length < titleB.length ? titleA : titleB;
  const longer = titleA.length >= titleB.length ? titleA : titleB;
  if (longer.includes(shorter) && shorter.length >= 6) {
    return shorter.length / longer.length;
  }
  return 0;
}

export function pickWeightedTask(tasks) {
  if (!tasks.length) {
    return null;
  }
  const now = Date.now();
  const weighted = tasks.map((task) => {
    const ageHours = Math.max(0, (now - task.createdAt) / (1000 * 60 * 60));
    const weight = 1 + task.deferCount * 0.75 + ageHours / 12;
    return { task, weight };
  });
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let threshold = Math.random() * total;
  for (const item of weighted) {
    threshold -= item.weight;
    if (threshold <= 0) {
      return item.task;
    }
  }
  return weighted[weighted.length - 1].task;
}

export function shuffle(items) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}
