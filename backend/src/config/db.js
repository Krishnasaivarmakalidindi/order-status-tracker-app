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
      status TEXT NOT NULL
    )
  `);

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
