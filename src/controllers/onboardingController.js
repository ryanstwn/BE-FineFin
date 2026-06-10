// src/controllers/onboardingController.js
import onboardingService from "../services/onboardingService.js";

export const createOnboarding = async (req, res) => {
    try {
        // 1. Ambil ID User dari JWT
        const userId = req.user.id; 

        // 2. Tangkap struktur bersarang sesuai format baru Frontend
        const { impian, financialProfile, riskProfile } = req.body;

        // 3. Validasi awal di Controller
        if (!financialProfile || !financialProfile.pemasukan) {
            return res.status(400).json({ success: false, message: "Data finansial tidak lengkap!" });
        }
        if (!riskProfile || !Array.isArray(riskProfile)) {
            return res.status(400).json({ success: false, message: "Data profil risiko tidak valid!" });
        }

        // 4. Oper kotak besar data ke Service Layer
        const result = await onboardingService.onBoarding(userId, { 
            impian, 
            financialProfile, 
            riskProfile 
        });

        // 5. Respon sukses ke Frontend
        return res.status(201).json({
            success: true,
            message: `Kuesioner berhasil! Profil risiko Anda: ${result.riskCategory}`,
            data: result.newProfile
        });

    } catch (error) {
        console.error("Error BE2 Onboarding Controller:", error);
        
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Anda sudah mengisi kuesioner onboarding sebelumnya." });
        }

        return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
    }
};