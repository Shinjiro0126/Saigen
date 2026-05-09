import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";
import { Suites } from "./pages/Suites";
import { Cases } from "./pages/Cases";
import { Recorder } from "./pages/Recorder";
import { RunDetail } from "./pages/RunDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId/suites" element={<Suites />} />
          <Route path="projects/:projectId/suites/:suiteId/cases" element={<Cases />} />
          <Route path="cases/:caseId/record" element={<Recorder />} />
          <Route path="runs/:runId" element={<RunDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
