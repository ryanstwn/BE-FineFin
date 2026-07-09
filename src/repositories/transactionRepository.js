import Transaction from "../models/Transaction.js"; 

const saveTransaction = async (transactionData) => {
    const newRecord = new Transaction(transactionData);
    return await newRecord.save();
};

const getTransactionsByUserId = async (userId) => {
    return await Transaction.find({ userId }).sort({ tanggal: -1 });
};

// 👇 TAMBAHAN BARU: Menghapus transaksi berdasarkan ID & kepemilikan User
const deleteTransactionByIdAndUser = async (transactionId, userId) => {
    // findOneAndDelete akan mereturn data jika berhasil dihapus, atau null jika tidak ketemu
    return await Transaction.findOneAndDelete({ _id: transactionId, userId });
};

export default {
    saveTransaction,
    getTransactionsByUserId,
    deleteTransactionByIdAndUser // 👇 Jangan lupa diekspor
};