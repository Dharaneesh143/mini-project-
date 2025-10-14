import React from 'react'
import { Play } from 'lucide-react'

const QuizIntro = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🍿</div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Find Your Perfect Movie Match
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Answer a few fun questions and let our AI find movies you'll love. Discover hidden gems and rediscover classics tailored just for you!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">Personalized</h3>
            <p className="text-gray-400 text-sm">AI-powered recommendations based on your preferences</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Quick & Fun</h3>
            <p className="text-gray-400 text-sm">Just a few minutes to find your next favorite movie</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="text-3xl mb-3">🎬</div>
            <h3 className="font-semibold mb-2">Curated Selection</h3>
            <p className="text-gray-400 text-sm">From thousands of movies in our database</p>
          </div>
        </div>

        <button
          onClick={onStart}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 flex items-center space-x-3 mx-auto"
        >
          <Play className="w-6 h-6" />
          <span>Start Quiz</span>
        </button>
      </div>
    </div>
  )
}

export default QuizIntro
