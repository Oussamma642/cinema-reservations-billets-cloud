
const axios = require('axios');

const api = {
  getFilmDetails: async (filmId) => {
    try {
      const response = await axios.get(`${process.env.FILMS_API_URL}/api/films/${filmId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyToken: async (token) => {
    try {
      const response = await axios.get(`${process.env.AUTH_API_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = api;

