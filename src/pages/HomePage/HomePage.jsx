// src/pages/HomePage/HomePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./HomePage.scss";

import Section1 from "../../components/Section1/Section1";
import Section2 from "../../components/Section2/Section2";
import Section3 from "../../components/Section3/Section3";

import { parseInstagramFile, compareSets } from "../../utils/igParse";

export default function HomePage() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const [followingSet, setFollowingSet] = useState(new Set());
  const [followersSet, setFollowersSet] = useState(new Set());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [clearTick, setClearTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setError("");
      if (!file1 && !file2) {
        if (!cancelled) {
          setFollowingSet(new Set());
          setFollowersSet(new Set());
        }
        return;
      }
      setLoading(true);
      try {
        if (file1) {
          const s1 = await parseInstagramFile(file1);
          if (!cancelled) setFollowingSet(s1);
        } else if (!cancelled) {
          setFollowingSet(new Set());
        }

        if (file2) {
          const s2 = await parseInstagramFile(file2);
          if (!cancelled) setFollowersSet(s2);
        } else if (!cancelled) {
          setFollowersSet(new Set());
        }
      } catch {
        if (!cancelled) setError("Failed to parse one or both files. Please upload valid Instagram exports (JSON/HTML).");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [file1, file2]);

  const results = useMemo(
    () => compareSets(followingSet, followersSet),
    [followingSet, followersSet]
  );

  const showTextBox = Boolean(followingSet.size && followersSet.size);

  const handleClearAll = () => {
    setFile1(null);
    setFile2(null);
    setClearTick((t) => t + 1);
  };

  return (
    <div className="homePage">
      <Section1 onFileSelect={setFile1} clearTrigger={clearTick} />
      <Section2 onFileSelect={setFile2} clearTrigger={clearTick} />
      <Section3
        showTextBox={showTextBox}
        loading={loading}
        error={error}
        results={results}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
