import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

// ===============================
// SAVE TRANSACTION
// ===============================
const saveTransaction = async (transactionData) => {
  const newRecord = new Transaction(transactionData);
  return await newRecord.save();
};

// ===============================
// GET TRANSACTION LIST
// ===============================
const getTransactionsByUserId = async (userId, startDate, endDate) => {
  const query = { userId };

  if (startDate && endDate) {
    query.tanggal = {
      $gte: startDate,
      $lt: endDate,
    };
  } else if (startDate) {
    query.tanggal = {
      $gte: startDate,
    };
  }

  return await Transaction.find(query).sort({ tanggal: -1 });
};

// ===============================
// TOTAL PEMASUKAN TAMBAHAN
// (Tidak termasuk gaji onboarding)
// ===============================
const getAdditionalIncomeSummary = async (userId, startDate, endDate) => {
  const match = {
    userId: new mongoose.Types.ObjectId(userId),
    tipeTransaksi: "Pemasukan",
  };

  if (startDate && endDate) {
    match.tanggal = {
      $gte: startDate,
      $lt: endDate,
    };
  } else if (startDate) {
    match.tanggal = {
      $gte: startDate,
    };
  }

  const result = await Transaction.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$nominal",
        },
      },
    },
  ]);

  return result.length ? result[0].total : 0;
};

// ===============================
// TOTAL PENGELUARAN
// ===============================
const getExpenseSummary = async (userId, startDate, endDate) => {
  const match = {
    userId: new mongoose.Types.ObjectId(userId),
    tipeTransaksi: "Pengeluaran",
  };

  if (startDate && endDate) {
    match.tanggal = {
      $gte: startDate,
      $lt: endDate,
    };
  } else if (startDate) {
    match.tanggal = {
      $gte: startDate,
    };
  }

  const result = await Transaction.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$nominal",
        },
      },
    },
  ]);

  return result.length ? result[0].total : 0;
};

// ===============================
// PIE CHART
// TOTAL PENGELUARAN PER KATEGORI
// ===============================
const getExpenseCategorySummary = async (userId, startDate, endDate) => {
  const match = {
    userId: new mongoose.Types.ObjectId(userId),
    tipeTransaksi: "Pengeluaran",
  };

  if (startDate && endDate) {
    match.tanggal = {
      $gte: startDate,
      $lt: endDate,
    };
  } else if (startDate) {
    match.tanggal = {
      $gte: startDate,
    };
  }

  return await Transaction.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: "$kategori",
        total: {
          $sum: "$nominal",
        },
      },
    },
    {
      $project: {
        _id: 0,
        kategori: "$_id",
        total: 1,
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
  ]);
};

// ===============================
// DELETE TRANSACTION
// ===============================
const deleteTransactionByIdAndUser = async (transactionId, userId) => {
  return await Transaction.findOneAndDelete({
    _id: transactionId,
    userId,
  });
};

// ===============================
// UPDATE TRANSACTION
// ===============================
const updateTransactionByIdAndUser = async (
  transactionId,
  userId,
  updateData,
) => {
  return await Transaction.findOneAndUpdate(
    {
      _id: transactionId,
      userId: userId,
    },
    updateData,
    {
      new: true, // mengembalikan data terbaru
      runValidators: true, // tetap menjalankan validasi schema
    },
  );
};

export default {
  saveTransaction,
  getTransactionsByUserId,
  getAdditionalIncomeSummary,
  getExpenseSummary,
  getExpenseCategorySummary,
  deleteTransactionByIdAndUser,
  updateTransactionByIdAndUser,
};
