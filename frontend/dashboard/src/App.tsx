// src/App.tsx
import React from "react";
import { HealthOverview } from "./components/HealthOverview";
import { RequestTable } from "./components/RequestTable";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <header style={{ marginBottom: "1rem" }}>
        <div className="app-title">AI HealthGuard Dashboard</div>
        <div className="app-subtitle">
          Live view of your model&apos;s health across factuality, relevance, coherence, safety,
          latency, and calibration.
        </div>
      </header>

      <HealthOverview />
      <RequestTable />
    </div>
  );
};

export default App;
