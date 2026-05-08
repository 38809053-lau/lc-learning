import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StepNavigation } from './components/StepNavigation';
import HomePage from './pages/HomePage';
import ConflictPage from './pages/ConflictPage';
import RealityPage from './pages/RealityPage';
import SolutionPage from './pages/SolutionPage';
import RefinePage from './pages/RefinePage';
import ActionPage from './pages/ActionPage';
import ResultPage from './pages/ResultPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900">
        <StepNavigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/conflict" element={<ConflictPage />} />
          <Route path="/reality" element={<RealityPage />} />
          <Route path="/solution" element={<SolutionPage />} />
          <Route path="/refine" element={<RefinePage />} />
          <Route path="/action" element={<ActionPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </div>
    </Router>
  );
}
