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
    return db.get("SELECT id, customerName, status FROM orders WHERE id = ?", [id]);
}

async function getAllOrders() {
    const db = getDB();
    return db.all("SELECT id, customerName, status FROM orders ORDER BY id DESC");
}

async function updateOrderStatus(id, status) {
    const db = getDB();
    await db.run("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    return getOrderById(id);
}

module.exports = {
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
};
