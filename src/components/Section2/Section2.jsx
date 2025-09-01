// src/components/Section2/Section2.jsx

import React, { useRef, useState, useCallback } from "react";
import "./Section2.scss";

export default function Section2({ onFileSelect }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const acceptList = ".html,.json";
  const openPicker = () => fileInputRef.current?.click();

  const isAllowed = (f) => {
    const name = (f?.name || "").toLowerCase();
    return name.endsWith(".html") || name.endsWith(".json");
  };

  const handleOneFile = useCallback(
    (list) => {
      const first = list && list[0];
      if (!first) return;
      if (!isAllowed(first)) {
        console.warn("Section 2 rejected file:", first.name);
        return;
      }
      setFile(first);
      onFileSelect?.(first);
    },
    [onFileSelect]
  );

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    onFileSelect?.(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onChange = (e) => handleOneFile(e.target.files);
  const onDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); };
  const onDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); };
  const onDrop = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); handleOneFile(e.dataTransfer.files); };
  const onKeyDown = (e) => { if (e.key === "Enter" || e.key === " ") openPicker(); };

  const formatSize = (bytes) => {
    if (bytes == null) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/1024/1024).toFixed(1)} MB`;
  };

  return (
    <div
      className={`section section2 ${isDragOver ? "is-dragover" : ""}`}
      role="button"
      tabIndex={0}
      aria-label="Choose or drop an HTML/JSON file for Section 2"
      onClick={openPicker}
      onKeyDown={onKeyDown}
      onDragOver={onDragOver}
      onDragEnter={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Clear (X) button — only visible when a file is present */}
      {file && (
        <button
          type="button"
          className="file-clear"
          aria-label="Clear selected file"
          title="Clear"
          onClick={clearFile}
        >
          ×
        </button>
      )}

      <div className="section__content" onClick={(e) => file && e.stopPropagation()}>
        {file ? (
          <div className="file-single" title={file.name}>
            <span className="file-single__icon">📂</span>
            <span className="file-single__name">{file.name}</span>
            <span className="file-single__size">{formatSize(file.size)}</span>
          </div>
        ) : (
          <>
            <h2>Section Two</h2>
            <p>Drag & drop files here, or click to browse</p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptList}
        style={{ display: "none" }}
        onChange={onChange}
      />
    </div>
  );
}
