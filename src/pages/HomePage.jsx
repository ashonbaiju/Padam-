import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import Footer from '../components/Footer';
import MovieModal from '../components/MovieModal';
import { tmdb, GENRE_IDS } from '../services/tmdb';

import { 
  TrendingUp, Film, Star, Rocket, Swords, 
  Smile, Ghost, Orbit, Heart, Drama, Search, Palette 
} from 'lucide-react';

const ROWS = [
  { title: 'Trending This Week',     icon: TrendingUp, fetchFn: () => tmdb.trending(),              showRank: true  },
  { title: 'Now Playing',            icon: Film,       fetchFn: () => tmdb.nowPlaying()                              },
  { title: 'Top Rated All Time',     icon: Star,       fetchFn: () => tmdb.topRated(),              showRank: true  },
  { title: 'Popular Right Now',      icon: Rocket,     fetchFn: () => tmdb.popular()                                },
  { title: 'Action & Adventure',     icon: Swords,     fetchFn: () => tmdb.byGenre(GENRE_IDS.Action)               },
  { title: 'Comedy',                 icon: Smile,      fetchFn: () => tmdb.byGenre(GENRE_IDS.Comedy)               },
  { title: 'Horror',                 icon: Ghost,      fetchFn: () => tmdb.byGenre(GENRE_IDS.Horror)               },
  { title: 'Sci-Fi',                 icon: Orbit,      fetchFn: () => tmdb.byGenre(GENRE_IDS['Sci-Fi'])            },
  { title: 'Romance',                icon: Heart,      fetchFn: () => tmdb.byGenre(GENRE_IDS.Romance)              },
  { title: 'Drama',                  icon: Drama,      fetchFn: () => tmdb.byGenre(GENRE_IDS.Drama)                },
  { title: 'Thriller',               icon: Search,     fetchFn: () => tmdb.byGenre(GENRE_IDS.Thriller)             },
  { title: 'Animation',              icon: Palette,    fetchFn: () => tmdb.byGenre(GENRE_IDS.Animation)            },
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
                icon={row.icon}
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
