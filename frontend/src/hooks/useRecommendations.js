import { useState, useEffect } from 'react'
import mockMovies from '../data/mockMovies'
import movieService from '../services/movieService'

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [personalityType, setPersonalityType] = useState(null)
  const [trending, setTrending] = useState([])
  const [timeBased, setTimeBased] = useState([])
  const [newReleases, setNewReleases] = useState([])

  // Load saved personality type from localStorage
  useEffect(() => {
    const savedPersonality = localStorage.getItem('personalityType')
    if (savedPersonality) {
      setPersonalityType(savedPersonality)
      generateRecommendations(savedPersonality)
    }
  }, [])

  // Load trending and time-based movies
  useEffect(() => {
    setTrending(mockMovies.slice(0, 5))
    setTimeBased(mockMovies.slice(5, 10))

    // Load new releases from TMDB
    const loadNewReleases = async () => {
      try {
        const response = await movieService.getUpcomingMovies()
        setNewReleases(response.data.slice(0, 5))
      } catch (err) {
        console.error('Failed to load new releases:', err)
        // Fallback to mock movies
        setNewReleases(mockMovies.slice(10, 15))
      }
    }
    loadNewReleases()
  }, [])

  const generateRecommendations = async (personality = personalityType) => {
    if (!personality) return

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const recommendationsByPersonality = {
        adventurous: [
          {
            id: 101,
            title: "Mad Max: Fury Road",
            overview: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler.",
            posterPath: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
            voteAverage: 8.1,
            releaseDate: "2015-05-15",
            genres: ["Action", "Adventure", "Sci-Fi"],
            reason: "Perfect for adventure seekers who love high-octane action!"
          },
          {
            id: 102,
            title: "John Wick",
            overview: "An ex-hit-man comes out of retirement to track down the gangsters.",
            posterPath: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
            voteAverage: 7.4,
            releaseDate: "2014-10-24",
            genres: ["Action", "Crime", "Thriller"],
            reason: "Non-stop action with incredible choreography!"
          }
        ],
        romantic: [
          {
            id: 201,
            title: "The Princess Bride",
            overview: "A classic fairy tale of true love and high adventure.",
            posterPath: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
            voteAverage: 8.0,
            releaseDate: "1987-09-25",
            genres: ["Adventure", "Family", "Fantasy", "Comedy", "Romance"],
            reason: "A timeless romantic adventure that warms the heart!"
          },
          {
            id: 202,
            title: "La La Land",
            overview: "A jazz musician and an aspiring actress fall in love.",
            posterPath: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
            voteAverage: 8.0,
            releaseDate: "2016-12-09",
            genres: ["Comedy", "Drama", "Music", "Romance"],
            reason: "Beautiful romance with stunning musical numbers!"
          }
        ],
        'thrill-seeker': [
          {
            id: 301,
            title: "Get Out",
            overview: "A young African-American visits his white girlfriend's parents.",
            posterPath: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
            voteAverage: 7.7,
            releaseDate: "2017-02-24",
            genres: ["Horror", "Mystery", "Thriller"],
            reason: "Mind-bending thriller that will keep you on edge!"
          },
          {
            id: 302,
            title: "Gone Girl",
            overview: "With his wife's disappearance having become the focus of an intense media circus.",
            posterPath: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
            voteAverage: 8.1,
            releaseDate: "2014-10-01",
            genres: ["Mystery", "Thriller", "Drama"],
            reason: "Psychological thriller with shocking twists!"
          }
        ],
        intellectual: [
          {
            id: 401,
            title: "The Shawshank Redemption",
            overview: "Two imprisoned men bond over a number of years.",
            posterPath: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
            voteAverage: 9.3,
            releaseDate: "1994-09-23",
            genres: ["Drama"],
            reason: "A profound story about hope and human resilience!"
          },
          {
            id: 402,
            title: "12 Angry Men",
            overview: "A jury holdout attempts to prevent a miscarriage of justice.",
            posterPath: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
            voteAverage: 9.0,
            releaseDate: "1957-04-10",
            genres: ["Crime", "Drama"],
            reason: "Masterful exploration of justice and human nature!"
          }
        ]
      }

      const personalityRecommendations = recommendationsByPersonality[personality] || []
      setRecommendations(personalityRecommendations)
    } catch (err) {
      setError('Failed to generate recommendations. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const updatePersonalityType = (newPersonality) => {
    setPersonalityType(newPersonality)
    localStorage.setItem('personalityType', newPersonality)
    generateRecommendations(newPersonality)
  }

  const getRecommendationsByGenre = (genre) => {
    return recommendations.filter(movie => 
      movie.genres && movie.genres.includes(genre)
    )
  }

  const refreshRecommendations = () => {
    generateRecommendations()
  }

  const clearRecommendations = () => {
    setRecommendations([])
    setPersonalityType(null)
    localStorage.removeItem('personalityType')
  }

  return {
    recommendations,
    trending,
    timeBased,
    newReleases,
    isLoading,
    error,
    personalityType,
    generateRecommendations,
    updatePersonalityType,
    getRecommendationsByGenre,
    refreshRecommendations,
    clearRecommendations
  }
}
