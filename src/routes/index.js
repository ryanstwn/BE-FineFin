import { Router } from 'express'
import authRouter from './authRoute'

const mainRoute = Router()
mainRoute.use('/auth', authRouter)

mainRoute.use('')

export default mainRoute