import { useEffect, useMemo, useState } from "react";
import { fetchOrders, fetchStats } from "./api";
import CreateOrderForm from "./components/CreateOrderForm";
import DashboardStats from "./components/DashboardStats";
import FiltersBar from "./components/FiltersBar";
import OrderList from "./components/OrderList";
import Toast from "./components/Toast";
import "./styles.css";

function App() {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ totalOrders: 0, deliveredOrders: 0, pendingOrders: 0 });
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [toast, setToast] = useState({ message: "", type: "success" });

    const activeFilters = useMemo(
        () => ({
            search: searchTerm.trim(),
            status: statusFilter,
        }),
        [searchTerm, statusFilter]
    );

    function showToast(typeOrPayload, messageValue) {
        if (typeof typeOrPayload === "object" && typeOrPayload !== null) {
            setToast({ type: typeOrPayload.type || "success", message: typeOrPayload.text || "" });
            return;
        }

        setToast({ type: typeOrPayload || "success", message: messageValue || "" });
    }

    async function loadOrders(filters = activeFilters) {
        setLoading(true);
        const result = await fetchOrders(filters);
        setLoading(false);

        if (!result.ok) {
            showToast("error", result.body.message || result.body.error || "Failed to load orders");
            return;
        }

        setOrders((result.body.data || []).map((order) => ({ ...order, isUpdating: false, highlight: false })));
    }

    async function loadStats() {
        setStatsLoading(true);
        const result = await fetchStats();
        setStatsLoading(false);

        if (!result.ok) {
            showToast("error", result.body.message || result.body.error || "Failed to load stats");
            return;
        }

        setStats(result.body.data || { totalOrders: 0, deliveredOrders: 0, pendingOrders: 0 });
    }

    useEffect(() => {
        loadOrders(activeFilters);
    }, [activeFilters]);

    useEffect(() => {
        loadStats();
    }, []);

    useEffect(() => {
        if (!toast.message) {
            return undefined;
        }

        const timeout = setTimeout(() => {
            setToast({ message: "", type: "success" });
        }, 2800);

        return () => clearTimeout(timeout);
    }, [toast.message]);

    async function handleOrderCreated() {
        await Promise.all([loadOrders(activeFilters), loadStats()]);
    }

    function handleOrderUpdated(orderId, patch) {
        setOrders((prev) =>
            prev.map((order) => {
                if (order.id !== orderId) {
                    return order;
                }

                if (patch.payload) {
                    return { ...order, ...patch.payload, isUpdating: patch.isUpdating, highlight: patch.highlight };
                }

                return { ...order, ...patch };
            })
        );

        if (patch.highlight) {
            setTimeout(() => {
                setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, highlight: false } : order)));
            }, 700);
            loadStats();
        }
    }

    function handleResetFilters() {
        setSearchTerm("");
        setStatusFilter("");
    }

    return (
        <main className="container">
            <header className="page-header">
                <h1>Order Tracking System</h1>
                <p className="muted">Production-ready dashboard for tracking every order stage.</p>
            </header>

            <Toast message={toast.message} type={toast.type} />

            <DashboardStats stats={stats} loading={statsLoading} />

            <FiltersBar
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
                onReset={handleResetFilters}
            />

            <CreateOrderForm onOrderCreated={handleOrderCreated} onMessage={showToast} />

            {loading ? (
                <div className="card loading-card">
                    <p>Loading orders...</p>
                </div>
            ) : (
                <OrderList orders={orders} onOrderUpdated={handleOrderUpdated} onMessage={showToast} />
            )}
        </main>
    );
}

export default App;
