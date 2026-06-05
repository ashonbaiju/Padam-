import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // ── Watchlist (localStorage persisted) ───────────────────────────
  const [myList, setMyList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('streamflix_watchlist') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('streamflix_watchlist', JSON.stringify(myList));
  }, [myList]);

  const addToMyList = useCallback((movieId) => {
    setMyList((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    );
  }, []);

  const isInMyList = useCallback((movieId) => myList.includes(movieId), [myList]);

  // ── Profile ───────────────────────────────────────────────────────
  const [currentProfile] = useState({ name: 'Guest', color: '#E50914' });

  // ── Search ────────────────────────────────────────────────────────
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // ── Movie Modal (quick preview) ───────────────────────────────────
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback((movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedMovie(null);
    document.body.style.overflow = '';
  }, []);

  return (
    <AppContext.Provider
      value={{
        myList,
        addToMyList,
        isInMyList,
        currentProfile,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        searchLoading,
        setSearchLoading,
        selectedMovie,
        isModalOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
