import { updateOrderStatus } from "../api";
import StatusStepper, { STATUS_FLOW } from "./StatusStepper";

const STATUS_BADGE_CLASS = {
    Placed: "badge placed",
    Packed: "badge packed",
    Shipped: "badge shipped",
    Delivered: "badge delivered",
};

function OrderList({ orders, onOrderUpdated, onMessage }) {
    async function handleUpdateStatus(order, nextStatus) {
        if (!nextStatus) {
            onMessage({ type: "error", text: `Order #${order.id} is already Delivered` });
            return;
        }

        onOrderUpdated(order.id, { isUpdating: true });

        const result = await updateOrderStatus(order.id, nextStatus);

        if (!result.ok) {
            onOrderUpdated(order.id, { isUpdating: false });
            onMessage({
                type: "error",
                text: result.body.error || result.body.message || "Failed to update order",
            });
            return;
        }

        onOrderUpdated(order.id, {
            isUpdating: false,
            highlight: true,
            payload: result.body.data,
        });
        onMessage({ type: "success", text: `Order #${order.id} moved to ${nextStatus}` });
    }

    if (orders.length === 0) {
        return (
            <div className="card empty-state">
                <h2>No Orders Yet</h2>
                <p>Create your first order to start tracking fulfillment progress.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h2>Order List</h2>
            <div className="list">
                {orders.map((order) => {
                    const currentIndex = STATUS_FLOW.indexOf(order.status);
                    const nextStatus = STATUS_FLOW[currentIndex + 1];

                    return (
                        <article key={order.id} className={`list-item ${order.highlight ? "pulse" : ""}`}>
                            <div className="order-meta">
                                <p className="order-id">Order #{order.id}</p>
                                <p className="muted">Customer: {order.customerName}</p>
                                <p className="muted">Created: {new Date(order.createdAt).toLocaleString()}</p>
                                <p className="muted">Updated: {new Date(order.updatedAt).toLocaleString()}</p>
                                <span className={STATUS_BADGE_CLASS[order.status]}>{order.status}</span>
                            </div>
                            <div className="actions">
                                <StatusStepper status={order.status} />
                                <button
                                    onClick={() => handleUpdateStatus(order, nextStatus)}
                                    disabled={!nextStatus || order.isUpdating}
                                >
                                    {order.isUpdating
                                        ? "Updating..."
                                        : nextStatus
                                            ? `Move to ${nextStatus}`
                                            : "Completed"}
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}

export default OrderList;
