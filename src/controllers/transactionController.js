import transactionService from "../services/transactionService.js";

export const createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { namaPengeluaran, totalPengeluaran, kategori, metodePembayaran, tanggal } = req.body;

    const newTransaction = await transactionService.addTransaction(userId, {
      namaPengeluaran,
      totalPengeluaran,
      kategori,
      metodePembayaran,
      tanggal,
    });

    return res.status(201).json({
      success: true,
      message: "Data transaksi berhasil ditambahkan!",
      data: newTransaction,
    });
  } catch (error) {
    console.error("Error BE2 Transaction Controller:", error.message);
    if (error.message.includes("Validasi")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
};

// 👇 TAMBAHAN BARU: Controller untuk GET Riwayat Transaksi
export const getTransactions = async (req, res) => {
    try {
        const userId = req.user.id; // Diambil dari token JWT

        // Tarik data dari Service
        const transactions = await transactionService.getTransactions(userId);

        return res.status(200).json({
            success: true,
            message: "Data riwayat transaksi berhasil diambil!",
            data: transactions
        });
    } catch (error) {
        console.error("Error BE2 GET Transaction:", error.message);
        return res.status(500).json({ success: false, message: "Gagal mengambil data dari server." });
    }
};