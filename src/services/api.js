// src/services/api.js
import axios from 'axios';

// Fallback URLs for different environments
const getBaseURL = () => {
  // Try Vite env first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Development fallback
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // Production fallback
  return '/api'; // Relative URL for same-origin API
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request ID for tracking
    config.headers['X-Request-ID'] = Date.now();
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // You can process successful responses here
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear tokens and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden
          console.warn('Access forbidden');
          break;
          
        case 404:
          // Not found
          console.warn('Resource not found');
          break;
          
        case 500:
          // Server error
          console.error('Server error occurred');
          break;
          
        default:
          console.warn(`HTTP Error ${error.response.status}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error - no response received');
      
      // Check if we're offline
      if (!navigator.onLine) {
        console.error('You appear to be offline');
      }
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API Service Factory
const createAPI = (endpoint) => {
  return {
    getAll: () => api.get(`/${endpoint}`),
    getById: (id) => api.get(`/${endpoint}/${id}`),
    create: (data) => api.post(`/${endpoint}`, data),
    update: (id, data) => api.put(`/${endpoint}/${id}`, data),
    delete: (id) => api.delete(`/${endpoint}/${id}`),
    custom: (method, url, data) => api({
      method,
      url: `/${endpoint}${url}`,
      data
    })
  };
};

// Specific API endpoints
const resumeAPI = {
  ...createAPI('resumes'),
  optimizeResume: async (id, jobDescription) => {
    return api.post(`/resumes/${id}/optimize`, { jobDescription });
  },
  analyzeResume: async (id) => {
    return api.get(`/resumes/${id}/analyze`);
  },
  uploadResume: async (formData) => {
    return api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

const aiAPI = {
  analyzeJob: async (jobDescription) => {
    return api.post('/ai/analyze-job', { jobDescription });
  },
  generateResume: async (userInfo, jobDescription) => {
    return api.post('/ai/generate-resume', { userInfo, jobDescription });
  },
};

const jobAPI = {
  ...createAPI('jobs'),
  saveJob: async (jobData) => {
    return api.post('/jobs/save', jobData);
  },
  getSavedJobs: async () => {
    return api.get('/jobs/saved');
  },
};

const authAPI = {
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  getProfile: async () => {
    return api.get('/auth/profile');
  },
  updateProfile: async (userData) => {
    return api.put('/auth/profile', userData);
  },
  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  }
};

// Helper function to check API health
const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return {
      healthy: true,
      data: response.data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Helper function for offline detection
const isOnline = () => {
  return navigator.onLine;
};

// Export everything
export { 
  api, 
  resumeAPI, 
  aiAPI, 
  jobAPI, 
  authAPI,
  checkHealth,
  isOnline,
  createAPI 
};