import transactionService from "./transactionService.js";
import FinancialProfile from "../models/financialProfile.js";

const generateProjection = async (userId) => {
  // 1. Ambil Sisa Saldo (Surplus) dari bulan berjalan
  const summary = await transactionService.getTransactionSummary(userId);
  const surplus = summary.balance;

  // 2. Cek apakah user punya profil finansial
  const profile = await FinancialProfile.findOne({ userId });
  if (!profile) {
    throw new Error("Validasi Gagal: User belum mengisi form Onboarding/Profil Risiko.");
  }

  // 3. Validasi Kondisi Defisit / Pas-pasan
  if (surplus <= 0) {
    return {
      status: surplus === 0 ? "Kuning" : "Merah",
      message: surplus === 0 
        ? "Keuanganmu pas-pasan bulan ini. Yuk coba evaluasi pengeluaran tersier." 
        : "Defisit! Pengeluaranmu lebih besar dari pemasukan. Stop pengeluaran tidak penting sekarang.",
      surplus: surplus,
      recommendation: null,
      projection: [] // FE tidak perlu render Recharts kalau array kosong
    };
  }

  // 4. Penentuan Instrumen & Return per Tahun berdasarkan Profil Risiko
  let ratePerYear = 0;
  let instrumentName = "";
  let instrumentDesc = "";

  // Kita set instrumen riil yang relevan dengan market Indonesia
  switch (profile.riskCategory.toLowerCase()) {
    case "konservatif":
      ratePerYear = 0.05; // Asumsi return 5% per tahun
      instrumentName = "Reksadana Pasar Uang (RDPU)";
      instrumentDesc = "Risiko sangat rendah, cocok untuk dana darurat dan menjaga nilai uangmu.";
      break;
    case "moderat":
      ratePerYear = 0.07; // Asumsi return 7% per tahun
      instrumentName = "SBN Retail / Obligasi FR";
      instrumentDesc = "Risiko menengah dengan imbal hasil tetap (fixed) yang dijamin negara, cocok untuk 1-3 tahun.";
      break;
    case "agresif":
      ratePerYear = 0.12; // Asumsi return 12% per tahun
      instrumentName = "Reksadana Campuran / Saham";
      instrumentDesc = "Risiko tinggi dengan potensi imbal hasil maksimal, cocok untuk investasi jangka panjang (>5 tahun).";
      break;
    default:
      ratePerYear = 0.05;
      instrumentName = "Reksadana Pasar Uang (RDPU)";
      instrumentDesc = "Risiko sangat rendah.";
  }

  // 5. Kalkulasi Bunga Majemuk (Future Value of Annuity) untuk 1-5 Tahun ke depan
  // Rumus: FV = P * [ ((1 + r)^n - 1) / r ]
  // P = Setoran bulanan (surplus)
  // r = Suku bunga per bulan (ratePerYear / 12)
  // n = Jumlah bulan (tahun * 12)
  
  const r = ratePerYear / 12;
  const P = surplus;
  const projection = [];

  // Looping untuk proyeksi Tahun 1 sampai Tahun 5
  for (let year = 1; year <= 5; year++) {
    const n = year * 12; // Total bulan
    const futureValue = P * ((Math.pow(1 + r, n) - 1) / r);
    const totalInvested = P * n; // Total uang asli yang disetor user (tanpa bunga)

    projection.push({
      year: `Tahun ${year}`,
      totalModal: Math.round(totalInvested),
      estimasiHasil: Math.round(futureValue),
    });
  }

  return {
    status: "Hijau",
    message: "Mantap! Ada sisa uang bulan ini. Yuk disiplin investasikan!",
    surplus: surplus,
    recommendation: {
      instrument: instrumentName,
      description: instrumentDesc,
      expectedReturn: `${ratePerYear * 100}% per tahun`,
    },
    projection: projection // Ini yang akan di-consume oleh Recharts (Line Chart) di FE
  };
};

export default {
  generateProjection,
};