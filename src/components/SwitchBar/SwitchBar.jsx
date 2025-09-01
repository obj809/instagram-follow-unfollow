// src/components/SwitchBar/SwitchBar.jsx
import React, { useEffect, useState } from "react";
import "./SwitchBar.scss";

/**
 * Uncontrolled SwitchBar (original structure & styles preserved).
 * Adds optional onModeChange callback (no visual changes).
 */
export default function SwitchBar({ onModeChange }) {
  const [mode, setMode] = useState("following_not_following_back");
  const [showAbout, setShowAbout] = useState(false);

  const label =
    mode === "following_not_following_back"
      ? "Showing: Not Following You Back"
      : "Showing: You’re Not Following Back";

  const openAbout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAbout(true);
  };

  const closeAbout = (e) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    setShowAbout(false);
  };

  // Notify parent (Section3) of mode changes, if provided
  useEffect(() => {
    onModeChange?.(mode);
  }, [mode, onModeChange]);

  // Close About on ESC (keeps UI intact)
  useEffect(() => {
    if (!showAbout) return;
    const handler = (e) => {
      if (e.key === "Escape" || e.key === "Esc") closeAbout(e);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [showAbout]);

  return (
    <div
      className="switchBar"
      role="region"
      aria-label="Follow comparison mode"
      // allow clicks when About is open (since .switchBar has pointer-events: none)
      style={{ pointerEvents: showAbout ? "auto" : undefined }}
    >
      <div className="switchBar__label" aria-live="polite">
        {label}
      </div>

      <div className="switchBar__buttons">
        <button
          className="switchBar__button"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMode((m) =>
              m === "following_not_following_back"
                ? "followers_you_dont_follow"
                : "following_not_following_back"
            );
          }}
        >
          Switch
        </button>

        <button
          type="button"
          className="switchBar__about"
          onClick={openAbout}
          aria-haspopup="dialog"
          aria-controls="about-modal"
        >
          About
        </button>
      </div>

      {showAbout && (
        <div
          id="about-modal"
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-modal-title"
          onClick={closeAbout}             // backdrop closes
        >
          <div
            className="modal__dialog"
            onClick={(e) => e.stopPropagation()} // keep clicks inside
          >
            <h3 id="about-modal-title">About This App</h3>
            <p>
              Compare your Instagram <strong>followers</strong> and{" "}
              <strong>following</strong> lists. Upload one HTML/JSON file into{" "}
              <em>Section One</em> (Following) and another into <em>Section Two</em> (Followers),
              then use the switcher below to toggle the view.
            </p>
            <p>
              Built with React, Vite, and drag-and-drop uploads. Files are processed locally in your browser.
            </p>
            <button
              className="modal__close"
              type="button"
              onClick={closeAbout}
              aria-label="Close about dialog"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
