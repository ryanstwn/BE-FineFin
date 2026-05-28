const mongoose = require('mongoose');

const FinancialProfileSchema = new mongoose.Schema({
  // 1. Relasi Krusial ke Koleksi User (Mengikat data ke user yang login)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // KUNCI: Harus sama dengan nama model User kamu saat exports (misal: 'User')
    required: true,
    unique: true // Memastikan 1 user hanya punya 1 profil finansial/onboarding
  },
  
  // 2. Data Langkah 1 Wizard Form (Profil Finansial Dasar)
  monthlyIncome: {
    type: Number,
    required: true,
    min: [0, 'Pendapatan tidak boleh minus']
  },
  monthlyExpenses: {
    type: Number,
    required: true,
    min: [0, 'Pengeluaran tidak boleh minus']
  },
  financialGoal: {
    type: String,
    required: true,
    enum: ['Pensiun', 'Dana Darurat', 'Investasi', 'Lainnya'] // Sesuaikan dengan opsi yang dibuat FE 1
  },

  // 3. Data Langkah 2 & 3 Wizard Form (Jawaban Kuesioner)
  // Disimpan dalam bentuk object poin angka agar BE 2 mudah menjumlahkannya di Sprint 4
  answers: {
    q1: { type: Number, required: true },
    q2: { type: Number, required: true },
    q3: { type: Number, required: true },
    q4: { type: Number, required: true },
    q5: { type: Number, required: true }
  },

  // 4. Status Profil Risiko (Akan di-update oleh BE 2 menggunakan rumus If-Then di Sprint 4)
  riskStatus: {
    type: String,
    enum: ['Konservatif', 'Moderat', 'Agresif', 'Belum Dihitung'],
    default: 'Belum Dihitung'
  }
}, { 
  timestamps: true // Otomatis membuat field createdAt dan updatedAt di MongoDB
});

module.exports = mongoose.model('FinancialProfile', FinancialProfileSchema);