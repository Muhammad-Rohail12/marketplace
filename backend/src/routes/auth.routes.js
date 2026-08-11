const express = require('express');
const { register } = require('../auth/controllers/register.controller');
const { verifyEmail } = require('../auth/controllers/verifyEmail.controller');
const { resendVerification } = require('../auth/controllers/resendVerification.controller');
const { login } = require('../auth/controllers/login.controller');
const { refresh } = require('../auth/controllers/refresh.controller');
const { logout } = require('../auth/controllers/logout.controller');
const { getSession } = require('../auth/controllers/session.controller');
const { forgotPassword } = require('../auth/controllers/forgotPassword.controller');
const { resetPassword } = require('../auth/controllers/resetPassword.controller');
const authenticate = require('../auth/middlewares/authenticate.middleware');

const router = express.Router();

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/session', authenticate, getSession);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;