// src/components/Section3/Section3.jsx
import React, { useState } from "react";
import "./Section3.scss";
import SwitchBar from "../SwitchBar/SwitchBar";

export default function Section3({ showTextBox }) {
  const [showPrompt, setShowPrompt] = useState(false);

  const handleClick = () => {
    if (showPrompt) return;          // ignore clicks when modal is open
    if (!showTextBox) setShowPrompt(true);
  };

  const closePrompt = () => setShowPrompt(false);

  // Close on ESC too
  const onKeyDownRoot = (e) => {
    if ((e.key === "Escape" || e.key === "Esc") && showPrompt) {
      e.stopPropagation();
      closePrompt();
    }
    if ((e.key === "Enter" || e.key === " ") && !showPrompt) {
      handleClick();
    }
  };

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
          <h3>Comparison Results</h3>
          <p>
            Your results will appear here — for example, accounts you follow that don’t follow back,
            and accounts that follow you that you don’t follow back.
          </p>
        </div>
      )}

      <SwitchBar />

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
