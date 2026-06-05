import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, ChevronDown, X, Bookmark, Home, Tv, Film, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { tmdb, getPoster } from '../services/tmdb';

const NAV_LINKS = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Movies', icon: Film, path: '/search?type=movie' },
  { label: 'TV Shows', icon: Tv, path: '/search?type=tv' },
  { label: 'Trending', icon: TrendingUp, path: '/search?type=trending' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const {
    isSearchOpen, setIsSearchOpen,
    searchQuery, setSearchQuery,
    searchResults, setSearchResults,
    setSearchLoading,
    myList,
  } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchRef.current) searchRef.current.focus();
  }, [isSearchOpen]);

  // Live TMDB search with debounce
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setSearchLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await tmdb.search(searchQuery);
        setSearchResults(res.results?.slice(0, 8) || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const goToMovie = (id) => {
    closeSearch();
    navigate(`/movie/${id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      closeSearch();
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-12 py-3 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'nav-solid' : 'nav-gradient'
        }`}
      >
        {/* Logo + Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          <div className="padam-logo" onClick={() => navigate('/')}>PADAM</div>

          <ul className="hidden lg:flex items-center gap-5 text-sm">
            {NAV_LINKS.map(({ label, path }) => (
              <li
                key={label}
                onClick={() => navigate(path)}
                className="text-white/70 hover:text-white cursor-pointer transition-colors duration-200 font-medium"
              >
                {label}
              </li>
            ))}
          </ul>

          {/* Mobile browse toggle */}
          <button
            className="lg:hidden flex items-center gap-1 text-sm text-white"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            Browse
            <ChevronDown size={13} className={`transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search */}
          {isSearchOpen ? (
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 border border-white/60 bg-black/70 backdrop-blur px-3 py-1.5 rounded animate-fade-in"
            >
              <Search size={14} className="text-white/70 shrink-0" />
              <input
                ref={searchRef}
                id="navbar-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Movies, actors, genres..."
                className="bg-transparent text-white text-sm outline-none w-36 md:w-52 placeholder:text-white/40"
              />
              <button type="button" onClick={closeSearch} className="text-white/50 hover:text-white">
                <X size={14} />
              </button>
            </form>
          ) : (
            <button
              id="navbar-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <Search size={19} />
            </button>
          )}

          {/* My List badge */}
          <button
            onClick={() => navigate('/search?type=mylist')}
            className="hidden md:flex items-center gap-1 text-white/70 hover:text-white transition-colors relative"
          >
            <Bookmark size={18} />
            {myList.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#E50914] rounded-full text-[9px] font-bold flex items-center justify-center">
                {myList.length}
              </span>
            )}
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              id="navbar-profile-btn"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-1 group"
            >
              <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center text-white font-bold text-sm">
                G
              </div>
              <ChevronDown
                size={13}
                className={`text-white transition-transform ${profileOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-11 w-52 glass rounded-lg shadow-2xl py-2 animate-fade-in">
                {['Guest', 'Add Profile'].map((name) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <div className="w-7 h-7 rounded bg-[#E50914] flex items-center justify-center text-white font-bold text-xs">
                      {name[0]}
                    </div>
                    <span className="text-sm text-white">{name}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 mt-1 pt-1">
                  <div className="px-4 py-2.5 hover:bg-white/10 cursor-pointer text-sm text-white/60">Settings</div>
                  <div className="px-4 py-2.5 hover:bg-white/10 cursor-pointer text-sm text-[#E50914] font-medium">Sign Out</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed top-14 left-0 right-0 z-50 glass py-1 animate-fade-in lg:hidden shadow-xl">
          {NAV_LINKS.map(({ label, path, icon: Icon }) => (
            <div
              key={label}
              onClick={() => { navigate(path); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 px-5 py-3 text-sm text-white hover:bg-white/10 cursor-pointer transition-colors"
            >
              <Icon size={16} className="text-white/60" />
              {label}
            </div>
          ))}
        </div>
      )}

      {/* Search results dropdown */}
      {isSearchOpen && searchQuery && searchResults.length > 0 && (
        <div className="fixed top-14 right-4 md:right-12 z-50 w-full max-w-sm glass rounded-xl shadow-2xl overflow-hidden animate-fade-in max-h-[75vh] overflow-y-auto scrollbar-hide">
          <div className="px-4 py-2.5 border-b border-white/10 text-xs text-white/50 font-semibold uppercase tracking-wider">
            Results
          </div>
          {searchResults.map((movie) => (
            <div
              key={movie.id}
              onClick={() => goToMovie(movie.id)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/8 cursor-pointer transition-colors border-b border-white/5 last:border-0"
            >
              <img
                src={getPoster(movie.poster_path, 'w92')}
                alt={movie.title || movie.name}
                className="w-10 h-14 object-cover rounded-md bg-zinc-800 shrink-0"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{movie.title || movie.name}</p>
                <p className="text-xs text-white/50 mt-0.5">
                  {movie.release_date?.slice(0, 4) || '—'}
                  {movie.vote_average > 0 && (
                    <span className="ml-2 text-[#f5c518] font-medium">★ {movie.vote_average.toFixed(1)}</span>
                  )}
                </p>
              </div>
            </div>
          ))}
          <div
            onClick={() => { navigate(`/search?q=${encodeURIComponent(searchQuery)}`); closeSearch(); }}
            className="px-4 py-3 text-sm text-[#E50914] font-semibold hover:bg-white/8 cursor-pointer transition-colors text-center"
          >
            See all results for "{searchQuery}" →
          </div>
        </div>
      )}

      {/* Backdrop to close dropdowns */}
      {(profileOpen || mobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setProfileOpen(false); setMobileMenuOpen(false); }}
        />
      )}
    </>
  );
}
