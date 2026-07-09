import Transaction from "../models/Transaction.js"; 

// 1. Fungsi Save Transaksi (Sudah Aman)
const saveTransaction = async (transactionData) => {
    const newRecord = new Transaction(transactionData);
    return await newRecord.save();
};

// 👇 TAMBAHAN BARU: Ambil semua transaksi milik user tertentu
const getTransactionsByUserId = async (userId) => {
    // sort({ tanggal: -1 }) artinya diurutkan dari tanggal terbaru ke terlama
    return await Transaction.find({ userId }).sort({ tanggal: -1 });
};

//4. menambahkan fungsi update
const updateTransactionByIdAndUser = async (transactionId, userId, updateData) => {
    // findOneAndUpdate akan mencari data, mengubahnya, dan { new: true } mengembalikan data versi terbaru
    return await Transaction.findOneAndUpdate(
        { _id: transactionId, userId },
        { $set: updateData },
        { new: true, runValidators: true }
    );
};

//4. menambahkan fungsi update
const updateTransactionByIdAndUser = async (transactionId, userId, updateData) => {
    // findOneAndUpdate akan mencari data, mengubahnya, dan { new: true } mengembalikan data versi terbaru
    return await Transaction.findOneAndUpdate(
        { _id: transactionId, userId },
        { $set: updateData },
        { new: true, runValidators: true }
    );
};

export default {
    saveTransaction,
    getTransactionsByUserId,
    deleteTransactionByIdAndUser,
    updateTransactionByIdAndUser
};