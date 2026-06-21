import transactionRepository from "../repositories/transactionRepository.js";

const addTransaction = async (userId, data) => {
    const { namaPengeluaran, totalPengeluaran, kategori, metodePembayaran, tanggal } = data;

    // 1. Validasi Inputan Wajib
    if (!namaPengeluaran || !totalPengeluaran || !kategori || !metodePembayaran || !tanggal) {
        throw new Error("Validasi Gagal: namaPengeluaran, totalPengeluaran, kategori, metodePembayaran, tanggal wajib diisi!");
    }

    // 2. Validasi Core Logic BE2: Harus Angka Murni
    const parsedNominal = Number(totalPengeluaran);
    if (isNaN(parsedNominal)) {
        throw new Error("Validasi Gagal: Total pengeluaran harus berupa angka valid!");
    }

    // 3. Validasi Core Logic BE2: Anti-Minus
    if (parsedNominal <= 0) {
        throw new Error("Validasi Gagal: Total pengeluaran harus lebih besar dari 0!");
    }
    
    // Siapkan objek data bersih untuk dikirim ke repo
    const transactionData = {
        userId,
        namaPengeluaran,
        totalPengeluaran : parsedNominal,
        kategori,
        metodePembayaran,
        tanggal
    };

    return await transactionRepository.saveTransaction(transactionData);
};

export default { addTransaction };