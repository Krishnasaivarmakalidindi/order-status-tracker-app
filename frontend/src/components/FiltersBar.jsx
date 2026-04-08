const STATUS_OPTIONS = ["", "Placed", "Packed", "Shipped", "Delivered"];

function FiltersBar({ searchTerm, statusFilter, onSearchChange, onStatusChange, onReset }) {
    return (
        <section className="card filters-card">
            <h2>Search and Filter</h2>
            <div className="filters-row">
                <div className="field grow">
                    <label htmlFor="searchCustomer">Search by Customer</label>
                    <input
                        id="searchCustomer"
                        type="text"
                        value={searchTerm}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Type customer name"
                    />
                </div>
                <div className="field filter-select">
                    <label htmlFor="statusFilter">Status</label>
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(event) => onStatusChange(event.target.value)}
                    >
                        {STATUS_OPTIONS.map((statusOption) => (
                            <option key={statusOption || "all"} value={statusOption}>
                                {statusOption || "All"}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="button" className="secondary-btn" onClick={onReset}>
                    Reset
                </button>
            </div>
        </section>
    );
}

export default FiltersBar;
