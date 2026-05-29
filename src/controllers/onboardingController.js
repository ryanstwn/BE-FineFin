// controllers/onboardingController.js
import FinancialProfile from "../models/financialProfile.js"; // Diubah jadi F Kapital agar sinkron

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

        // 3. CORE LOGIC: Fungsi pembersih string "Rp5.000.000" menjadi angka murni 5000000
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

        // 5. Simpan ke MongoDB Atlas menggunakan skema baru
        const newProfile = new FinancialProfile({ // Sekarang sudah sinkron dengan baris nomor 2
            userId,
            pemasukan: finalPemasukan,
            tanggalGajian: Number(tanggalGajian),
            tagihanNama,
            tagihanNominal: finalTagihanNominal,
            cicilanNama,
            cicilanNominal: finalCicilanNominal,
            targetTabungan: finalTargetTabungan,
            impian
        });

        await newProfile.save();

        // 6. Respon sukses ke Frontend
        return res.status(201).json({
            success: true,
            message: "Kuisioner onboarding berhasil disimpan!",
            data: newProfile
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