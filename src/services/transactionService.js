import transactionRepository from "../repositories/transactionRepository.js";
// WAJIB IMPORT MODEL PROFIL FINANSIAL
import FinancialProfile from "../models/financialProfile.js";

// 1. Fungsi Add Transaction
const addTransaction = async (userId, data) => {
  const {
    namaTransaksi,
    tipeTransaksi,
    nominal,
    kategori,
    metodePembayaran,
    tanggal,
  } = data;

  if (
    !namaTransaksi ||
    !tipeTransaksi ||
    !nominal ||
    !kategori ||
    !metodePembayaran ||
    !tanggal
  ) {
    throw new Error("Validasi Gagal: Semua kolom wajib diisi!");
  }

  const parsedNominal = Number(nominal);
  if (isNaN(parsedNominal) || parsedNominal <= 0) {
    throw new Error("Validasi Gagal: Nominal harus berupa angka positif!");
  }

  if (!["Pemasukan", "Pengeluaran"].includes(tipeTransaksi)) {
    throw new Error(
      "Validasi Gagal: Tipe transaksi harus 'Pemasukan' atau 'Pengeluaran'!",
    );
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

  // Ambil profil user
  const profile = await FinancialProfile.findOne({ userId });

  const payday = profile?.tanggalGajian || 1;

  const today = new Date();

  let startMonth = today.getMonth();
  let startYear = today.getFullYear();

  // Menentukan awal siklus
  if (today.getDate() < payday) {
    startMonth--;
  }

  // Jika mundur ke Desember tahun sebelumnya
  if (startMonth < 0) {
    startMonth = 11;
    startYear--;
  }

  // Tentukan tanggal awal siklus
  const maxDaysStart = new Date(startYear, startMonth + 1, 0).getDate();
  const actualStartPayday = payday > maxDaysStart ? maxDaysStart : payday;

  const startDate = new Date(startYear, startMonth, actualStartPayday);

  // Tentukan tanggal akhir siklus
  let endMonth = startMonth + 1;
  let endYear = startYear;

  if (endMonth > 11) {
    endMonth = 0;
    endYear++;
  }

  const maxDaysEnd = new Date(endYear, endMonth + 1, 0).getDate();

  const actualEndPayday = payday > maxDaysEnd ? maxDaysEnd : payday;

  const endDate = new Date(endYear, endMonth, actualEndPayday);

  return await transactionRepository.getTransactionsByUserId(
    userId,
    startDate,
    endDate,
  );
};

// 3. Fungsi Delete Transaction
const deleteTransaction = async (transactionId, userId) => {
  if (!transactionId) {
    throw new Error("Validasi Gagal: Parameter ID Transaksi tidak Valid!");
  }

  const deletedRecord =
    await transactionRepository.deleteTransactionByIdAndUser(
      transactionId,
      userId,
    );

  // Pastikan variabelnya matching: deletedRecord
  if (!deletedRecord) {
    throw new Error(
      "Data Tidak Ditemukan atau anda tidak memiliki akses untuk menghapusnya!!",
    );
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
  if (
    updateData.tipeTransaksi &&
    !["Pemasukan", "Pengeluaran"].includes(updateData.tipeTransaksi)
  ) {
    throw new Error(
      "Validasi Gagal: Tipe transaksi harus 'Pemasukan' atau 'Pengeluaran'!",
    );
  }

  const updatedRecord =
    await transactionRepository.updateTransactionByIdAndUser(
      transactionId,
      userId,
      updateData,
    );

  if (!updatedRecord) {
    throw new Error(
      "Data Tidak Ditemukan atau anda tidak memiliki akses untuk mengubahnya!!",
    );
  }

  return updatedRecord;
};
const getTransactionSummary = async (userId) => {
  if (!userId) {
    throw new Error("Validasi Gagal: User ID tidak ditemukan!");
  }

  // Ambil profil finansial user
  const profile = await FinancialProfile.findOne({ userId });

  // Gaji tetap dari onboarding
  const salary = profile?.pemasukan || 0;

  // Ambil tanggal gajian
  const payday = profile?.tanggalGajian || 1;

  // Menentukan awal siklus
  const today = new Date();
  let startMonth = today.getMonth();
  let startYear = today.getFullYear();

  if (today.getDate() < payday) {
    startMonth--;
  }

  const maxDays = new Date(startYear, startMonth + 1, 0).getDate();
  const actualPayday = payday > maxDays ? maxDays : payday;

  const startDate = new Date(startYear, startMonth, actualPayday);

  // Ambil data dari Repository (BE1)
  const additionalIncome =
    await transactionRepository.getAdditionalIncomeSummary(
      userId,
      startDate,
      endDate,
    );

  const expense = await transactionRepository.getExpenseSummary(
    userId,
    startDate,
    endDate,
  );

  const categories = await transactionRepository.getExpenseCategorySummary(
    userId,
    startDate,
    endDate,
  );

  // Business Logic
  const income = salary + additionalIncome;
  const balance = income - expense;

  return {
    income,
    expense,
    balance,
    categories,
  };
};

export default {
  addTransaction,
  getTransactions,
  deleteTransaction,
  editTransaction,
  getTransactionSummary,
};
