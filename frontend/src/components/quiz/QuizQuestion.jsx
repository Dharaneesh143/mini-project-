import React from 'react'
import ProgressBar from './ProgressBar'
import QuizOption from './QuizOption'

const QuizQuestion = ({ question, current, total, selected, onSelect, onNext, onPrevious, canProceed }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <ProgressBar current={current} total={total} />

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">{question.question}</h2>

          <div className="space-y-4 mb-8">
            {question.options.map((option, index) => (
              <QuizOption
                key={index}
                option={option}
                type={question.type}
                selected={selected}
                onSelect={onSelect}
                multiple={question.multiple}
              />
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={onPrevious}
              disabled={current === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                current === 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              Previous
            </button>

            <button
              onClick={onNext}
              disabled={!canProceed}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                canProceed
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {current === total ? 'Finish Quiz' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizQuestion
