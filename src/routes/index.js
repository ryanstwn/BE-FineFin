import { Router } from 'express'
import authRouter from './authRoute.js'

//Import rute onbordingController
import financialRoute from './financialRoute.js'

const mainRoute = Router()
mainRoute.use('/auth', authRouter)

mainRoute.use('/financial', financialRoute)

export default mainRoute