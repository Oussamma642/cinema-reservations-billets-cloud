import { useState, useEffect } from "react";

export default function FilmForm({ film, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [status, setStatus] = useState("active");
  const [errors, setErrors] = useState({});
  
  // Si un film est fourni, remplir le formulaire avec ses données (mode édition)
  useEffect(() => {
    if (film) {
      setTitle(film.title || "");
      setDescription(film.description || "");
      setDuration(film.duration ? film.duration.toString() : "");
      setGenre(film.genre || "");
      setReleaseDate(film.release_date || "");
      setPosterUrl(film.poster_url || "");
      setStatus(film.status || "active");
    }
  }, [film]);
  
  const validate = () => {
    const newErrors = {};
    
    if (!title.trim()) newErrors.title = "Le titre est requis";
    if (!description.trim()) newErrors.description = "La description est requise";
    if (!duration) newErrors.duration = "La durée est requise";
    else if (isNaN(duration) || Number(duration) <= 0) newErrors.duration = "La durée doit être un nombre positif";
    if (!genre.trim()) newErrors.genre = "Le genre est requis";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const filmData = {
      title,
      description,
      duration: Number(duration),
      genre,
      release_date: releaseDate || null,
      poster_url: posterUrl || null,
      status
    };
    
    // Si on est en mode édition, ajouter l'ID
    if (film && film.id) {
      filmData.id = film.id;
    }
    
    onSubmit(filmData);
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {film ? "Modifier le film" : "Ajouter un nouveau film"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Titre*
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 ${
                errors.title ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>
          
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 ${
                errors.description ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>
          
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Durée (minutes)*
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 ${
                errors.duration ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration}</p>}
          </div>
          
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Genre*
            </label>
            <input
              type="text"
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 ${
                errors.genre ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.genre && <p className="mt-1 text-sm text-red-500">{errors.genre}</p>}
          </div>
          
          <div>
            <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date de sortie
            </label>
            <input
              type="date"
              id="releaseDate"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Statut
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          
          <div className="col-span-2">
            <label htmlFor="posterUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL de l'affiche
            </label>
            <input
              type="url"
              id="posterUrl"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="https://example.com/poster.jpg"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />
            {posterUrl && (
              <div className="mt-2">
                <img 
                  src={posterUrl} 
                  alt="Aperçu de l'affiche" 
                  className="h-40 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=Image+invalide';
                  }}
                />
              </div>
            )}
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
            {film ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
} 