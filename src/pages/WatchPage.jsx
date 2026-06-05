import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Play, Film, SkipForward, RotateCcw,
  Maximize, Minimize, Server, X, Star, Clock, ChevronRight,
} from 'lucide-react';
import { tmdb, formatRating, getTrailerKey } from '../services/tmdb';

// ── All Streaming Servers ─────────────────────────────────────────────────────
const SERVERS = [
  { name: 'VidSrc',       label: 'Server 1',  badge: 'HD',  color: '#E50914', url: (id) => `https://vidsrc.to/embed/movie/${id}` },
  { name: 'VidSrc.me',    label: 'Server 2',  badge: 'FHD', color: '#3b82f6', url: (id) => `https://vidsrc.me/embed/movie?tmdb=${id}` },
  { name: '2Embed',       label: 'Server 3',  badge: 'HD',  color: '#8b5cf6', url: (id) => `https://2embed.org/embed/movie/${id}` },
  { name: 'EmbedSu',      label: 'Server 4',  badge: 'HD',  color: '#10b981', url: (id) => `https://embed.su/embed/movie/${id}` },
  { name: 'MultiEmbed',   label: 'Server 5',  badge: '4K',  color: '#f59e0b', url: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1` },
  { name: 'AutoEmbed',    label: 'Server 6',  badge: 'HD',  color: '#06b6d4', url: (id) => `https://player.autoembed.cc/embed/movie/${id}` },
  { name: 'VidSrc.xyz',   label: 'Server 7',  badge: 'FHD', color: '#ec4899', url: (id) => `https://vidsrc.xyz/embed/movie?tmdb=${id}` },
  { name: 'MoviesAPI',    label: 'Server 8',  badge: 'HD',  color: '#84cc16', url: (id) => `https://moviesapi.club/movie/${id}` },
  { name: 'SmashyStream', label: 'Server 9',  badge: 'FHD', color: '#f97316', url: (id) => `https://player.smashy.stream/movie/${id}` },
  { name: '2Embed.cc',    label: 'Server 10', badge: 'HD',  color: '#a78bfa', url: (id) => `https://www.2embed.cc/embed/${id}` },
];

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const hideTimer = useRef(null);
  const iframeRef = useRef(null);

  const [movie, setMovie]               = useState(null);
  const [loading, setLoading]           = useState(true);
  const [serverIndex, setServerIndex]   = useState(0);
  const [mode, setMode]                 = useState('stream');   // 'stream' | 'trailer'
  const [trailerKey, setTrailerKey]     = useState(null);
  const [showHUD, setShowHUD]           = useState(true);       // top/bottom bars
  const [showPanel, setShowPanel]       = useState(false);      // server panel
  const [fullscreen, setFullscreen]     = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [triedServers, setTriedServers] = useState(new Set([0]));

  // ── Load movie details ───────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setIframeLoaded(false);
    setServerIndex(0);
    setTriedServers(new Set([0]));
    setShowPanel(false);
    tmdb.details(id)
      .then((data) => { setMovie(data); setTrailerKey(getTrailerKey(data.videos)); })
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [id]);

  // ── HUD auto-hide — ONLY hides when panel is closed ─────────────────────────
  const resetHideTimer = useCallback(() => {
    setShowHUD(true);
    clearTimeout(hideTimer.current);
    // Don't start timer if panel is open — keep HUD visible
    if (!showPanel) {
      hideTimer.current = setTimeout(() => setShowHUD(false), 4000);
    }
  }, [showPanel]);

  // Keep HUD visible whenever panel is open
  useEffect(() => {
    if (showPanel) {
      clearTimeout(hideTimer.current);
      setShowHUD(true);
    }
  }, [showPanel]);

  // Listen for mouse movement on the CONTAINER (not the iframe area directly)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove  = () => resetHideTimer();
    const onTouch = () => resetHideTimer();
    el.addEventListener('mousemove', onMove);
    el.addEventListener('touchstart', onTouch);
    resetHideTimer();
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('touchstart', onTouch);
      clearTimeout(hideTimer.current);
    };
  }, [resetHideTimer]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (showPanel) { setShowPanel(false); return; }
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        else navigate(-1);
      }
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      if (e.key === 's' || e.key === 'S') setShowPanel((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showPanel]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setFullscreen(false);
    }
  };

  const switchServer = (i) => {
    setServerIndex(i);
    setIframeLoaded(false);
    setMode('stream');
    setTriedServers((prev) => new Set([...prev, i]));
    setShowPanel(false);
  };

  const nextServer = () => switchServer((serverIndex + 1) % SERVERS.length);

  // ── URLs ─────────────────────────────────────────────────────────────────────
  const server    = SERVERS[serverIndex];
  const streamUrl = server.url(id);
  const trailerUrl = trailerKey
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1&modestbranding=1&rel=0`
    : null;
  const embedUrl  = mode === 'stream' ? streamUrl : trailerUrl;

  // ── Whether controls/overlays should intercept pointer events ───────────────
  // KEY FIX: only intercept pointers when the HUD is actually visible
  const hudPointer = showHUD ? 'pointer-events-auto' : 'pointer-events-none';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-[100] overflow-hidden"
      style={{ cursor: showHUD ? 'default' : 'none' }}
    >
      {/* ── IFRAME — always full screen, z-index 1, NEVER blocked ───────────── */}
      <div className="absolute inset-0 z-[1]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="w-14 h-14 rounded-full border-4 border-[#E50914] border-t-transparent animate-spin" />
          </div>
        )}

        {/* Colored spinner while switching servers */}
        {!iframeLoaded && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black z-10">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-white/10" />
              <div
                className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
                style={{ borderColor: `${server.color} transparent transparent transparent` }}
              />
            </div>
            <div className="text-center">
              <p className="text-white/60 text-sm font-semibold">Connecting to {server.name}…</p>
              <p className="text-white/30 text-xs mt-1">{server.label} · {server.badge}</p>
            </div>
            <button
              onClick={nextServer}
              className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all mt-1"
            >
              <SkipForward size={13} /> Try Next Server
            </button>
          </div>
        )}

        {/* THE IFRAME — fills entire screen, no pointer-events interference */}
        {embedUrl && !loading && (
          <iframe
            ref={iframeRef}
            key={`${mode}-${serverIndex}-${id}`}
            src={embedUrl}
            title={mode === 'stream' ? server.name : 'Trailer'}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer"
            allowFullScreen
            className="w-full h-full border-0"
            onLoad={() => setIframeLoaded(true)}
          />
        )}

        {/* Unavailable fallback */}
        {!embedUrl && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black px-8 text-center z-10">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
              <Film size={36} className="text-white/20" />
            </div>
            <p className="text-white/70 text-xl font-bold">Stream Unavailable</p>
            <p className="text-white/35 text-sm max-w-sm leading-relaxed">
              This movie isn't available on the current server. Try switching servers or watch the trailer.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              <button onClick={() => setShowPanel(true)}
                className="btn-red flex items-center gap-2 px-5 py-2 rounded-xl text-sm">
                <Server size={14} /> Switch Server
              </button>
              {trailerKey && (
                <button onClick={() => setMode('trailer')}
                  className="btn-info flex items-center gap-2 px-5 py-2 rounded-xl text-sm">
                  <Play size={14} /> Watch Trailer
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── HUD LAYER — z-index 10, pointer-events ONLY when visible ─────────── */}

      {/* Top bar */}
      <div
        className={`absolute top-0 left-0 right-0 z-[10] flex items-center justify-between px-4 sm:px-8 py-4
          bg-gradient-to-b from-black/90 via-black/50 to-transparent
          transition-opacity duration-300 ${hudPointer}
          ${showHUD ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 hover:text-white bg-black/50 backdrop-blur-sm
            px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>

        {/* Title */}
        <div className="text-center hidden sm:block max-w-xs">
          <p className="text-white font-semibold text-sm truncate">{movie?.title || '…'}</p>
          {mode === 'stream' && (
            <p className="text-xs mt-0.5 font-medium" style={{ color: server.color }}>
              ● {server.name} · {server.badge}
            </p>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {trailerKey && (
            <button
              onClick={() => { setMode((m) => m === 'stream' ? 'trailer' : 'stream'); setIframeLoaded(false); }}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold
                border transition-all ${mode === 'trailer'
                  ? 'bg-[#E50914] border-[#E50914] text-white'
                  : 'bg-black/50 border-white/20 text-white/70 hover:text-white'}`}
            >
              <Film size={12} /> {mode === 'stream' ? 'Trailer' : 'Movie'}
            </button>
          )}

          {mode === 'stream' && (
            <button
              onClick={() => setShowPanel((v) => !v)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold
                bg-black/50 border border-white/20 text-white/70 hover:text-white transition-all"
            >
              <Server size={12} /> Servers
            </button>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-[10] px-4 sm:px-8 py-4
          bg-gradient-to-t from-black/95 via-black/50 to-transparent
          transition-opacity duration-300 ${hudPointer}
          ${showHUD ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Movie info */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{movie?.title}</p>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-white/50 flex-wrap">
              {movie?.vote_average > 0 && (
                <span className="flex items-center gap-0.5 text-[#f5c518] font-bold">
                  <Star size={10} fill="#f5c518" /> {formatRating(movie.vote_average)}
                </span>
              )}
              {movie?.runtime > 0 && (
                <span className="flex items-center gap-0.5">
                  <Clock size={10} /> {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
              <span className="font-semibold" style={{ color: mode === 'stream' ? server.color : '#E50914' }}>
                {mode === 'stream' ? `● ${server.name}` : '▶ Trailer'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick server buttons 1-5 */}
            {mode === 'stream' && (
              <div className="hidden md:flex items-center gap-1 mr-1">
                {SERVERS.slice(0, 5).map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => switchServer(i)}
                    title={`${s.name} (${s.badge})`}
                    className="w-7 h-7 rounded-md text-[11px] font-black transition-all duration-200"
                    style={i === serverIndex
                      ? { background: s.color, color: '#fff' }
                      : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }
                    }
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setShowPanel(true)}
                  title="More servers"
                  className="w-7 h-7 rounded-md text-[11px] font-black bg-white/10 text-white/50
                    hover:bg-white/20 hover:text-white transition-all"
                >
                  •••
                </button>
              </div>
            )}

            {mode === 'stream' && (
              <button onClick={nextServer} title="Next server"
                className="text-white/60 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-all">
                <SkipForward size={16} />
              </button>
            )}
            <button onClick={() => setIframeLoaded(false)} title="Reload"
              className="text-white/60 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-all">
              <RotateCcw size={16} />
            </button>
            <button onClick={toggleFullscreen} title="Fullscreen (F)"
              className="text-white/60 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-all">
              {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── SERVER PANEL — side drawer, z-index 20, doesn't block player ────── */}
      {showPanel && mode === 'stream' && (
        <>
          {/* Click-outside area: transparent, sits between iframe (z:1) and panel (z:20) */}
          {/* Uses pointer-events-auto only on a thin strip — does NOT block iframe center */}
          <div
            className="absolute inset-0 z-[15]"
            onClick={() => setShowPanel(false)}
          />

          {/* Panel itself */}
          <div
            className="absolute top-0 right-0 bottom-0 z-[20] w-72 glass shadow-2xl flex flex-col animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <Server size={15} className="text-[#E50914]" />
                <span className="text-white font-bold">Servers</span>
                <span className="text-white/30 text-xs">({SERVERS.length})</span>
              </div>
              <button
                onClick={() => setShowPanel(false)}
                className="text-white/40 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            {/* Server list */}
            <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
              {SERVERS.map((s, i) => {
                const isActive = i === serverIndex;
                const wasTried = triedServers.has(i) && !isActive;
                return (
                  <button
                    key={s.name}
                    onClick={() => switchServer(i)}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all
                      ${isActive ? 'bg-white/10' : 'hover:bg-white/6'}`}
                  >
                    {/* Color indicator */}
                    <div
                      className="w-3 h-3 rounded-full shrink-0 transition-all"
                      style={{ background: isActive ? s.color : wasTried ? '#374151' : 'rgba(255,255,255,0.2)' }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-white/65'}`}>
                          {s.name}
                        </span>
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded border"
                          style={{
                            color: isActive ? s.color : 'rgba(255,255,255,0.3)',
                            borderColor: isActive ? `${s.color}60` : 'rgba(255,255,255,0.1)',
                            background: isActive ? `${s.color}15` : 'transparent',
                          }}
                        >
                          {s.badge}
                        </span>
                      </div>
                      <p className="text-xs text-white/30 mt-0.5">{s.label}</p>
                    </div>

                    <div className="shrink-0 text-xs">
                      {isActive ? (
                        <span className="font-semibold" style={{ color: s.color }}>● Live</span>
                      ) : wasTried ? (
                        <span className="text-white/25">Tried</span>
                      ) : (
                        <ChevronRight size={14} className="text-white/20" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer hint */}
            <div className="px-5 py-3 border-t border-white/8 bg-black/20 shrink-0">
              <p className="text-[11px] text-white/30 leading-relaxed mb-1">
                💡 Use the player's built-in settings (⚙️) to change video quality, subtitles, and audio tracks (if available).
              </p>
              <p className="text-[11px] text-white/25 leading-relaxed">
                Shortcuts: <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/40 text-[10px]">S</kbd> servers · <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/40 text-[10px]">F</kbd> fullscreen
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
