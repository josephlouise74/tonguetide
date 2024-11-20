

// api/index.ts
import axios from 'axios';

// Replace with your backend URL
const BACKEND_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: 10000, // Request timeout of 10 seconds
});

// Setting up interceptors for error handling
api.interceptors.response.use(
    response => response,
    async error => {
        let errorMessage = 'An error occurred';

        if (error.response) {
            // Server responded with a status code outside the 2xx range
            errorMessage = error.response.data.message || error.response.data.error || errorMessage;
        } else if (error.request) {
            // Request was made but no response received
            errorMessage = 'No response received from the server';
        } else {
            // Something happened setting up the request
            errorMessage = error.message;
        }

        return Promise.reject(new Error(errorMessage));
    }
);

export default api;
