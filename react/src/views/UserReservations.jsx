import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { ReservationsService, AuthService } from "../services/api";

export default function UserReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const user = AuthService.getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }

        console.log('Fetching reservations for user:', user.id);
        const response = await ReservationsService.getUserReservations(user.id);
        console.log('Reservations from Auth Service:', response.data);
        setReservations(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setError(t('error.fetchReservations'));
        setLoading(false);
      }
    };

    fetchReservations();
  }, [navigate, t]);

  const formatDate = (dateString) => {
    try {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    } catch (error) {
      return "Date invalide";
    }
  };

  // Translate status
  const translateStatus = (status) => {
    if (!status) return "";
    return t.myReservations.status[status] || status;
  };

  if (loading) return <div className="text-center py-8 text-gray-700 dark:text-gray-300">Chargement de vos réservations...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{t.myReservations.title}</h1>
      
      {reservations.length > 0 ? (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div 
              key={reservation._id || reservation.id} 
              className="card transition-all hover:shadow-lg"
            >
              <div className="md:flex">
                {reservation.film?.poster_url && (
                  <div className="md:w-1/4 h-40 md:h-auto">
                    <img 
                      src={reservation.film.poster_url} 
                      alt={reservation.film.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-4 md:p-6 md:w-3/4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                        {reservation.film_title || reservation.film?.title || "Film inconnu"}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        <span className="font-medium">{t.myReservations.dateTime}:</span> {formatDate(reservation.date_time || reservation.seance?.date_time)}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        <span className="font-medium">{t.myReservations.tickets}:</span> {reservation.number_of_tickets || reservation.numberOfPlaces}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        <span className="font-medium">{t.myReservations.totalPrice}:</span> {reservation.total_price || reservation.totalPrice} DH
                      </p>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      reservation.status === 'accepted' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : reservation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {translateStatus(reservation.status)}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <Link
                      to={`/films/${reservation.film_id || reservation.film?.id || reservation.seance?.film_id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      {t.myReservations.viewFilm}
                    </Link>
                    
                    <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                    
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                      {t.myReservations.reservedOn} {new Date(reservation.createdAt || reservation.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t.myReservations.noReservations}</p>
          <Link
            to="/films"
            className="btn-primary inline-block"
          >
            {t.myReservations.exploreFilms}
          </Link>
        </div>
      )}
    </div>
  );
}