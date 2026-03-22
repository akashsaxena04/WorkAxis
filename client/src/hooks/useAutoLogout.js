import { useEffect, useRef, useCallback } from "react";
import { authAPI } from "@/services/api";

const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
const DEFAULT_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const WARNING_BEFORE = 60 * 1000; // warn 1 minute before logout

/**
 * Auto-logout hook that triggers after inactivity.
 * @param {Function} onLogout - called when auto-logout fires
 * @param {Function} onWarning - called 1 min before logout with seconds remaining
 * @param {number} timeout - inactivity timeout in ms
 */
export const useAutoLogout = (onLogout, onWarning, timeout = DEFAULT_TIMEOUT) => {
  const timerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const warningIntervalRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
  }, []);

  const resetTimer = useCallback(() => {
    clearTimers();

    // Warning timer: fires 1 minute before logout
    warningTimerRef.current = setTimeout(() => {
      let secondsLeft = Math.floor(WARNING_BEFORE / 1000);
      onWarning?.(secondsLeft);
      warningIntervalRef.current = setInterval(() => {
        secondsLeft -= 1;
        if (secondsLeft > 0) {
          onWarning?.(secondsLeft);
        }
      }, 1000);
    }, timeout - WARNING_BEFORE);

    // Logout timer
    timerRef.current = setTimeout(() => {
      clearTimers();
      authAPI.logout();
      onLogout();
    }, timeout);
  }, [timeout, onLogout, onWarning, clearTimers]);

  useEffect(() => {
    if (!authAPI.isAuthenticated()) return;

    resetTimer();

    const handleActivity = () => resetTimer();

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true })
    );

    return () => {
      clearTimers();
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
    };
  }, [resetTimer, clearTimers]);
};
