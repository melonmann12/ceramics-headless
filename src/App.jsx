import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PDP from './pages/PDP';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<PDP />} />
    </Routes>
  );
}

export default App;
