import transactionRepository from "../repositories/transactionRepository.js";

const addTransaction = async (userId, data) => {
  const { namaPengeluaran, totalPengeluaran, kategori, metodePembayaran, tanggal } = data;

  if (!namaPengeluaran || !totalPengeluaran || !kategori || !metodePembayaran || !tanggal) {
    throw new Error("Validasi Gagal: Semua kolom wajib diisi!");
  }

  const parsedNominal = Number(totalPengeluaran);
  if (isNaN(parsedNominal)) {
    throw new Error("Validasi Gagal: Total pengeluaran harus berupa angka valid!");
  }

  if (parsedNominal <= 0) {
    throw new Error("Validasi Gagal: Total pengeluaran harus lebih besar dari 0!");
  }

  const transactionData = {
    userId,
    namaPengeluaran,
    totalPengeluaran: parsedNominal,
    kategori,
    metodePembayaran,
    tanggal,
  };

  return await transactionRepository.saveTransaction(transactionData);
};

// 👇 TAMBAHAN BARU: Service untuk meneruskan permintaan ke repository
const getTransactions = async (userId) => {
    if (!userId) {
        throw new Error("Validasi Gagal: User ID tidak ditemukan!");
    }
    return await transactionRepository.getTransactionsByUserId(userId);
};

// Jangan lupa tambahkan getTransactions di sini
export default { addTransaction, getTransactions };