import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import FilmForm from "../components/admin/FilmForm";
import SeanceForm from "../components/admin/SeanceForm";
import SalleForm from "../components/admin/SalleForm";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("films");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // États pour les données et le chargement
  const [films, setFilms] = useState([]);
  const [seances, setSeances] = useState([]);
  const [salles, setSalles] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États pour les formulaires
  const [showFilmForm, setShowFilmForm] = useState(false);
  const [showSeanceForm, setShowSeanceForm] = useState(false);
  const [showSalleForm, setShowSalleForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Charger les données
  useEffect(() => {
    // Vérifier que l'utilisateur est admin
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser || storedUser.role !== 'admin') {
      navigate('/films');
      return;
    }
    
    setUser(storedUser);
    
    // Récupérer les données du localStorage s'il y en a, sinon utiliser les données fictives
    const storedFilms = JSON.parse(localStorage.getItem('admin_films') || '[]');
    const storedSeances = JSON.parse(localStorage.getItem('admin_seances') || '[]');
    const storedSalles = JSON.parse(localStorage.getItem('admin_salles') || '[]');
    
    if (storedFilms.length > 0) {
      setFilms(storedFilms);
    } else {
      // Utiliser les données fictives
      const defaultFilms = [
        { id: 1, title: "Inception", duration: 148, genre: "Science-Fiction", status: "active", description: "Un voleur qui s'infiltre dans les rêves des autres pour voler leurs secrets.", release_date: "2010-07-16", poster_url: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg" },
        { id: 2, title: "The Dark Knight", duration: 152, genre: "Action", status: "active", description: "Batman affronte le Joker, un criminel psychotique qui veut plonger Gotham City dans le chaos.", release_date: "2008-07-18", poster_url: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg" },
        { id: 3, title: "Pulp Fiction", duration: 154, genre: "Crime", status: "active", description: "Les vies de deux tueurs à gages, d'un boxeur, de la femme d'un gangster et de deux braqueurs s'entremêlent.", release_date: "1994-10-14", poster_url: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg" },
        { id: 4, title: "The Shawshank Redemption", duration: 142, genre: "Drame", status: "inactive", description: "L'histoire d'un banquier innocent condamné à la prison à vie pour le meurtre de sa femme.", release_date: "1994-09-23", poster_url: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg" },
      ];
      setFilms(defaultFilms);
      localStorage.setItem('admin_films', JSON.stringify(defaultFilms));
    }
    
    if (storedSeances.length > 0) {
      setSeances(storedSeances);
    } else {
      // Utiliser les données fictives
      const defaultSeances = [
        { id: 101, film_id: 1, date_time: "2025-06-01T18:00:00", price: 65, salle_id: 1, reserved_places: 20 },
        { id: 102, film_id: 1, date_time: "2025-06-01T21:30:00", price: 75, salle_id: 2, reserved_places: 15 },
        { id: 201, film_id: 2, date_time: "2025-06-01T19:00:00", price: 65, salle_id: 3, reserved_places: 75 },
      ];
      setSeances(defaultSeances);
      localStorage.setItem('admin_seances', JSON.stringify(defaultSeances));
    }
    
    if (storedSalles.length > 0) {
      setSalles(storedSalles);
    } else {
      // Utiliser les données fictives
      const defaultSalles = [
        { id: 1, name: "Salle 1", capacity: 100, cinema_id: 1 },
        { id: 2, name: "Salle 2", capacity: 80, cinema_id: 1 },
        { id: 3, name: "Salle 3", capacity: 120, cinema_id: 2 },
      ];
      setSalles(defaultSalles);
      localStorage.setItem('admin_salles', JSON.stringify(defaultSalles));
    }
    
    setClients([
      { id: 1, username: "john_doe", email: "john@example.com", created_at: "2025-01-15" },
      { id: 2, username: "jane_smith", email: "jane@example.com", created_at: "2025-02-20" },
      { id: 3, username: "alice_wonder", email: "alice@example.com", created_at: "2025-03-05" },
    ]);
    
    setLoading(false);
  }, [navigate]);
  
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
  
  // Gestionnaires pour les actions CRUD
  const handleAddItem = (type) => {
    setEditingItem(null);
    
    if (type === "film") {
      setShowFilmForm(true);
      setShowSeanceForm(false);
      setShowSalleForm(false);
    } else if (type === "seance") {
      setShowFilmForm(false);
      setShowSeanceForm(true);
      setShowSalleForm(false);
    } else if (type === "salle") {
      setShowFilmForm(false);
      setShowSeanceForm(false);
      setShowSalleForm(true);
    }
  };
  
  const handleEditItem = (type, id) => {
    if (type === "film") {
      const filmToEdit = films.find(f => f.id === id);
      if (filmToEdit) {
        setEditingItem(filmToEdit);
        setShowFilmForm(true);
        setShowSeanceForm(false);
        setShowSalleForm(false);
      }
    } else if (type === "seance") {
      const seanceToEdit = seances.find(s => s.id === id);
      if (seanceToEdit) {
        setEditingItem(seanceToEdit);
        setShowFilmForm(false);
        setShowSeanceForm(true);
        setShowSalleForm(false);
      }
    } else if (type === "salle") {
      const salleToEdit = salles.find(s => s.id === id);
      if (salleToEdit) {
        setEditingItem(salleToEdit);
        setShowFilmForm(false);
        setShowSeanceForm(false);
        setShowSalleForm(true);
      }
    } else if (type === "client") {
      alert(`Voir les détails du client avec ID: ${id}`);
    }
  };
  
  const handleDeleteItem = (type, id) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer cet élément ?`)) {
      if (type === "film") {
        const updatedFilms = films.filter(f => f.id !== id);
        setFilms(updatedFilms);
        localStorage.setItem('admin_films', JSON.stringify(updatedFilms));
      } else if (type === "seance") {
        const updatedSeances = seances.filter(s => s.id !== id);
        setSeances(updatedSeances);
        localStorage.setItem('admin_seances', JSON.stringify(updatedSeances));
      } else if (type === "salle") {
        const updatedSalles = salles.filter(s => s.id !== id);
        setSalles(updatedSalles);
        localStorage.setItem('admin_salles', JSON.stringify(updatedSalles));
      }
    }
  };
  
  const handleFormCancel = () => {
    setShowFilmForm(false);
    setShowSeanceForm(false);
    setShowSalleForm(false);
    setEditingItem(null);
  };
  
  // Gestionnaires pour les soumissions de formulaires
  const handleFilmSubmit = (filmData) => {
    let updatedFilms;
    
    if (editingItem) {
      // Mode édition
      updatedFilms = films.map(f => f.id === editingItem.id ? { ...filmData } : f);
    } else {
      // Mode ajout
      const newId = Math.max(...films.map(f => f.id), 0) + 1;
      updatedFilms = [...films, { ...filmData, id: newId }];
    }
    
    setFilms(updatedFilms);
    localStorage.setItem('admin_films', JSON.stringify(updatedFilms));
    
    setShowFilmForm(false);
    setEditingItem(null);
  };
  
  const handleSeanceSubmit = (seanceData) => {
    let updatedSeances;
    
    if (editingItem) {
      // Mode édition
      updatedSeances = seances.map(s => s.id === editingItem.id ? { ...seanceData } : s);
    } else {
      // Mode ajout
      const newId = Math.max(...seances.map(s => s.id), 0) + 1;
      updatedSeances = [...seances, { ...seanceData, id: newId }];
    }
    
    setSeances(updatedSeances);
    localStorage.setItem('admin_seances', JSON.stringify(updatedSeances));
    
    setShowSeanceForm(false);
    setEditingItem(null);
  };
  
  const handleSalleSubmit = (salleData) => {
    let updatedSalles;
    
    if (editingItem) {
      // Mode édition
      updatedSalles = salles.map(s => s.id === editingItem.id ? { ...salleData } : s);
    } else {
      // Mode ajout
      const newId = Math.max(...salles.map(s => s.id), 0) + 1;
      updatedSalles = [...salles, { ...salleData, id: newId }];
    }
    
    setSalles(updatedSalles);
    localStorage.setItem('admin_salles', JSON.stringify(updatedSalles));
    
    setShowSalleForm(false);
    setEditingItem(null);
  };
  
  if (loading) {
    return <div className="text-center py-8">Chargement du tableau de bord...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Tableau de bord Admin
      </h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("films")}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === "films"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Films
          </button>
          <button
            onClick={() => setActiveTab("seances")}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === "seances"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Séances
          </button>
          <button
            onClick={() => setActiveTab("salles")}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === "salles"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Salles
          </button>
          <button
            onClick={() => setActiveTab("clients")}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === "clients"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Clients
          </button>
        </nav>
      </div>
      
      {/* Content based on active tab */}
      <div className="card p-6">
        {activeTab === "films" && (
          <div>
            {/* Afficher le formulaire ou la liste */}
            {showFilmForm ? (
              <FilmForm 
                film={editingItem}
                onSubmit={handleFilmSubmit}
                onCancel={handleFormCancel}
              />
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Liste des Films</h2>
                  <button
                    onClick={() => handleAddItem("film")}
                    className="btn-primary text-sm"
                  >
                    Ajouter un film
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Durée</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Genre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {films.map((film) => (
                        <tr key={film.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{film.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{film.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{film.duration} min</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{film.genre}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              film.status === "active" 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }`}>
                              {film.status === "active" ? "Actif" : "Inactif"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleEditItem("film", film.id)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                            >
                              Modifier
                            </button>
                            <button 
                              onClick={() => handleDeleteItem("film", film.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
        
        {activeTab === "seances" && (
          <div>
            {/* Afficher le formulaire ou la liste */}
            {showSeanceForm ? (
              <SeanceForm 
                seance={editingItem}
                films={films}
                salles={salles}
                onSubmit={handleSeanceSubmit}
                onCancel={handleFormCancel}
              />
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Liste des Séances</h2>
                  <button
                    onClick={() => handleAddItem("seance")}
                    className="btn-primary text-sm"
                  >
                    Ajouter une séance
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Film</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Heure</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prix</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Salle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Places réservées</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {seances.map((seance) => {
                        const film = films.find(f => f.id === seance.film_id);
                        const salle = salles.find(s => s.id === seance.salle_id);
                        
                        return (
                          <tr key={seance.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{seance.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {film ? film.title : `Film ID: ${seance.film_id}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(seance.date_time)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{seance.price} DH</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {salle ? salle.name : `Salle ID: ${seance.salle_id}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{seance.reserved_places}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => handleEditItem("seance", seance.id)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                              >
                                Modifier
                              </button>
                              <button 
                                onClick={() => handleDeleteItem("seance", seance.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
        
        {activeTab === "salles" && (
          <div>
            {/* Afficher le formulaire ou la liste */}
            {showSalleForm ? (
              <SalleForm 
                salle={editingItem}
                onSubmit={handleSalleSubmit}
                onCancel={handleFormCancel}
              />
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Liste des Salles</h2>
                  <button
                    onClick={() => handleAddItem("salle")}
                    className="btn-primary text-sm"
                  >
                    Ajouter une salle
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Capacité</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cinéma ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {salles.map((salle) => (
                        <tr key={salle.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{salle.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{salle.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{salle.capacity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{salle.cinema_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleEditItem("salle", salle.id)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                            >
                              Modifier
                            </button>
                            <button 
                              onClick={() => handleDeleteItem("salle", salle.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
        
        {activeTab === "clients" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Liste des Clients</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nom d'utilisateur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date d'inscription</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{client.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{client.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{client.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{client.created_at}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleEditItem("client", client.id)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                        >
                          Voir détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}