const express = require("express");
const {
    createOrder,
    updateOrderStatus,
    getOrderById,
    getAllOrders,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/orders", createOrder);
router.put("/orders/:id", updateOrderStatus);
router.get("/orders/:id", getOrderById);
router.get("/orders", getAllOrders);

module.exports = router;
