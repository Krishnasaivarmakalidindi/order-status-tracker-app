const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const orderRoutes = require("./routes/orderRoutes");
const { initDB } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ message: "API is running" });
});

app.use("/api", orderRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

initDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Backend server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to initialize database:", error);
        process.exit(1);
    });
