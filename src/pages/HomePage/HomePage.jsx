// src/pages/HomePage/HomePage.jsx

import React from "react";
import "./HomePage.scss";
import Section1 from "../../components/Section1/Section1";
import Section2 from "../../components/Section2/Section2";
import Section3 from "../../components/Section3/Section3";

export default function HomePage() {
  return (
    <div className="homePage">
      <div className="sections-container">
        <Section1 />
        <Section2 />
        <Section3 />
      </div>
    </div>
  );
}
