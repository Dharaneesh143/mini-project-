import React from 'react'

const ErrorMessage = ({ message }) => {
  if (!message) return null

  return (
    <div className="bg-red-600 text-white p-4 rounded-md mb-4 text-center font-semibold">
      {message}
    </div>
  )
}

export default ErrorMessage
