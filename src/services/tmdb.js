// TMDB API Service — direct calls to api.themoviedb.org (no backend needed)
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '8265bd1679663a7ea12ac168da84d2e8';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p';

// Image helpers
export const getPoster = (path, size = 'w342') =>
  path ? `${IMG_BASE}/${size}${path}` : '/placeholder-poster.jpg';

export const getBackdrop = (path, size = 'w1280') =>
  path ? `${IMG_BASE}/${size}${path}` : '/placeholder-backdrop.jpg';

export const getProfilePic = (path, size = 'w185') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

// Core fetch wrapper
async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
}

// ── Movies ────────────────────────────────────────────────────────────────────
export const tmdb = {
  // Trending this week
  trending: (page = 1) =>
    tmdbFetch('/trending/movie/week', { page }),

  // Now playing in theatres
  nowPlaying: (page = 1) =>
    tmdbFetch('/movie/now_playing', { page }),

  // Top rated all time
  topRated: (page = 1) =>
    tmdbFetch('/movie/top_rated', { page }),

  // Popular right now
  popular: (page = 1) =>
    tmdbFetch('/movie/popular', { page }),

  // Movies by genre ID
  byGenre: (genreId, page = 1) =>
    tmdbFetch('/discover/movie', { with_genres: genreId, sort_by: 'popularity.desc', page }),

  // Single movie details (includes imdb_id, runtime, tagline, genres)
  details: (id) =>
    tmdbFetch(`/movie/${id}`, { append_to_response: 'credits,videos,similar,external_ids' }),

  // Cast & crew
  credits: (id) =>
    tmdbFetch(`/movie/${id}/credits`),

  // YouTube trailers
  videos: (id) =>
    tmdbFetch(`/movie/${id}/videos`),

  // Similar movies
  similar: (id, page = 1) =>
    tmdbFetch(`/movie/${id}/similar`, { page }),

  // Search movies
  search: (query, page = 1) =>
    tmdbFetch('/search/movie', { query, page }),

  // Multi search (movies + TV + people)
  searchMulti: (query) =>
    tmdbFetch('/search/multi', { query }),

  // Genre list
  genres: () =>
    tmdbFetch('/genre/movie/list'),
};

// TMDB Genre IDs (commonly used ones)
export const GENRE_IDS = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  'Sci-Fi': 878,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

// Get best YouTube trailer key from videos response
export function getTrailerKey(videos) {
  if (!videos?.results?.length) return null;
  const trailers = videos.results.filter(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );
  const official = trailers.find((v) => v.type === 'Trailer' && v.official);
  return (official || trailers[0])?.key || null;
}

// Format runtime (minutes → "2h 15m")
export function formatRuntime(mins) {
  if (!mins) return '';
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

// Format vote average to 1 decimal
export function formatRating(vote) {
  return vote ? vote.toFixed(1) : 'N/A';
}
