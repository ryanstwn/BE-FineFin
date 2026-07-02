import mongoose from "mongoose";
import createApp from "./app.js";
import config from "./config/index.js";

const app = createApp();

mongoose.connect(config.mongoDbUrl)
  .then(() => console.log("Koneksi ke MongoDB Berhasil!"))
  .catch(err => console.error(err));

app.get("/", (req, res) => {
  res.send("Server Backend Keuangan Aktif dan Berjalan!");
});

app.listen(config.port || 5000, () => {
  console.log(`Server berjalan di http://localhost:${config.port || 5000}`);
});