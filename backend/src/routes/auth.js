const express = require('express')
const { body } = require('express-validator')
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController')
const { protect } = require('../middleware/auth')
const { handleValidationErrors } = require('../middleware/validation')

const router = express.Router()

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
]

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('preferences.genres')
    .optional()
    .isArray()
    .withMessage('Genres must be an array'),
  body('preferences.minRating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Minimum rating must be between 0 and 10'),
  body('preferences.maxDuration')
    .optional()
    .isInt({ min: 1, max: 600 })
    .withMessage('Maximum duration must be between 1 and 600 minutes')
]

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
]

// Routes
router.post('/register', registerValidation, handleValidationErrors, register)
router.post('/login', loginValidation, handleValidationErrors, login)
router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfileValidation, handleValidationErrors, updateProfile)
router.put('/password', protect, changePasswordValidation, handleValidationErrors, changePassword)
router.post('/logout', protect, logout)

module.exports = router
