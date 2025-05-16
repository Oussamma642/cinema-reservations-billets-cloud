import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { FilmsService, AuthService } from "../services/api";

export default function Films() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Get current user from auth service
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);

    // Fetch films from API
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    setLoading(true);
    try {
      const response = await FilmsService.getFilms();
      setFilms(response.data);
    } catch (error) {
      console.error("Error loading films:", error);
      // Fallback to localStorage if API fails
      try {
        const storedFilms = JSON.parse(localStorage.getItem('admin_films') || '[]');
        setFilms(storedFilms.filter(film => film.status === "active"));
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
        setFilms([]);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">{t('loading')}...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        {t('movies_available')}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {films.map(film => (
          <div key={film.id} className="card overflow-hidden flex flex-col">
            <div className="relative pb-[140%]">
              <img 
                src={film.poster_url || "https://via.placeholder.com/300x450?text=No+Poster"} 
                alt={film.title}
                className="absolute top-0 left-0 w-full h-full object-cover transition-transform hover:scale-105" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
                }}
              />
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{film.title}</h2>
              
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full px-3 py-1 text-xs font-semibold mr-2">
                  {film.genre}
                </span>
                <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full px-3 py-1 text-xs font-semibold">
                  {film.duration} {t('minutes')}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                {film.description}
              </p>
              
              <div className="mt-auto flex space-x-2">
                <Link 
                  to={`/films/${film.id}`} 
                  className="flex-1 text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
                >
                  {t('details')}
                </Link>
                
                {user ? (
                  <Link 
                    to={`/films/${film.id}#seances`} 
                    className="flex-1 text-center py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-200"
                  >
                    {t('book')}
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    className="flex-1 text-center py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition duration-200"
                    title={t('login_to_book')}
                  >
                    {t('login_to_book')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}