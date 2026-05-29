// src/models/financialProfile.js
import mongoose from 'mongoose'; // Ganti dari require ke import

const financialProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    pemasukan: { type: Number, required: true },
    tanggalGajian: { type: Number, required: true },
    tagihanNama: { type: String },
    tagihanNominal: { type: Number },
    cicilanNama: { type: String },
    cicilanNominal: { type: Number },
    targetTabungan: { type: Number },
    impian: { type: String }
}, { timestamps: true });

const FinancialProfile = mongoose.model('FinancialProfile', financialProfileSchema);

export default FinancialProfile; // Ganti dari module.exports ke export default