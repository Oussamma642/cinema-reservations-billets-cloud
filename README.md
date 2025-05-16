# Cinema Reservation System

A full-stack application for managing cinema ticket reservations using a microservices architecture.

## Architecture

The system consists of the following components:

1. **Auth Service (Node.js + MongoDB)**: Handles user authentication and authorization using JWT tokens
2. **Films & Seances Service (Laravel)**: Manages films, screenings, and theater information
3. **React Frontend**: User interface for browsing films, creating reservations, and user management

## Prerequisites

- Node.js (v16+)
- MongoDB (v4+)
- PHP (v8+) with Composer
- Laravel (v10+)

## Setup Instructions

### 1. Auth Service Setup

```bash
# Navigate to auth service directory
cd auth-service

# Install dependencies
npm install

# Set up environment variables (or create .env file)
# MONGO_URI=mongodb://localhost:27017/cinema-auth
# JWT_SECRET=your-secret-key
# PORT=5000

# Seed the database with test users
npm run seed

# Start the service
npm start
```

Test users created:
- Admin: admin@cinema.com / password123
- User: user1@example.com / password123

### 2. Films Service Setup

```bash
# Navigate to the films-seances directory
cd films-seances

# Set up Laravel environment
composer install
php artisan key:generate

# Run migrations and seed the database
php artisan migrate --seed

# Start the service
php artisan serve --port=8000
```

### 3. React Frontend Setup

```bash
# Navigate to the React directory
cd react

# Install dependencies
npm install

# Start the frontend
npm start
```

## Running the Entire System

For convenience, you can use the provided Node.js script to start all services at once:

```bash
# From the project root
node start-all.js
```

## Testing the API Connection

You can test if the APIs are working correctly using the test script:

```bash
# From the project root
node test-api.js
```

## Service URLs

- Auth Service: http://localhost:5000
- Films API: http://localhost:8000/api
- React Frontend: http://localhost:3000

## System Flow

1. Users register/login through the auth service
2. JWT tokens are stored in localStorage
3. Protected routes require valid JWT tokens
4. Reservations are stored in MongoDB
5. Film and screening data comes from the Laravel API

## Troubleshooting

- If you see "Page Not Found" when trying to access http://localhost:3000/reservations/create/2, make sure:
  - The auth service is running
  - You're logged in
  - Seance with ID 2 exists in the database
  - The API endpoints are accessible

- If MongoDB connection fails, check:
  - MongoDB service is running
  - Connection string is correct
  - Database user has proper permissions

## Development

- For auth service development: `npm run dev`
- For React development: `npm start`
- For Laravel development: `php artisan serve --port=8000`

## API Endpoints

### Public Endpoints (No Authentication Required)

- `GET /api/films` - Get all films
- `GET /api/films/{id}` - Get a specific film by ID
- `GET /api/categories` - Get all categories

### Protected Endpoints (JWT Authentication Required)

**Films:**
- `POST /api/films` - Create a new film
- `PUT /api/films/{id}` - Update a film
- `DELETE /api/films/{id}` - Delete a film

**Theaters:**
- `GET /api/salles` - Get all theaters
- `POST /api/salles` - Create a new theater
- `GET /api/salles/{id}` - Get a specific theater
- `PUT /api/salles/{id}` - Update a theater
- `DELETE /api/salles/{id}` - Delete a theater

**Screenings:**
- `GET /api/seances` - Get all screenings
- `POST /api/seances` - Create a new screening
- `GET /api/seances/{id}` - Get a specific screening
- `PUT /api/seances/{id}` - Update a screening
- `DELETE /api/seances/{id}` - Delete a screening
- `GET /api/seances/{seance}/availability` - Check seat availability for a screening

## Authentication

The API uses JWT for authentication. To access protected endpoints:

1. Obtain a JWT token by logging in
2. Include the token in the Authorization header of your requests:
   ```
   Authorization: Bearer your_jwt_token
   ```

## Data Models

### Film
- `id` - Unique identifier
- `title` - Film title
- `description` - Film description
- `duration` - Duration in minutes
- `release_date` - Release date
- `poster_url` - URL to the film poster

### Category
- `id` - Unique identifier
- `name` - Category name 
- `description` - Category description

### Theater (Salle)
- `id` - Unique identifier
- `name` - Theater name
- `capacity` - Number of seats
- `cinema_id` - ID of the cinema

### Screening (Seance)
- `id` - Unique identifier
- `film_id` - Film being screened
- `salle_id` - Theater where screening happens
- `date_time` - Date and time of screening
- `price` - Ticket price
- `reserved_places` - Number of reserved seats 