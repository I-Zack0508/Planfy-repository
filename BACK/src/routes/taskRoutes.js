const express = require('express')
const router = express.Router()
const auth = require('../middlewares/authMiddleware')
const { createTask, getTasks, updateTask, deleteTask, completeTask, getTaskStats } = require('../controllers/taskController')

router.get('/', auth, getTasks)
router.post('/', auth, createTask)
router.put('/:id', auth, updateTask)
router.delete('/:id', auth, deleteTask)
router.patch('/:id/complete', auth, completeTask)
router.get('/stats', auth, getTaskStats)

module.exports = router