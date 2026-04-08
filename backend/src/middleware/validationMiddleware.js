const { STATUS_FLOW } = require("../utils/statusFlow");
const { sendError } = require("../utils/apiResponse");

function validateOrderId(req, res, next) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return sendError(res, 400, "Order id must be a positive integer");
    }

    req.params.id = id;
    return next();
}

function validateCreateOrder(req, res, next) {
    const { customerName } = req.body;

    if (!customerName || typeof customerName !== "string" || !customerName.trim()) {
        return sendError(res, 400, "customerName is required");
    }

    req.body.customerName = customerName.trim();
    return next();
}

function validateUpdateStatus(req, res, next) {
    const { status } = req.body;

    if (!status || !STATUS_FLOW.includes(status)) {
        return sendError(res, 400, `status must be one of: ${STATUS_FLOW.join(", ")}`);
    }

    return next();
}

function validateListQuery(req, res, next) {
    const { status, search } = req.query;

    if (status && !STATUS_FLOW.includes(status)) {
        return sendError(res, 400, `status query must be one of: ${STATUS_FLOW.join(", ")}`);
    }

    if (search && typeof search !== "string") {
        return sendError(res, 400, "search query must be text");
    }

    return next();
}

module.exports = {
    validateOrderId,
    validateCreateOrder,
    validateUpdateStatus,
    validateListQuery,
};
