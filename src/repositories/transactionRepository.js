import Transaction from "../models/Transaction.js"; 

const saveTransaction = async (transactionData) => {
    const newRecord = new Transaction(transactionData);
    return await newRecord.save();
};

// 👇 UBAH FUNGSI INI: Tambahkan parameter startDate
const getTransactionsByUserId = async (userId, startDate) => {
    // Tarik hanya transaksi yang tanggalnya >= startDate siklus gajian
    return await Transaction.find({ 
        userId,
        tanggal: { $gte: startDate } 
    }).sort({ tanggal: -1 });
};

const deleteTransactionByIdAndUser = async (transactionId, userId) => {
    return await Transaction.findOneAndDelete({ _id: transactionId, userId });
};

export default {
    saveTransaction,
    getTransactionsByUserId,
    deleteTransactionByIdAndUser 
};