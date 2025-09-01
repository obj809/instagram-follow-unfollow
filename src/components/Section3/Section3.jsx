// src/components/Section3/Section3.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./Section3.scss";
import SwitchBar from "../SwitchBar/SwitchBar";

export default function Section3({
  showTextBox,         // true when both files are present
  loading,
  error,
  results,
  onClearAll,          // () => void  clears both Section1 & Section2 files
}) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [mode, setMode] = useState("following_not_following_back");

  // Build current list & heading
  const list = useMemo(() => {
    if (!results) return [];
    return mode === "following_not_following_back"
      ? results?.notFollowingYouBack ?? []
      : results?.youDontFollowBack ?? [];
  }, [mode, results]);

  const heading =
    mode === "following_not_following_back"
      ? "Accounts Not Following You Back"
      : "Accounts You Don’t Follow Back";

  // Open the "Upload Required" modal only when files are missing
  const handleClickRoot = () => {
    if (!showTextBox) setShowPrompt(true);
  };

  const closePrompt = () => setShowPrompt(false);

  // Keyboard: open on Enter/Space, close modal on ESC
  const onKeyDownRoot = (e) => {
    if (!showTextBox && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setShowPrompt(true);
    }
  };

  useEffect(() => {
    if (!showPrompt) return;
    const onEsc = (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        e.stopPropagation();
        closePrompt();
      }
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [showPrompt]);

  return (
    <div
      className="section section3"
      role="button"
      aria-label="Section Three (Results)"
      tabIndex={0}
      onClick={handleClickRoot}
      onKeyDown={onKeyDownRoot}
    >
      {/* Clear-all button (top-right) appears only when both files are present */}
      {showTextBox && (
        <button
          type="button"
          className="file-clear"
          aria-label="Clear both files"
          title="Clear both files"
          onClick={(e) => {
            e.stopPropagation();
            onClearAll?.();
          }}
        >
          ×
        </button>
      )}

      {/* Intro (centered) when files not uploaded yet */}
      {!showTextBox && (
        <div className="section__content" onClick={(e) => e.stopPropagation()}>
          <h2>Comparison Results</h2>
          <p>Upload both files to view differences between your Followers and Following lists.</p>
        </div>
      )}

      {/* Scrollable results when files present */}
      {showTextBox && (
        <div
          className="results"
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
              {list.length ? (
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

      {/* Bottom controls (Switch / About) */}
      <SwitchBar onModeChange={setMode} />

      {/* Upload Required modal (restored & robust) */}
      {showPrompt && !showTextBox && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="s3-modal-title"
          onClick={(e) => {
            // Clicking the backdrop closes the modal
            e.stopPropagation();
            closePrompt();
          }}
        >
          <div
            className="modal__dialog"
            onClick={(e) => e.stopPropagation()} // keep clicks inside
          >
            <h3 id="s3-modal-title">Upload Required</h3>
            <p>
              Before proceeding, upload files into <strong>Section One</strong> (Following)
              and <strong>Section Two</strong> (Followers).
            </p>
            <div className="modal__actions">
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
        </div>
      )}
    </div>
  );
}
