const mongoose = require('mongoose');

// REVISI SKEMA BIAR COCOK SAMA FE 6 SOAL (Sudah Diperbaiki Sintaksnya)
const FinancialProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  pemasukan: { 
    type: Number, 
    required: true,
    min: [0, 'Pemasukan tidak boleh minus']
  },
  tanggalGajian: { 
    type: Number, 
    required: true,
    min: 1,
    max: 31
  },
  tagihanNama: { 
    type: String 
  },
  tagihanNominal: { 
    type: Number, 
    default: 0,
    min: [0, 'Tagihan tidak boleh minus']
  },
  cicilanNama: { 
    type: String 
  },
  cicilanNominal: { 
    type: Number, 
    default: 0,
    min: [0, 'Cicilan tidak boleh minus']
  },
  targetTabungan: { 
    type: Number, 
    required: true,
    min: [0, 'Target tabungan tidak boleh minus']
  },
  impian: { 
    type: String, 
    required: true 
  },
  
  // Biarkan field ini default dulu untuk modal Sprint 4 (Kalkulator/Skoring)
  riskStatus: { 
    type: String, 
    enum: ['Konservatif', 'Moderat', 'Agresif', 'Belum Dihitung'], 
    default: 'Belum Dihitung' 
  }
}, { 
  timestamps: true // KUNCI: Cukup tulis sekali di sini untuk otomatis create field createdAt & updatedAt
});

module.exports = mongoose.model('FinancialProfile', FinancialProfileSchema);