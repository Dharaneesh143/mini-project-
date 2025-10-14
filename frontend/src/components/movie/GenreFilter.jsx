import React from 'react'
import { genresList } from '../../data/genres'
import { getGenreEmoji } from '../../utils/helpers'

const GenreFilter = ({ selectedGenre, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('')}
        className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
          selectedGenre === ''
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
            : 'bg-gray-800 dark:bg-gray-700 text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        🎬 All
      </button>
      {genresList.map(genre => (
        <button
          key={genre}
          onClick={() => onChange(genre)}
          className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
            selectedGenre === genre
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : 'bg-gray-800 dark:bg-gray-700 text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-600'
          }`}
        >
          {getGenreEmoji(genre)} {genre}
        </button>
      ))}
    </div>
  )
}

export default GenreFilter