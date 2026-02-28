import { Routes, Route } from 'react-router-dom';
import Home from './pages/anime/Home';
import AnimeDetail from './pages/anime/AnimeDetail';
import EpisodePlayer from './pages/anime/EpisodePlayer';
import Genre from './pages/anime/Genre';
import Story from './pages/anime/Story';
import Status from './pages/anime/Status';
import More from './pages/anime/More';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageAnime from './pages/admin/ManageAnime';
import ManageReelsAnime from './pages/admin/ManageReelsAnime';
import Tess from './pages/Tess';

function App() {
  return (
    <Routes>
      <Route path="/tes" element={<Tess />} />



      {/* ── Anime Routes ──────────────── */}
      <Route path="/" element={<Home />} />
      <Route path="/anime/:id" element={<AnimeDetail />} />
      <Route path="/anime/:id/episode/:episodeNumber" element={<EpisodePlayer />} />
      <Route path="/anime/story" element={<Story />} />
      <Route path="/anime/genre" element={<Genre />} />
      <Route path="/genre/:genreName" element={<Genre />} />
      <Route path="/anime/status" element={<Status />} />
      <Route path="/anime/more" element={<More />} />

      {/* ── Admin Routes ──────────────── */}
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/manage-anime" element={<ManageAnime />} />
      <Route path="/dashboard/manage-reels" element={<ManageReelsAnime />} />
    </Routes>
  );
}

export default App;
