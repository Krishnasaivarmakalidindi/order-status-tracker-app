const orderModel = require("../models/orderModel");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { getNextStatus, isValidTransition } = require("../utils/statusFlow");

async function createOrder(req, res) {
    try {
        const { customerName } = req.body;
        const newOrder = await orderModel.createOrder(customerName);

        return sendSuccess(res, 201, "Order created successfully", newOrder);
    } catch (error) {
        return sendError(res, 500, "Failed to create order", error.message);
    }
}

async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const existingOrder = await orderModel.getOrderById(id);

        if (!existingOrder) {
            return sendError(res, 404, "Order not found");
        }

        if (!isValidTransition(existingOrder.status, status)) {
            const next = getNextStatus(existingOrder.status);
            const errorMessage = next
                ? `Allowed next status is '${next}'`
                : "Order is already in final status and cannot be updated";

            return sendError(res, 400, "Invalid status transition", errorMessage);
        }

        const updatedOrder = await orderModel.updateOrderStatus(id, status);

        return sendSuccess(res, 200, "Order status updated successfully", updatedOrder);
    } catch (error) {
        return sendError(res, 500, "Failed to update order status", error.message);
    }
}

async function getOrderById(req, res) {
    try {
        const { id } = req.params;
        const order = await orderModel.getOrderById(id);

        if (!order) {
            return sendError(res, 404, "Order not found");
        }

        return sendSuccess(res, 200, "Order fetched successfully", order);
    } catch (error) {
        return sendError(res, 500, "Failed to fetch order", error.message);
    }
}

async function getAllOrders(req, res) {
    try {
        const filters = {
            search: req.query.search || "",
            status: req.query.status || "",
        };
        const orders = await orderModel.getAllOrders(filters);
        return sendSuccess(res, 200, "Orders fetched successfully", orders);
    } catch (error) {
        return sendError(res, 500, "Failed to fetch orders", error.message);
    }
}

async function getOrderStats(req, res) {
    try {
        const stats = await orderModel.getOrderStats();
        return sendSuccess(res, 200, "Order stats fetched successfully", {
            totalOrders: Number(stats.totalOrders || 0),
            deliveredOrders: Number(stats.deliveredOrders || 0),
            pendingOrders: Number(stats.pendingOrders || 0),
        });
    } catch (error) {
        return sendError(res, 500, "Failed to fetch order stats", error.message);
    }
}

module.exports = {
    createOrder,
    updateOrderStatus,
    getOrderById,
    getAllOrders,
    getOrderStats,
};
