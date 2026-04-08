const orderModel = require("../models/orderModel");

const STATUS_FLOW = ["Placed", "Packed", "Shipped", "Delivered"];

function getNextStatus(currentStatus) {
    const index = STATUS_FLOW.indexOf(currentStatus);
    if (index === -1 || index === STATUS_FLOW.length - 1) {
        return null;
    }
    return STATUS_FLOW[index + 1];
}

function isValidTransition(currentStatus, nextStatus) {
    return getNextStatus(currentStatus) === nextStatus;
}

async function createOrder(req, res) {
    try {
        const { customerName } = req.body;

        if (!customerName || typeof customerName !== "string" || !customerName.trim()) {
            return res.status(400).json({
                message: "customerName is required",
            });
        }

        const newOrder = await orderModel.createOrder(customerName.trim());

        return res.status(201).json({
            message: "Order created successfully",
            data: newOrder,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create order",
            error: error.message,
        });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !STATUS_FLOW.includes(status)) {
            return res.status(400).json({
                message: `status must be one of: ${STATUS_FLOW.join(", ")}`,
            });
        }

        const existingOrder = await orderModel.getOrderById(id);

        if (!existingOrder) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        if (!isValidTransition(existingOrder.status, status)) {
            const next = getNextStatus(existingOrder.status);
            const details = next
                ? `Allowed next status is '${next}'`
                : "Order is already in final status and cannot be updated";

            return res.status(400).json({
                message: "Invalid status transition",
                details,
            });
        }

        const updatedOrder = await orderModel.updateOrderStatus(id, status);

        return res.status(200).json({
            message: "Order status updated successfully",
            data: updatedOrder,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update order status",
            error: error.message,
        });
    }
}

async function getOrderById(req, res) {
    try {
        const { id } = req.params;
        const order = await orderModel.getOrderById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        return res.status(200).json({
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch order",
            error: error.message,
        });
    }
}

async function getAllOrders(req, res) {
    try {
        const orders = await orderModel.getAllOrders();
        return res.status(200).json({
            data: orders,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message,
        });
    }
}

module.exports = {
    createOrder,
    updateOrderStatus,
    getOrderById,
    getAllOrders,
    STATUS_FLOW,
    getNextStatus,
};
