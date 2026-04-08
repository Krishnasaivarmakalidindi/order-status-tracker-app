import { updateOrderStatus } from "../api";

const STATUS_FLOW = ["Placed", "Packed", "Shipped", "Delivered"];

function OrderList({ orders, onOrderUpdated, onMessage }) {
    async function handleUpdateStatus(order) {
        const currentIndex = STATUS_FLOW.indexOf(order.status);
        const nextStatus = STATUS_FLOW[currentIndex + 1];

        if (!nextStatus) {
            onMessage({ type: "error", text: `Order #${order.id} is already Delivered` });
            return;
        }

        const result = await updateOrderStatus(order.id, nextStatus);

        if (!result.ok) {
            onMessage({ type: "error", text: result.body.details || result.body.message || "Failed to update order" });
            return;
        }

        onOrderUpdated(result.body.data);
        onMessage({ type: "success", text: `Order #${order.id} updated to ${nextStatus}` });
    }

    if (orders.length === 0) {
        return (
            <div className="card">
                <h2>Order List</h2>
                <p>No orders found. Create one to get started.</p>
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
                        <div key={order.id} className="list-item">
                            <div>
                                <p><strong>Order #{order.id}</strong></p>
                                <p>Customer: {order.customerName}</p>
                                <p>Status: {order.status}</p>
                            </div>
                            <div className="actions">
                                <span className="step-indicator">
                                    {STATUS_FLOW.map((step, index) => (
                                        <span
                                            key={step}
                                            className={index <= currentIndex ? "step done" : "step"}
                                        >
                                            {step}
                                        </span>
                                    ))}
                                </span>
                                <button onClick={() => handleUpdateStatus(order)} disabled={!nextStatus}>
                                    {nextStatus ? `Move to ${nextStatus}` : "Completed"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default OrderList;
