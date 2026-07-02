import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    let token;

    // 1. Cek apakah ada token di header request
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Mengambil token asli (memotong kata 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // 2. Verifikasi token menggunakan JWT_SECRET yang ada di .env tim kalian
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_sementara');

            // 3. Selipkan data user id ke dalam object request (req.user)
            // BE 1 biasanya menyimpan id user di dalam token saat login dengan nama 'id' atau '_id'
            req.user = { id: decoded.id };

            return next(); // Lanjut ke controller onboarding kamu
        } catch (error) {
            return res.status(401).json({ message: 'Token tidak valid atau kadaluwarsa' });
        }
    }

    // Jika tidak ada token sama sekali
    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak, token tidak ditemukan' });
    }
};