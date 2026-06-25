import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import config from '../config/index.js';
import authRepository from '../repositories/authRepository.js';
import dns from 'dns/promises';

// fungsi validasi 
const validateEmailDomain = async (email) => {
    // cek fotmat dasar pakai Regex
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email))
        return false;
    // ambil nama domain
    const domain = email.split('@')[1];
    // cek mx record ke dns server
    try {
        const records = await dns.resolveMx(domain);
        //jika record ada isinya
        return records && records.length > 0;
    } catch (error) {
        //jika tidak
        return false;
    }
}
const register = async (data) => {
    const { username, email, password } = data;
    // validasi
    const isEmailValid = await validateEmailDomain(email);
    if (!isEmailValid) {
        return res.status(400).json({ message: "Gagal: Format Email Salah atau domain tdk terdaftar" });
    }

    // 1. Cek apakah email sudah terdaftar di database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Gagal: Email sudah terdaftar!" }); 
        // Error ini nanti otomatis ditangkap oleh errorMiddleware kalian
    }

    // 2. Enkripsi (Hash) password menggunakan bcrypt
    const saltRounds = config.bcryptSalt || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Simpan user baru ke database MongoDB
    const result = await authRepository.registrasi(username, email, hashedPassword)
    return { message: "Registrasi berhasil!", userId: result._id };
};

const login = async (data) => {
    const { email, password } = data;

    // 1. Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Gagal: Email atau kata sandi salah!" });
    }

    // 2. Bandingkan password yang diketik dengan yang ada di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Gagal: Email atau kata sandi salah!" });
    }

    // 3. Jika cocok, buatkan token JWT
    // Menggunakan variabel dari config/index.js yang mengambil dari .env
    const token = jwt.sign(
        { id: user._id, email: user.email }, // Payload (data yang diselipkan di token)
        config.jwtSecret || 'rahasia_aman_finefin', // Kunci rahasia
        { expiresIn: config.jwtExpiredIn || '1d' } // Masa berlaku token (1 hari)
    );

    

    // 4. Kembalikan token ke Frontend
    return { 
        message: "Login berhasil!", 
        token: token,
        isOnboarded: user.isOnboarded, 
        user: { 
            id: user._id, 
            username: user.username, 
            email: user.email 
        } 
    };
};

export default { register, login };