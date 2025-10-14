import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Star, Play } from 'lucide-react'

const MovieCarousel = ({ title, movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 6

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerView >= movies.length ? 0 : prevIndex + itemsPerView
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerView < 0 ? Math.max(0, movies.length - itemsPerView) : prevIndex - itemsPerView
    )
  }

  const visibleMovies = movies.slice(currentIndex, currentIndex + itemsPerView)

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full hover:bg-gray-700/50 transition-colors"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full hover:bg-gray-700/50 transition-colors"
              disabled={currentIndex + itemsPerView >= movies.length}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {visibleMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer group"
            >
              <div className="aspect-[2/3] relative">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white mb-2 truncate">{movie.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{movie.rating}</span>
                  </div>
                  <span>{movie.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MovieCarousel
