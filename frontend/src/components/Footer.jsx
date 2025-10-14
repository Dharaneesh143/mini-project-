import React from 'react'
import { Film, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Film className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">MovieApp</span>
            </div>
            <p className="text-gray-400">
              Discover your next favorite movie with our AI-powered recommendations and personalized suggestions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Movies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Recommendations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Watchlist</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Action</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Drama</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Comedy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sci-Fi</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@movieapp.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Los Angeles, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 MovieApp. All rights reserved. Built with ❤️ for movie lovers.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
