import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import movieService from '../../services/movieService'
import { getRandomItems } from '../../utils/helpers'
import { useInView } from '../../hooks/useInView'

const Hero = () => {
  const navigate = useNavigate()
  const [currentMovie, setCurrentMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRandomMovie = async () => {
      try {
        const response = await movieService.getMovies(1)
        if (response.data && response.data.length > 0) {
          const randomMovie = getRandomItems(response.data, 1)[0]
          setCurrentMovie(randomMovie)
        }
      } catch (error) {
        console.error('Error fetching movie for hero:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRandomMovie()
  }, [])

  const handleGetRecommendations = () => {
    navigate('/recommendations')
  }

  const handleTakeQuiz = () => {
    navigate('/quiz')
  }

  const { ref, inView } = useInView()

  return (
    <section ref={ref} className={`relative h-96 md:h-[500px] overflow-hidden ${inView ? 'animate-fade-in' : 'opacity-0'}`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${currentMovie?.backdrop || '/images/hero-bg.jpg'})`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
              Discover Your Next
              <span className="text-blue-400 block">Favorite Movie</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed animation-delay-100 animate-fade-in-up">
              Get personalized movie recommendations powered by AI. 
              Find films that match your taste and mood.
            </p>
            
            {/* Featured Movie Info */}
            {currentMovie && (
              <div className="mb-8 animation-delay-200 animate-fade-in-up">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-yellow-400 text-lg">⭐ {currentMovie.rating}</span>
                  <span className="text-gray-300">{currentMovie.year}</span>
                  <span className="text-gray-300">{currentMovie.genre}</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2">{currentMovie.title}</h3>
                <p className="text-gray-300 line-clamp-2">{currentMovie.description}</p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animation-delay-300 animate-fade-in-up">
              <button
                onClick={handleGetRecommendations}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <span className="mr-2">🎯</span>
                Get Recommendations
              </button>
              <button
                onClick={handleTakeQuiz}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <span className="mr-2">📝</span>
                Take Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

export default Hero
