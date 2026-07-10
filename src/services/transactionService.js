import transactionRepository from "../repositories/transactionRepository.js";
// WAJIB IMPORT MODEL PROFIL FINANSIAL
import FinancialProfile from "../models/financialProfile.js"; 

// 1. Fungsi Add Transaction
const addTransaction = async (userId, data) => {
  const { namaTransaksi, tipeTransaksi, nominal, kategori, metodePembayaran, tanggal } = data;

  if (!namaTransaksi || !tipeTransaksi || !nominal || !kategori || !metodePembayaran || !tanggal) {
    throw new Error("Validasi Gagal: Semua kolom wajib diisi!");
  }

  const parsedNominal = Number(nominal);
  if (isNaN(parsedNominal) || parsedNominal <= 0) {
    throw new Error("Validasi Gagal: Nominal harus berupa angka positif!");
  }

  if (!["Pemasukan", "Pengeluaran"].includes(tipeTransaksi)) {
    throw new Error("Validasi Gagal: Tipe transaksi harus 'Pemasukan' atau 'Pengeluaran'!");
  }

  const transactionData = {
    userId,
    namaTransaksi,
    tipeTransaksi,
    nominal: parsedNominal,
    kategori,
    metodePembayaran,
    tanggal,
  };

  return await transactionRepository.saveTransaction(transactionData);
};

// 2. Fungsi GET (Fokus Siklus Berjalan Berdasarkan Tanggal Gajian)
const getTransactions = async (userId) => {
    if (!userId) {
        throw new Error("Validasi Gagal: User ID tidak ditemukan!");
    }

    // Tarik tanggal gajian user dari database
    const profile = await FinancialProfile.findOne({ userId });
    
    // Jika user belum isi kuesioner, default ke tanggal 1
    const payday = profile?.tanggalGajian || 1; 

    // Logika Penentuan Siklus (Robo-Advisor Core)
    const today = new Date();
    let startMonth = today.getMonth();
    let startYear = today.getFullYear();
    const currentDay = today.getDate();

    // Jika hari ini belum mencapai tanggal gajian, berarti user masih di siklus bulan lalu
    if (currentDay < payday) {
        startMonth -= 1;
    }

    // Penanganan Ujung Bulan (Edge Case)
    const maxDaysInStartMonth = new Date(startYear, startMonth + 1, 0).getDate();
    const actualPayday = payday > maxDaysInStartMonth ? maxDaysInStartMonth : payday;

    // Buat objek tanggal yang valid
    const startDate = new Date(startYear, startMonth, actualPayday);
    
    // Lempar ke repository dengan membawa startDate
    return await transactionRepository.getTransactionsByUserId(userId, startDate);
};

// 3. Fungsi Delete Transaction 
const deleteTransaction = async (transactionId, userId) => {
  if (!transactionId) {
    throw new Error("Validasi Gagal: Parameter ID Transaksi tidak Valid!");
  }

  const deletedRecord = await transactionRepository.deleteTransactionByIdAndUser(transactionId, userId);

  // Pastikan variabelnya matching: deletedRecord
  if (!deletedRecord) {
    throw new Error("Data Tidak Ditemukan atau anda tidak memiliki akses untuk menghapusnya!!");
  }

  return deletedRecord; 
};

// 4. fungsi Edit Transaction
const editTransaction = async (transactionId, userId, updateData) => {
  if (!transactionId) {
    throw new Error("Validasi Gagal: Parameter ID Transaksi tidak Valid!");
  }

  // Jika ada nominal yang diubah, wajib kita validasi dulu angka murninya
  if (updateData.nominal !== undefined) {
    const parsedNominal = Number(updateData.nominal);
    if (isNaN(parsedNominal) || parsedNominal <= 0) {
      throw new Error("Validasi Gagal: Nominal harus berupa angka positif!");
    }
    updateData.nominal = parsedNominal; // Masukkan kembali angka yang sudah bersih
  }

  // Validasi tipe transaksi jika diubah
  if (updateData.tipeTransaksi && !["Pemasukan", "Pengeluaran"].includes(updateData.tipeTransaksi)) {
    throw new Error("Validasi Gagal: Tipe transaksi harus 'Pemasukan' atau 'Pengeluaran'!");
  }

  const updatedRecord = await transactionRepository.updateTransactionByIdAndUser(transactionId, userId, updateData);

  if (!updatedRecord) {
    throw new Error("Data Tidak Ditemukan atau anda tidak memiliki akses untuk mengubahnya!!");
  }

  return updatedRecord;
};

export default { addTransaction, getTransactions, deleteTransaction, editTransaction };