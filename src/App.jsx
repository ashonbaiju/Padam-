import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import WatchPage from './pages/WatchPage';
import SearchPage from './pages/SearchPage';

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </AppProvider>
  );
}
