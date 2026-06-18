import transactionRepository from "../repositories/transactionRepository.js";

const addTransaction = async (userId, data) => {
    const { type, category, nominal, date, note } = data;

    // 1. Validasi Inputan Wajib
    if (!type || !category || !nominal || !date) {
        throw new Error("Validasi Gagal: Tipe, kategori, nominal, dan tanggal wajib diisi!");
    }

    // 2. Validasi Core Logic BE2: Harus Angka Murni
    const parsedNominal = Number(nominal);
    if (isNaN(parsedNominal)) {
        throw new Error("Validasi Gagal: Nominal transaksi harus berupa angka valid!");
    }

    // 3. Validasi Core Logic BE2: Anti-Minus
    if (parsedNominal <= 0) {
        throw new Error("Validasi Gagal: Nominal transaksi harus lebih besar dari 0!");
    }

    // 4. Validasi Pilihan Tipe
    if (!["Pemasukan", "Pengeluaran"].includes(type)) {
        throw new Error("Validasi Gagal: Tipe transaksi harus 'Pemasukan' atau 'Pengeluaran'!");
    }

    // Siapkan objek data bersih untuk dikirim ke repo
    const transactionData = {
        userId,
        type,
        category,
        nominal: parsedNominal,
        date,
        note: note || ""
    };

    return await transactionRepository.saveTransaction(transactionData);
};

export default { addTransaction };