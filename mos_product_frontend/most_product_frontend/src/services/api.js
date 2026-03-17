import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/users/login/', credentials),
    signup: (userData) => api.post('/users/', userData),
    logout: () => api.post('/users/logout/'),
    getCurrentUser: () => api.get('/users/me/'),
};

// Menu API
export const menuAPI = {
    getCategories: () => api.get('/menu/categories/'),
    getMenuItems: (categoryId = null) => {
        const url = categoryId ? `/menu/menu/?category=${categoryId}` : '/menu/menu/';
        return api.get(url);
    },
    getMenuItem: (id) => api.get(`/menu/menu/${id}/`),
    getRecommendations: (limit = 8) => api.get(`/menu/menu/recommendations/?limit=${limit}`),
    askChatbot: (message) => api.post('/menu/menu/chatbot/', { message }),
};

// Toppings API
export const toppingsAPI = {
    getToppings: () => api.get('/toppings/'),
    getTopping: (id) => api.get(`/toppings/${id}/`),
};

// Orders API
export const ordersAPI = {
    createOrder: (orderData) => api.post('/orders/', orderData),
    getOrders: () => api.get('/orders/'),
    getOrder: (id) => api.get(`/orders/${id}/`),
    updateOrderStatus: (id, status) => api.patch(`/orders/${id}/`, { status }),
};

// Bike API (for delivery tracking)
export const bikeAPI = {
    getBikes: () => api.get('/bikes/'),
    getBike: (id) => api.get(`/bikes/${id}/`),
};

export default api;
