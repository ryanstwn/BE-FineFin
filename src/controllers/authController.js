import authService from "../services/authService.js"
//import logger from "../utils/logger.js"

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body)

        console.info(`[authController] - Permintaan berhasil: ${result.message}`)
        res.status(201).json(result)
    } catch (err) {
        console.error(`[authController] - Permintaan untuk mendaftar gagal: ${err.track}`)
        next(err)
    }
}

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body)

        console.info(`[authController] - Permintaan berhasil: ${result.message}`)
        return res.status(200).json(result)
    } catch (err) {
        console.error(`[authController] - Permintaan untuk login gagal: ${err.track}`)
        next(err)
    }
}

export default {
    register,
    login,
}   