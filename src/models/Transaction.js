import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  // Relasi ke User yang sedang login (Sangat Penting!)
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  namaPengeluaran: { 
    type: String, 
    required: true,
    trim: true // Menghapus spasi berlebih
  },
  totalPengeluaran: { 
    type: Number, 
    required: true,
    min: [1, 'Nominal tidak boleh 0 atau negatif'] // Proteksi lapis kedua di backend
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
  timestamps: true // Otomatis membuat field createdAt dan updatedAt
});

export default mongoose.model('Transaction', transactionSchema);
