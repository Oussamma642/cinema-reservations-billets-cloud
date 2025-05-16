import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { FilmsService, AuthService } from "../services/api";
import axios from "axios";

export default function FilmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [film, setFilm] = useState(null);
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchFilmAndSeances = async () => {
      try {
        setLoading(true);
        console.log(`Fetching film details for ID: ${id} from API`);
        
        // Get current user
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
        
        // Fetch film details from API
        console.log('Making API call to get film details using FilmsService');
        const filmResponse = await FilmsService.getFilm(id);
        console.log('Film data received:', filmResponse.data);
        setFilm(filmResponse.data);
        
        // Fetch seances for this film
        console.log('Making API call to get seances for film');
        const seancesResponse = await FilmsService.getSeancesByFilm(id);
        console.log('Seances data received:', seancesResponse.data);
        
        // Add room information to each seance
        console.log('Making API call to get theater rooms');
        const sallesResponse = await FilmsService.getSalles();
        console.log('Theaters data received:', sallesResponse.data);
        const salles = sallesResponse.data;
        
        const seancesWithRoomInfo = seancesResponse.data.map(seance => {
          const salle = salles.find(s => s.id === seance.salle_id);
          return {
            ...seance,
            salle: {
              id: salle ? salle.id : seance.salle_id,
              name: salle ? salle.name : `Salle ${seance.salle_id}`,
              capacity: salle ? salle.capacity : 100
            },
            status: (salle && seance.reserved_places >= salle.capacity) ? "full" : "available"
          };
        });
        
        console.log('Final processed seances data:', seancesWithRoomInfo);
        setSeances(seancesWithRoomInfo);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching film details:", err);
        console.log("Error response:", err.response);
        console.log("Error details:", err.response ? err.response.data : "No response data");
        setError("Failed to load film details");
        setLoading(false);
      }
    };
    
    fetchFilmAndSeances();
  }, [id]);

  const handleReservation = (seanceId) => {
    console.log("handleReservation called with seanceId:", seanceId);
    
    if (!user) {
      console.log("User not logged in, redirecting to login page");
      navigate('/login', { state: { returnUrl: `/films/${id}` } });
      return;
    }
    
    console.log("Navigating to reservation page:", `/reservations/create/${seanceId}`);
    navigate(`/reservations/create/${seanceId}`);
  };

  const formatDate = (dateString) => {
    try {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  if (error || !film) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-10 text-red-500">
          <p className="mb-4">{error || "Film non trouvé"}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {t('error_loading_film')}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mr-2"
          >
            {t('retry')}
          </button>
          <Link 
            to="/films"
            className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {t('back_to_films')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Film Details Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Poster */}
          <div className="md:w-1/3">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={film.poster_url || "https://via.placeholder.com/300x450?text=No+Image"} 
                alt={film.title}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
                }}
              />
            </div>
          </div>
          
          {/* Film Info */}
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{film.title}</h1>
            
            <div className="mb-6 space-y-2">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 text-sm font-semibold rounded-full">
                  {film.genre}
                </span>
                <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 text-sm font-semibold rounded-full">
                  {film.duration} {t('minutes')}
                </span>
                {film.release_date && (
                  <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 text-sm font-semibold rounded-full">
                    {new Date(film.release_date).getFullYear()}
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{film.description}</p>
            </div>
            
            {/* Call to action */}
            <div className="mt-8">
              <a href="#seances" className="btn-primary">{t('book_ticket')}</a>
            </div>
          </div>
        </div>
        
        {/* Seances Section */}
        <div id="seances" className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
            Séances disponibles
          </h2>
          
          {seances.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {seances.map((seance) => (
                <div 
                  key={seance.id} 
                  className={`card border ${
                    seance.status === "full" 
                      ? "border-red-300 dark:border-red-700" 
                      : "border-green-300 dark:border-green-700"
                  }`}
                >
                  <div className="p-4">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {formatDate(seance.date_time)}
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 mb-4">
                      {seance.salle.name} · {seance.price} DH
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            seance.status === "full"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          }`}
                        >
                          {seance.status === "full" 
                            ? "Complet" 
                            : `${seance.salle.capacity - seance.reserved_places} places disponibles`
                          }
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleReservation(seance.id)}
                        disabled={seance.status === "full"}
                        className={`py-2 px-3 text-sm rounded-md font-medium ${
                          seance.status === "full"
                            ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                            : user 
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-500 hover:bg-gray-600 text-white"
                        }`}
                      >
                        {seance.status === "full" 
                          ? "Complet" 
                          : user 
                            ? "Réserver" 
                            : "Connectez-vous"
                        }
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              Aucune séance disponible pour ce film
            </div>
          )}
        </div>
        
        {/* Back to films button */}
        <div className="text-center">
          <Link to="/films" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Retour aux films
          </Link>
        </div>
      </div>
    </div>
  );
} 