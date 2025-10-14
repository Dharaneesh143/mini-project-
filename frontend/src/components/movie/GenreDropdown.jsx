import React, { useState, useRef, useEffect } from 'react'
import { genresList } from '../../data/genres'
import { getGenreEmoji } from '../../utils/helpers'

const GenreDropdown = ({ selectedGenres, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleGenreToggle = (genre) => {
    let newSelectedGenres = [...selectedGenres]
    if (newSelectedGenres.includes(genre)) {
      newSelectedGenres = newSelectedGenres.filter(g => g !== genre)
    } else {
      if (newSelectedGenres.length < 3) {
        newSelectedGenres.push(genre)
      }
    }
    onChange(newSelectedGenres)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
      >
        Genre
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1 max-h-60 overflow-auto">
            {genresList.map((genre) => (
              <label
                key={genre}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreToggle(genre)}
                  className="mr-2"
                  disabled={!selectedGenres.includes(genre) && selectedGenres.length >= 3}
                />
                <span>{getGenreEmoji(genre)} {genre}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GenreDropdown
