import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Play, Plus, Check, Star, Clock, Calendar,
  ExternalLink, ChevronRight, Film,
} from 'lucide-react';
import {
  tmdb, getBackdrop, getPoster, getProfilePic,
  formatRuntime, formatRating, getTrailerKey,
} from '../services/tmdb';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieModal from '../components/MovieModal';

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToMyList, isInMyList } = useApp();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setShowTrailer(false);
    tmdb.details(id)
      .then((data) => {
        setMovie(data);
        setTrailerKey(getTrailerKey(data.videos));
      })
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#E50914] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <Film size={48} className="text-white/20" />
        <p className="text-white/50">Movie not found</p>
        <button onClick={() => navigate('/')} className="btn-red px-6 py-2 rounded-lg text-sm">Back to Home</button>
      </div>
    );
  }

  const inList = isInMyList(movie.id);
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const crew = movie.credits?.crew || [];
  const directors = crew.filter((c) => c.job === 'Director').map((c) => c.name);
  const writers = crew.filter((c) => ['Writer', 'Screenplay', 'Story'].includes(c.job)).slice(0, 2).map((c) => c.name);
  const similar = movie.similar?.results?.slice(0, 6) || [];
  const genres = movie.genres?.map((g) => g.name) || [];
  const imdbId = movie.external_ids?.imdb_id;
  const runtime = formatRuntime(movie.runtime);
  const rating = formatRating(movie.vote_average);
  const year = movie.release_date?.slice(0, 4);
  const budget = movie.budget > 0 ? `$${(movie.budget / 1e6).toFixed(0)}M` : null;
  const revenue = movie.revenue > 0 ? `$${(movie.revenue / 1e6).toFixed(0)}M` : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] page-enter">
      <Navbar />

      {/* Hero Backdrop */}
      <div className="relative w-full h-[55vh] md:h-[70vh] max-h-[780px] overflow-hidden">
        {showTrailer && trailerKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1&modestbranding=1&rel=0`}
            title="Trailer"
            allow="autoplay; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
          />
        ) : (
          <>
            <img
              src={getBackdrop(movie.backdrop_path)}
              alt={movie.title}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/30" />
          </>
        )}

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 md:left-10 z-20 flex items-center gap-1.5 text-white/70 hover:text-white transition-colors bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm"
        >
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-10 -mt-32 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          {/* Poster */}
          <div className="shrink-0 w-40 sm:w-48 md:w-56 mx-auto md:mx-0">
            <img
              src={getPoster(movie.poster_path, 'w342')}
              alt={movie.title}
              className="w-full rounded-xl shadow-2xl border border-white/10"
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-white/40 italic text-base mb-4">"{movie.tagline}"</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {movie.vote_average > 0 && (
                <span className="rating-badge text-base px-3 py-1">
                  <Star size={14} fill="#f5c518" /> {rating}
                  <span className="text-white/30 text-xs ml-1 font-normal">
                    ({movie.vote_count?.toLocaleString()} votes)
                  </span>
                </span>
              )}
              {year && <span className="text-white/60 flex items-center gap-1 text-sm"><Calendar size={13} />{year}</span>}
              {runtime && <span className="text-white/60 flex items-center gap-1 text-sm"><Clock size={13} />{runtime}</span>}
              {imdbId && (
                <a
                  href={`https://www.imdb.com/title/${imdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f5c518] font-bold text-sm border border-[#f5c518]/50 px-2.5 py-1 rounded-md hover:bg-[#f5c518]/10 transition-colors flex items-center gap-1"
                >
                  IMDB <ExternalLink size={11} />
                </a>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-5">
              {genres.map((g) => (
                <span key={g} className="text-sm text-white/80 bg-white/10 hover:bg-white/15 px-3 py-1 rounded-full cursor-pointer transition-colors">
                  {g}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                id="movie-play-btn"
                onClick={() => navigate(`/watch/${movie.id}`)}
                className="btn-play flex items-center gap-2 px-7 py-2.5 rounded-lg text-base"
              >
                <Play size={18} fill="black" /> Play Now
              </button>

              {trailerKey && (
                <button
                  id="movie-trailer-btn"
                  onClick={() => setShowTrailer((v) => !v)}
                  className="btn-info flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm"
                >
                  <Film size={16} /> {showTrailer ? 'Hide Trailer' : 'Watch Trailer'}
                </button>
              )}

              <button
                id="movie-list-btn"
                onClick={() => addToMyList(movie.id)}
                className={`btn-icon flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm ${inList ? 'bg-white/15' : ''}`}
              >
                {inList ? <Check size={16} /> : <Plus size={16} />}
                {inList ? 'In My List' : 'My List'}
              </button>
            </div>

            {/* Overview */}
            <p className="text-white/80 text-base leading-relaxed mb-6 max-w-2xl">
              {movie.overview || 'No description available.'}
            </p>

            {/* Crew + Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {directors.length > 0 && (
                <div>
                  <p className="text-white/35 mb-1">Director</p>
                  <p className="text-white/80 font-medium">{directors.join(', ')}</p>
                </div>
              )}
              {writers.length > 0 && (
                <div>
                  <p className="text-white/35 mb-1">Writer</p>
                  <p className="text-white/80 font-medium">{writers.join(', ')}</p>
                </div>
              )}
              {movie.original_language && (
                <div>
                  <p className="text-white/35 mb-1">Language</p>
                  <p className="text-white/80 font-medium uppercase">{movie.original_language}</p>
                </div>
              )}
              {movie.status && (
                <div>
                  <p className="text-white/35 mb-1">Status</p>
                  <p className="text-white/80 font-medium">{movie.status}</p>
                </div>
              )}
              {budget && (
                <div>
                  <p className="text-white/35 mb-1">Budget</p>
                  <p className="text-white/80 font-medium">{budget}</p>
                </div>
              )}
              {revenue && (
                <div>
                  <p className="text-white/35 mb-1">Box Office</p>
                  <p className="text-white/80 font-medium">{revenue}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trailer Section */}
        {trailerKey && !showTrailer && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Film size={18} className="text-[#E50914]" /> Official Trailer
            </h2>
            <div className="relative rounded-2xl overflow-hidden aspect-video max-w-3xl bg-black shadow-2xl border border-white/10">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?controls=1&modestbranding=1&rel=0`}
                title={`${movie.title} Trailer`}
                allow="fullscreen"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
              />
            </div>
          </div>
        )}

        {/* Cast Section */}
        {cast.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              Cast
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {cast.map((actor) => (
                <div key={actor.id} className="cast-card text-center group">
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-zinc-800 mb-2 shadow-lg">
                    {actor.profile_path ? (
                      <img
                        src={getProfilePic(actor.profile_path, 'w185')}
                        alt={actor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/25 text-2xl font-black">
                        {actor.name?.[0]}
                      </div>
                    )}
                  </div>
                  <p className="text-white text-xs font-semibold truncate">{actor.name}</p>
                  <p className="text-white/40 text-[10px] truncate mt-0.5">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-white mb-5">More Like This</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {similar.map((m) => (
                <div
                  key={m.id}
                  onClick={() => navigate(`/movie/${m.id}`)}
                  className="group cursor-pointer rounded-xl overflow-hidden bg-zinc-900 hover:ring-2 hover:ring-[#E50914] transition-all shadow-lg"
                >
                  <div className="relative aspect-[2/3] bg-zinc-800">
                    <img
                      src={getPoster(m.poster_path, 'w185')}
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <Play size={20} fill="white" color="white" />
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-white text-xs font-semibold truncate">{m.title}</p>
                    {m.vote_average > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={9} fill="#f5c518" color="#f5c518" />
                        <span className="text-[10px] text-[#f5c518] font-bold">{formatRating(m.vote_average)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <MovieModal />
    </div>
  );
}
