import { useEffect, useRef } from "react";
import { taskAPI } from "@/services/api";

/**
 * Polls the backend for task updates at a given interval.
 * When the backend is connected, this ensures real-time-like updates.
 * @param {Function} onUpdate - callback receiving the latest tasks array
 * @param {number} interval - polling interval in ms (default 10s)
 * @param {boolean} enabled - whether polling is active
 */
export const useTaskPolling = (onUpdate, interval = 10000, enabled = true) => {
  const savedCallback = useRef(onUpdate);

  useEffect(() => {
    savedCallback.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!enabled) return;

    const poll = async () => {
      try {
        const tasks = await taskAPI.getAll();
        savedCallback.current(tasks);
      } catch (err) {
        // Silently fail on poll errors — don't disrupt UX
        console.warn("Task polling failed:", err.message);
      }
    };

    const id = setInterval(poll, interval);
    return () => clearInterval(id);
  }, [interval, enabled]);
};
