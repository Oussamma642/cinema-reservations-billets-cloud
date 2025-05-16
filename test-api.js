// Script to test API connections
const axios = require('axios');

// API Endpoints
const AUTH_API_URL = 'http://localhost:5000/api/auth';
const FILMS_API_URL = 'http://localhost:8000/api';

// Credentials for testing
const testCredentials = {
  email: 'user1@example.com',
  password: 'password123'
};

// Test function
async function testAPIs() {
  console.log('Starting API tests...');
  let token = null;

  try {
    // 1. Test auth service health
    console.log('\n--- Testing Auth Service Health ---');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('Auth service health check:', healthResponse.data);

    // 2. Test login
    console.log('\n--- Testing Login ---');
    const loginResponse = await axios.post(`${AUTH_API_URL}/login`, testCredentials);
    console.log('Login successful!');
    console.log('User:', loginResponse.data.user);
    token = loginResponse.data.token;
    console.log('Token received:', token ? 'Yes (JWT)' : 'No');

    if (!token) {
      throw new Error('No token received from login');
    }

    // 3. Test token verification
    console.log('\n--- Testing Token Verification ---');
    const verifyResponse = await axios.get(`${AUTH_API_URL}/verify-token`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Token verification result:', verifyResponse.data.valid ? 'Valid' : 'Invalid');

    // 4. Test films list API
    console.log('\n--- Testing Films API ---');
    try {
      const filmsResponse = await axios.get(`${FILMS_API_URL}/films`);
      console.log('Films API response:', filmsResponse.data.length, 'films found');
      console.log('Sample film:', filmsResponse.data[0] ? filmsResponse.data[0].title : 'No films');
    } catch (err) {
      console.error('Films API error:', err.message);
    }

    // 5. Test seances list API
    console.log('\n--- Testing Seances API ---');
    try {
      const seancesResponse = await axios.get(`${FILMS_API_URL}/seances`);
      console.log('Seances API response:', seancesResponse.data.length, 'seances found');
      
      if (seancesResponse.data.length > 0) {
        console.log('Test seance ID for reservation:', seancesResponse.data[0].id);
      }
    } catch (err) {
      console.error('Seances API error:', err.message);
    }

    // 6. Test protected route
    console.log('\n--- Testing Protected Route ---');
    try {
      const usersResponse = await axios.get(`${AUTH_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Protected route access successful');
      console.log('Users found:', usersResponse.data.length);
    } catch (err) {
      console.error('Protected route error:', err.message);
    }

    console.log('\n--- API Test Complete ---');
    console.log('Auth Service: ✅');
    console.log('Films API: ' + (filmsResponse ? '✅' : '❌'));
    console.log('Seances API: ' + (seancesResponse ? '✅' : '❌'));

    console.log('\n--- Test User Credentials ---');
    console.log('Admin user: admin@cinema.com / password123');
    console.log('Regular user: user1@example.com / password123');

  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests
testAPIs(); 