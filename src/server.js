// 1. Import semua package menggunakan gaya TypeScript (ES Modules)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
import createApp from "app"
import config from './config';

const app = createApp()

// 4. Koneksi ke MongoDB
const mongoUri = config.mongoDbUrl || 'mongodb://localhost:27017/keuangan_db';
// Di atas adalah fallback ke database lokal jika .env belum disetting, agar server tidak langsung mati.

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Koneksi ke MongoDB Berhasil!');
  })
  .catch((err) => {
    if (err instanceof Error) {
      console.error('Gagal konek ke MongoDB:', err.message);
    }
  });

// 5. Membuat Route Dasar
app.get('/', (req, res) => {
  res.send('Server Backend Keuangan Aktif dan Berjalan!');
});

// 6. Menjalankan Server
const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});