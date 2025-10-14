const express = require('express')
const { getMe, updateProfile } = require('../controllers/authController')
const { protect } = require('../middleware/auth')

const router = express.Router()

// All routes are protected
router.use(protect)

// Routes
router.get('/me', getMe)
router.put('/profile', updateProfile)

module.exports = router
