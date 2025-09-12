const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = async (endpoint, options = {}) => {
    const { body, ...customConfig } = options;

    const headers = { 'Content-Type': 'application/json' };

    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        if (!response.ok) {
            // Try to get a meaningful error message from the JSON body
            const errorData = await response.json().catch(() => ({ message: `Network response was not ok: ${response.statusText}` }));
            throw new Error(errorData.message);
        }
        
        // Handle cases where the response might be empty (like a successful DELETE)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        } else {
            return true; // Return a simple success indicator
        }

    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
};

export default apiClient;
