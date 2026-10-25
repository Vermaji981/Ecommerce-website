import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaClock, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";
import api from "../../services/api";
import "./InactivityHandler.css";

// Timeout configuration (in milliseconds)
const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // Exactly 10 minutes (600,000 ms)
const WARNING_THRESHOLD_MS = 9 * 60 * 1000;  // 9 minutes (540,000 ms, warning shows 60s before logout)
const ACTIVITY_THROTTLE_MS = 2500;           // Throttle storage writes to once every 2.5 seconds

const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  CURRENT_USER: "currentUser",
  ADMIN_TOKEN: "adminToken",
  ADMIN_USER: "adminUser",
  LAST_ACTIVITY: "lastActivityTime",
  LOGOUT_EVENT: "authLogoutEvent"
};

const InactivityHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  const lastActivityRef = useRef(Date.now());
  const lastStorageWriteRef = useRef(0);
  const isLoggingOutRef = useRef(false);

  // Helper function to check if any user or admin is currently authenticated
  const checkIsAuthenticated = useCallback(() => {
    try {
      const regularToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const adminToken =
        localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) ||
        sessionStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
      const user =
        localStorage.getItem(STORAGE_KEYS.CURRENT_USER) ||
        localStorage.getItem(STORAGE_KEYS.USER);
      const adminUser =
        localStorage.getItem(STORAGE_KEYS.ADMIN_USER) ||
        sessionStorage.getItem(STORAGE_KEYS.ADMIN_USER);

      return Boolean(regularToken || adminToken || user || adminUser);
    } catch (e) {
      return false;
    }
  }, []);

  // Helper to determine if current session is an Admin session
  const checkIsAdmin = useCallback(() => {
    try {
      const adminToken =
        localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) ||
        sessionStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
      const adminUserStr =
        localStorage.getItem(STORAGE_KEYS.ADMIN_USER) ||
        sessionStorage.getItem(STORAGE_KEYS.ADMIN_USER) ||
        localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

      if (adminToken) return true;
      if (location.pathname.startsWith("/admin")) return true;
      if (adminUserStr) {
        const u = JSON.parse(adminUserStr);
        return String(u?.role).toLowerCase() === "admin";
      }
      return false;
    } catch (e) {
      return false;
    }
  }, [location.pathname]);

  // Execute clean, synchronized logout
  const performLogout = useCallback(
    (reason = "inactivity", broadcast = true) => {
      if (isLoggingOutRef.current) return;
      isLoggingOutRef.current = true;

      const isAdmin = checkIsAdmin();

      // Clear all tokens and session entries from localStorage and sessionStorage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
      localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);

      sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.USER);
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
      sessionStorage.clear();

      setShowWarning(false);

      // Multi-tab synchronization signal
      if (broadcast) {
        try {
          localStorage.setItem(
            STORAGE_KEYS.LOGOUT_EVENT,
            JSON.stringify({ timestamp: Date.now(), reason })
          );
        } catch (e) {}
      }

      // Notify local components
      window.dispatchEvent(new Event("authChange"));

      // Notify backend logout endpoint
      try {
        if (api && typeof api.logout === "function") {
          api.logout().catch(() => {});
        }
      } catch (e) {}

      // Replace history state to prevent browser Back button access
      try {
        window.history.replaceState(null, "", window.location.href);
      } catch (e) {}

      // Redirect user to the appropriate login page with feedback
      const redirectPath = isAdmin ? "/admin/login" : "/auth";
      const logoutMsg =
        reason === "inactivity"
          ? "You have been automatically logged out due to 10 minutes of inactivity."
          : "You have been logged out successfully.";

      navigate(redirectPath, {
        replace: true,
        state: { error: logoutMsg, reason }
      });

      // Reset logout lock after navigation settles
      setTimeout(() => {
        isLoggingOutRef.current = false;
      }, 1000);
    },
    [checkIsAdmin, navigate]
  );

  // Record user activity and synchronize timestamp across tabs
  const recordActivity = useCallback(
    (force = false) => {
      if (!checkIsAuthenticated()) return;

      const now = Date.now();
      lastActivityRef.current = now;

      // If warning modal is open, any user activity dismisses it immediately
      setShowWarning((prev) => {
        if (prev) return false;
        return prev;
      });

      // Throttled write to localStorage to prevent high CPU / disk writes on constant mouse movement
      if (force || now - lastStorageWriteRef.current >= ACTIVITY_THROTTLE_MS) {
        lastStorageWriteRef.current = now;
        try {
          localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, now.toString());
        } catch (e) {}
      }
    },
    [checkIsAuthenticated]
  );

  // Initialize activity timestamp upon mounting or when authentication is detected
  useEffect(() => {
    if (checkIsAuthenticated()) {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
      const now = Date.now();
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, now.toString());
        lastActivityRef.current = now;
      } else {
        lastActivityRef.current = Number(stored);
      }
    }
  }, [checkIsAuthenticated]);

  // Attach global user activity listeners
  useEffect(() => {
    const handleUserInteraction = () => {
      recordActivity(false);
    };

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
      "wheel"
    ];

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserInteraction, { passive: true });
    });

    return () => {
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserInteraction);
      });
    };
  }, [recordActivity]);

  // Synchronize activity and logout across multiple tabs via the storage event
  useEffect(() => {
    const handleStorageEvent = (e) => {
      // 1. Cross-tab activity update: another tab recorded activity
      if (e.key === STORAGE_KEYS.LAST_ACTIVITY && e.newValue) {
        const remoteTime = Number(e.newValue);
        if (remoteTime > lastActivityRef.current) {
          lastActivityRef.current = remoteTime;
          setShowWarning(false);
        }
      }

      // 2. Cross-tab logout update: another tab logged out
      if (e.key === STORAGE_KEYS.LOGOUT_EVENT && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          performLogout(data.reason || "cross_tab_logout", false);
        } catch (err) {
          performLogout("cross_tab_logout", false);
        }
      }

      // 3. Token removed by another tab or session cleared
      if (
        (e.key === STORAGE_KEYS.TOKEN || e.key === STORAGE_KEYS.ADMIN_TOKEN) &&
        !e.newValue
      ) {
        if (!checkIsAuthenticated()) {
          performLogout("token_cleared", false);
        }
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [performLogout, checkIsAuthenticated]);

  // Periodic interval check (runs every 1 second)
  useEffect(() => {
    const checkTimerInterval = setInterval(() => {
      if (!checkIsAuthenticated()) {
        setShowWarning(false);
        return;
      }

      const storedTime = Number(
        localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY) || lastActivityRef.current
      );
      const now = Date.now();
      const elapsed = now - storedTime;

      // 1. Inactivity limit reached (>= 10 minutes) -> Automatic Logout
      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        performLogout("inactivity", true);
        return;
      }

      // 2. Warning threshold reached (>= 9 minutes) -> Show Countdown Modal
      if (elapsed >= WARNING_THRESHOLD_MS) {
        const remainingMs = INACTIVITY_TIMEOUT_MS - elapsed;
        const seconds = Math.max(1, Math.ceil(remainingMs / 1000));
        setSecondsRemaining(seconds);
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => {
      clearInterval(checkTimerInterval);
    };
  }, [checkIsAuthenticated, performLogout]);

  // Tab Visibility & Focus Revalidation (Handles browser background/sleep resumption)
  useEffect(() => {
    const revalidateOnFocusOrVisible = () => {
      if (!checkIsAuthenticated()) return;

      const storedTime = Number(
        localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY) || lastActivityRef.current
      );
      const now = Date.now();
      const elapsed = now - storedTime;

      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        performLogout("inactivity", true);
      } else if (elapsed >= WARNING_THRESHOLD_MS) {
        const remainingMs = INACTIVITY_TIMEOUT_MS - elapsed;
        setSecondsRemaining(Math.max(1, Math.ceil(remainingMs / 1000)));
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    document.addEventListener("visibilitychange", revalidateOnFocusOrVisible);
    window.addEventListener("focus", revalidateOnFocusOrVisible);
    window.addEventListener("pageshow", revalidateOnFocusOrVisible);

    return () => {
      document.removeEventListener("visibilitychange", revalidateOnFocusOrVisible);
      window.removeEventListener("focus", revalidateOnFocusOrVisible);
      window.removeEventListener("pageshow", revalidateOnFocusOrVisible);
    };
  }, [checkIsAuthenticated, performLogout]);

  // "Stay Logged In" button action
  const handleStayLoggedIn = () => {
    recordActivity(true);
    setShowWarning(false);
  };

  // "Log Out Now" button action
  const handleImmediateLogout = () => {
    performLogout("user_initiated", true);
  };

  if (!showWarning) {
    return null;
  }

  // Calculate percentage of remaining warning period for visual progress indicator
  const progressPercent = Math.min(100, Math.max(0, (secondsRemaining / 60) * 100));

  return (
    <div className="inactivity-overlay" role="dialog" aria-modal="true" aria-labelledby="timeout-title">
      <div className="inactivity-modal">
        <div className="inactivity-modal-header">
          <div className="inactivity-modal-icon">
            <FaClock />
          </div>
          <h4 id="timeout-title">Session Inactivity Warning</h4>
        </div>

        <div className="inactivity-modal-body">
          <p className="mb-2">
            You have been inactive for <strong>9 minutes</strong>. For your security and protection, your session will automatically end soon.
          </p>

          <div className="inactivity-countdown-box">
            <div className="inactivity-countdown-number">{secondsRemaining}</div>
            <div className="inactivity-countdown-label">Seconds Remaining Until Logout</div>
            <div className="inactivity-progress-bar-container">
              <div
                className="inactivity-progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <p className="small text-muted mb-0 d-flex align-items-center gap-1">
            <FaShieldAlt className="text-primary" />
            Click <strong>Stay Logged In</strong> to continue your current session.
          </p>
        </div>

        <div className="inactivity-modal-footer">
          <button
            type="button"
            className="inactivity-btn inactivity-btn-secondary"
            onClick={handleImmediateLogout}
          >
            <FaSignOutAlt /> Log Out Now
          </button>
          <button
            type="button"
            className="inactivity-btn inactivity-btn-primary"
            onClick={handleStayLoggedIn}
            autoFocus
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
};

export default InactivityHandler;
