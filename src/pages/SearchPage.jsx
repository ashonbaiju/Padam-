import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Star, Film, ArrowLeft } from 'lucide-react';
import { tmdb, getPoster, formatRating } from '../services/tmdb';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieModal from '../components/MovieModal';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || '';

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    setMovies([]);
    setPage(1);
    const fetch = query
      ? tmdb.search(query)
      : type === 'trending'
      ? tmdb.trending()
      : tmdb.popular();

    fetch
      .then((res) => {
        setMovies(res.results || []);
        setTotalPages(res.total_pages || 1);
      })
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, [query, type]);

  const pageTitle = query
    ? `Results for "${query}"`
    : type === 'trending'
    ? '🔥 Trending'
    : type === 'mylist'
    ? '🔖 My List'
    : '🎬 Movies';

  return (
    <div className="min-h-screen bg-[#0a0a0a] page-enter">
      <Navbar />

      <div className="pt-24 px-4 md:px-10 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{pageTitle}</h1>
          {!loading && (
            <span className="text-white/30 text-sm">{movies.length} results</span>
          )}
        </div>

        {/* Search bar */}
        {query && (
          <form
            onSubmit={(e) => { e.preventDefault(); }}
            className="flex items-center gap-3 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 mb-8 max-w-xl"
          >
            <Search size={18} className="text-white/40" />
            <input
              type="text"
              defaultValue={query}
              placeholder="Search movies..."
              className="flex-1 bg-transparent text-white outline-none placeholder:text-white/30 text-sm"
              onChange={(e) => {
                const val = e.target.value;
                if (val) navigate(`/search?q=${encodeURIComponent(val)}`, { replace: true });
              }}
            />
          </form>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="skeleton rounded-xl aspect-[2/3]" />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Film size={52} className="text-white/15" />
            <p className="text-white/40 text-lg">No results found</p>
            <button onClick={() => navigate('/')} className="btn-red px-6 py-2 rounded-lg text-sm">
              Browse Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="group cursor-pointer rounded-xl overflow-hidden bg-zinc-900 hover:ring-2 hover:ring-[#E50914] transition-all shadow-lg"
              >
                <div className="relative aspect-[2/3] bg-zinc-800">
                  <img
                    src={getPoster(movie.poster_path, 'w342')}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.style.opacity = '0'; }}
                  />
                  {/* Rating overlay */}
                  {movie.vote_average > 0 && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded">
                      <Star size={9} fill="#f5c518" color="#f5c518" />
                      <span className="text-[10px] font-bold text-[#f5c518]">
                        {formatRating(movie.vote_average)}
                      </span>
                    </div>
                  )}
                  {/* Play overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Film size={20} color="white" />
                    </div>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-white text-xs font-semibold truncate">{movie.title}</p>
                  <p className="text-white/40 text-[11px] mt-0.5">
                    {movie.release_date?.slice(0, 4) || '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <MovieModal />
    </div>
  );
}
