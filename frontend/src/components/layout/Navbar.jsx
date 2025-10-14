import React, { useState } from 'react'
import { Film, User, Menu } from 'lucide-react'
import GenreFilter from '../movie/GenreFilter'

const Navbar = () => {
  const [selectedGenre, setSelectedGenre] = useState('')

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre)
    // Additional logic for filtering can be added here
  }

  return (
    <nav className="bg-gray-900 text-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Film className="w-6 h-6" />
          <span className="font-bold text-xl">Movie Recommendation</span>
        </div>
        <div className="flex items-center space-x-4">
          {/* Replace search bar with genre filter */}
          <GenreFilter selectedGenre={selectedGenre} onChange={handleGenreChange} />
          {/* Only show Login button, remove Sign Up */}
          <button className="bg-blue-600 px-3 py-1 rounded">Login</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
