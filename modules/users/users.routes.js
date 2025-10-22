const express = require('express');
const register = require('./controllers/register');
const userDashboard = require('./controllers/userDashboard');
const auth = require('../../middlewares/auth');

const userRouter = express.Router();

module.exports = userRouter;

userRouter.post('/register', register.register);
userRouter.post('/login', register.login);
userRouter.post('/forgot-password', register.forgotPassword);
userRouter.post('/reset-password', register.resetPassword);

userRouter.use(auth);
userRouter.get('/dashboard', userDashboard);

module.exports = userRouter;