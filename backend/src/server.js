const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const orderRoutes = require("./routes/orderRoutes");
const { initDB } = require("./config/db");
const { sendError, sendSuccess } = require("./utils/apiResponse");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    return res.status(200).send("OK");
});

app.use("/api", orderRoutes);

app.use((error, req, res, next) => {
    return sendError(res, 500, "Internal server error", error?.message || null);
});

app.use((req, res) => {
    return sendError(res, 404, "Route not found");
});

const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

initDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Backend server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to initialize database:", error);
        process.exit(1);
    });
