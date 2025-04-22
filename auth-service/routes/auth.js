// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, getAllUsers } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/users',verifyToken ,getAllUsers);
module.exports = router;