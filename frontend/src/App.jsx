import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Wizard from './components/Wizard';
import MirrorPage from './components/MirrorPage';
import SuccessPage from './components/SuccessPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/start" element={<Wizard />} />
        <Route path="/temp/:slug" element={<MirrorPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/" element={<Navigate to="/start" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
