// src/components/Section3/Section3.jsx
import React, { useMemo, useState } from "react";
import "./Section3.scss";
import SwitchBar from "../SwitchBar/SwitchBar";

/**
 * Displays results and keeps SwitchBar visually identical to before.
 * SwitchBar reports mode via onModeChange; Section3 uses it to pick which list to show.
 */
export default function Section3({ showTextBox, loading, error, results }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [mode, setMode] = useState("following_not_following_back");

  const handleClick = () => {
    if (showPrompt) return;
    if (!showTextBox) setShowPrompt(true);
  };

  const closePrompt = () => setShowPrompt(false);

  const onKeyDownRoot = (e) => {
    if ((e.key === "Escape" || e.key === "Esc") && showPrompt) {
      e.stopPropagation();
      closePrompt();
    }
    if ((e.key === "Enter" || e.key === " ") && !showPrompt) {
      handleClick();
    }
  };

  const list = useMemo(() => {
    if (!results) return [];
    return mode === "following_not_following_back"
      ? results.notFollowingYouBack
      : results.youDontFollowBack;
  }, [mode, results]);

  const heading =
    mode === "following_not_following_back"
      ? "Accounts Not Following You Back"
      : "Accounts You Don’t Follow Back";

  return (
    <div
      className="section section3"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Section Three (Results)"
      onKeyDown={onKeyDownRoot}
    >
      {!showTextBox && (
        <div className="section__content" onClick={(e) => e.stopPropagation()}>
          <h2>Comparison Results</h2>
          <p>Upload both files to view differences between your Followers and Following lists.</p>
        </div>
      )}

      {showTextBox && (
        <div
          className="text-box"
          role="region"
          aria-label="Results area"
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <>
              <h3>Processing…</h3>
              <p>Parsing your files in the browser.</p>
            </>
          ) : error ? (
            <>
              <h3>Something went wrong</h3>
              <p>{error}</p>
            </>
          ) : (
            <>
              <h3>{heading}</h3>
              {list?.length ? (
                <ul className="results-list" aria-live="polite">
                  {list.map((u) => (
                    <li key={u}>@{u}</li>
                  ))}
                </ul>
              ) : (
                <p>No accounts in this view 🎉</p>
              )}
            </>
          )}
        </div>
      )}

      {/* Keep SwitchBar exactly where it was visually; just listen for mode changes */}
      <SwitchBar onModeChange={setMode} />

      {showPrompt && !showTextBox && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="s3-modal-title"
          onClick={(e) => {
            e.stopPropagation();
            closePrompt();
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div
            className="modal__dialog"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3 id="s3-modal-title">Upload Required</h3>
            <p>
              Before proceeding, upload files into <strong>Section One</strong> (Following)
              and <strong>Section Two</strong> (Followers).
            </p>
            <button
              className="modal__close"
              onClick={(e) => {
                e.stopPropagation();
                closePrompt();
              }}
              aria-label="Close modal"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
