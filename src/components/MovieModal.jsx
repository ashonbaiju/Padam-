import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Plus, Check, Star, Clock, Calendar, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { tmdb, getBackdrop, getPoster, getProfilePic, formatRuntime, formatRating, getTrailerKey } from '../services/tmdb';

export default function MovieModal() {
  const { isModalOpen, selectedMovie, closeModal, addToMyList, isInMyList } = useApp();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!selectedMovie?.id) { setDetails(null); setShowTrailer(false); return; }
    setLoading(true);
    setShowTrailer(false);
    tmdb.details(selectedMovie.id)
      .then(setDetails)
      .catch(() => setDetails(null))
      .finally(() => setLoading(false));
  }, [selectedMovie?.id]);

  if (!isModalOpen || !selectedMovie) return null;

  const movie = details || selectedMovie;
  const inList = isInMyList(selectedMovie.id);
  const trailerKey = details ? getTrailerKey(details.videos) : null;
  const cast = details?.credits?.cast?.slice(0, 8) || [];
  const similar = details?.similar?.results?.slice(0, 4) || [];
  const genres = details?.genres?.map((g) => g.name) || [];
  const runtime = formatRuntime(details?.runtime);
  const rating = formatRating(movie.vote_average);
  const year = (movie.release_date || '').slice(0, 4);
  const imdbId = details?.external_ids?.imdb_id;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center modal-overlay"
      style={{ backgroundColor: 'rgba(0,0,0,0.82)' }}
      onClick={closeModal}
    >
      <div
        className="relative bg-[#181818] rounded-t-2xl sm:rounded-2xl overflow-hidden w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide modal-content shadow-2xl sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: backdrop or trailer */}
        <div className="relative h-52 sm:h-72 md:h-80">
          {showTrailer && trailerKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
              title="Trailer"
              allow="autoplay; fullscreen"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
            />
          ) : (
            <>
              <img
                src={getBackdrop(movie.backdrop_path, 'w780')}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
              {/* Trailer play overlay */}
              {trailerKey && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="absolute inset-0 flex items-center justify-center group"
                >
                  <div className="w-14 h-14 rounded-full bg-black/60 border-2 border-white/40 flex items-center justify-center group-hover:bg-black/80 group-hover:border-white transition-all">
                    <Play size={22} fill="white" color="white" className="ml-1" />
                  </div>
                  <span className="absolute bottom-16 text-white/70 text-xs bg-black/60 px-2 py-1 rounded">
                    Watch Trailer
                  </span>
                </button>
              )}
            </>
          )}

          {/* Close */}
          <button
            id="modal-close"
            onClick={closeModal}
            className="absolute top-3 right-3 w-9 h-9 bg-[#181818]/90 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors z-10"
          >
            <X size={16} className="text-white" />
          </button>

          {/* Title + buttons */}
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-xl sm:text-2xl font-black text-white mb-2 drop-shadow-xl">
              {movie.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="modal-play"
                onClick={() => { closeModal(); navigate(`/watch/${selectedMovie.id}`); }}
                className="btn-play flex items-center gap-1.5 px-5 py-1.5 rounded-md font-bold text-sm"
              >
                <Play size={14} fill="black" /> Play
              </button>
              <button
                id="modal-list"
                onClick={() => addToMyList(selectedMovie.id)}
                className="w-9 h-9 rounded-full btn-icon flex items-center justify-center"
                title={inList ? 'Remove from list' : 'Add to list'}
              >
                {inList ? <Check size={14} /> : <Plus size={14} />}
              </button>
              <button
                onClick={() => { closeModal(); navigate(`/movie/${selectedMovie.id}`); }}
                className="w-9 h-9 rounded-full btn-icon flex items-center justify-center ml-auto"
                title="Full details"
              >
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 pt-4 pb-6">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            {movie.vote_average > 0 && (
              <span className="rating-badge">
                <Star size={11} fill="#f5c518" /> {rating}
              </span>
            )}
            {year && <span className="text-white/60 flex items-center gap-1"><Calendar size={12} />{year}</span>}
            {runtime && <span className="text-white/60 flex items-center gap-1"><Clock size={12} />{runtime}</span>}
            {imdbId && (
              <a
                href={`https://www.imdb.com/title/${imdbId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f5c518] font-bold text-xs border border-[#f5c518]/40 px-2 py-0.5 rounded hover:bg-[#f5c518]/10 transition-colors"
              >
                IMDB ↗
              </a>
            )}
          </div>

          {/* Genres */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {genres.map((g) => (
                <span key={g} className="text-xs text-white/70 bg-white/10 px-2.5 py-1 rounded-full">{g}</span>
              ))}
            </div>
          )}

          {/* Overview */}
          <p className="text-white/80 text-sm leading-relaxed mb-5">
            {loading ? (
              <><div className="skeleton h-3 mb-2 rounded" /><div className="skeleton h-3 mb-2 w-3/4 rounded" /></>
            ) : (movie.overview || 'No description available.')}
          </p>

          {/* Details sidebar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-5">
            {details?.director && (
              <div>
                <span className="text-white/40">Director: </span>
                <span className="text-white/80">{details.director}</span>
              </div>
            )}
            {details?.tagline && (
              <div className="sm:col-span-2">
                <span className="text-white/40 italic">"{details.tagline}"</span>
              </div>
            )}
          </div>

          {/* Cast */}
          {cast.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-bold text-sm mb-3">Cast</h3>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                {cast.map((actor) => (
                  <div key={actor.id} className="shrink-0 text-center cast-card w-16">
                    <div className="w-14 h-14 mx-auto rounded-full overflow-hidden bg-zinc-800 mb-1.5">
                      {actor.profile_path ? (
                        <img
                          src={getProfilePic(actor.profile_path)}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30 text-lg font-bold">
                          {actor.name?.[0]}
                        </div>
                      )}
                    </div>
                    <p className="text-white text-[10px] font-semibold leading-tight truncate">{actor.name}</p>
                    <p className="text-white/40 text-[9px] truncate">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Movies */}
          {similar.length > 0 && (
            <div>
              <h3 className="text-white font-bold text-sm mb-3">More Like This</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {similar.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => { closeModal(); navigate(`/movie/${m.id}`); }}
                    className="bg-zinc-800/80 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#E50914] transition-all"
                  >
                    <img
                      src={getPoster(m.poster_path, 'w185')}
                      alt={m.title}
                      className="w-full h-24 object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="p-2">
                      <p className="text-white text-[11px] font-semibold truncate">{m.title}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={9} fill="#f5c518" color="#f5c518" />
                        <span className="text-[10px] text-[#f5c518] font-bold">{formatRating(m.vote_average)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
