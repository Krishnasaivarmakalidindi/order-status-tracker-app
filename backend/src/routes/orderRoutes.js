const express = require("express");
const {
    createOrder,
    updateOrderStatus,
    getOrderById,
    getAllOrders,
    getOrderStats,
} = require("../controllers/orderController");
const {
    validateOrderId,
    validateCreateOrder,
    validateUpdateStatus,
    validateListQuery,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.get("/orders/stats", getOrderStats);
router.get("/orders", validateListQuery, getAllOrders);
router.get("/orders/:id", validateOrderId, getOrderById);
router.post("/orders", validateCreateOrder, createOrder);
router.put("/orders/:id", validateOrderId, validateUpdateStatus, updateOrderStatus);

module.exports = router;
