// authRoutes.js

const express = require('express');
const { register, login, enable2FA, disable2FA, updateAddress } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/enable-2fa', authenticate, enable2FA);
router.post('/disable-2fa', authenticate, disable2FA);
router.put('/update-address', authenticate, updateAddress);

module.exports = router;

