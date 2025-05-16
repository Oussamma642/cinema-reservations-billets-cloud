import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useEffect, useRef } from "react";

export default function ReservationSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservation } = location.state || {};
  const { t } = useLanguage();
  const ticketRef = useRef(null);
  
  // Ajout d'un style d'impression spécifique
  useEffect(() => {
    // Création d'un élément de style pour l'impression
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        #printable-ticket, #printable-ticket * {
          visibility: visible;
        }
        #printable-ticket {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!reservation) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Détails de Réservation Non Trouvés</h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">Impossible de récupérer les détails de la réservation.</p>
        <button
          onClick={() => navigate("/films")}
          className="btn-primary"
        >
          Retour aux films
        </button>
      </div>
    );
  }

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div id="printable-ticket" ref={ticketRef} className="max-w-2xl mx-auto card">
        <div className="bg-green-500 dark:bg-green-600 text-white p-4 text-center">
          <h1 className="text-2xl font-bold">{t('reservation_confirmed')}</h1>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('reservation_details')}</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('reservation_id')}:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{reservation.id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('movie')}:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{reservation.film_title}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('date_time')}:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{formatDate(reservation.date_time)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('seats')}:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {reservation.seats?.length || 0} {reservation.seats?.length > 1 ? t('seats') : t('seat')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('seat_numbers')}:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {reservation.seats?.join(', ') || '-'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('total')}:</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{reservation.price} DH</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('salle_name')}:</span>
                <span className="font-medium capitalize text-gray-900 dark:text-gray-100">
                  {reservation.salle_name}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Informations importantes</h3>
            <ul className="list-disc pl-5 text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>Veuillez vous présenter 15 minutes avant le début de la séance.</li>
              <li>Une pièce d'identité peut être demandée lors du contrôle des billets.</li>
              <li>Aucun remboursement n'est possible après confirmation de la réservation.</li>
            </ul>
          </div>
          
          <div className="flex justify-center space-x-4 no-print">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600"
            >
              {t('print_ticket')}
            </button>
            
            <button
              onClick={() => navigate("/films")}
              className="btn-primary"
            >
              {t('back_to_movies')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}