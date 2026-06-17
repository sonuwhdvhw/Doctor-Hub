import express from 'express'
import { register, login, forgotPassword, resetPassword } from '../controllers/authController.js'
import { validate } from '../middleware/validate.js'
import { registerRules, loginRules, forgotPasswordRules, resetPasswordRules } from '../validators/hubValidators.js'

const authRouter = express.Router()

authRouter.post('/register', registerRules, validate, register)
authRouter.post('/login', loginRules, validate, login)
authRouter.post('/forgot-password', forgotPasswordRules, validate, forgotPassword)
authRouter.post('/reset-password', resetPasswordRules, validate, resetPassword)

export default authRouter
