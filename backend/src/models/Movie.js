const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    unique: true,
    sparse: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  originalTitle: {
    type: String,
    trim: true
  },
  overview: {
    type: String,
    required: [true, 'Overview is required'],
    maxlength: [2000, 'Overview cannot be more than 2000 characters']
  },
  tagline: String,
  genres: [{
    type: String,
    required: true,
    enum: [
      'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
      'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music',
      'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
    ]
  }],
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
  },
  runtime: {
    type: Number,
    min: 0,
    max: 600 // 10 hours max
  },
  adult: {
    type: Boolean,
    default: false
  },
  originalLanguage: {
    type: String,
    default: 'en'
  },
  spokenLanguages: [String],
  productionCountries: [String],
  budget: {
    type: Number,
    min: 0
  },
  revenue: {
    type: Number,
    min: 0
  },
  popularity: {
    type: Number,
    default: 0
  },
  voteAverage: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  voteCount: {
    type: Number,
    default: 0
  },
  posterPath: String,
  backdropPath: String,
  images: {
    posters: [String],
    backdrops: [String],
    logos: [String]
  },
  cast: [{
    id: Number,
    name: String,
    character: String,
    order: Number,
    profilePath: String
  }],
  crew: [{
    id: Number,
    name: String,
    job: String,
    department: String,
    profilePath: String
  }],
  director: {
    type: String,
    trim: true
  },
  writers: [String],
  producers: [String],
  keywords: [String],
  similarMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  recommendations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  externalIds: {
    imdbId: String,
    facebookId: String,
    instagramId: String,
    twitterId: String
  },
  videos: [{
    key: String,
    name: String,
    site: String,
    type: String,
    official: Boolean
  }],
  status: {
    type: String,
    enum: ['Rumored', 'Planned', 'In Production', 'Post Production', 'Released', 'Canceled'],
    default: 'Released'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Indexes for better query performance
movieSchema.index({ title: 'text', overview: 'text', tagline: 'text' })
movieSchema.index({ genres: 1 })
movieSchema.index({ releaseDate: -1 })
movieSchema.index({ voteAverage: -1 })
movieSchema.index({ popularity: -1 })
movieSchema.index({ tmdbId: 1 })

// Virtual for formatted release year
movieSchema.virtual('releaseYear').get(function() {
  return this.releaseDate ? this.releaseDate.getFullYear() : null
})

// Virtual for formatted runtime
movieSchema.virtual('formattedRuntime').get(function() {
  if (!this.runtime) return null
  const hours = Math.floor(this.runtime / 60)
  const minutes = this.runtime % 60
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
})

// Virtual for formatted budget
movieSchema.virtual('formattedBudget').get(function() {
  if (!this.budget) return null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(this.budget)
})

// Virtual for formatted revenue
movieSchema.virtual('formattedRevenue').get(function() {
  if (!this.revenue) return null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(this.revenue)
})

// Method to get similar movies
movieSchema.methods.getSimilarMovies = async function(limit = 5) {
  return await this.constructor.find({
    _id: { $ne: this._id },
    genres: { $in: this.genres },
    isActive: true
  })
  .sort({ voteAverage: -1, popularity: -1 })
  .limit(limit)
  .select('title posterPath voteAverage releaseDate genres')
}

// Method to get recommendations
movieSchema.methods.getRecommendations = async function(limit = 10) {
  return await this.constructor.find({
    _id: { $ne: this._id },
    $or: [
      { genres: { $in: this.genres } },
      { director: this.director },
      { 'cast.name': { $in: this.cast.map(c => c.name) } }
    ],
    isActive: true
  })
  .sort({ voteAverage: -1, popularity: -1 })
  .limit(limit)
  .select('title posterPath voteAverage releaseDate genres director')
}

// Static method to search movies
movieSchema.statics.searchMovies = function(query, options = {}) {
  const {
    page = 1,
    limit = 20,
    genres = [],
    minRating = 0,
    maxRating = 10,
    yearFrom = null,
    yearTo = null,
    sortBy = 'popularity',
    sortOrder = 'desc'
  } = options

  const searchQuery = {
    isActive: true
  }

  // Text search
  if (query) {
    searchQuery.$text = { $search: query }
  }

  // Genre filter
  if (genres.length > 0) {
    searchQuery.genres = { $in: genres }
  }

  // Rating filter
  if (minRating > 0 || maxRating < 10) {
    searchQuery.voteAverage = { $gte: minRating, $lte: maxRating }
  }

  // Year filter
  if (yearFrom || yearTo) {
    searchQuery.releaseDate = {}
    if (yearFrom) searchQuery.releaseDate.$gte = new Date(`${yearFrom}-01-01`)
    if (yearTo) searchQuery.releaseDate.$lte = new Date(`${yearTo}-12-31`)
  }

  // Sort options
  const sortOptions = {}
  if (sortBy === 'title') {
    sortOptions.title = sortOrder === 'desc' ? -1 : 1
  } else if (sortBy === 'rating') {
    sortOptions.voteAverage = sortOrder === 'desc' ? -1 : 1
  } else if (sortBy === 'year') {
    sortOptions.releaseDate = sortOrder === 'desc' ? -1 : 1
  } else {
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1
  }

  return this.find(searchQuery)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('similarMovies', 'title posterPath voteAverage')
    .populate('recommendations', 'title posterPath voteAverage')
}

module.exports = mongoose.model('Movie', movieSchema)
