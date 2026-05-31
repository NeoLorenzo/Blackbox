import backArrowClickUrl from "../../back_arrow_click.wav";
import taskAdditionCompleteUrl from "../../task_addition_complete.wav";
import undoRiserUrl from "../../undo_riser.wav";
import uiLeftClickUrl from "../../UI_left_click.wav";

const SOUND_URLS = {
  backArrow: backArrowClickUrl,
  taskAdditionComplete: taskAdditionCompleteUrl,
  undoRiser: undoRiserUrl,
  uiLeftClick: uiLeftClickUrl
};

let audioContext = null;
let initialized = false;
let preloadPromise = null;
let unlockBound = false;
const bufferCache = new Map();

let activeUndoRiser = null;
let undoRiserFallbackAudio = null;

function getAudioContext() {
  if (audioContext) {
    return audioContext;
  }
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) {
    return null;
  }
  audioContext = new AudioContextCtor({ latencyHint: "interactive" });
  return audioContext;
}

async function decodeToBuffer(context, url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return context.decodeAudioData(arrayBuffer);
}

async function preloadBuffers() {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  const entries = Object.entries(SOUND_URLS);
  await Promise.all(
    entries.map(async ([name, url]) => {
      if (bufferCache.has(name)) {
        return;
      }
      try {
        const buffer = await decodeToBuffer(context, url);
        bufferCache.set(name, buffer);
      } catch {
        // no-op fallback handled at play time
      }
    })
  );
}

export function unlockUiSounds() {
  const context = getAudioContext();
  if (!context) {
    return;
  }
  if (context.state !== "running") {
    context.resume().catch(() => { });
  }
}

export function initUiSounds() {
  if (initialized) {
    return preloadPromise;
  }
  initialized = true;
  preloadPromise = preloadBuffers();

  if (!unlockBound) {
    unlockBound = true;
    const unlockOnce = () => {
      unlockUiSounds();
      window.removeEventListener("pointerdown", unlockOnce, true);
      window.removeEventListener("keydown", unlockOnce, true);
      window.removeEventListener("touchstart", unlockOnce, true);
    };
    window.addEventListener("pointerdown", unlockOnce, true);
    window.addEventListener("keydown", unlockOnce, true);
    window.addEventListener("touchstart", unlockOnce, true);
  }

  return preloadPromise;
}

function fallbackPlay(url, volume = 1, startAtSeconds = 0) {
  const audio = new Audio(url);
  audio.preload = "auto";
  audio.volume = volume;
  audio.currentTime = startAtSeconds;
  audio.play().catch(() => { });
}

function cleanupActiveUndoRiser() {
  if (!activeUndoRiser) {
    return;
  }
  try {
    activeUndoRiser.source.onended = null;
    activeUndoRiser.source.disconnect();
    activeUndoRiser.gain.disconnect();
  } catch {
    // no-op
  }
  activeUndoRiser = null;
}

function playBuffer(name, options = {}) {
  const context = getAudioContext();
  if (!context) {
    return false;
  }

  const buffer = bufferCache.get(name);
  if (!buffer) {
    return false;
  }

  if (context.state !== "running") {
    context.resume().catch(() => { });
  }

  const now = context.currentTime;
  const offset = Math.max(0, options.offsetSeconds || 0);
  const baseDuration = Math.max(0, buffer.duration - offset);
  if (baseDuration <= 0) {
    return false;
  }
  const requestedDuration =
    typeof options.durationSeconds === "number" ? options.durationSeconds : baseDuration;
  const duration = Math.min(baseDuration, Math.max(0.01, requestedDuration));
  const volume = Math.max(0, Math.min(1, options.volume ?? 1));
  const fadeOutSeconds = Math.max(0, options.fadeOutSeconds || 0);
  const fadeStartSeconds = Math.max(0, options.fadeStartSeconds ?? duration - fadeOutSeconds);

  const source = context.createBufferSource();
  source.buffer = buffer;

  const gainNode = context.createGain();
  gainNode.gain.setValueAtTime(volume, now);

  if (fadeOutSeconds > 0 && fadeStartSeconds < duration) {
    const fadeStart = now + fadeStartSeconds;
    const fadeEnd = now + duration;
    gainNode.gain.setValueAtTime(volume, fadeStart);
    gainNode.gain.linearRampToValueAtTime(0.0001, fadeEnd);
  }

  source.connect(gainNode);
  gainNode.connect(context.destination);
  source.start(now, offset, duration);
  return true;
}

export function playBackArrowSound() {
  const played = playBuffer("backArrow", {
    volume: 0.75,
    offsetSeconds: 0.0
  });
  if (!played) {
    fallbackPlay(SOUND_URLS.backArrow, 0.75, 0.08);
  }
}

export function playTaskAdditionCompleteSound(visualDurationMs = 1140) {
  const durationSeconds = Math.max(0.34, visualDurationMs / 1000);
  const fadeOutSeconds = Math.min(0.8, Math.max(0.46, durationSeconds * 0.58));
  const fadeStartSeconds = Math.max(0, durationSeconds - fadeOutSeconds);

  const played = playBuffer("taskAdditionComplete", {
    volume: 0.85,
    durationSeconds,
    fadeOutSeconds,
    fadeStartSeconds
  });
  if (!played) {
    fallbackPlay(SOUND_URLS.taskAdditionComplete, 0.85, 0);
  }
}

export function playUiLeftClickSound() {
  const played = playBuffer("uiLeftClick", {
    volume: 0.72,
    offsetSeconds: 0
  });
  if (!played) {
    fallbackPlay(SOUND_URLS.uiLeftClick, 0.72, 0);
  }
}

export function startUndoRiserSound(durationMs = 3000) {
  stopUndoRiserSound();

  const context = getAudioContext();
  const buffer = context ? bufferCache.get("undoRiser") : null;
  if (context && buffer) {
    if (context.state !== "running") {
      context.resume().catch(() => { });
    }

    const now = context.currentTime;
    const durationSeconds = Math.max(0.08, durationMs / 1000);
    const volume = 0.20;

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = buffer.duration < durationSeconds;

    const gain = context.createGain();
    gain.gain.setValueAtTime(volume, now);

    const stopAt = now + durationSeconds;
    const fadeStart = Math.max(now, stopAt - 0.04);
    gain.gain.setValueAtTime(volume, fadeStart);
    gain.gain.linearRampToValueAtTime(0.0001, stopAt);

    source.connect(gain);
    gain.connect(context.destination);
    source.start(now);
    source.stop(stopAt + 0.01);

    activeUndoRiser = { source, gain };
    source.onended = () => {
      cleanupActiveUndoRiser();
    };
    return;
  }

  if (!undoRiserFallbackAudio) {
    undoRiserFallbackAudio = new Audio(SOUND_URLS.undoRiser);
    undoRiserFallbackAudio.preload = "auto";
    undoRiserFallbackAudio.loop = true;
    undoRiserFallbackAudio.volume = 0.20;
  }
  undoRiserFallbackAudio.currentTime = 0;
  undoRiserFallbackAudio.play().catch(() => { });
}

export function stopUndoRiserSound() {
  if (activeUndoRiser) {
    try {
      activeUndoRiser.source.stop();
    } catch {
      // no-op
    }
    cleanupActiveUndoRiser();
  }

  if (undoRiserFallbackAudio) {
    undoRiserFallbackAudio.pause();
    undoRiserFallbackAudio.currentTime = 0;
  }
}
