const express = require('express');
const app = express();
const PORT = 3000;

// Middleware agar Express bisa membaca request berbentuk JSON
app.use(express.json());

// Data tiruan (Dummy Data) sebagai pengganti database sementara
let books = [
    { id: 1, title: "Laskar Pelangi", author: "Andrea Hirata" },
    { id: 2, title: "Bumi", author: "Tere Liye" }
];

// --- ROUTE API YAREUUU ---
// get (Mengambil semua data)
app.get('/api/books', (req, res) => {
    res.json(books);
});
// get id (spesifik)
app.get('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.json(book);
});
//Post (Menambah Data Baru)
app.post('/api/books', (req, res) => {
    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author
    };
    books.push(newBook);
    res.status(201).json(newBook);
});
// Put (mengubah data)
app.put('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });

    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;

    res.json({ message: "Buku berhasil diperbarui", book });
});
//Delete 
app.put('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });

    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;

    res.json({ message: "Buku berhasil diperbarui", book });
});
// Jalankan server
app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:3000`);
});