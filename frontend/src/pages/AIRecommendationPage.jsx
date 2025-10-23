import React, { useState } from 'react'
import { Sparkles, MessageCircle, Music, BookOpen, Search } from 'lucide-react'
import ChatBot from '../components/chatbot/ChatBot'
import MovieCard from '../components/movie/MovieCard'
import LoadingSpinner from '../components/common/LoadingSpinner'

const AIRecommendationPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [recommendedMovies, setRecommendedMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [watchlist, setWatchlist] = useState([])

  // Load watchlist from localStorage
  React.useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist')
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist))
    }
  }, [])

  const addToWatchlist = (movie) => {
    const newWatchlist = [...watchlist, movie]
    setWatchlist(newWatchlist)
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist))
  }

  const removeFromWatchlist = (movieId) => {
    const newWatchlist = watchlist.filter(m => (m.id || m.tmdbId) !== movieId)
    setWatchlist(newWatchlist)
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist))
  }

  const isInWatchlist = (movieId) => {
    return watchlist.some(m => (m.id || m.tmdbId) === movieId)
  }

  const toggleWatchlist = (movie) => {
    if (isInWatchlist(movie.id || movie.tmdbId)) {
      removeFromWatchlist(movie.id || movie.tmdbId)
    } else {
      addToWatchlist(movie)
    }
  }

  const examplePrompts = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Story-Based Recommendations",
      description: "Describe a story or scenario",
      example: "A young wizard discovers they have magical powers and must save their world from an ancient evil",
      prompt: "A young wizard discovers they have magical powers and must save their world from an ancient evil"
    },
    {
      icon: <Music className="w-5 h-5" />,
      title: "Song-Based Recommendations", 
      description: "Mention a song or artist",
      example: "Bohemian Rhapsody by Queen",
      prompt: "Bohemian Rhapsody by Queen"
    },
    {
      icon: <Search className="w-5 h-5" />,
      title: "Mood-Based Recommendations",
      description: "Describe your mood or feeling",
      example: "I want to watch something that makes me feel hopeful and inspired",
      prompt: "I want to watch something that makes me feel hopeful and inspired"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-yellow-400 mr-4" />
            <h1 className="text-5xl font-bold">AI Movie Recommendations</h1>
          </div>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Powered by Gemini AI, our intelligent assistant can recommend movies based on stories, songs, moods, or any description you provide.
          </p>
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto"
          >
            <MessageCircle className="w-6 h-6" />
            Start AI Chat
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {examplePrompts.map((feature, index) => (
              <div key={index} className="bg-gray-700 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                <div className="bg-gray-600 p-3 rounded text-sm">
                  <p className="text-gray-400 mb-1">Example:</p>
                  <p className="text-white">"{feature.example}"</p>
                </div>
                <button
                  onClick={() => {
                    setIsChatOpen(true)
                    // You could pre-fill the chat with this prompt
                  }}
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                  Try This Example
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Movies Section */}
      {recommendedMovies.length > 0 && (
        <div className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">AI Recommended Movies</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {recommendedMovies.map((movie, index) => (
                <MovieCard
                  key={movie.id || movie.tmdbId || index}
                  movie={movie}
                  onAddToWatchlist={addToWatchlist}
                  onRemoveFromWatchlist={removeFromWatchlist}
                  isInWatchlist={isInWatchlist(movie.id || movie.tmdbId)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Bot */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* CTA Section */}
      <div className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Discover Your Next Favorite Movie?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Our AI assistant is ready to help you find the perfect movie based on any description you provide.
          </p>
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-6 h-6" />
            Start AI Recommendations
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIRecommendationPage