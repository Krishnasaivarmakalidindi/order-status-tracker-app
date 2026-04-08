const API_BASE_URL = import.meta.env.VITE_FRONTEND_API_URL || import.meta.env.VITE_API_URL || "/api";

async function parseResponse(response) {
    const body = await response.json();
    return { ok: response.ok, status: response.status, body };
}

function networkErrorResponse(error) {
    return {
        ok: false,
        status: 0,
        body: {
            success: false,
            message: "Unable to reach API server",
            error: error?.message || "Network error",
        },
    };
}

export async function createOrder(payload) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        return parseResponse(response);
    } catch (error) {
        return networkErrorResponse(error);
    }
}

export async function fetchOrders(filters = {}) {
    const params = new URLSearchParams();

    if (filters.search) {
        params.set("search", filters.search);
    }

    if (filters.status) {
        params.set("status", filters.status);
    }

    const queryString = params.toString();
    try {
        const response = await fetch(
            `${API_BASE_URL}/orders${queryString ? `?${queryString}` : ""}`
        );
        return parseResponse(response);
    } catch (error) {
        return networkErrorResponse(error);
    }
}

export async function updateOrderStatus(id, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });

        return parseResponse(response);
    } catch (error) {
        return networkErrorResponse(error);
    }
}

export async function fetchStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/stats`);
        return parseResponse(response);
    } catch (error) {
        return networkErrorResponse(error);
    }
}
