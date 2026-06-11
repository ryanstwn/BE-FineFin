// src/models/financialProfile.js
import mongoose from 'mongoose'; // Ganti dari require ke import

const onboardingSchema = new mongoose.Schema({
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
    impian: { type: String },

    //ProfileRisk
    riskScore: {type: Number, required: true },
    riskCategory: {type:String, required: true }
    
}, { timestamps: true });

const FinancialProfile = mongoose.model('FinancialProfile', onboardingSchema);

export default mongoose.model('Onboarding', onboardingSchema); // Ganti dari module.exports ke export default