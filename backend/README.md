# Movie Recommendation Backend API

A comprehensive backend API for a movie recommendation system built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with user registration/login
- 🎬 **Movie Management** - CRUD operations for movies with search and filtering
- 📋 **Watchlist Management** - Add/remove movies from user watchlists
- 🎯 **Smart Recommendations** - AI-powered movie recommendations based on user preferences
- 🔍 **Advanced Search** - Full-text search with filters (genre, rating, year, etc.)
- 📊 **Analytics** - User preferences tracking and movie statistics
- 🛡️ **Security** - Rate limiting, input validation, and error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Documentation**: Built-in API documentation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password
- `POST /api/auth/logout` - Logout user

### Movies
- `GET /api/movies` - Get all movies (with pagination and filters)
- `GET /api/movies/:id` - Get single movie
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/genre/:genre` - Get movies by genre
- `GET /api/movies/search` - Search movies
- `GET /api/movies/:id/similar` - Get similar movies
- `GET /api/movies/:id/recommendations` - Get movie recommendations
- `GET /api/movies/genres` - Get available genres

### Watchlist
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist/:movieId` - Add movie to watchlist
- `DELETE /api/watchlist/:movieId` - Remove movie from watchlist
- `GET /api/watchlist/:movieId` - Check if movie is in watchlist
- `POST /api/watchlist/:movieId/watched` - Mark movie as watched
- `GET /api/watchlist/watched` - Get watched movies

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations
- `GET /api/recommendations/content-based` - Get content-based recommendations
- `GET /api/recommendations/trending` - Get trending recommendations

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/movie-recommendation
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   TMDB_API_KEY=ecfa837bb91bbbca17970e60da354c6b
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Database Schema

### User Model
- Personal information (name, email, password)
- Preferences (genres, actors, directors, ratings)
- Watchlist and watched movies
- Quiz results and personality profile

### Movie Model
- Basic information (title, overview, release date)
- Technical details (runtime, budget, revenue)
- Cast and crew information
- Ratings and popularity metrics
- Images and media
- Similar movies and recommendations

## API Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get movies with filters
```bash
curl "http://localhost:3001/api/movies?genres=Action,Drama&minRating=7&page=1&limit=10"
```

### Add movie to watchlist
```bash
curl -X POST http://localhost:3001/api/watchlist/64a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Recommendation Algorithm

The recommendation system uses multiple approaches:

1. **Content-Based Filtering**: Recommends movies based on user's preferred genres, actors, and directors
2. **Collaborative Filtering**: Uses similar users' preferences to suggest movies
3. **Hybrid Approach**: Combines multiple recommendation methods for better results
4. **Trending Fallback**: Shows popular movies when user has no preferences

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS protection
- Helmet for security headers
- Error handling without sensitive data exposure

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

### Project Structure
```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   ├── services/       # Business logic services
│   └── server.js       # Main server file
├── package.json
├── .env.example
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
