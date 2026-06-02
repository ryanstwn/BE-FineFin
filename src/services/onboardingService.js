import onboardingRepository from "../repositories/onboardingRepository.js";

// 3. CORE LOGIC: Fungsi pembersih string "Rp5.000.000" menjadi angka murni 5000000
const onBoarding = async (userId,{ 
            pemasukan, 
            tanggalGajian, 
            tagihanNama, 
            tagihanNominal, 
            cicilanNama, 
            cicilanNominal, 
            targetTabungan, 
            impian 
        }
    ) => {
    
    const cleanNumber = (val) => {
        if (!val) return 0;
        const cleaned = val.toString().replace(/[^0-9]/g, ''); // Hapus semua karakter non-angka
        return cleaned ? Number(cleaned) : 0;
    };

    const finalPemasukan = cleanNumber(pemasukan);
    const finalTagihanNominal = cleanNumber(tagihanNominal);
    const finalCicilanNominal = cleanNumber(cicilanNominal);
    const finalTargetTabungan = cleanNumber(targetTabungan);

    // 4. Validasi Input Dasar
    if (finalPemasukan <= 0) {
        return res.status(400).json({ success: false, message: "Pemasukan bulanan harus diisi angka valid!" });
    }
    if (!tanggalGajian) {
        return res.status(400).json({ success: false, message: "Tanggal gajian harus dipilih!" });
    }

    return await onboardingRepository.createOnboarding({ 
            userId,
            finalPemasukan, 
            tanggalGajian, 
            tagihanNama, 
            finalTagihanNominal, 
            cicilanNama, 
            finalCicilanNominal, 
            finalTargetTabungan, 
            impian 
        })
}

export default {onBoarding}