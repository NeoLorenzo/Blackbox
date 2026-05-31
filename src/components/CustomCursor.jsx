import { useEffect, useRef, useState } from "react";

const SIGNAL_SELECTOR = [
  ".action-primary",
  ".action-airlock-pending",
  ".action-airlock-complete",
  ".pill-active",
  ".segment-active",
  ".wheel-pointer",
  ".neglect-nudge"
].join(", ");

function isSignalLikeRgb(colorValue) {
  const match = colorValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) {
    return false;
  }
  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  return r >= 180 && g >= 45 && g <= 165 && b <= 90;
}

function isOverSignalElement(target) {
  if (!(target instanceof Element)) {
    return false;
  }
  if (target.closest(SIGNAL_SELECTOR)) {
    return true;
  }
  const style = window.getComputedStyle(target);
  return (
    isSignalLikeRgb(style.backgroundColor) ||
    isSignalLikeRgb(style.borderColor) ||
    isSignalLikeRgb(style.borderTopColor) ||
    isSignalLikeRgb(style.color)
  );
}

export default function CustomCursor() {
  const dotRef = useRef(null);
  const trailRef = useRef(null);
  const clickRef = useRef(null);
  const clickRingRef = useRef(null);
  const rafRef = useRef(null);
  const ringTimeoutRef = useRef(null);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const trailRefPos = useRef({ x: 0, y: 0 });
  const overSignalRef = useRef(false);
  const initializedRef = useRef(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateEnabled = () => setEnabled(media.matches);
    updateEnabled();

    if (media.addEventListener) {
      media.addEventListener("change", updateEnabled);
    } else {
      media.addListener(updateEnabled);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", updateEnabled);
      } else {
        media.removeListener(updateEnabled);
      }
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("cursor-enabled");
      document.documentElement.classList.remove("cursor-over-signal");
      return undefined;
    }

    document.documentElement.classList.add("cursor-enabled");

    function onPointerMove(event) {
      pointerTargetRef.current = { x: event.clientX, y: event.clientY };
      const overSignal = isOverSignalElement(event.target);
      if (overSignal !== overSignalRef.current) {
        overSignalRef.current = overSignal;
        document.documentElement.classList.toggle("cursor-over-signal", overSignal);
      }
      if (!initializedRef.current) {
        trailRefPos.current = { x: event.clientX, y: event.clientY };
        initializedRef.current = true;
      }
    }

    function onMouseDown(event) {
      if (event.button !== 0 || !clickRef.current || !clickRingRef.current) {
        return;
      }
      clickRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      clickRingRef.current.classList.remove("cursor-click-ring-active");
      void clickRingRef.current.offsetWidth;
      clickRingRef.current.classList.add("cursor-click-ring-active");
      if (ringTimeoutRef.current) {
        window.clearTimeout(ringTimeoutRef.current);
      }
      ringTimeoutRef.current = window.setTimeout(() => {
        if (clickRingRef.current) {
          clickRingRef.current.classList.remove("cursor-click-ring-active");
        }
      }, 240);
    }

    function animate() {
      const target = pointerTargetRef.current;
      const trail = trailRefPos.current;
      const dx = target.x - trail.x;
      const dy = target.y - trail.y;
      trail.x += dx * 0.24;
      trail.y += dy * 0.24;
      trailRefPos.current = trail;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const speed = Math.hypot(dx, dy);
      const stretch = Math.min(1.35, 0.72 + speed / 20);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) rotate(${angle}deg) scaleX(${stretch})`;
      }

      rafRef.current = window.requestAnimationFrame(animate);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("cursor-enabled");
      document.documentElement.classList.remove("cursor-over-signal");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mousedown", onMouseDown);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (ringTimeoutRef.current) {
        window.clearTimeout(ringTimeoutRef.current);
        ringTimeoutRef.current = null;
      }
      initializedRef.current = false;
      overSignalRef.current = false;
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <div ref={trailRef} className="cursor-trail" />
      <div ref={dotRef} className="cursor-dot" />
      <div ref={clickRef} className="cursor-click">
        <div ref={clickRingRef} className="cursor-click-ring" />
      </div>
    </>
  );
}
