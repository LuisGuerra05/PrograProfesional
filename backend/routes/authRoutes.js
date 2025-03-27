// authRoutes.js

const express = require('express');
const { register, login, generate2FA, disable2FA, updateAddress, getProfile, confirm2FA, verifyOTP } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/generate-2fa', authenticate, generate2FA);
router.post('/confirm-2fa', authenticate, confirm2FA);
router.post('/verify-otp', authenticate, verifyOTP);

router.post('/disable-2fa', authenticate, disable2FA);
router.put('/update-address', authenticate, updateAddress);

router.get('/profile', authenticate, getProfile);

module.exports = router;

