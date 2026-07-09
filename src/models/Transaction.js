import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  namaTransaksi: {
    type: String,
    required: true,
    trim: true
  },

  totalPengeluaran: {
    type: Number,
    required: true,
    min: [1, 'Nominal tidak boleh 0 atau negatif']
  },

  kategori: {
    type: String,
    required: true
  },

  metodePembayaran: {
    type: String,
    required: true
  },

  tanggal: {
    type: Date,
    required: true
  }

}, {
  timestamps: true
});

// Compound Index
transactionSchema.index({
    userId: 1,
    tanggal: -1
});

export default mongoose.model('Transaction', transactionSchema);