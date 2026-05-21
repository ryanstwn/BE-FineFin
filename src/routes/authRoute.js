import { Router } from "express"
import userController from "../controllers/authController.js"

const authRouter = Router()

authRouter.post('/login', userController.login)
authRouter.post('/register', userController.register)

export default authRouter