import { useEffect, useState } from "react";
import { fetchOrders } from "./api";
import CreateOrderForm from "./components/CreateOrderForm";
import OrderList from "./components/OrderList";
import "./styles.css";

function App() {
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadOrders() {
        setLoading(true);
        const result = await fetchOrders();
        setLoading(false);

        if (!result.ok) {
            setMessage({ type: "error", text: result.body.message || "Failed to load orders" });
            return;
        }

        setOrders(result.body.data || []);
    }

    useEffect(() => {
        loadOrders();
    }, []);

    function handleOrderCreated(order) {
        setOrders((prev) => [order, ...prev]);
    }

    function handleOrderUpdated(updatedOrder) {
        setOrders((prev) => prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
    }

    return (
        <main className="container">
            <h1>Order Tracking System</h1>

            {message && <div className={`message ${message.type}`}>{message.text}</div>}

            <CreateOrderForm onOrderCreated={handleOrderCreated} onMessage={setMessage} />

            {loading ? (
                <div className="card">
                    <p>Loading orders...</p>
                </div>
            ) : (
                <OrderList orders={orders} onOrderUpdated={handleOrderUpdated} onMessage={setMessage} />
            )}
        </main>
    );
}

export default App;
