import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react'

const QuizResult = ({ answers, onRetake }) => {
  const navigate = useNavigate()

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">{personality.emoji}</div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Movie Personality: {personality.title}
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed mb-6">
            {personality.description}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span className="text-lg font-semibold">AI Analysis Complete</span>
          </div>
          <p className="text-gray-400">
            Based on your answers, we've analyzed thousands of movies to find your perfect matches.
            Ready to discover your next favorite film?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/recommendations')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3"
          >
            <span>View AI Recommendations</span>
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
