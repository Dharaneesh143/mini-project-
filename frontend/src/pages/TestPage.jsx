import React from 'react'

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Movie Recommendation App
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome! The app is working correctly.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Test Features:</h2>
          <ul className="text-left space-y-2">
            <li>✅ React Router working</li>
            <li>✅ Tailwind CSS loaded</li>
            <li>✅ Context providers active</li>
            <li>✅ Components rendering</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TestPage
