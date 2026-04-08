const API_BASE_URL = "http://localhost:5000/api";

export async function createOrder(payload) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    return response.json().then((body) => ({ ok: response.ok, status: response.status, body }));
}

export async function fetchOrders() {
    const response = await fetch(`${API_BASE_URL}/orders`);
    return response.json().then((body) => ({ ok: response.ok, status: response.status, body }));
}

export async function updateOrderStatus(id, status) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });

    return response.json().then((body) => ({ ok: response.ok, status: response.status, body }));
}
