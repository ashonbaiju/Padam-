/**
 * API client — connects the React frontend to the PHP backend.
 * Base URL is resolved automatically for both dev (Vite proxy) and XAMPP production.
 */

const API_BASE = '/streamflix/api';

async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  } catch (err) {
    console.error(`[API] ${options.method || 'GET'} ${url}:`, err.message);
    throw err;
  }
}

// ── Movies ────────────────────────────────────────────────────────
export const moviesApi = {
  /** Fetch all categories with their movies */
  getCategories: () => apiFetch('/movies/categories'),

  /** Fetch a single movie + similar titles */
  getMovie: (id) => apiFetch(`/movies/${id}`),

  /** Fetch all movies, optionally filtered by genre */
  getAll: (genre) => apiFetch(`/movies${genre ? `?genre=${encodeURIComponent(genre)}` : ''}`),
};

// ── Search ────────────────────────────────────────────────────────
export const searchApi = {
  /** Full-text search across title, genre, description, tags */
  search: (query, genre = '') =>
    apiFetch(`/search?q=${encodeURIComponent(query)}&genre=${encodeURIComponent(genre)}`),
};

// ── Watchlist ─────────────────────────────────────────────────────
export const watchlistApi = {
  /** Get the current user's watchlist with full movie details */
  get: () => apiFetch('/watchlist'),

  /** Add a movie to the watchlist */
  add: (movieId) =>
    apiFetch('/watchlist', {
      method: 'POST',
      body: JSON.stringify({ movie_id: movieId }),
    }),

  /** Remove a movie from the watchlist */
  remove: (movieId) =>
    apiFetch(`/watchlist/${movieId}`, { method: 'DELETE' }),
};

// ── Auth ──────────────────────────────────────────────────────────
export const authApi = {
  /** Get the currently logged-in user (session) */
  me: () => apiFetch('/auth/me'),

  /** Login with email + password */
  login: (email, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  /** Register a new account */
  register: (name, email, password) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  /** Logout */
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
};

// ── TMDB Proxy (requires API key in PHP backend) ──────────────────
export const tmdbApi = {
  /** Get popular movies from TMDB */
  popular: (page = 1) => apiFetch(`/tmdb?path=popular&page=${page}`),

  /** Search TMDB */
  search: (query) => apiFetch(`/tmdb?q=${encodeURIComponent(query)}`),

  /** Get trending movies */
  trending: () => apiFetch('/tmdb?path=trending'),

  /** Get movie details from TMDB */
  movie: (id) => apiFetch(`/tmdb/${id}`),
};

// ── Health check ──────────────────────────────────────────────────
export const healthApi = {
  check: () => apiFetch('/health'),
};
