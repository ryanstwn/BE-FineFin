import FinancialProfile from "../models/financialProfile.js";

// 5. Simpan ke MongoDB Atlas menggunakan skema baru
const createOnboarding = async ({ 
            userId,
            finalPemasukan, 
            tanggalGajian, 
            tagihanNama, 
            finalTagihanNominal, 
            cicilanNama, 
            finalCicilanNominal, 
            finalTargetTabungan, 
            impian 
        }) =>{
    const newProfile = new FinancialProfile({ // Sekarang sudah sinkron dengan baris nomor 2
        userId: userId,
        pemasukan: finalPemasukan,
        tanggalGajian: date(tanggalGajian),
        tagihanNama: tagihanNama,
        tagihanNominal: finalTagihanNominal,
        cicilanNama: cicilanNama,
        cicilanNominal: finalCicilanNominal,
        targetTabungan: finalTargetTabungan,
        impian: impian
    });

    return await newProfile.save();
}

export default {
    createOnboarding
}