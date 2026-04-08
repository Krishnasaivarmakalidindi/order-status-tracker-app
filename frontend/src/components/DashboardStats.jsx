function DashboardStats({ stats, loading }) {
    const items = [
        { label: "Total Orders", value: stats.totalOrders, variant: "neutral" },
        { label: "Delivered Orders", value: stats.deliveredOrders, variant: "success" },
        { label: "Pending Orders", value: stats.pendingOrders, variant: "warning" },
    ];

    return (
        <section className="stats-grid">
            {items.map((item) => (
                <article key={item.label} className={`stat-card ${item.variant}`}>
                    <p className="stat-label">{item.label}</p>
                    <p className="stat-value">{loading ? "..." : item.value}</p>
                </article>
            ))}
        </section>
    );
}

export default DashboardStats;
