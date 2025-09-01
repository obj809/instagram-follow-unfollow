// src/components/Section3/Section3.jsx

import React, { useState } from "react";
import "./Section3.scss";
import SwitchBar from "../SwitchBar/SwitchBar";

export default function Section3({ showTextBox }) {
  const [showPrompt, setShowPrompt] = useState(false);

  const handleClick = () => {
    if (!showTextBox) setShowPrompt(true);
  };

  const closePrompt = () => setShowPrompt(false);

  return (
    <div
      className="section section3"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Section Three"
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
    >
      {!showTextBox && (
        <div className="section__content" onClick={(e) => e.stopPropagation()}>
          <h2>Section Three</h2>
          <p>
            This area will activate once both Section One and Section Two have a
            file uploaded.
          </p>
        </div>
      )}

      {showTextBox && (
        <div
          className="text-box"
          role="region"
          aria-label="Section Three text box"
          onClick={(e) => e.stopPropagation()}
        >
          <h3>Ready to Proceed</h3>
          <p>
            Both files are uploaded. You can place your next-step content here
            (e.g., summary, controls, or actions).
          </p>
        </div>
      )}

      {/* Always sits in bottom 15% */}
      <SwitchBar />

      {showPrompt && !showTextBox && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="s3-modal-title"
          onClick={closePrompt}
        >
          <div className="modal__dialog" onClick={(e) => e.stopPropagation()}>
            <h3 id="s3-modal-title">Upload Required</h3>
            <p>
              Please upload a file into <strong>Section One</strong> and{" "}
              <strong>Section Two</strong> first.
            </p>
            <button
              className="modal__close"
              onClick={closePrompt}
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
