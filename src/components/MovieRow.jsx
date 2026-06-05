import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';

export default function MovieRow({ title, fetchFn, showRank = false }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const rowRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchFn()
      .then((res) => setMovies(res.results || []))
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, []);

  const checkScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 700, behavior: 'smooth' });
    setTimeout(checkScroll, 450);
  };

  return (
    <section className="relative px-4 md:px-10 py-4 group/row">
      {/* Row header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="row-title text-lg md:text-xl font-black text-white tracking-tight">
            {title}
          </h2>
        </div>
        <button
          onClick={() => navigate('/search?type=all')}
          className="text-xs text-white/40 hover:text-[#E50914] transition-colors font-semibold flex items-center gap-1 group/see"
        >
          See All
          <ChevronRight size={13} className="group-hover/see:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Scroll wrapper */}
      <div className="relative">
        {/* Left arrow + fade */}
        <div
          className={`absolute left-0 top-0 bottom-4 z-20 flex items-center transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <div className="absolute inset-y-0 left-0 w-20 row-fade-left pointer-events-none" />
          <button
            onClick={() => scroll(-1)}
            className="relative z-10 w-10 h-10 ml-1 bg-black/80 hover:bg-[#E50914] border border-white/10 hover:border-[#E50914] rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-200 hover:scale-110 opacity-0 group-hover/row:opacity-100"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Right arrow + fade */}
        <div
          className={`absolute right-0 top-0 bottom-4 z-20 flex items-center transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <div className="absolute inset-y-0 right-0 w-20 row-fade-right pointer-events-none" />
          <button
            onClick={() => scroll(1)}
            className="relative z-10 w-10 h-10 mr-1 bg-black/80 hover:bg-[#E50914] border border-white/10 hover:border-[#E50914] rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-200 hover:scale-110 opacity-0 group-hover/row:opacity-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Cards */}
        <div
          ref={rowRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-6 pt-2 px-1"
        >
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton shrink-0 rounded-xl"
                  style={{ width: 160, height: 240 }}
                />
              ))
            : movies.map((movie, i) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  rank={showRank ? i + 1 : undefined}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
