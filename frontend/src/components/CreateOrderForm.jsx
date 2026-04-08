import { useState } from "react";
import { createOrder } from "../api";

function CreateOrderForm({ onOrderCreated, onMessage }) {
    const [customerName, setCustomerName] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        if (!customerName.trim()) {
            onMessage({ type: "error", text: "Customer name is required" });
            return;
        }

        setLoading(true);
        const result = await createOrder({ customerName: customerName.trim() });
        setLoading(false);

        if (!result.ok) {
            onMessage({
                type: "error",
                text: result.body.message || result.body.error || "Failed to create order",
            });
            return;
        }

        setCustomerName("");
        onOrderCreated();
        onMessage({ type: "success", text: result.body.message || "Order created successfully" });
    }

    return (
        <form onSubmit={handleSubmit} className="card">
            <h2>Create Order</h2>
            <p className="muted">Every new order starts in Placed status.</p>
            <div className="field">
                <label htmlFor="customerName">Customer Name</label>
                <input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    disabled={loading}
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Order"}
            </button>
        </form>
    );
}

export default CreateOrderForm;
