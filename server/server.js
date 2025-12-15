const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/emotions", require("./routes/emotionRoutes"));
app.use("/api/music", require("./routes/musicRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

connectDB();

/* FRONTEND SERVE */
const clientPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientPath));

// ✅ Express 5 safe catch-all
app.use((req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
