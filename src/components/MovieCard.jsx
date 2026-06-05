import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Star, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPoster, formatRating } from '../services/tmdb';

export default function MovieCard({ movie, rank }) {
  const { addToMyList, isInMyList } = useApp();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [ripples, setRipples] = useState([]);
  const cardRef = useRef(null);

  const inList = isInMyList(movie.id);
  const title = movie.title || movie.name || 'Untitled';
  const year = (movie.release_date || movie.first_air_date || '').slice(0, 4);
  const rating = formatRating(movie.vote_average);
  const posterUrl = getPoster(movie.poster_path, 'w342');

  // Ripple effect on click
  const handleClick = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left - 30;
      const y = e.clientY - rect.top - 30;
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
    }
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div
      ref={cardRef}
      className="relative shrink-0 cursor-pointer"
      style={{ width: 160, minWidth: 160 }}
    >
      {/* Big rank number behind card */}
      {rank !== undefined && (
        <div
          className="absolute -left-4 bottom-0 z-0 font-black select-none pointer-events-none leading-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: '2px rgba(255,255,255,0.18)',
            fontSize: '76px',
          }}
        >
          {String(rank).padStart(2, '0')}
        </div>
      )}

      {/* Card */}
      <div
        className="movie-card card-sheen relative z-10 rounded-xl overflow-hidden bg-[#1c1c1c] shadow-lg"
        onClick={handleClick}
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {!imgError ? (
            <img
              src={posterUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex flex-col items-center justify-center gap-2 p-3">
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white/30 text-lg font-black">
                {title[0]}
              </div>
              <p className="text-white/25 text-[10px] text-center leading-tight">{title}</p>
            </div>
          )}

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

          {/* TOP: rating badge */}
          {movie.vote_average > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/75 backdrop-blur-sm rounded-md px-1.5 py-0.5 z-10">
              <Star size={9} fill="#f5c518" color="#f5c518" />
              <span className="text-[10px] font-bold text-[#f5c518]">{rating}</span>
            </div>
          )}

          {/* BOTTOM: slide-up info panel */}
          <div className="card-info-panel absolute bottom-0 left-0 right-0 px-3 pt-6 pb-3 bg-gradient-to-t from-black via-black/80 to-transparent">
            {/* Play button — big and centered */}
            <div className="flex justify-center mb-2">
              <button
                id={`card-play-${movie.id}`}
                onClick={(e) => { e.stopPropagation(); navigate(`/watch/${movie.id}`); }}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 hover:bg-[#E50914] hover:text-white transition-all duration-200 group/play"
              >
                <Play size={16} fill="black" color="black" className="group-hover/play:fill-white group-hover/play:text-white ml-0.5" />
              </button>
            </div>

            {/* Title */}
            <p className="text-white font-bold text-xs text-center truncate mb-1.5">{title}</p>

            {/* Action row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {year && <span className="text-white/50 text-[10px]">{year}</span>}
                {movie.vote_average > 0 && (
                  <span className="text-[#f5c518] text-[10px] font-bold ml-1">★ {rating}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  id={`card-list-${movie.id}`}
                  onClick={(e) => { e.stopPropagation(); addToMyList(movie.id); }}
                  className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center text-white hover:border-white hover:bg-white/10 transition-all"
                >
                  {inList ? <Check size={10} /> : <Plus size={10} />}
                </button>
                <button
                  id={`card-info-${movie.id}`}
                  onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie.id}`); }}
                  className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center text-white hover:border-white hover:bg-white/10 transition-all"
                >
                  <Info size={10} />
                </button>
              </div>
            </div>
          </div>

          {/* Ripple effects */}
          {ripples.map(({ id, x, y }) => (
            <span
              key={id}
              className="ripple-effect"
              style={{ left: x, top: y }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
