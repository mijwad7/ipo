import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Wizard from './components/Wizard';
import MirrorPage from './components/MirrorPage';
import SuccessPage from './components/SuccessPage';
import ModernPreview from './components/ModernPreview';
import TraditionalPreview from './components/TraditionalPreview';
import BoldPreview from './components/BoldPreview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/start" element={<Wizard />} />
        <Route path="/temp/:slug/:template" element={<MirrorPage />} />
        <Route path="/temp/:slug" element={<MirrorPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/preview/modern" element={<ModernPreview />} />
        <Route path="/preview/traditional" element={<TraditionalPreview />} />
        <Route path="/preview/bold" element={<BoldPreview />} />
        <Route path="/" element={<Navigate to="/start" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
