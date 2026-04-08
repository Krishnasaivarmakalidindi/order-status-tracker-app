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

module.exports = {
    STATUS_FLOW,
    getNextStatus,
    isValidTransition,
};
