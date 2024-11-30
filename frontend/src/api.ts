import axios from "axios"; // Importing Axios for HTTP requests
import { ACCESS_TOKEN } from "./constants"; // Importing the access token key constant

// Creating an Axios instance with a base URL set from the environment variable
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL // Dynamically sets the base URL from .env
});

// Adding an interceptor to handle requests
api.interceptors.request.use(
    (config) => {
        // Fetch the access token from localStorage
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            // If a token exists, attach it to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; // Return the updated config to proceed with the request
    },
    (error) => {
        // If there's an error while preparing the request, reject the promise
        return Promise.reject(error);
    }
);

// Exporting the Axios instance to use throughout the application
export default api;
