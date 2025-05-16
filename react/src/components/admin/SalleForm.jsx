import { useState, useEffect } from "react";

export default function SalleForm({ salle, onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [cinemaId, setCinemaId] = useState("1");  // Par défaut, cinéma 1
  const [errors, setErrors] = useState({});
  
  // Si une salle est fournie, remplir le formulaire avec ses données (mode édition)
  useEffect(() => {
    if (salle) {
      setName(salle.name || "");
      setCapacity(salle.capacity ? salle.capacity.toString() : "");
      setCinemaId(salle.cinema_id ? salle.cinema_id.toString() : "1");
    }
  }, [salle]);
  
  const validate = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = "Le nom est requis";
    if (!capacity) newErrors.capacity = "La capacité est requise";
    else if (isNaN(capacity) || Number(capacity) <= 0) newErrors.capacity = "La capacité doit être un nombre positif";
    if (!cinemaId) newErrors.cinemaId = "Le cinéma est requis";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const salleData = {
      name,
      capacity: Number(capacity),
      cinema_id: Number(cinemaId)
    };
    
    // Si on est en mode édition, ajouter l'ID
    if (salle && salle.id) {
      salleData.id = salle.id;
    }
    
    onSubmit(salleData);
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {salle ? "Modifier la salle" : "Ajouter une nouvelle salle"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom de la salle*
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 ${
                errors.name ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Salle 1"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Capacité (nombre de places)*
            </label>
            <input
              type="number"
              id="capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              min="1"
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 ${
                errors.capacity ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="100"
            />
            {errors.capacity && <p className="mt-1 text-sm text-red-500">{errors.capacity}</p>}
          </div>
          
          <div>
            <label htmlFor="cinemaId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cinéma*
            </label>
            <select
              id="cinemaId"
              value={cinemaId}
              onChange={(e) => setCinemaId(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 ${
                errors.cinemaId ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <option value="1">Cinéma 1</option>
              <option value="2">Cinéma 2</option>
            </select>
            {errors.cinemaId && <p className="mt-1 text-sm text-red-500">{errors.cinemaId}</p>}
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
            {salle ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
} 