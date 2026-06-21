// src/controllers/transactionController.js
import transactionService from "../services/transactionService.js";

export const createTransaction = async (req, res) => {
    try {
        // 1. Ambil ID user dari token JWT yang sedang login
        const userId = req.user.id;

        // 2. Tangkap inputan dari pop-up modal Frontend
        const { namaPengeluaran, totalPengeluaran, kategori, metodePembayaran, tanggal } = req.body;

        // 3. Oper ke Service Layer untuk divalidasi dan diolah
        const newTransaction = await transactionService.addTransaction(userId, {
            namaPengeluaran, 
            totalPengeluaran, 
            kategori, 
            metodePembayaran, 
            tanggal
        });

        // 4. Berikan respon sukses
        return res.status(201).json({
            success: true,
            message: "Data transaksi berhasil ditambahkan!",
            data: newTransaction
        });

    } catch (error) {
        console.error("Error BE2 Transaction Controller:", error.message);
        
        // Tangkap error dari hasil validasi di Service Layer
        if (error.message.includes("Validasi")) {
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
    }
};