import { Routes, Route } from 'react-router-dom';
import Tess from './pages/Tess';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/tes" element={<Tess />} />

      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
