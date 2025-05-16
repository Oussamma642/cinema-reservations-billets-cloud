import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [films, setFilms] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userInfo = localStorage.getItem("USER");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("ACCESS_TOKEN");
        
        // Get featured films (limiting to 4 for the dashboard)
        const filmsResponse = await axios.get("http://localhost:8000/api/films", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Get user reservations
        const userId = JSON.parse(localStorage.getItem("USER")).id;
        const reservationsResponse = await axios.get(`http://localhost:5000/api/reservations/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setFilms(filmsResponse.data.slice(0, 4)); // Only show first 4 films
        setUserReservations(reservationsResponse.data.slice(0, 3)); // Only show first 3 reservations
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.username || "User"}!</h1>
        <p className="text-gray-600">Explore the latest films and manage your reservations.</p>
      </div>
      
      {/* Featured Films Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Featured Films</h2>
          <Link to="/films" className="text-blue-600 hover:text-blue-800">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {films.length > 0 ? (
            films.map((film) => (
              <div key={film.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {film.poster_url && (
                  <img 
                    src={film.poster_url} 
                    alt={film.title} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{film.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{film.description}</p>
                  <Link 
                    to={`/films/${film.id}`} 
                    className="block w-full text-center bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-4">
              <p className="text-gray-500">No films available at the moment.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Reservations Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Recent Reservations</h2>
          <Link to="/reservations" className="text-blue-600 hover:text-blue-800">View All</Link>
        </div>
        
        {userReservations.length > 0 ? (
          <div className="space-y-4">
            {userReservations.map((reservation) => (
              <div 
                key={reservation._id} 
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      Reservation #{reservation._id.slice(-6)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {reservation.numberOfPlaces} tickets • {reservation.totalPrice} DH
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(reservation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    reservation.status === 'accepted' 
                      ? 'bg-green-100 text-green-800' 
                      : reservation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {reservation.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">You don't have any reservations yet.</p>
            <Link
              to="/films"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Browse Films
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

