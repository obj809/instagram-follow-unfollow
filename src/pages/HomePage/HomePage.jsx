// src/pages/HomePage/HomePage.jsx

import React, { useState } from "react";
import "./HomePage.scss";

import Section1 from "../../components/Section1/Section1";
import Section2 from "../../components/Section2/Section2";
import Section3 from "../../components/Section3/Section3";

export default function HomePage() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  return (
    <div className="homePage">
      <Section1 onFileSelect={setFile1} />
      <Section2 onFileSelect={setFile2} />
      <Section3 showTextBox={!!(file1 && file2)} />
    </div>
  );
}
