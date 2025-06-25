const express = require('express')
const router = express.Router()
const { register, login, recoverPassword } = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.post('/recover', recoverPassword)


module.exports = router
