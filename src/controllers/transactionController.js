import transactionService from "../services/transactionService.js";

export const createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { namaTransaksi, tipeTransaksi,nominal, kategori, metodePembayaran, tanggal } = req.body;

    const newTransaction = await transactionService.addTransaction(userId, {
      namaTransaksi,
      tipeTransaksi,
      nominal,
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

//Controller untuk GET Riwayat Transaksi
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

//Controller untuk DELETE riwayat transaksi
export const  deleteTransaction = async (req, res) => {
  try{
    const userId = req.user.id;
    const transactionId = req.params.id; //diambil dr parameter URL: /api/transaction/:id

    await transactionService.deleteTransaction(transactionId, userId);

    return res.status(200).json({
      success:true,
      message:"Data transaksi berhasil dihapus!"
    });
  }catch (error) {
    console.error("Error BE2 DELETE Transaction:",error.message);

    //membedakan error validasi/not found dengan error server
    if (error.message.includes("Tidak Ditemukan")||
  error.message.includes("Validasi")){
    return res.status(404).json({success: false, message: error.message});
  }

  return res.status(500).json({success:false, message:"Terjadi Kesalahan pada server saat menghapus data!"});
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id; // Diambil dari /api/transaction/:id
    const { namaTransaksi, tipeTransaksi, nominal, kategori, metodePembayaran, tanggal } = req.body;

    // Kumpulkan data yang ingin di-update
    const updateData = {};
    if (namaTransaksi) updateData.namaTransaksi = namaTransaksi;
    if (tipeTransaksi) updateData.tipeTransaksi = tipeTransaksi;
    if (nominal) updateData.nominal = nominal;
    if (kategori) updateData.kategori = kategori;
    if (metodePembayaran) updateData.metodePembayaran = metodePembayaran;
    if (tanggal) updateData.tanggal = tanggal;

    const updatedTransaction = await transactionService.editTransaction(transactionId, userId, updateData);

    return res.status(200).json({
      success: true,
      message: "Data transaksi berhasil diperbarui!",
      data: updatedTransaction
    });
  } catch (error) {
    console.error("Error BE2 UPDATE Transaction:", error.message);
    if (error.message.includes("Ditemukan")) {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes("Validasi")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server saat memperbarui data." });
  }
};
// TAMBAHKAN INI di paling bawah:

export const getSummary = async (req, res) => {
  try {
    const userId = req.user.id; // Diambil dari middleware protect

    const summary = await transactionService.getTransactionSummary(userId);

    return res.status(200).json({
      success: true,
      message: "Data ringkasan keuangan berhasil dihitung!",
      data: summary
    });
  } catch (error) {
    console.error("Error BE2 GET Summary:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Terjadi kesalahan saat menghitung ringkasan keuangan." 
    });
  }
};