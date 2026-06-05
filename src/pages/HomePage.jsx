import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import Footer from '../components/Footer';
import MovieModal from '../components/MovieModal';
import { tmdb, GENRE_IDS } from '../services/tmdb';

const ROWS = [
  { title: '🔥 Trending This Week',     fetchFn: () => tmdb.trending(),              showRank: true  },
  { title: '🎬 Now Playing',            fetchFn: () => tmdb.nowPlaying()                              },
  { title: '⭐ Top Rated All Time',     fetchFn: () => tmdb.topRated(),              showRank: true  },
  { title: '🚀 Popular Right Now',      fetchFn: () => tmdb.popular()                                },
  { title: '💥 Action & Adventure',     fetchFn: () => tmdb.byGenre(GENRE_IDS.Action)               },
  { title: '😂 Comedy',                 fetchFn: () => tmdb.byGenre(GENRE_IDS.Comedy)               },
  { title: '👻 Horror',                 fetchFn: () => tmdb.byGenre(GENRE_IDS.Horror)               },
  { title: '🚀 Sci-Fi',                 fetchFn: () => tmdb.byGenre(GENRE_IDS['Sci-Fi'])            },
  { title: '❤️ Romance',               fetchFn: () => tmdb.byGenre(GENRE_IDS.Romance)              },
  { title: '🎭 Drama',                  fetchFn: () => tmdb.byGenre(GENRE_IDS.Drama)                },
  { title: '🔍 Thriller',              fetchFn: () => tmdb.byGenre(GENRE_IDS.Thriller)             },
  { title: '🎨 Animation',             fetchFn: () => tmdb.byGenre(GENRE_IDS.Animation)            },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] page-enter">
      <Navbar />

      <main>
        <Hero />

        {/* Section divider */}
        <div className="relative -mt-16 z-10">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none" />
        </div>

        {/* Movie rows */}
        <div className="relative z-10 space-y-2 pb-6">
          {ROWS.map((row, i) => (
            <div
              key={row.title}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
            >
              <MovieRow
                title={row.title}
                fetchFn={row.fetchFn}
                showRank={row.showRank}
              />
            </div>
          ))}
        </div>

        <Footer />
      </main>

      <MovieModal />
    </div>
  );
}
