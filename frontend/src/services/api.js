import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const taskAPI = {
    // Get all tasks
    getAllTasks: () => api.get('/tasks'),

    // Get single task
    getTask: (id) => api.get(`/tasks/${id}`),

    // Create new task
    createTask: (taskData) => api.post('/tasks', taskData),

    // Update task
    updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),

    // Delete task
    deleteTask: (id) => api.delete(`/tasks/${id}`),

    // Get statistics
    getStats: () => api.get('/tasks/stats/summary'),
};

export default api;
