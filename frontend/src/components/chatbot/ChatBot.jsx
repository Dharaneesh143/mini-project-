import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react'
import geminiService from '../../services/geminiService'
import movieService from '../../services/movieService'

const ChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI movie recommendation assistant powered by Gemini. I can help you find movies based on stories, songs, or any description. What would you like to watch today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [recommendedMovies, setRecommendedMovies] = useState([])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      // Test API connection when chat opens
      geminiService.testConnection()
      // List available models to see what's available
      geminiService.listAvailableModels()
    }
  }, [isOpen])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      // Use Gemini AI for intelligent responses
      const aiResponse = await generateAIResponse(inputMessage)
      
      const botMessage = {
        id: Date.now() + 1,
        text: aiResponse.response,
        sender: 'bot',
        timestamp: new Date(),
        recommendations: aiResponse.recommendations || []
      }
      
      setMessages(prev => [...prev, botMessage])
      
      // If we have movie recommendations, try to fetch actual movie data
      if (aiResponse.recommendations && aiResponse.recommendations.length > 0) {
        await fetchRecommendedMovies(aiResponse.recommendations)
      }
    } catch (error) {
      console.error('Error generating AI response:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later!",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const generateAIResponse = async (userInput) => {
    try {
      // Check if input contains song names or story descriptions
      const input = userInput.toLowerCase()
      
      if (input.includes('song') || input.includes('music') || input.includes('melody') || 
          input.includes('track') || input.includes('artist') || input.includes('band')) {
        return await geminiService.getMoviesFromSong(userInput)
      }
      
      if (input.includes('story') || input.includes('plot') || input.includes('narrative') ||
          input.includes('tale') || input.includes('scenario') || input.includes('describe')) {
        return await geminiService.analyzeStoryForMovies(userInput)
      }
      
      // General movie recommendation
      return await geminiService.generateMovieRecommendations(userInput)
    } catch (error) {
      console.error('Error generating AI response:', error)
      // Fallback to simple response
      return {
        response: "I'd love to help you find the perfect movie! Can you tell me more about what you're looking for?",
        recommendations: []
      }
    }
  }

  const fetchRecommendedMovies = async (recommendations) => {
    try {
      const moviePromises = recommendations.slice(0, 3).map(async (rec) => {
        try {
          // Search for the movie using our movie service
          const searchResults = await movieService.searchMovies(rec.title)
          if (searchResults.movies && searchResults.movies.length > 0) {
            return searchResults.movies[0] // Return the first match
          }
          return null
        } catch (error) {
          console.error(`Error searching for ${rec.title}:`, error)
          return null
        }
      })

      const movies = await Promise.all(moviePromises)
      const validMovies = movies.filter(movie => movie !== null)
      
      if (validMovies.length > 0) {
        setRecommendedMovies(validMovies)
      }
    } catch (error) {
      console.error('Error fetching recommended movies:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={20} />
          <span className="font-semibold">AI Movie Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.sender === 'bot' && <Bot size={16} className="mt-1 flex-shrink-0" />}
                {message.sender === 'user' && <User size={16} className="mt-1 flex-shrink-0" />}
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Bot size={16} />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Recommended Movies */}
      {recommendedMovies.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <Sparkles size={14} />
            AI Recommendations
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recommendedMovies.map((movie, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                <img 
                  src={movie.poster || movie.posterPath || 'https://via.placeholder.com/40x60/374151/9ca3af?text=No+Poster'} 
                  alt={movie.title}
                  className="w-8 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{movie.title}</p>
                  <p className="text-xs text-gray-500">{movie.year || 'N/A'}</p>
                </div>
                <div className="text-xs text-yellow-600 font-semibold">
                  ⭐ {movie.rating || movie.voteAverage || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Describe a story, mention a song, or ask for movie recommendations..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatBot
