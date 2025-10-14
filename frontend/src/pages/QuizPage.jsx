import React, { useState } from 'react'
import QuizIntro from '../components/quiz/QuizIntro'
import QuizQuestion from '../components/quiz/QuizQuestion'
import QuizResult from '../components/quiz/QuizResult'
import LoadingScreen from '../components/quiz/LoadingScreen'

const QuizPage = () => {
  const [quizState, setQuizState] = useState('intro') // intro, quiz, loading, result
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const questions = [
    {
      id: 1,
      question: "What type of movies do you enjoy most?",
      type: "single",
      multiple: false,
      options: [
        { value: "action", label: "Action & Adventure", icon: "🚀", description: "Thrilling adventures and high-stakes action" },
        { value: "comedy", label: "Comedy", icon: "😂", description: "Funny stories that make you laugh" },
        { value: "romance", label: "Romance", icon: "💕", description: "Love stories and emotional connections" },
        { value: "horror", label: "Horror & Thriller", icon: "👻", description: "Suspenseful and scary experiences" },
        { value: "drama", label: "Drama", icon: "🎭", description: "Deep stories about life and emotions" },
        { value: "sci-fi", label: "Science Fiction", icon: "🛸", description: "Futuristic worlds and advanced technology" }
      ]
    },
    {
      id: 2,
      question: "What's your preferred movie mood?",
      type: "single",
      multiple: false,
      options: [
        { value: "exciting", label: "Exciting & Energetic", icon: "⚡", description: "Fast-paced and adrenaline-pumping" },
        { value: "relaxing", label: "Relaxing & Chill", icon: "🌅", description: "Calm and peaceful experiences" },
        { value: "emotional", label: "Emotional & Thoughtful", icon: "💭", description: "Deep feelings and meaningful moments" },
        { value: "funny", label: "Funny & Light-hearted", icon: "😄", description: "Humorous and entertaining" },
        { value: "mysterious", label: "Mysterious & Intriguing", icon: "🔍", description: "Suspenseful and mind-bending" }
      ]
    },
    {
      id: 3,
      question: "How long do you prefer your movies to be?",
      type: "single",
      multiple: false,
      options: [
        { value: "short", label: "Short & Sweet (< 2 hours)", icon: "⚡", description: "Quick watches for busy schedules" },
        { value: "medium", label: "Medium Length (2-3 hours)", icon: "⏱️", description: "Balanced runtime for most stories" },
        { value: "long", label: "Epic Length (> 3 hours)", icon: "🎬", description: "Deep dives into complex narratives" }
      ]
    },
    {
      id: 4,
      question: "What era of movies interests you most?",
      type: "single",
      multiple: false,
      options: [
        { value: "classic", label: "Classic Movies", icon: "📽️", description: "Timeless films from the golden age" },
        { value: "modern", label: "Modern Blockbusters", icon: "🎯", description: "Recent hits and contemporary films" },
        { value: "indie", label: "Independent Films", icon: "🎨", description: "Unique and artistic indie productions" },
        { value: "mixed", label: "Mix of Everything", icon: "🌈", description: "No preference - all eras welcome" }
      ]
    },
    {
      id: 5,
      question: "Do you prefer movies based on books or original stories?",
      type: "single",
      multiple: false,
      options: [
        { value: "book", label: "Book Adaptations", icon: "📚", description: "Stories that started as novels" },
        { value: "original", label: "Original Screenplays", icon: "✍️", description: "Fresh stories created for film" },
        { value: "both", label: "Both Are Great", icon: "🤝", description: "Love adaptations and originals equally" }
      ]
    }
  ]

  const handleStartQuiz = () => {
    setQuizState('quiz')
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
  }

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer)
  }

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = {
        questionId: questions[currentQuestion].id,
        answer: selectedAnswer
      }
      setAnswers(newAnswers)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        // Quiz completed
        setQuizState('loading')
        setTimeout(() => {
          setQuizState('result')
        }, 2000) // Simulate AI processing
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1]?.answer || null)
    }
  }

  const handleRetake = () => {
    setQuizState('intro')
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
  }

  const canProceed = selectedAnswer !== null

  if (quizState === 'intro') {
    return <QuizIntro onStart={handleStartQuiz} />
  }

  if (quizState === 'loading') {
    return <LoadingScreen />
  }

  if (quizState === 'result') {
    return <QuizResult answers={answers} onRetake={handleRetake} />
  }

  if (quizState === 'quiz') {
    const question = questions[currentQuestion]
    return (
      <QuizQuestion
        question={question}
        current={currentQuestion + 1}
        total={questions.length}
        selected={selectedAnswer}
        onSelect={handleAnswerSelect}
        onNext={handleNext}
        onPrevious={handlePrevious}
        canProceed={canProceed}
      />
    )
  }

  return null
}

export default QuizPage
