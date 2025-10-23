# Gemini AI Setup Instructions

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## Setting Up the Environment Variable

1. Create a `.env` file in the `frontend` directory
2. Add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

## Features

The AI Movie Recommendation system now includes:

### 🎬 Story-Based Recommendations
- Describe any story or scenario
- AI analyzes themes and suggests similar movies
- Example: "A young wizard discovers magical powers and must save the world"

### 🎵 Song-Based Recommendations  
- Mention any song or artist
- AI finds movies with similar themes or atmosphere
- Example: "Bohemian Rhapsody by Queen"

### 💭 Mood-Based Recommendations
- Describe your current mood or feeling
- AI suggests movies that match your emotional state
- Example: "I want something that makes me feel hopeful and inspired"

## How to Use

1. Navigate to `/ai-recommendations` or click "AI Chat" in the header
2. Click "Start AI Chat" to open the chatbot
3. Type your request in natural language
4. The AI will analyze your input and provide movie recommendations
5. Recommended movies will appear below the chat

## Technical Details

- Uses Google's Gemini Pro model for natural language processing
- Integrates with TMDB API for actual movie data
- Real-time chat interface with typing indicators
- Fallback responses if AI service is unavailable
- Responsive design for all devices

## Troubleshooting

If the AI chat isn't working:
1. Check that your Gemini API key is correctly set in the `.env` file
2. Ensure the frontend server is restarted after adding the API key
3. Check the browser console for any error messages
4. Verify your internet connection
