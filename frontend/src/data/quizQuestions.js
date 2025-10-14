export const quizQuestions = [
  {
    id: 1,
    question: "What's your favorite movie setting?",
    type: "single",
    options: [
      { id: "urban", text: "Urban/City", genres: ["Action", "Crime", "Thriller"] },
      { id: "space", text: "Space/Future", genres: ["Sci-Fi", "Fantasy"] },
      { id: "historical", text: "Historical Periods", genres: ["History", "Drama", "War"] },
      { id: "fantasy", text: "Fantasy Worlds", genres: ["Fantasy", "Adventure"] },
      { id: "nature", text: "Nature/Outdoors", genres: ["Adventure", "Drama"] }
    ]
  },
  {
    id: 2,
    question: "What mood are you usually in when watching movies?",
    type: "single",
    options: [
      { id: "excited", text: "Excited/Thrilled", genres: ["Action", "Thriller", "Adventure"] },
      { id: "thoughtful", text: "Thoughtful/Reflective", genres: ["Drama", "Mystery", "Sci-Fi"] },
      { id: "relaxed", text: "Relaxed/Chill", genres: ["Comedy", "Romance", "Family"] },
      { id: "curious", text: "Curious/Intrigued", genres: ["Mystery", "Thriller", "Sci-Fi"] },
      { id: "nostalgic", text: "Nostalgic/Sentimental", genres: ["Drama", "Romance", "History"] }
    ]
  },
  {
    id: 3,
    question: "What's your ideal movie length?",
    type: "single",
    options: [
      { id: "short", text: "Under 90 minutes", genres: ["Comedy", "Horror", "Thriller"] },
      { id: "medium", text: "90-120 minutes", genres: ["Action", "Romance", "Crime"] },
      { id: "long", text: "120-150 minutes", genres: ["Drama", "Sci-Fi", "Fantasy"] },
      { id: "epic", text: "Over 150 minutes", genres: ["Fantasy", "History", "Adventure"] }
    ]
  },
  {
    id: 4,
    question: "What type of characters do you prefer?",
    type: "multiple",
    options: [
      { id: "heroes", text: "Heroes/Protagonists", genres: ["Action", "Adventure", "Fantasy"] },
      { id: "antiheroes", text: "Anti-heroes/Complex", genres: ["Crime", "Drama", "Thriller"] },
      { id: "villains", text: "Interesting Villains", genres: ["Thriller", "Horror", "Crime"] },
      { id: "everyday", text: "Everyday People", genres: ["Drama", "Comedy", "Romance"] },
      { id: "historical", text: "Historical Figures", genres: ["History", "Biography", "Drama"] }
    ]
  },
  {
    id: 5,
    question: "What's your favorite time period for movies?",
    type: "single",
    options: [
      { id: "classic", text: "Classic (Pre-1980)", genres: ["History", "Drama", "Western"] },
      { id: "80s90s", text: "80s-90s", genres: ["Action", "Comedy", "Thriller"] },
      { id: "2000s", text: "2000s", genres: ["Action", "Drama", "Sci-Fi"] },
      { id: "recent", text: "Recent (2010+)", genres: ["Action", "Sci-Fi", "Fantasy"] },
      { id: "future", text: "Future/Sci-Fi", genres: ["Sci-Fi", "Fantasy"] }
    ]
  },
  {
    id: 6,
    question: "What do you value most in a movie?",
    type: "multiple",
    options: [
      { id: "story", text: "Compelling Story", genres: ["Drama", "Mystery", "Thriller"] },
      { id: "action", text: "Action/Excitement", genres: ["Action", "Adventure", "Thriller"] },
      { id: "humor", text: "Humor/Comedy", genres: ["Comedy", "Romance"] },
      { id: "emotion", text: "Emotional Impact", genres: ["Drama", "Romance"] },
      { id: "visuals", text: "Visual Effects", genres: ["Sci-Fi", "Fantasy", "Action"] },
      { id: "characters", text: "Character Development", genres: ["Drama", "Crime", "Biography"] }
    ]
  },
  {
    id: 7,
    question: "How do you prefer to watch movies?",
    type: "single",
    options: [
      { id: "alone", text: "Alone (Focused)", genres: ["Drama", "Mystery", "Thriller"] },
      { id: "partner", text: "With Partner", genres: ["Romance", "Comedy", "Drama"] },
      { id: "friends", text: "With Friends", genres: ["Comedy", "Action", "Horror"] },
      { id: "family", text: "With Family", genres: ["Family", "Comedy", "Adventure"] }
    ]
  },
  {
    id: 8,
    question: "What's your tolerance for violence/intensity?",
    type: "single",
    options: [
      { id: "low", text: "Low (Family-friendly)", genres: ["Family", "Comedy", "Romance"] },
      { id: "medium", text: "Medium (Some action)", genres: ["Action", "Adventure", "Drama"] },
      { id: "high", text: "High (Intense content)", genres: ["Thriller", "Horror", "Crime"] },
      { id: "extreme", text: "Extreme (No limits)", genres: ["Horror", "Crime", "Thriller"] }
    ]
  }
]

export const getQuestionById = (id) => {
  return quizQuestions.find(question => question.id === id)
}

export const calculateRecommendations = (answers) => {
  const genreScores = {}
  
  // Process each answer
  answers.forEach(answer => {
    if (answer.questionId && answer.selectedOptions) {
      const question = getQuestionById(answer.questionId)
      if (question) {
        answer.selectedOptions.forEach(optionId => {
          const option = question.options.find(opt => opt.id === optionId)
          if (option && option.genres) {
            option.genres.forEach(genre => {
              genreScores[genre] = (genreScores[genre] || 0) + 1
            })
          }
        })
      }
    }
  })
  
  // Sort genres by score
  const sortedGenres = Object.entries(genreScores)
    .sort(([,a], [,b]) => b - a)
    .map(([genre]) => genre)
  
  return sortedGenres.slice(0, 5) // Top 5 genres
}
