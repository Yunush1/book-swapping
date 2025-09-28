const express = require('express');
const router = express.Router();
const authController = require('../controller/authController')

// router.post('/login-via-otp', authController.loginByOTP);
router.post('/login-via-password', authController.loginByPassword);
// router.get('/google/login', authController.googleLoginRedirect);
// router.get('/google/callback', authController.googleCallback);

// router.post('/verify-otp', authController.verifyOtp);
// router.post('/send-otp', authController.loginByOTP);
router.post('/signup',authController.register);
// router.get('/get-access-token',authController.getAccssToken);
// const authenticate = require('../middlewares/authMiddleware');

// router.post('/update-password',authenticate, authController.updatePassword);
// router.post('/reset-password', authenticate,authController.resetPassword);
// router.get('/validate-token', authenticate, (req, res) => {
//   res.sendStatus(200);
// });


module.exports = router;