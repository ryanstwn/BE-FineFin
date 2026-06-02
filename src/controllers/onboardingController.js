// controllers/onboardingController.js
import FinancialProfile from "../models/financialProfile.js"; // Diubah jadi F Kapital agar sinkron
import onboardingService from "../services/onboardingService.js";

export const createOnboarding = async (req, res) => { // Langsung tambahkan 'export' di depan fungsi
    try {
        // 1. Ambil ID User dari JWT (didapat dari middleware auth)
        const userId = req.user.id; 

        // 2. Tangkap data dari body request sesuai state milik Frontend
        const { 
            pemasukan, 
            tanggalGajian, 
            tagihanNama, 
            tagihanNominal, 
            cicilanNama, 
            cicilanNominal, 
            targetTabungan, 
            impian 
        } = req.body;

        const result = await onboardingService.onBoarding(userId, { 
            pemasukan, 
            tanggalGajian, 
            tagihanNama, 
            tagihanNominal, 
            cicilanNama, 
            cicilanNominal, 
            targetTabungan, 
            impian 
        })

        // 6. Respon sukses ke Frontend
        return res.status(201).json({
            success: true,
            message: "Kuisioner onboarding berhasil disimpan!",
            data: result.newProfile
        });

    } catch (error) {
        console.error("Error BE2 Onboarding:", error);
        
        // Antisipasi jika user menekan tombol submit dua kali (userId unique)
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Anda sudah mengisi kuesioner onboarding sebelumnya." });
        }

        return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
    }
};