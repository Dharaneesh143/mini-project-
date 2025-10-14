const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: null
  },
  preferences: {
    genres: [{
      type: String,
      enum: [
        'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
        'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music',
        'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
      ]
    }],
    favoriteActors: [String],
    favoriteDirectors: [String],
    minRating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    maxDuration: {
      type: Number,
      default: 300 // 5 hours in minutes
    }
  },
  quizResults: {
    personality: {
      type: String,
      enum: ['Adventurer', 'Romantic', 'Thinker', 'ThrillSeeker', 'ComedyLover']
    },
    preferredGenres: [String],
    mood: {
      type: String,
      enum: ['Happy', 'Sad', 'Excited', 'Relaxed', 'Nostalgic']
    },
    completedAt: Date
  },
  watchlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  watchedMovies: [{
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    },
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    watchedAt: {
      type: Date,
      default: Date.now
    },
    review: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index for better query performance
userSchema.index({ email: 1 })
userSchema.index({ 'preferences.genres': 1 })

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Get user profile (without sensitive data)
userSchema.methods.getProfile = function() {
  const userObject = this.toObject()
  delete userObject.password
  delete userObject.__v
  return userObject
}

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date()
  return this.save()
}

module.exports = mongoose.model('User', userSchema)
