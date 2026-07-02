import Transaction from "../models/Transaction.js"; 

const saveTransaction = async (transactionData) => {
    const newRecord = new Transaction(transactionData);
    return await newRecord.save();
};

// 👇 TAMBAHAN BARU: Ambil semua transaksi milik user tertentu
const getTransactionsByUserId = async (userId) => {
    // sort({ tanggal: -1 }) artinya diurutkan dari tanggal terbaru ke terlama
    return await Transaction.find({ userId }).sort({ tanggal: -1 });
};

export default {
    saveTransaction,
    getTransactionsByUserId // Jangan lupa diekspor
};