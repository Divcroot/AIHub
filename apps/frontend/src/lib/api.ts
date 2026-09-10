const API_URL = import.meta.env.VITE_API_URL;

export const api = {
    async health() {
        const response = await fetch(`${API_URL}/api/health`);

        if (!response.ok) {
            throw new Error("Failed to connect to API");
        }

        return response.json();
    }
};