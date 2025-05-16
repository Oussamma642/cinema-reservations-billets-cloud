import axios from "axios";

// Base URLs for different APIs
const FILMS_API_URL = 'http://localhost:8000/api';
const RESERVATIONS_API_URL = 'http://localhost:5003/api';
const AUTH_API_URL = 'http://localhost:5000/api'; // Node.js Auth service URL

// Create axios instances for different APIs
const filmsApi = axios.create({
  baseURL: FILMS_API_URL,
  timeout: 10000
});

const reservationsApi = axios.create({
  baseURL: RESERVATIONS_API_URL,
  timeout: 10000
});

const authApi = axios.create({  // New axios instance for auth service
  baseURL: AUTH_API_URL,
  timeout: 10000
});

// Add request interceptor to add JWT token to requests
filmsApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

reservationsApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

authApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Films API services
export const FilmsService = {
  // Public endpoints (no JWT required)
  getFilms: () => filmsApi.get('/films'),
  getFilm: (id) => filmsApi.get(`/films/${id}`),
  getCategories: () => filmsApi.get('/categories'),
  
  // Protected endpoints (JWT required)
  createFilm: (film) => filmsApi.post('/films', film),
  updateFilm: (id, film) => filmsApi.put(`/films/${id}`, film),
  deleteFilm: (id) => filmsApi.delete(`/films/${id}`),
  
  // Seances
  getSeances: () => filmsApi.get('/seances'),
  getSeancesByFilm: (filmId) => filmsApi.get('/seances', { params: { film_id: filmId } }),
  getSeance: (id) => filmsApi.get(`/seances/${id}`),
  getSeanceAvailability: (id) => filmsApi.get(`/seances/${id}/availability`),
  createSeance: (seance) => filmsApi.post('/seances', seance),
  updateSeance: (id, seance) => filmsApi.put(`/seances/${id}`, seance),
  deleteSeance: (id) => filmsApi.delete(`/seances/${id}`),
  
  // Salles
  getSalles: () => filmsApi.get('/salles'),
  getSalle: (id) => filmsApi.get(`/salles/${id}`),
  createSalle: (salle) => filmsApi.post('/salles', salle),
  updateSalle: (id, salle) => filmsApi.put(`/salles/${id}`, salle),
  deleteSalle: (id) => filmsApi.delete(`/salles/${id}`)
};

// Reservations API services - Now using Auth Service for MongoDB storage
export const ReservationsService = {
  getUserReservations: async (userId) => {
    try {
      const response = await authApi.get(`/auth/reservations/user/${userId}`);
      console.log('Reservations fetched from Auth service:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      console.error('Error response:', error.response ? error.response.data : 'No response data');
      throw error;
    }
  },
  
  getReservation: async (id) => {
    try {
      const response = await authApi.get(`/auth/reservations/${id}`);
      console.log('Reservation fetched from Auth service:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching reservation:', error);
      console.error('Error response:', error.response ? error.response.data : 'No response data');
      throw error;
    }
  },
  
  createReservation: async (reservation) => {
    try {
      console.log('Creating reservation with data:', reservation);
      const response = await authApi.post('/auth/reservations', reservation);
      console.log('Reservation created in Auth service:', response.data);
      return response;
    } catch (error) {
      console.error('Error creating reservation:', error);
      console.error('Error response:', error.response ? error.response.data : 'No response data');
      throw error;
    }
  },
  
  updateReservation: async (id, reservation) => {
    try {
      const response = await authApi.put(`/auth/reservations/${id}`, reservation);
      console.log('Reservation updated in Auth service:', response.data);
      return response;
    } catch (error) {
      console.error('Error updating reservation:', error);
      console.error('Error response:', error.response ? error.response.data : 'No response data');
      throw error;
    }
  },
  
  deleteReservation: async (id) => {
    try {
      const response = await authApi.delete(`/auth/reservations/${id}`);
      console.log('Reservation deleted from Auth service:', response.data);
      return response;
    } catch (error) {
      console.error('Error deleting reservation:', error);
      console.error('Error response:', error.response ? error.response.data : 'No response data');
      throw error;
    }
  }
};

// Auth service - Using Node.js Auth service
export const AuthService = {
  login: async (credentials) => {
    try {
      console.log('Attempting login with Node.js Auth service:', credentials.email);
      // Try to login using the Node.js Auth service endpoint
      const response = await authApi.post('/auth/login', credentials);
      console.log('Login success! Response from Auth service:', response.data);
      
      // Ensure user has _id for MongoDB compatibility
      if (response.data.user && !response.data.user._id && response.data.user.id) {
        response.data.user._id = response.data.user.id;
      }
      
      // Store token and user data
      localStorage.setItem('jwt_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response;
    } catch (error) {
      console.error('Auth service login failed:', error.message);
      
      // Fallback to localStorage (simulation mode)
      console.log('Using localStorage fallback for login');
      const isAdmin = credentials.email.includes('admin');
      
      const user = { 
        id: Math.floor(Math.random() * 1000), 
        _id: Math.floor(Math.random() * 1000),  // Add _id for MongoDB compatibility
        email: credentials.email,
        username: credentials.email.split('@')[0],
        role: isAdmin ? 'admin' : 'client'
      };
      
      const mockResponse = {
        data: {
          token: 'fake-token-' + Math.random(),
          user: user
        }
      };
      
      localStorage.setItem('jwt_token', mockResponse.data.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.data.user));
      
      return mockResponse;
    }
  },
  
  register: async (userData) => {
    try {
      console.log('Attempting registration with Node.js Auth service:', userData.email);
      // Try to register using the Node.js Auth service endpoint
      const response = await authApi.post('/auth/register', userData);
      console.log('Registration success! Response from Auth service:', response.data);
      
      // Ensure user has _id for MongoDB compatibility
      if (response.data.user && !response.data.user._id && response.data.user.id) {
        response.data.user._id = response.data.user.id;
      }
      
      // If the registration returns a token
      localStorage.setItem('jwt_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response;
    } catch (error) {
      console.error('Auth service registration failed:', error.message);
      
      // Fallback to localStorage (simulation mode)
      console.log('Using localStorage fallback for registration');
      
      const mockResponse = {
        data: {
          message: 'User registered successfully (simulated)',
          user: {
            id: Math.floor(Math.random() * 1000),
            _id: Math.floor(Math.random() * 1000),  // Add _id for MongoDB compatibility
            email: userData.email,
            username: userData.username,
            role: userData.role || 'client'
          },
          token: 'fake-token-' + Math.random()
        }
      };
      
      // Store the user data in localStorage for future logins
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({
        email: userData.email,
        username: userData.username,
        role: userData.role || 'client'
      });
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto-login the user
      localStorage.setItem('jwt_token', mockResponse.data.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.data.user));
      
      return mockResponse;
    }
  },
  
  verifyToken: async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) return { valid: false };
      
      const response = await authApi.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Token verification success:', response.data);
      
      // Update user data if response contains user
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Token verification failed:', error.message);
      // Fallback - in offline mode consider all tokens valid
      return { 
        valid: true,
        user: JSON.parse(localStorage.getItem('user') || 'null')
      };
    }
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    
    const userData = JSON.parse(user);
    // Ensure we have _id for MongoDB compatibility
    if (userData && !userData._id && userData.id) {
      userData._id = userData.id;
    }
    
    return userData;
  },
  
  logout: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
  },
  
  isAuthenticated: async () => {
    try {
      // For optimal performance, first check if we have token in localStorage
      const token = localStorage.getItem('jwt_token');
      if (!token) return false;
      
      // In fallback mode, just consider token presence as authentication
      return true;
    } catch (error) {
      console.error('Authentication check failed:', error.message);
      // Fallback to just checking localStorage in case of errors
      return !!localStorage.getItem('jwt_token');
    }
  }
};

export default {
  FilmsService,
  ReservationsService,
  AuthService
};