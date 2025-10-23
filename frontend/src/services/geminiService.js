import { GoogleGenerativeAI } from '@google/generative-ai'

class GeminiService {
  constructor() {
    // Get API key from environment variable or use the provided key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBLV08Un617dltyugY-OOIuReSsfGckWuE'
    console.log('Initializing Gemini service with API key:', apiKey.substring(0, 10) + '...')
    this.genAI = new GoogleGenerativeAI(apiKey)
    // We'll set the model after discovering what's available
    this.model = null
  }

  async listAvailableModels() {
    try {
      console.log('Attempting to find a working model...')
      
      // Try common model names directly since listModels() is not available
      const modelNames = [
        'gemini-2.0-flash-exp',
        'gemini-1.5-pro',
        'gemini-1.0-pro',
        'gemini-pro',
        'gemini-1.5-flash',
        'gemini-1.5-pro-001'
      ]
      
      console.log('Trying model names:', modelNames)
      
      for (const modelName of modelNames) {
        try {
          console.log(`Trying model: ${modelName}`)
          const model = this.genAI.getGenerativeModel({ model: modelName })
          
          // Test if it works with a simple request
          const testResult = await model.generateContent('Hello')
          const response = await testResult.response
          const text = response.text()
          
          console.log(`✅ Model ${modelName} works! Response: ${text}`)
          this.model = model
          return modelName
          
        } catch (modelError) {
          console.log(`❌ Model ${modelName} failed:`, modelError.message)
        }
      }
      
      console.log('No working models found')
      return null
      
    } catch (error) {
      console.error('Error in listAvailableModels:', error)
      return null
    }
  }

  async testConnection() {
    try {
      console.log('Testing Gemini API connection...')
      
      // First, find a working model
      const workingModelName = await this.listAvailableModels()
      
      if (!workingModelName || !this.model) {
        console.error('No working model found')
        return false
      }
      
      console.log(`✅ Connection successful with model: ${workingModelName}`)
      return true
      
    } catch (error) {
      console.error('Gemini API test failed:', error)
      return false
    }
  }

  // Attempt to extract JSON from model output, supporting fenced code blocks
  extractJson(text) {
    if (!text) return null
    // ```json ... ```
    const fenced = text.match(/```json[\s\S]*?```/i)
    const fencedAlt = text.match(/```[\s\S]*?```/)
    const candidate = fenced?.[0]
      ?.replace(/```json/i, '')
      ?.replace(/```/g, '')
      ?.trim() ||
      fencedAlt?.[0]
        ?.replace(/```/g, '')
        ?.trim() ||
      (text.match(/\{[\s\S]*\}/)?.[0] || null)

    if (!candidate) return null
    try {
      return JSON.parse(candidate)
    } catch (_) {
      // Try to fix common trailing comma issues
      try {
        const cleaned = candidate
          .replace(/,\s*([}\]])/g, '$1')
          .replace(/\s+:/g, ':')
        return JSON.parse(cleaned)
      } catch (_) {
        return null
      }
    }
  }

  async generateMovieRecommendations(userInput) {
    try {
      console.log('Generating recommendations for:', userInput)
      console.log('API Key available:', !!import.meta.env.VITE_GEMINI_API_KEY)
      
      // Ensure we have a working model
      if (!this.model) {
        console.log('No model set, trying to find a working model...')
        const workingModelName = await this.listAvailableModels()
        if (!workingModelName || !this.model) {
          // Try direct model initialization as last resort
          console.log('Trying direct model initialization...')
          this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
          if (!this.model) {
            throw new Error('No working model found')
          }
        }
      }
      
      const prompt = `
        You are a movie recommendation AI assistant. Based on the user's input, suggest 3-5 movies that match their request.
        
        User input: "${userInput}"
        
        Please provide movie recommendations in the following JSON format:
        {
          "recommendations": [
            {
              "title": "Movie Title",
              "year": 2023,
              "genre": "Action, Thriller",
              "reason": "Brief explanation why this movie matches the request",
              "mood": "exciting, intense"
            }
          ],
          "response": "A friendly response explaining the recommendations"
        }
        
        If the user mentions a song name, suggest movies that have similar themes, mood, or atmosphere to that song.
        If the user describes a story or scenario, suggest movies that match that narrative style or theme.
        Keep recommendations diverse and include both recent and classic films.
      `

      console.log('Sending request to Gemini API...')
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      console.log('Raw Gemini response:', text)
      
      const parsed = this.extractJson(text)
      if (parsed) {
        console.log('Successfully parsed JSON:', parsed)
        return parsed
      }
      
      console.log('Failed to parse JSON, using fallback')
      // Fallback response if JSON parsing fails
      return {
        recommendations: [
          {
            title: "The Matrix",
            year: 1999,
            genre: "Action, Sci-Fi",
            reason: "A classic that matches most requests",
            mood: "mind-bending, action-packed"
          }
        ],
        response: "Here are some great movie recommendations based on your request!"
      }
    } catch (error) {
      console.error('Error generating recommendations:', error)
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
      
      // Return a more specific error message based on the error type
      if (error.message.includes('API_KEY')) {
        return {
          recommendations: [],
          response: "API key issue detected. Please check the Gemini API key configuration."
        }
      }
      
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return {
          recommendations: [],
          response: "API quota exceeded. Please try again later."
        }
      }
      
      return {
        recommendations: [],
        response: `I'm having trouble connecting to the AI service. Error: ${error.message}. Please try again or check your internet connection.`
      }
    }
  }

  async analyzeStoryForMovies(storyDescription) {
    try {
      const prompt = `
        Analyze this story description and suggest movies that have similar themes, narrative structure, or emotional tone:
        
        Story: "${storyDescription}"
        
        Provide 3-5 movie recommendations in JSON format:
        {
          "recommendations": [
            {
              "title": "Movie Title",
              "year": 2023,
              "genre": "Drama, Romance",
              "similarity": "Why this movie is similar to the story",
              "themes": ["theme1", "theme2"],
              "mood": "emotional, uplifting"
            }
          ],
          "analysis": "Brief analysis of the story's themes and how the movies relate"
        }
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      const parsed = this.extractJson(text)
      if (parsed) return parsed
      
      return {
        recommendations: [],
        analysis: "I'd be happy to suggest movies based on your story!"
      }
    } catch (error) {
      console.error('Error analyzing story:', error)
      return {
        recommendations: [],
        analysis: "I couldn't analyze that right now. Could you share the key themes, mood, or similar movies you like?"
      }
    }
  }

  async getMoviesFromSong(songName) {
    try {
      const prompt = `
        Based on the song "${songName}", suggest movies that have similar themes, mood, or atmosphere.
        
        Consider:
        - The song's genre and emotional tone
        - Common themes in movies that use similar music
        - Movies that might have featured this song or similar music
        - Movies that capture the same feeling or atmosphere
        
        Provide 3-5 movie recommendations in JSON format:
        {
          "recommendations": [
            {
              "title": "Movie Title",
              "year": 2023,
              "genre": "Drama, Musical",
              "connection": "How this movie connects to the song",
              "mood": "melancholic, hopeful"
            }
          ],
          "response": "Explanation of the connection between the song and movies"
        }
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      const parsed = this.extractJson(text)
      if (parsed) return parsed
      
      return {
        recommendations: [],
        response: "I'd love to suggest movies based on that song!"
      }
    } catch (error) {
      console.error('Error getting movies from song:', error)
      return {
        recommendations: [],
        response: "I couldn't connect the song right now. Tell me its mood or themes (e.g., energetic, nostalgic), and I'll suggest movies that match."
      }
    }
  }
}

export default new GeminiService()
