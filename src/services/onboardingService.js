// src/services/onboardingService.js
import onboardingRepository from "../repositories/onboardingRepository.js";

const onBoarding = async (userId, data) => {
    const { impian, financialProfile, riskProfile } = data;

    // 1. LOGIKA SKORING RISIKO
    const riskScore = riskProfile.reduce((total, angka) => total + angka, 0);
    let riskCategory = "Konservatif";
    
    if (riskScore >= 9 && riskScore <= 12) {
        riskCategory = "Moderat";
    } else if (riskScore >= 13) {
        riskCategory = "Agresif";
    }

    // 2. VALIDASI LOGIKAL
    if (!financialProfile.pemasukan || Number(financialProfile.pemasukan) <= 0) {
        throw new Error("Pemasukan bulanan harus diisi angka valid!");
    }
    if (!financialProfile.tanggalGajian) {
        throw new Error("Tanggal gajian harus dipilih!");
    }

    // 3. MAPPING & KIRIM KE REPOSITORY (Data diubah ke angka murni dengan Number())
    const newProfile = await onboardingRepository.createOnboarding({ 
        userId,
        pemasukan: Number(financialProfile.pemasukan),
        tanggalGajian: financialProfile.tanggalGajian,
        tagihanNama: financialProfile.tagihan?.nama || "",
        tagihanNominal: Number(financialProfile.tagihan?.nominal || 0),
        cicilanNama: financialProfile.cicilan?.nama || "",
        cicilanNominal: Number(financialProfile.cicilan?.nominal || 0),
        targetTabungan: Number(financialProfile.targetTabungan || 0),
        impian: impian,
        riskScore: riskScore,
        riskCategory: riskCategory
    });

    return { newProfile, riskCategory };
};

export default { onBoarding };