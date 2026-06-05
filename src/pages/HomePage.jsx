import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import Footer from '../components/Footer';
import MovieModal from '../components/MovieModal';
import { tmdb, GENRE_IDS } from '../services/tmdb';

import { 
  AnimatedFire, AnimatedFilm, AnimatedStar, AnimatedRocket, AnimatedSwords, 
  AnimatedSmile, AnimatedGhost, AnimatedOrbit, AnimatedHeart, AnimatedDrama, AnimatedSearch, AnimatedPalette 
} from '../components/AnimatedIcons';

const ROWS = [
  { title: 'Trending This Week',     icon: AnimatedFire,    fetchFn: () => tmdb.trending(),              showRank: true  },
  { title: 'Now Playing',            icon: AnimatedFilm,    fetchFn: () => tmdb.nowPlaying()                              },
  { title: 'Top Rated All Time',     icon: AnimatedStar,    fetchFn: () => tmdb.topRated(),              showRank: true  },
  { title: 'Popular Right Now',      icon: AnimatedRocket,  fetchFn: () => tmdb.popular()                                },
  { title: 'Action & Adventure',     icon: AnimatedSwords,  fetchFn: () => tmdb.byGenre(GENRE_IDS.Action)               },
  { title: 'Comedy',                 icon: AnimatedSmile,   fetchFn: () => tmdb.byGenre(GENRE_IDS.Comedy)               },
  { title: 'Horror',                 icon: AnimatedGhost,   fetchFn: () => tmdb.byGenre(GENRE_IDS.Horror)               },
  { title: 'Sci-Fi',                 icon: AnimatedOrbit,   fetchFn: () => tmdb.byGenre(GENRE_IDS['Sci-Fi'])            },
  { title: 'Romance',                icon: AnimatedHeart,   fetchFn: () => tmdb.byGenre(GENRE_IDS.Romance)              },
  { title: 'Drama',                  icon: AnimatedDrama,   fetchFn: () => tmdb.byGenre(GENRE_IDS.Drama)                },
  { title: 'Thriller',               icon: AnimatedSearch,  fetchFn: () => tmdb.byGenre(GENRE_IDS.Thriller)             },
  { title: 'Animation',              icon: AnimatedPalette, fetchFn: () => tmdb.byGenre(GENRE_IDS.Animation)            },
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
