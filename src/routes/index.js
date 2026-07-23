import { Router } from 'express'
import authRouter from './authRoute.js'
import financialRoute from './financialRoute.js'
import transactionRoute from './transactionRoute.js'
import roboAdvisorRoute from './roboAdvisorRoute.js'

const mainRoute = Router()
mainRoute.use('/auth', authRouter)

mainRoute.use('/onboarding', financialRoute)

mainRoute.use('/transaction', transactionRoute)

mainRoute.use('/robo-advisor', roboAdvisorRoute)

export default mainRoute