const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

let db;

async function initDB() {
    if (db) {
        return db;
    }

    db = await open({
        filename: path.join(__dirname, "../../data/orders.db"),
        driver: sqlite3.Database,
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerName TEXT NOT NULL,
            status TEXT NOT NULL,
            createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

    const columns = await db.all("PRAGMA table_info(orders)");
    const columnNames = columns.map((column) => column.name);

    if (!columnNames.includes("createdAt")) {
        await db.exec("ALTER TABLE orders ADD COLUMN createdAt TEXT");
        await db.exec("UPDATE orders SET createdAt = CURRENT_TIMESTAMP WHERE createdAt IS NULL");
    }

    if (!columnNames.includes("updatedAt")) {
        await db.exec("ALTER TABLE orders ADD COLUMN updatedAt TEXT");
        await db.exec("UPDATE orders SET updatedAt = CURRENT_TIMESTAMP WHERE updatedAt IS NULL");
    }

    return db;
}

function getDB() {
    if (!db) {
        throw new Error("Database not initialized. Call initDB() first.");
    }
    return db;
}

module.exports = {
    initDB,
    getDB,
};
