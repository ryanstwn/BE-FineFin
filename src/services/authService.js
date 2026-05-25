import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import config from '../config/index.js';

const register = async (data) => {
    const { nama, email, password } = data;

    // 1. Cek apakah email sudah terdaftar di database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Gagal: Email sudah terdaftar!"); 
        // Error ini nanti otomatis ditangkap oleh errorMiddleware kalian
    }

    // 2. Enkripsi (Hash) password menggunakan bcrypt
    const saltRounds = config.bcryptSalt || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Simpan user baru ke database MongoDB
    const newUser = new User({
        nama,
        email,
        password: hashedPassword
    });
    await newUser.save();

    return { message: "Registrasi berhasil!", userId: newUser._id };
};

const login = async (data) => {
    const { email, password } = data;

    // 1. Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Gagal: Email atau kata sandi salah!");
    }

    // 2. Bandingkan password yang diketik dengan yang ada di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Gagal: Email atau kata sandi salah!");
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
        user: { 
            id: user._id, 
            nama: user.nama, 
            email: user.email 
        } 
    };
};

export default { register, login };