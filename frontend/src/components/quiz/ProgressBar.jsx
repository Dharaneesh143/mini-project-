import React from 'react'

const ProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">Question {current} of {total}</span>
        <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
