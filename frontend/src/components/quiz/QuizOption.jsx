import React from 'react'

const QuizOption = ({ option, type, selected, onSelect, multiple = false }) => {
  const isSelected = multiple ? selected.includes(option.value) : selected === option.value

  const handleClick = () => {
    if (multiple) {
      const newSelected = isSelected
        ? selected.filter(s => s !== option.value)
        : [...selected, option.value]
      onSelect(newSelected)
    } else {
      onSelect(option.value)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
        isSelected
          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
          : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
      }`}
    >
      <div className="flex items-center space-x-3">
        {option.icon && <span className="text-2xl">{option.icon}</span>}
        <div className="text-left">
          <div className="font-semibold">{option.label}</div>
          {option.description && (
            <div className="text-sm text-gray-400 mt-1">{option.description}</div>
          )}
        </div>
        {isSelected && (
          <div className="ml-auto">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </button>
  )
}

export default QuizOption
