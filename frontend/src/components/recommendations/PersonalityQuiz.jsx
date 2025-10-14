import React, { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Star } from 'lucide-react'

const PersonalityQuiz = ({ isOpen, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)

  const questions = [
    {
      id: 1,
      question: "What's your ideal Friday night?",
      options: [
        { id: 'a', text: "Watching an action-packed blockbuster", personality: 'adventurous' },
        { id: 'b', text: "Enjoying a romantic comedy with someone special", personality: 'romantic' },
        { id: 'c', text: "Getting scared with a horror movie", personality: 'thrill-seeker' },
        { id: 'd', text: "Learning something new with a documentary", personality: 'intellectual' }
      ]
    },
    {
      id: 2,
      question: "Which movie setting appeals to you most?",
      options: [
        { id: 'a', text: "Futuristic space colonies", personality: 'adventurous' },
        { id: 'b', text: "Cozy small towns", personality: 'romantic' },
        { id: 'c', text: "Dark, mysterious locations", personality: 'thrill-seeker' },
        { id: 'd', text: "Historical periods", personality: 'intellectual' }
      ]
    },
    {
      id: 3,
      question: "What do you want to feel after watching a movie?",
      options: [
        { id: 'a', text: "Pumped up and energized", personality: 'adventurous' },
        { id: 'b', text: "Warm and fuzzy inside", personality: 'romantic' },
        { id: 'c', text: "On the edge of my seat", personality: 'thrill-seeker' },
        { id: 'd', text: "Thoughtful and inspired", personality: 'intellectual' }
      ]
    },
    {
      id: 4,
      question: "Your favorite movie character type is:",
      options: [
        { id: 'a', text: "The fearless hero who saves the day", personality: 'adventurous' },
        { id: 'b', text: "The charming romantic lead", personality: 'romantic' },
        { id: 'c', text: "The mysterious anti-hero", personality: 'thrill-seeker' },
        { id: 'd', text: "The wise mentor or complex protagonist", personality: 'intellectual' }
      ]
    },
    {
      id: 5,
      question: "When choosing a movie, you prioritize:",
      options: [
        { id: 'a', text: "Amazing action sequences and special effects", personality: 'adventurous' },
        { id: 'b', text: "Great chemistry between characters", personality: 'romantic' },
        { id: 'c', text: "Suspense and plot twists", personality: 'thrill-seeker' },
        { id: 'd', text: "Deep themes and meaningful messages", personality: 'intellectual' }
      ]
    }
  ]

  const handleAnswerSelect = (optionId, personality) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: { optionId, personality }
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      completeQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const completeQuiz = () => {
    // Calculate personality type based on answers
    const personalityCount = {}
    Object.values(answers).forEach(answer => {
      personalityCount[answer.personality] = (personalityCount[answer.personality] || 0) + 1
    })

    const dominantPersonality = Object.keys(personalityCount).reduce((a, b) => 
      personalityCount[a] > personalityCount[b] ? a : b
    )

    setIsCompleted(true)
    
    // Call onComplete with results
    if (onComplete) {
      onComplete({
        personality: dominantPersonality,
        answers: answers,
        recommendations: getRecommendationsByPersonality(dominantPersonality)
      })
    }
  }

  const getRecommendationsByPersonality = (personality) => {
    const recommendations = {
      adventurous: [
        "Mad Max: Fury Road",
        "The Dark Knight",
        "Inception",
        "John Wick",
        "Mission: Impossible"
      ],
      romantic: [
        "The Princess Bride",
        "When Harry Met Sally",
        "La La Land",
        "The Notebook",
        "Pride and Prejudice"
      ],
      'thrill-seeker': [
        "Get Out",
        "Parasite",
        "Gone Girl",
        "Shutter Island",
        "The Silence of the Lambs"
      ],
      intellectual: [
        "The Shawshank Redemption",
        "12 Angry Men",
        "Citizen Kane",
        "2001: A Space Odyssey",
        "The Godfather"
      ]
    }

    return recommendations[personality] || recommendations.adventurous
  }

  const getPersonalityDescription = (personality) => {
    const descriptions = {
      adventurous: "You love excitement, action, and epic adventures! You're drawn to movies with spectacular visuals, heroic journeys, and high-stakes drama.",
      romantic: "You appreciate the beauty of human connections and love stories that warm the heart. You enjoy character-driven narratives and emotional depth.",
      'thrill-seeker': "You crave suspense, mystery, and psychological complexity. You love movies that keep you guessing and challenge your expectations.",
      intellectual: "You value thought-provoking content and appreciate films with deep themes, complex narratives, and artistic merit."
    }

    return descriptions[personality] || descriptions.adventurous
  }

  if (!isOpen) return null

  const currentQ = questions[currentQuestion]
  const selectedAnswer = answers[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isCompleted ? 'Your Movie Personality' : 'Movie Personality Quiz'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {!isCompleted ? (
          <>
            {/* Progress Bar */}
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="px-6 pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id, option.personality)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer?.optionId === option.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.text}</span>
                      {selectedAnswer?.optionId === option.id && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        ) : (
          /* Results */
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                You're {Object.values(answers)[0]?.personality.charAt(0).toUpperCase() + Object.values(answers)[0]?.personality.slice(1)}!
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {getPersonalityDescription(Object.values(answers)[0]?.personality)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Recommended Movies for You:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getRecommendationsByPersonality(Object.values(answers)[0]?.personality).map((movie, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="font-medium text-gray-900">{movie}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explore Recommendations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PersonalityQuiz
