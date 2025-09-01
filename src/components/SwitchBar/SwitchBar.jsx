// src/components/SwitchBar/SwitchBar.jsx
import React, { useEffect, useState } from "react";
import "./SwitchBar.scss";

/**
 * Uncontrolled SwitchBar (original structure & styles preserved).
 * Now without the top status label; only the Switch and About buttons remain.
 * Adds optional onModeChange callback (no visual changes beyond removing label).
 */
export default function SwitchBar({ onModeChange }) {
  const [mode, setMode] = useState("following_not_following_back");
  const [showAbout, setShowAbout] = useState(false);

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
      aria-label="Follow comparison controls"
      // allow clicks when About is open (since .switchBar has pointer-events: none)
      style={{ pointerEvents: showAbout ? "auto" : undefined }}
    >
      {/* Label removed */}

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
          onClick={closeAbout}
        >
          <div
            className="modal__dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="about-modal-title">About This App</h3>

            <p>
              Compare your Instagram <strong>followers</strong> and{" "}
              <strong>following</strong> lists by uploading one file into{" "}
              <em>Section One</em> (Following) and another into{" "}
              <em>Section Two</em> (Followers). Use the switcher to toggle views.
            </p>

            <h4>How to export from Instagram (PC)</h4>
            <ol>
              <li>
                Log in to Instagram and open{" "}
                <strong>Settings &gt; Settings &amp; Privacy</strong>.
              </li>
              <li>
                Go to{" "}
                <strong>Accounts Centre &gt; Your information and permissions</strong>.
              </li>
              <li>
                Select <strong>Export your information</strong> →{" "}
                <strong>Create export</strong>.
              </li>
              <li>
                Choose <strong>Export to device</strong> and select{" "}
                <strong>HTML</strong> or <strong>JSON</strong>.
              </li>
              <li>
                Click <strong>Start export</strong>, then when it’s ready select{" "}
                <strong>Download information</strong>.
              </li>
            </ol>

            <p>
              After downloading the export, unzip it and open{" "}
              <code>connections</code> → <code>followers_and_following</code>.
              Upload <code>following.json</code> into <strong>Section One</strong> (blue),
              and <code>followers_1.json</code> into <strong>Section Two</strong> (purple).
            </p>

            <p>
              <strong>Privacy:</strong> All processing happens in your browser —
              there is <strong>no server</strong>, <strong>no database</strong>, and{" "}
              <strong>no storage</strong> of your files. Your data stays private on your device.
            </p>

            <div className="modal__actions">
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
        </div>
      )}
    </div>
  );
}
