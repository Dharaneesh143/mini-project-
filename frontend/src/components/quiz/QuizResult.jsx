import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react'
import movieService from '../../services/movieService'
import MovieCard from '../movie/MovieCard'

const QuizResult = ({ answers, onRetake }) => {
  const navigate = useNavigate()
  const [recommendedMovies, setRecommendedMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Generate movie recommendations based on quiz answers
  useEffect(() => {
    const generateRecommendations = async () => {
      try {
        setLoading(true)
        const recommendedGenres = getRecommendedGenres()
        console.log('Recommended genres:', recommendedGenres)
        
        // Fetch movies from different genres based on quiz answers
        const moviePromises = recommendedGenres.slice(0, 3).map(async (genre) => {
          try {
            const response = await movieService.getMoviesByGenre(genre, 1)
            return response.movies.slice(0, 2) // Get 2 movies per genre
          } catch (error) {
            console.error(`Error fetching ${genre} movies:`, error)
            return []
          }
        })

        const movieArrays = await Promise.all(moviePromises)
        const allMovies = movieArrays.flat()
        
        // Shuffle and limit to 6 movies
        const shuffledMovies = allMovies.sort(() => 0.5 - Math.random())
        setRecommendedMovies(shuffledMovies.slice(0, 6))
      } catch (err) {
        console.error('Error generating recommendations:', err)
        setError('Failed to generate movie recommendations')
      } finally {
        setLoading(false)
      }
    }

    if (answers.length > 0) {
      generateRecommendations()
    }
  }, [answers])

  // Determine recommended genres based on quiz answers
  const getRecommendedGenres = () => {
    const genreAnswer = answers.find(a => a.questionId === 1)?.answer
    const moodAnswer = answers.find(a => a.questionId === 2)?.answer
    const timeAnswer = answers.find(a => a.questionId === 3)?.answer
    const eraAnswer = answers.find(a => a.questionId === 4)?.answer

    let recommendedGenres = []

    // Primary genre based on first question
    switch (genreAnswer) {
      case 'action':
        recommendedGenres = ['Action', 'Adventure', 'Thriller']
        break
      case 'comedy':
        recommendedGenres = ['Comedy', 'Romance']
        break
      case 'romance':
        recommendedGenres = ['Romance', 'Drama']
        break
      case 'horror':
        recommendedGenres = ['Horror', 'Thriller', 'Mystery']
        break
      case 'drama':
        recommendedGenres = ['Drama', 'History']
        break
      case 'sci-fi':
        recommendedGenres = ['Science Fiction', 'Fantasy']
        break
      default:
        recommendedGenres = ['Drama', 'Action', 'Comedy']
    }

    // Add mood-based genres
    switch (moodAnswer) {
      case 'exciting':
        recommendedGenres = [...recommendedGenres, 'Action', 'Adventure']
        break
      case 'relaxing':
        recommendedGenres = [...recommendedGenres, 'Family', 'Animation']
        break
      case 'emotional':
        recommendedGenres = [...recommendedGenres, 'Drama', 'Romance']
        break
      case 'funny':
        recommendedGenres = [...recommendedGenres, 'Comedy']
        break
      case 'mysterious':
        recommendedGenres = [...recommendedGenres, 'Mystery', 'Thriller']
        break
    }

    // Remove duplicates and return
    return [...new Set(recommendedGenres)]
  }

  // Simple logic to determine personality based on answers
  const getPersonality = () => {
    const genreAnswer = answers.find(a => a.questionId === 1)?.answer
    const moodAnswer = answers.find(a => a.questionId === 2)?.answer
    const timeAnswer = answers.find(a => a.questionId === 3)?.answer

    if (genreAnswer === 'action') {
      return {
        title: 'The Action Enthusiast 🔥',
        description: 'You love thrillers, sci-fi, and fast-paced stories that keep you on the edge of your seat!',
        emoji: '🚀'
      }
    } else if (genreAnswer === 'comedy') {
      return {
        title: 'The Comedy Lover 😂',
        description: 'You enjoy light-hearted films that make you laugh and forget about your worries!',
        emoji: '🎭'
      }
    } else if (genreAnswer === 'romance') {
      return {
        title: 'The Romantic Soul 💕',
        description: 'You appreciate heartfelt stories about love, relationships, and human connections!',
        emoji: '💖'
      }
    } else if (genreAnswer === 'horror') {
      return {
        title: 'The Thrill Seeker 👻',
        description: 'You crave suspense, mystery, and the adrenaline rush of horror films!',
        emoji: '🧟'
      }
    } else {
      return {
        title: 'The Movie Explorer 🎬',
        description: 'You have diverse tastes and enjoy discovering new genres and stories!',
        emoji: '🎯'
      }
    }
  }

  const personality = getPersonality()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Personality Section */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{personality.emoji}</div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Movie Personality: {personality.title}
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed mb-6">
            {personality.description}
          </p>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span className="text-lg font-semibold">AI Analysis Complete</span>
          </div>
          <p className="text-gray-400 text-center">
            Based on your answers, we've analyzed thousands of movies to find your perfect matches.
          </p>
        </div>

        {/* Movie Recommendations Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Your Personalized Movie Recommendations
          </h2>
          
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="text-center text-red-400 bg-red-900/20 p-6 rounded-lg mb-8">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && recommendedMovies.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recommendedMovies.map((movie) => (
                <MovieCard
                  key={movie.id || movie.tmdbId}
                  movie={movie}
                  showActions={false}
                />
              ))}
            </div>
          )}

          {!loading && !error && recommendedMovies.length === 0 && (
            <div className="text-center text-gray-400 bg-gray-800/50 p-6 rounded-lg">
              <p>No movies found based on your preferences. Try retaking the quiz!</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/recommendations')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3"
          >
            <span>View More Recommendations</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onRetake}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizResult
