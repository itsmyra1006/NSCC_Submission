const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = async (endpoint, { body, ...customConfig } = {}) => {
    const headers = { 'Content-Type': 'application/json' };

    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        credentials: 'include', 
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    let response;
    try {
        response = await fetch(`${BASE_URL}/api${endpoint}`, config);
    } catch (error) {
        console.error("API call failed:", error);
        throw new Error("Failed to fetch");
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Network response was not ok: ${response.statusText}` }));
        console.error("API Error Response:", errorData);
        throw new Error(errorData.message || `Network response was not ok: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return;
};

export default apiClient;