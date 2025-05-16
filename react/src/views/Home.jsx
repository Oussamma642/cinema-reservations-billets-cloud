import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { FilmsService, AuthService } from "../services/api";

export default function Home() {
  const { t } = useLanguage();
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFilms = async () => {
      try {
        setLoading(true);
        
        // Fetch films using our services
        const response = await FilmsService.getFilms();
        
        // Take the first 3 films for the homepage
        const filmsToShow = response.data.slice(0, 3);
        setFilms(filmsToShow);
        
      } catch (error) {
        console.error('Error fetching films:', error);
        
        // Only use localStorage fallback if API fails
        try {
        const storedFilms = JSON.parse(localStorage.getItem('admin_films') || '[]');
        setFilms(storedFilms.filter(film => film.status === "active").slice(0, 3));
        } catch (storageError) {
          console.error('Error loading films from localStorage:', storageError);
          setFilms([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchFilms();
  }, []);

  // Films à venir (fictifs)
  const comingSoonFilms = [
    {
      id: 101,
      title: "Avatar 3",
      description: "Jake Sully et Neytiri reviennent pour une nouvelle aventure sur Pandora.",
      releaseDate: "Décembre 2025",
      poster_url: "https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg"
    },
    
      {
        id: 102,
        title: "Inception 2",
        description: "Dom Cobb replonge dans les rêves pour une mission plus risquée que jamais.",
        releaseDate: "Juillet 2026",
        poster_url: "https://m.media-amazon.com/images/I/51zUbui+gbL._AC_.jpg"
      },
      {
        id: 103,
        title: "Black Panther: Legacy",
        description: "Un nouveau héros émerge pour défendre le Wakanda après la disparition de T'Challa.",
        releaseDate: "Novembre 2025",
        poster_url: "https://m.media-amazon.com/images/I/71niXI3lxlL._AC_SL1024_.jpg"
      },
      {
        id: 104,
        title: "Le Retour de Matrix",
        description: "Neo est de retour pour affronter une nouvelle menace virtuelle plus puissante que jamais.",
        releaseDate: "Mars 2026",
        poster_url: "https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg"
      },
      {
        id: 105,
        title: "Dune: L'Empire",
        description: "Paul Atréides continue sa conquête de l'univers et fait face à de nouveaux ennemis.",
        releaseDate: "Octobre 2025",
        poster_url: "https://m.media-amazon.com/images/I/81aA7hEEykL._AC_SY679_.jpg"
      },
      {
        id: 106,
        title: "Mission Impossible: Résurrection",
        description: "Ethan Hunt sort de sa retraite pour sauver le monde une dernière fois.",
        releaseDate: "Mai 2026",
        poster_url: "https://m.media-amazon.com/images/I/71c05lTE03L._AC_SY679_.jpg"
      },
      {
        id: 107,
        title: "Avengers: New Era",
        description: "Une nouvelle génération de super-héros prend la relève pour défendre la Terre.",
        releaseDate: "Avril 2026",
        poster_url: "https://m.media-amazon.com/images/I/81AJdOIEIhL._AC_SL1500_.jpg"
      },
    {
      id: 102,
      title: "Dune: Part Three",
      description: "La suite épique de l'adaptation du roman de Frank Herbert.",
      releaseDate: "Octobre 2026",
      poster_url: "https://m.media-amazon.com/images/I/71niXI3lxlL._AC_SL1024_.jpg"
    }
  ];

  if (loading) {
    return <div className="text-center py-10">{t('loading')}...</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1470&auto=format&fit=crop')",
            backgroundPosition: "center 30%", 
          }}>
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 text-center text-white z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('welcome')}
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-gray-200">
            {t('welcome_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Link 
              to="/films" 
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-200 text-center"
            >
              {t('see_all_movies')}
            </Link>
            <Link 
              to="/login" 
              className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-md transition duration-200 text-center"
            >
              {t('login')}
            </Link>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="fill-white dark:fill-slate-900">
            <path d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,53.3C1200,53,1320,43,1380,37.3L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Featured Movies Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('latest_movies')}
            </h2>
            <Link 
              to="/films" 
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
            >
              {t('see_all_movies')} →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {films.map(film => (
              <div key={film.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl">
                <div className="relative pb-[140%]">
                  <img 
                    src={film.poster_url || "https://via.placeholder.com/300x450?text=No+Poster"} 
                    alt={film.title}
                    className="absolute top-0 left-0 w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
                    }}
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{film.title}</h3>
                  
                  <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full px-3 py-1 text-xs font-semibold mr-2">
                      {film.genre}
                    </span>
                    <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full px-3 py-1 text-xs font-semibold">
                      {film.duration} {t('minutes')}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                    {film.description}
                  </p>
                  
                  <Link 
                    to={`/films/${film.id}`} 
                    className="inline-block w-full text-center py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-200"
                  >
                    {t('details')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Coming Soon Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            {t('coming_soon')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {comingSoonFilms.map(film => (
              <div key={film.id} className="flex flex-col md:flex-row bg-white dark:bg-slate-700 rounded-lg shadow-md overflow-hidden">
                <div className="md:w-1/3 relative">
                  <img 
                    src={film.poster_url || "https://via.placeholder.com/300x450?text=Coming+Soon"} 
                    alt={film.title}
                    className="w-full h-48 md:h-full object-cover" 
                  />
                  <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-2 py-1">
                    COMING SOON
                  </div>
                </div>
                
                <div className="md:w-2/3 p-4 md:p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{film.title}</h3>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 font-semibold mb-2">{film.releaseDate}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{film.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Special Offers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('special_offers')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">{t('discount_message')}</p>
          <Link 
            to="/login" 
            className="inline-block px-6 py-3 bg-white hover:bg-gray-100 text-red-600 font-semibold rounded-md transition duration-200"
          >
            {t('book_now')}
          </Link>
        </div>
      </section>
    </div>
  );
}