import Transaction from "../models/Transaction.js"; // Pastikan nama file modelnya cocok dengan BE 1

const saveTransaction = async (transactionData) => {
    // Karena nama properti sudah bersih dan sama, tinggal oper utuh ke Model Mongoose
    const newRecord = new Transaction(transactionData);
    return await newRecord.save();
};

export default {
    saveTransaction
};