import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { FilmsService, ReservationsService, AuthService } from "../services/api";
import axios from "axios";

export default function CreateReservation() {
  const { seanceId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [film, setFilm] = useState(null);
  const [seance, setSeance] = useState(null);
  const [salle, setSalle] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  console.log("CreateReservation component initialized with seanceId:", seanceId);
  
  // États pour la disposition des sièges
  const rows = 8;
  const seatsPerRow = 10;
  const totalSeats = rows * seatsPerRow;
  
  useEffect(() => {
    console.log("CreateReservation useEffect running with seanceId:", seanceId);
    
    // Vérifier si l'utilisateur est connecté
    const currentUser = AuthService.getCurrentUser();
    console.log("Current user:", currentUser);
    setUser(currentUser);
    
    if (!currentUser) {
      console.log("No user found, redirecting to login");
      navigate('/login', { state: { redirect: `/reservations/create/${seanceId}` } });
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(`Fetching seance with ID: ${seanceId}`);
        // Get the seance details
        const seanceResponse = await FilmsService.getSeance(seanceId);
        const seanceData = seanceResponse.data;
        console.log('Seance data:', seanceData);
        setSeance(seanceData);
        
        // Get the film details
        console.log(`Fetching film with ID: ${seanceData.film_id}`);
        const filmResponse = await FilmsService.getFilm(seanceData.film_id);
        const filmData = filmResponse.data;
        console.log('Film data:', filmData);
        setFilm(filmData);
        
        // Get the theater details
        console.log(`Fetching theater with ID: ${seanceData.salle_id}`);
        const salleResponse = await FilmsService.getSalle(seanceData.salle_id);
        const salleData = salleResponse.data;
        console.log('Theater data:', salleData);
        setSalle(salleData);
        
      } catch (error) {
        console.error("Error loading data:", error);
        console.log("Error details:", error.response ? error.response.data : "No response data");
        alert("Erreur lors du chargement des données de la séance. Veuillez réessayer.");
        navigate('/films');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [seanceId, navigate]);
  
  const handleSeatToggle = (seatId) => {
    // Vérifier si le siège est déjà réservé
    const isReserved = Math.random() < 0.3; // Simulation: 30% des sièges sont "déjà réservés"
    
    if (isReserved) {
      alert("Ce siège est déjà réservé.");
      return;
    }
    
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(s => s !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };
  
  const handleReservationSubmit = async () => {
    if (!seance || selectedSeats.length === 0) {
      alert("Veuillez sélectionner au moins un siège.");
      return;
    }
    
    try {
      console.log("Current user:", user);
      
      // Create reservation data
      const reservationData = {
        user_id: user._id || user.id, // Use _id for MongoDB ObjectId
        seance_id: seance.id,
        film_id: film.id,
        film_title: film.title,
        date_time: seance.date_time,
        salle_name: salle ? salle.name : `Salle ${seance.salle_id}`,
        seats: selectedSeats,
        quantity: selectedSeats.length,
        total_price: seance.price * selectedSeats.length
      };
      
      console.log('Submitting reservation to Auth Service:', reservationData);
      
      // First, test the endpoint without authentication
      try {
        const testResponse = await axios.post('http://localhost:5000/api/auth/reservations/test', reservationData);
        console.log('Test endpoint response:', testResponse.data);
      } catch (testError) {
        console.error('Test endpoint error:', testError);
        console.error('Test error response:', testError.response ? testError.response.data : 'No response data');
      }
      
      // Send the reservation data to Auth Service via ReservationsService
      const response = await ReservationsService.createReservation(reservationData);
      console.log('Reservation created:', response.data);
      
      // Update seance reserved places
      try {
        await FilmsService.updateSeance(seance.id, {
          reservedPlaces: selectedSeats.length
        });
      } catch (updateError) {
        console.error("Error updating seance:", updateError);
      }
      
      // Navigate to success page with reservation data
      navigate('/reservations/success', { 
        state: { 
          reservation: response.data.reservation || {
            id: Date.now(),
            user_id: user._id || user.id,
            film_id: film.id,
            film_title: film.title,
            film: film,
            seance_id: seance.id,
            seance: seance,
            date_time: seance.date_time,
            salle_name: salle ? salle.name : `Salle ${seance.salle_id}`,
            salle: salle,
            seats: selectedSeats,
            number_of_tickets: selectedSeats.length,
            total_price: seance.price * selectedSeats.length,
            created_at: new Date().toISOString(),
            status: 'pending'
          }
        } 
      });
    } catch (error) {
      console.error("Error creating reservation:", error);
      console.error("Error response:", error.response ? error.response.data : "No response data");
      alert("Une erreur est survenue lors de la création de la réservation. Veuillez réessayer.");
    }
  };
  
  // Fonction pour formater la date
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
      return "Date invalide";
    }
  };
  
  // Générer les sièges
  const generateSeats = () => {
    const seats = [];
    
    // Simuler des sièges déjà réservés (différents pour chaque séance)
    const reservedSeats = seance 
      ? Array(totalSeats).fill(0).map((_, i) => Math.random() < 0.3) // 30% de chance d'être réservé
      : [];
    
    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let seat = 0; seat < seatsPerRow; seat++) {
        const seatId = row * seatsPerRow + seat + 1;
        const isSelected = selectedSeats.includes(seatId);
        const isReserved = seance && reservedSeats[seatId - 1];
        
        rowSeats.push(
          <button
            key={seatId}
            className={`w-8 h-8 m-1 rounded-md flex items-center justify-center text-xs ${
              isSelected 
                ? 'bg-green-500 text-white' 
                : isReserved 
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-white dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900 border border-gray-300 dark:border-gray-600'
            }`}
            onClick={() => !isReserved && handleSeatToggle(seatId)}
            disabled={isReserved}
          >
            {seatId}
          </button>
        );
      }
      
      seats.push(
        <div key={`row-${row}`} className="flex justify-center">
          <div className="w-6 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm mr-2">
            {String.fromCharCode(65 + row)}
          </div>
          <div className="flex">
            {rowSeats}
          </div>
        </div>
      );
    }
    
    return seats;
  };
  
  if (loading) {
    return <div className="text-center py-10">{t('loading')}...</div>;
  }
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          {t('login_to_book')}
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Vous devez être connecté pour réserver des billets.
        </p>
        <Link 
          to="/login" 
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
        >
          {t('login')}
        </Link>
      </div>
    );
  }
  
  if (!film) {
    return <div className="text-center py-10">Film non trouvé</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          {t('reservation_title')} "{film.title}"
        </h1>
        
        {/* Sélection de séance */}
        <div className="card mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t('select_date')} & {t('select_time')}
          </h2>
          
          {seance && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                key={seance.id}
                className={`p-4 rounded-md border text-left transition ${
                  seance.id === seance.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatDate(seance.date_time)}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {salle ? salle.name : `Salle ${seance.salle_id}`} · {seance.price} DH
                </div>
                <div className="mt-2 text-xs">
                  <span className={`px-2 py-1 rounded-full ${
                    seance.availableSeats > 20 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : seance.availableSeats > 5
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {seance.availableSeats} {t('seats_available')}
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>
        
        {/* Sélection des places */}
        {seance && (
          <div className="card mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {t('select_seats')}
            </h2>
            
            <div className="mb-6">
              <div className="flex justify-center gap-6 mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{t('seats_available')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{t('selected')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{t('reserved')}</span>
                </div>
              </div>
              
              {/* Écran */}
              <div className="w-3/4 h-6 bg-gray-300 dark:bg-gray-700 mx-auto mb-8 rounded-t-lg flex items-center justify-center text-xs text-gray-700 dark:text-gray-300">
                {t('screen')}
              </div>
              
              {/* Sièges */}
              <div className="mt-8">
                {generateSeats()}
              </div>
            </div>
            
            {/* Récapitulatif */}
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-300">{t('selected')}: {selectedSeats.length} {t('seats')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedSeats.map(seat => {
                    const row = Math.floor((seat - 1) / seatsPerRow);
                    return String.fromCharCode(65 + row) + ((seat - 1) % seatsPerRow + 1);
                  }).join(', ')}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 dark:text-gray-300">{t('price')}: {seance.price} DH × {selectedSeats.length}</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{t('total')}: {seance.price * selectedSeats.length} DH</span>
              </div>
              
              <button
                onClick={handleReservationSubmit}
                disabled={selectedSeats.length === 0}
                className={`w-full py-3 rounded-md font-semibold transition ${
                  selectedSeats.length > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {t('confirm_reservation')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 