import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";
import { Suites } from "./pages/Suites";
import { Cases } from "./pages/Cases";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId/suites" element={<Suites />} />
          <Route path="projects/:projectId/suites/:suiteId/cases" element={<Cases />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
