import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layout
import Layout from './components/layout/Layout'

// Pages
import HomePage from './pages/HomePage'
import SimpleHomePage from './pages/SimpleHomePage'
import TestPage from './pages/TestPage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import WatchlistPage from './pages/WatchlistPage'
import RecommendationsPage from './pages/RecommendationsPage'
import ProfilePage from './pages/ProfilePage'
import QuizPage from './pages/QuizPage'
import TimeBasedSuggestionPage from './pages/TimeBasedSuggestionPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SearchResultsPage from './pages/SearchResultsPage'
import TrendingPage from './pages/TrendingPage'
import GenrePage from './pages/GenrePage'
import NotFoundPage from './pages/NotFoundPage'

// Styles
import './App.css'

function App() {
  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Animated Title (appears on home pages) */}
      <h1 className="title">Welcome to Movie App</h1>

      {/* Routes Configuration */}
      <Routes>
        {/* Auth Routes (No Layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Test Route */}
        <Route path="/test" element={<TestPage />} />

        {/* Main Routes (With Layout - Header & Footer) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<SimpleHomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="simple" element={<SimpleHomePage />} />
          <Route path="movie/:id" element={<MovieDetailsPage />} />
          <Route path="watchlist" element={<WatchlistPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="time-suggestions" element={<TimeBasedSuggestionPage />} />
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="trending" element={<TrendingPage />} />
          <Route path="genre/:genre" element={<GenrePage />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
