const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export async function apiRequest(endpoint, options = {}) {
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;

    let body = options.body;
    let headers = options.headers || {};

    // ✅ Only stringify plain objects
    if (body && typeof body === "object" && !(body instanceof FormData)) {
        body = JSON.stringify(body);
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        body,
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            ...headers,
        },
        credentials: "include",
        cache: "no-store",
    });

    const text = await res.text();

    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        throw new Error(text || "Invalid server response");
    }

    if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}