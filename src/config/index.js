import dotenv from 'dotenv'

dotenv.config()

const config = {
    port: process.env.PORT || 5000,
    bcryptSalt: Number(process.env.SALT),
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiredIn: process.env.JWT_EXPIRED_IN,
    mongoDbUrl: process.env.MONGODB_URL
}

export default config