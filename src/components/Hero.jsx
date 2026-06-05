import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Star, Calendar, Clock } from 'lucide-react';
import { tmdb, getBackdrop, formatRating, formatRuntime } from '../services/tmdb';

const GENRE_MAP = {
  28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',
  99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',
  27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Sci-Fi',
  53:'Thriller',10752:'War',37:'Western',
};

export default function Hero() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    tmdb.trending().then((res) => {
      setMovies(res.results?.slice(0, 6) || []);
    }).catch(() => {});
  }, []);

  // Auto-advance with smooth cross-fade
  useEffect(() => {
    if (movies.length < 2) return;
    const t = setInterval(() => {
      const next = (currentIndex + 1) % movies.length;
      setNextIndex(next);
      setTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(next);
        setTransitioning(false);
      }, 800);
    }, 7000);
    return () => clearInterval(t);
  }, [movies.length, currentIndex]);

  const goTo = (i) => {
    if (i === currentIndex) return;
    setNextIndex(i);
    setTransitioning(true);
    setTimeout(() => { setCurrentIndex(i); setTransitioning(false); }, 800);
  };

  const movie = movies[currentIndex];
  const nextMovie = movies[nextIndex];
  if (!movie) return <div className="h-[85vh] bg-[#0a0a0a]" />;

  const rating = formatRating(movie.vote_average);
  const year = movie.release_date?.slice(0, 4);
  const genres = movie.genre_ids?.slice(0, 3).map((id) => GENRE_MAP[id]).filter(Boolean) || [];
  const shortDesc = movie.overview?.slice(0, 180) + (movie.overview?.length > 180 ? '…' : '');

  return (
    <div className="relative w-full h-[88vh] min-h-[600px] max-h-[960px] overflow-hidden">

      {/* Current backdrop */}
      <div className={`absolute inset-0 transition-opacity duration-800 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
        style={{ transitionDuration: '800ms' }}>
        <img
          src={getBackdrop(movie.backdrop_path)}
          alt={movie.title}
          className="w-full h-full object-cover object-top scale-105 transition-transform duration-[8000ms] ease-out"
          style={{ transform: 'scale(1.03)' }}
        />
      </div>

      {/* Next backdrop (pre-loaded, fades in during transition) */}
      {nextMovie && (
        <div className={`absolute inset-0 transition-opacity duration-800 ${transitioning ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDuration: '800ms' }}>
          <img
            src={getBackdrop(nextMovie.backdrop_path)}
            alt={nextMovie.title}
            className="w-full h-full object-cover object-top"
          />
        </div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/20" />

      {/* Animated side accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#E50914] to-transparent opacity-60" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-12 md:px-20 pb-24 md:pb-32">

        {/* Trending badge */}
        <div className="flex items-center gap-3 mb-4 animate-fade-in">
          <div className="badge-pulse w-2 h-2 rounded-full bg-[#E50914]" />
          <span className="text-[11px] font-bold tracking-[4px] text-[#E50914] uppercase">
            Trending Now
          </span>
          <span className="text-white/30 text-xs">#{currentIndex + 1} This Week</span>
        </div>

        {/* Title */}
        <h1 className="hero-title-glow text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 leading-[1.05] max-w-3xl animate-slide-up">
          {movie.title}
        </h1>

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4 animate-fade-in">
          {movie.vote_average > 0 && (
            <span className="rating-badge px-3 py-1 text-sm">
              <Star size={12} fill="#f5c518" /> {rating}
            </span>
          )}
          {year && (
            <span className="flex items-center gap-1.5 text-white/60 text-sm bg-white/8 px-3 py-1 rounded-full">
              <Calendar size={12} /> {year}
            </span>
          )}
          {genres.map((g) => (
            <span key={g} className="text-white/60 text-xs border border-white/20 px-3 py-1 rounded-full hover:border-[#E50914] hover:text-[#E50914] transition-colors cursor-pointer">
              {g}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-white/75 text-sm md:text-base max-w-lg mb-7 leading-relaxed animate-fade-in line-clamp-3 hidden sm:block">
          {shortDesc}
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3 animate-fade-in">
          <button
            id="hero-play-btn"
            onClick={() => navigate(`/watch/${movie.id}`)}
            className="btn-play group flex items-center gap-2.5 px-7 md:px-9 py-3 md:py-3.5 rounded-xl text-sm md:text-base font-bold shadow-lg shadow-white/20"
          >
            <Play size={18} fill="black" className="group-hover:scale-110 transition-transform" />
            Play Now
          </button>
          <button
            id="hero-info-btn"
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="btn-info group flex items-center gap-2.5 px-6 md:px-8 py-3 md:py-3.5 rounded-xl text-sm md:text-base font-bold"
          >
            <Info size={17} className="group-hover:rotate-12 transition-transform" />
            More Info
          </button>
        </div>

        {/* Slide indicators */}
        <div className="flex items-center gap-2 mt-8">
          {movies.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-500 overflow-hidden"
              style={{
                width: i === currentIndex ? 32 : 6,
                height: 6,
                background: i === currentIndex
                  ? '#E50914'
                  : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Right-side thumbnail strip (visible on large screens) */}
      <div className="hidden xl:flex absolute right-10 bottom-32 flex-col gap-2 z-10">
        {movies.slice(0, 4).map((m, i) => (
          <button
            key={m.id}
            onClick={() => goTo(i)}
            className={`relative w-28 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
              i === currentIndex
                ? 'ring-2 ring-[#E50914] scale-105'
                : 'opacity-50 hover:opacity-80 hover:scale-102'
            }`}
          >
            <img
              src={getBackdrop(m.backdrop_path, 'w300')}
              alt={m.title}
              className="w-full h-full object-cover"
            />
            {i === currentIndex && (
              <div className="absolute inset-0 bg-[#E50914]/20" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
