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
const FRONTEND_API_URL = process.env.FRONTEND_API_URL || "";

const corsOptions = {
    origin(origin, callback) {
        if (!origin || !FRONTEND_API_URL || origin === FRONTEND_API_URL) {
            return callback(null, true);
        }

        return callback(new Error("CORS policy blocked this origin"));
    },
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (req, res) => {
    return sendSuccess(res, 200, "API is running", {
        uptimeSeconds: Math.floor(process.uptime()),
    });
});

app.use("/api", orderRoutes);

app.use((error, req, res, next) => {
    if (error && error.message === "CORS policy blocked this origin") {
        return sendError(res, 403, error.message);
    }

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
            console.log(`Backend server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to initialize database:", error);
        process.exit(1);
    });
