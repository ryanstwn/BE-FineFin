import Transaction from "../models/Transaction.js"; 

// 1. Fungsi Save Transaksi
const saveTransaction = async (transactionData) => {
    const newRecord = new Transaction(transactionData);
    return await newRecord.save();
};

// 2. Ambil semua transaksi milik user tertentu
const getTransactionsByUserId = async (userId) => {
    // sort({ tanggal: -1 }) artinya diurutkan dari tanggal terbaru ke terlama
    return await Transaction.find({ userId }).sort({ tanggal: -1 });
};

// 3. Fungsi Delete Transaksi (Kembali dimasukkan karena sempat hilang)
const deleteTransactionByIdAndUser = async (transactionId, userId) => {
    return await Transaction.findOneAndDelete({ _id: transactionId, userId });
};

// 4. Fungsi Update Transaksi (Cukup Tulis 1 Kali Saja)
const updateTransactionByIdAndUser = async (transactionId, userId, updateData) => {
    // findOneAndUpdate akan mencari data, mengubahnya, dan { new: true } mengembalikan data versi terbaru
    return await Transaction.findOneAndUpdate(
        { _id: transactionId, userId },
        { $set: updateData },
        { new: true, runValidators: true }
    );
};

// Export semua fungsi agar bisa dipakai di Service
export default {
    saveTransaction,
    getTransactionsByUserId,
    deleteTransactionByIdAndUser,
    updateTransactionByIdAndUser
};