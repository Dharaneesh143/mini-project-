const mongoose = require('mongoose')
const Movie = require('../models/Movie')
require('dotenv').config()

// Sample movie data
const sampleMovies = [
  {
    title: "The Dark Knight",
    originalTitle: "The Dark Knight",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    tagline: "Why So Serious?",
    genres: ["Action", "Crime", "Drama"],
    releaseDate: new Date("2008-07-18"),
    runtime: 152,
    adult: false,
    originalLanguage: "en",
    spokenLanguages: ["English", "Mandarin"],
    productionCountries: ["United States of America", "United Kingdom"],
    budget: 185000000,
    revenue: 1004558444,
    popularity: 85.5,
    voteAverage: 9.0,
    voteCount: 25000,
    posterPath: "https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=300&h=450&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=1200&h=675&fit=crop",
    cast: [
      { id: 1, name: "Christian Bale", character: "Bruce Wayne / Batman", order: 0 },
      { id: 2, name: "Heath Ledger", character: "Joker", order: 1 },
      { id: 3, name: "Aaron Eckhart", character: "Harvey Dent", order: 2 }
    ],
    crew: [
      { id: 1, name: "Christopher Nolan", job: "Director", department: "Directing" },
      { id: 2, name: "Jonathan Nolan", job: "Writer", department: "Writing" }
    ],
    director: "Christopher Nolan",
    writers: ["Jonathan Nolan", "Christopher Nolan"],
    producers: ["Christopher Nolan", "Emma Thomas"],
    keywords: ["superhero", "crime", "thriller", "drama"],
    externalIds: {
      imdbId: "tt0468569"
    },
    status: "Released"
  },
  {
    title: "Inception",
    originalTitle: "Inception",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    tagline: "Your mind is the scene of the crime.",
    genres: ["Action", "Sci-Fi", "Thriller"],
    releaseDate: new Date("2010-07-16"),
    runtime: 148,
    adult: false,
    originalLanguage: "en",
    spokenLanguages: ["English", "Japanese", "French"],
    productionCountries: ["United States of America", "United Kingdom"],
    budget: 160000000,
    revenue: 836836967,
    popularity: 78.2,
    voteAverage: 8.8,
    voteCount: 32000,
    posterPath: "https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=300&h=450&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=1200&h=675&fit=crop",
    cast: [
      { id: 4, name: "Leonardo DiCaprio", character: "Cobb", order: 0 },
      { id: 5, name: "Marion Cotillard", character: "Mal", order: 1 },
      { id: 6, name: "Tom Hardy", character: "Eames", order: 2 }
    ],
    crew: [
      { id: 1, name: "Christopher Nolan", job: "Director", department: "Directing" },
      { id: 1, name: "Christopher Nolan", job: "Writer", department: "Writing" }
    ],
    director: "Christopher Nolan",
    writers: ["Christopher Nolan"],
    producers: ["Christopher Nolan", "Emma Thomas"],
    keywords: ["sci-fi", "thriller", "action", "mystery"],
    externalIds: {
      imdbId: "tt1375666"
    },
    status: "Released"
  },
  {
    title: "Pulp Fiction",
    originalTitle: "Pulp Fiction",
    overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    tagline: "Just because you are a character doesn't mean you have character.",
    genres: ["Crime", "Drama"],
    releaseDate: new Date("1994-10-14"),
    runtime: 154,
    adult: false,
    originalLanguage: "en",
    spokenLanguages: ["English", "Spanish", "French"],
    productionCountries: ["United States of America"],
    budget: 8500000,
    revenue: 213928762,
    popularity: 65.8,
    voteAverage: 8.9,
    voteCount: 25000,
    posterPath: "https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=300&h=450&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=1200&h=675&fit=crop",
    cast: [
      { id: 7, name: "John Travolta", character: "Vincent Vega", order: 0 },
      { id: 8, name: "Uma Thurman", character: "Mia Wallace", order: 1 },
      { id: 9, name: "Samuel L. Jackson", character: "Jules Winnfield", order: 2 }
    ],
    crew: [
      { id: 3, name: "Quentin Tarantino", job: "Director", department: "Directing" },
      { id: 3, name: "Quentin Tarantino", job: "Writer", department: "Writing" }
    ],
    director: "Quentin Tarantino",
    writers: ["Quentin Tarantino"],
    producers: ["Lawrence Bender"],
    keywords: ["crime", "drama", "thriller", "comedy"],
    externalIds: {
      imdbId: "tt0110912"
    },
    status: "Released"
  },
  {
    title: "The Shawshank Redemption",
    originalTitle: "The Shawshank Redemption",
    overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    tagline: "Fear can hold you prisoner. Hope can set you free.",
    genres: ["Drama"],
    releaseDate: new Date("1994-09-23"),
    runtime: 142,
    adult: false,
    originalLanguage: "en",
    spokenLanguages: ["English"],
    productionCountries: ["United States of America"],
    budget: 25000000,
    revenue: 28341469,
    popularity: 72.1,
    voteAverage: 9.3,
    voteCount: 24000,
    posterPath: "https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=300&h=450&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=1200&h=675&fit=crop",
    cast: [
      { id: 10, name: "Tim Robbins", character: "Andy Dufresne", order: 0 },
      { id: 11, name: "Morgan Freeman", character: "Ellis Boyd 'Red' Redding", order: 1 },
      { id: 12, name: "Bob Gunton", character: "Warden Norton", order: 2 }
    ],
    crew: [
      { id: 4, name: "Frank Darabont", job: "Director", department: "Directing" },
      { id: 4, name: "Frank Darabont", job: "Writer", department: "Writing" }
    ],
    director: "Frank Darabont",
    writers: ["Frank Darabont"],
    producers: ["Niki Marvin"],
    keywords: ["drama", "prison", "friendship", "redemption"],
    externalIds: {
      imdbId: "tt0111161"
    },
    status: "Released"
  },
  {
    title: "The Godfather",
    originalTitle: "The Godfather",
    overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    tagline: "An offer you can't refuse.",
    genres: ["Crime", "Drama"],
    releaseDate: new Date("1972-03-24"),
    runtime: 175,
    adult: false,
    originalLanguage: "en",
    spokenLanguages: ["English", "Italian", "Latin"],
    productionCountries: ["United States of America"],
    budget: 6000000,
    revenue: 287000000,
    popularity: 68.9,
    voteAverage: 9.2,
    voteCount: 18000,
    posterPath: "https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=300&h=450&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=1200&h=675&fit=crop",
    cast: [
      { id: 13, name: "Marlon Brando", character: "Don Vito Corleone", order: 0 },
      { id: 14, name: "Al Pacino", character: "Michael Corleone", order: 1 },
      { id: 15, name: "James Caan", character: "Sonny Corleone", order: 2 }
    ],
    crew: [
      { id: 5, name: "Francis Ford Coppola", job: "Director", department: "Directing" },
      { id: 6, name: "Mario Puzo", job: "Writer", department: "Writing" }
    ],
    director: "Francis Ford Coppola",
    writers: ["Mario Puzo", "Francis Ford Coppola"],
    producers: ["Albert S. Ruddy"],
    keywords: ["crime", "drama", "family", "mob"],
    externalIds: {
      imdbId: "tt0068646"
    },
    status: "Released"
  }
]

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to MongoDB')

    // Clear existing movies
    await Movie.deleteMany({})
    console.log('Cleared existing movies')

    // Insert sample movies
    const movies = await Movie.insertMany(sampleMovies)
    console.log(`Inserted ${movies.length} movies`)

    // Update similar movies and recommendations
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i]
      const similarMovies = await movie.getSimilarMovies(3)
      const recommendations = await movie.getRecommendations(5)
      
      movie.similarMovies = similarMovies.map(m => m._id)
      movie.recommendations = recommendations.map(m => m._id)
      await movie.save()
    }

    console.log('Updated similar movies and recommendations')
    console.log('Database seeded successfully!')

    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase()
}

module.exports = seedDatabase
