import Transaction from "../models/Transaction.js"; 

// 1. Fungsi Save Transaksi (Sudah Aman)
const saveTransaction = async (transactionData) => {
    const newRecord = new Transaction(transactionData);
    return await newRecord.save();
};

// 2. ROMBAK FUNGSI GET: Saring berdasarkan userId DAN tanggal >= startDate
const getTransactionsByUserId = async (userId, startDate) => {
    // Menarik data transaksi yang tanggalnya mulai dari tanggal gajian (startDate) ke atas
    return await Transaction.find({ 
        userId,
        tanggal: { $gte: startDate } // $gte = Greater Than or Equal (Lebih besar atau sama dengan)
    }).sort({ tanggal: -1 }); // Diurutkan dari tanggal terbaru ke terlama
};

// 3. TAMBAHKAN FUNGSI DELETE: Eksekusi penghapusan di database Mongoose
const deleteTransactionByIdAndUser = async (transactionId, userId) => {
    // Menghapus data yang ID Transaksinya cocok DAN pastinya milik si user yang sedang login
    return await Transaction.findOneAndDelete({ _id: transactionId, userId });
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