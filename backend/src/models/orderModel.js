const { getDB } = require("../config/db");

async function createOrder(customerName, status = "Placed") {
    const db = getDB();
    const result = await db.run(
        "INSERT INTO orders (customerName, status) VALUES (?, ?)",
        [customerName, status]
    );

    return getOrderById(result.lastID);
}

async function getOrderById(id) {
    const db = getDB();
    return db.get(
        "SELECT id, customerName, status, createdAt, updatedAt FROM orders WHERE id = ?",
        [id]
    );
}

async function getAllOrders(filters = {}) {
    const db = getDB();
    const whereClauses = [];
    const values = [];

    if (filters.search) {
        whereClauses.push("LOWER(customerName) LIKE ?");
        values.push(`%${filters.search.toLowerCase()}%`);
    }

    if (filters.status) {
        whereClauses.push("status = ?");
        values.push(filters.status);
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

    return db.all(
        `SELECT id, customerName, status, createdAt, updatedAt
         FROM orders
         ${whereSql}
         ORDER BY id DESC`,
        values
    );
}

async function updateOrderStatus(id, status) {
    const db = getDB();
    await db.run(
        "UPDATE orders SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
        [status, id]
    );
    return getOrderById(id);
}

async function getOrderStats() {
    const db = getDB();
    return db.get(`
    SELECT
      COUNT(*) AS totalOrders,
      SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) AS deliveredOrders,
      SUM(CASE WHEN status != 'Delivered' THEN 1 ELSE 0 END) AS pendingOrders
    FROM orders
  `);
}

module.exports = {
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    getOrderStats,
};
