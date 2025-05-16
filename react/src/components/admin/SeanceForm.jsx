import { useState, useEffect } from "react";

export default function SeanceForm({ seance, films, salles, onSubmit, onCancel }) {
  const [filmId, setFilmId] = useState("");
  const [salleId, setSalleId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  
  // Si une séance est fournie, remplir le formulaire avec ses données (mode édition)
  useEffect(() => {
    if (seance) {
      setFilmId(seance.film_id ? seance.film_id.toString() : "");
      setSalleId(seance.salle_id ? seance.salle_id.toString() : "");
      
      // Formater la date pour l'input datetime-local
      if (seance.date_time) {
        const dateObj = new Date(seance.date_time);
        const formattedDate = dateObj.toISOString().slice(0, 16);
        setDateTime(formattedDate);
      }
      
      setPrice(seance.price ? seance.price.toString() : "");
    }
  }, [seance]);
  
  const validate = () => {
    const newErrors = {};
    
    if (!filmId) newErrors.filmId = "Le film est requis";
    if (!salleId) newErrors.salleId = "La salle est requise";
    if (!dateTime) newErrors.dateTime = "La date et l'heure sont requises";
    if (!price) newErrors.price = "Le prix est requis";
    else if (isNaN(price) || Number(price) <= 0) newErrors.price = "Le prix doit être un nombre positif";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const seanceData = {
      film_id: Number(filmId),
      salle_id: Number(salleId),
      date_time: dateTime,
      price: Number(price)
    };
    
    // Si on est en mode édition, ajouter l'ID et les places réservées
    if (seance && seance.id) {
      seanceData.id = seance.id;
      seanceData.reserved_places = seance.reserved_places || 0;
    } else {
      seanceData.reserved_places = 0;
    }
    
    onSubmit(seanceData);
  };
  
  // Pour l'affichage du titre du film dans le select
  const getFilmTitle = (id) => {
    const film = films.find(f => f.id === Number(id));
    return film ? film.title : "";
  };
  
  // Pour l'affichage des infos de la salle dans le select
  const getSalleInfo = (id) => {
    const salle = salles.find(s => s.id === Number(id));
    return salle ? `${salle.name} (${salle.capacity} places)` : "";
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {seance ? "Modifier la séance" : "Ajouter une nouvelle séance"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="filmId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Film*
            </label>
            <select
              id="filmId"
              value={filmId}
              onChange={(e) => setFilmId(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 ${
                errors.filmId ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <option value="">Sélectionner un film</option>
              {films.map((film) => (
                <option key={film.id} value={film.id}>
                  {film.title}
                </option>
              ))}
            </select>
            {errors.filmId && <p className="mt-1 text-sm text-red-500">{errors.filmId}</p>}
            
            {filmId && (
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Film sélectionné: {getFilmTitle(filmId)}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="salleId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Salle*
            </label>
            <select
              id="salleId"
              value={salleId}
              onChange={(e) => setSalleId(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 ${
                errors.salleId ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <option value="">Sélectionner une salle</option>
              {salles.map((salle) => (
                <option key={salle.id} value={salle.id}>
                  {salle.name} - {salle.capacity} places
                </option>
              ))}
            </select>
            {errors.salleId && <p className="mt-1 text-sm text-red-500">{errors.salleId}</p>}
            
            {salleId && (
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Salle sélectionnée: {getSalleInfo(salleId)}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date et heure*
            </label>
            <input
              type="datetime-local"
              id="dateTime"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 ${
                errors.dateTime ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.dateTime && <p className="mt-1 text-sm text-red-500">{errors.dateTime}</p>}
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prix (DH)*
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 ${
                errors.price ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {seance ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
} 