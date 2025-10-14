import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

const ChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your movie recommendation assistant. How can I help you find the perfect movie today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage)
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase()
    
    if (input.includes('action') || input.includes('adventure')) {
      return "Great choice! I'd recommend checking out some action-packed movies like The Dark Knight, Mad Max: Fury Road, or John Wick. Would you like me to show you more action movies?"
    }
    
    if (input.includes('comedy') || input.includes('funny')) {
      return "Looking for some laughs? I suggest movies like The Grand Budapest Hotel, Superbad, or Knives Out. What type of comedy do you prefer - romantic, dark, or slapstick?"
    }
    
    if (input.includes('horror') || input.includes('scary')) {
      return "If you're in the mood for some thrills, try Hereditary, Get Out, or A Quiet Place. How intense do you like your horror movies?"
    }
    
    if (input.includes('romance') || input.includes('love')) {
      return "Romance movies are perfect for a cozy night! I recommend The Princess Bride, When Harry Met Sally, or La La Land. Are you looking for classic or modern romance?"
    }
    
    if (input.includes('sci-fi') || input.includes('science fiction')) {
      return "Sci-fi is amazing! You might enjoy Blade Runner 2049, Interstellar, or Ex Machina. Do you prefer space adventures or futuristic Earth stories?"
    }
    
    if (input.includes('recommend') || input.includes('suggest')) {
      return "I'd be happy to recommend movies! What genre are you in the mood for? Or tell me about a movie you recently enjoyed, and I can suggest similar ones."
    }
    
    if (input.includes('popular') || input.includes('trending')) {
      return "The most popular movies right now include a mix of blockbusters and critically acclaimed films. Would you like to see what's trending in a specific genre?"
    }
    
    if (input.includes('rating') || input.includes('good')) {
      return "I can help you find highly-rated movies! Are you looking for critically acclaimed films, audience favorites, or movies with specific ratings?"
    }
    
    // Default responses
    const defaultResponses = [
      "That's interesting! Can you tell me more about what type of movies you enjoy?",
      "I'd love to help you find the perfect movie. What genre or mood are you looking for?",
      "Great question! Are you looking for something specific like a particular genre, actor, or time period?",
      "I'm here to help you discover amazing movies. What kind of experience are you looking for today?"
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <span className="font-semibold">Movie Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.sender === 'bot' && <Bot size={16} className="mt-1 flex-shrink-0" />}
                {message.sender === 'user' && <User size={16} className="mt-1 flex-shrink-0" />}
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Bot size={16} />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about movies..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatBot
