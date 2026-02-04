import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Handle success response
    if (response.data?.message && !response.config._silent) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    // Handle error response
    const { response } = error;
    
    // Don't show toast for silent requests
    if (error.config?._silent) {
      return Promise.reject(error);
    }
    
    // Network error
    if (!response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }
    
    const { status, data } = response;
    let message = 'An error occurred';
    
    // Handle different status codes
    switch (status) {
      case 400:
        message = data?.message || 'Bad request';
        if (data?.errors) {
          // Show validation errors
          const errorMessages = Object.values(data.errors).flat();
          errorMessages.forEach(err => toast.error(err));
        } else {
          toast.error(message);
        }
        break;
      
      case 401:
        message = data?.message || 'Session expired';
        toast.error(message);
        clearAuthData();
        // Redirect to login after delay
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 1500);
        break;
      
      case 403:
        message = data?.message || 'Access denied';
        toast.error(message);
        break;
      
      case 404:
        message = data?.message || 'Resource not found';
        toast.error(message);
        break;
      
      case 409:
        message = data?.message || 'Conflict occurred';
        toast.error(message);
        break;
      
      case 422:
        message = data?.message || 'Validation failed';
        if (data?.errors) {
          Object.values(data.errors).forEach(err => toast.error(err));
        } else {
          toast.error(message);
        }
        break;
      
      case 429:
        message = data?.message || 'Too many requests';
        toast.error(message);
        break;
      
      case 500:
        message = data?.message || 'Server error';
        toast.error('Server error. Please try again later.');
        break;
      
      default:
        message = data?.message || 'An error occurred';
        toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// ========== TOKEN MANAGEMENT ==========

/**
 * Save token to localStorage
 * @param {string} token - JWT token
 */
export const saveToken = (token) => {
  if (!token) return;
  
  try {
    localStorage.setItem('token', token);
    localStorage.setItem('token_timestamp', Date.now().toString());
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

/**
 * Get token from localStorage
 * @returns {string|null} Token or null
 */
export const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Remove all auth data from localStorage
 */
export const clearAuthData = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('token_timestamp');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

/**
 * Check if token is expired
 * @returns {boolean} Whether token is expired
 */
export const isTokenExpired = () => {
  try {
    const timestamp = localStorage.getItem('token_timestamp');
    if (!timestamp) return true;
    
    const tokenAge = Date.now() - parseInt(timestamp, 10);
    // Consider token expired after 7 days (in milliseconds)
    return tokenAge > 7 * 24 * 60 * 60 * 1000;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Save user data to localStorage
 * @param {object} user - User object
 */
export const saveUser = (user) => {
  if (!user) return;
  
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

/**
 * Get user data from localStorage
 * @returns {object|null} User object or null
 */
export const getUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// ========== AUTHENTICATION API ==========

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @param {string} userData.name - User's name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @returns {Promise<object>} Response data
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    const { token, user } = response.data;
    
    // Save auth data
    saveToken(token);
    saveUser(user);
    
    return {
      success: true,
      data: response.data,
      user,
      token
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Registration failed',
      details: error.response?.data?.errors
    };
  }
};

/**
 * Login user
 * @param {object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<object>} Response data
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    const { token, user } = response.data;
    
    // Save auth data
    saveToken(token);
    saveUser(user);
    
    return {
      success: true,
      data: response.data,
      user,
      token
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed',
      details: error.response?.data?.errors
    };
  }
};

/**
 * Get current user profile
 * @param {boolean} silent - Whether to suppress toast notifications
 * @returns {Promise<object>} User profile data
 */
export const getProfile = async (silent = false) => {
  try {
    const config = silent ? { _silent: true } : {};
    const response = await api.get('/auth/profile', config);
    
    // Update user data
    saveUser(response.data.user);
    
    return {
      success: true,
      user: response.data.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch profile'
    };
  }
};

/**
 * Update user profile
 * @param {object} userData - Updated user data
 * @returns {Promise<object>} Response data
 */
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData);
    
    // Update user data
    saveUser(response.data.user);
    
    return {
      success: true,
      user: response.data.user,
      message: response.data.message || 'Profile updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update profile',
      details: error.response?.data?.errors
    };
  }
};

/**
 * Change password
 * @param {object} passwordData - Password change data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise<object>} Response data
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/auth/change-password', passwordData);
    
    return {
      success: true,
      message: response.data.message || 'Password changed successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to change password',
      details: error.response?.data?.errors
    };
  }
};

/**
 * Request password reset
 * @param {string} email - User's email
 * @returns {Promise<object>} Response data
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    
    return {
      success: true,
      message: response.data.message || 'Password reset email sent'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to send reset email'
    };
  }
};

/**
 * Reset password with token
 * @param {object} resetData - Password reset data
 * @param {string} resetData.token - Reset token
 * @param {string} resetData.password - New password
 * @returns {Promise<object>} Response data
 */
export const resetPassword = async (resetData) => {
  try {
    const response = await api.post('/auth/reset-password', resetData);
    
    return {
      success: true,
      message: response.data.message || 'Password reset successful'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to reset password'
    };
  }
};

/**
 * Verify email with token
 * @param {string} token - Verification token
 * @returns {Promise<object>} Response data
 */
export const verifyEmail = async (token) => {
  try {
    const response = await api.post('/auth/verify-email', { token });
    
    // Update user verification status
    const user = getUser();
    if (user) {
      user.isVerified = true;
      saveUser(user);
    }
    
    return {
      success: true,
      message: response.data.message || 'Email verified successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Email verification failed'
    };
  }
};

/**
 * Resend verification email
 * @param {string} email - User's email
 * @returns {Promise<object>} Response data
 */
export const resendVerification = async (email) => {
  try {
    const response = await api.post('/auth/resend-verification', { email });
    
    return {
      success: true,
      message: response.data.message || 'Verification email sent'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to send verification email'
    };
  }
};

/**
 * Logout user
 * @returns {Promise<object>} Response data
 */
export const logout = async () => {
  try {
    // Call logout API (optional)
    await api.post('/auth/logout', {}, { _silent: true });
  } catch (error) {
    // Continue with local logout even if API fails
    console.error('Logout API error:', error);
  } finally {
    // Clear local auth data
    clearAuthData();
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }
};

/**
 * Delete user account
 * @param {string} password - User's password for confirmation
 * @returns {Promise<object>} Response data
 */
export const deleteAccount = async (password) => {
  try {
    const response = await api.delete('/auth/account', {
      data: { password }
    });
    
    // Clear auth data
    clearAuthData();
    
    return {
      success: true,
      message: response.data.message || 'Account deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete account'
    };
  }
};

// ========== AUTH STATE CHECKERS ==========

/**
 * Check if user is authenticated
 * @returns {boolean} Whether user is authenticated
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  // Check if token is expired
  if (isTokenExpired()) {
    clearAuthData();
    return false;
  }
  
  return true;
};

/**
 * Check if user has specific role
 * @param {string|string[]} roles - Role or array of roles to check
 * @returns {boolean} Whether user has the role
 */
export const hasRole = (roles) => {
  const user = getUser();
  if (!user || !user.role) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  
  return user.role === roles;
};

/**
 * Check if user is verified
 * @returns {boolean} Whether user is verified
 */
export const isVerified = () => {
  const user = getUser();
  return user?.isVerified === true;
};

// ========== SESSION MANAGEMENT ==========

/**
 * Refresh auth token
 * @returns {Promise<object>} New token data
 */
export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh-token', {}, { _silent: true });
    
    const { token } = response.data;
    saveToken(token);
    
    return {
      success: true,
      token
    };
  } catch (error) {
    // If refresh fails, logout
    clearAuthData();
    return {
      success: false,
      error: 'Session expired'
    };
  }
};

/**
 * Initialize auth session
 * Checks token validity and refreshes if needed
 * @returns {Promise<object>} Auth status
 */
export const initializeAuth = async () => {
  if (!isAuthenticated()) {
    return {
      isAuthenticated: false,
      user: null
    };
  }
  
  try {
    // Get fresh user data
    const profileResult = await getProfile(true);
    
    if (profileResult.success) {
      return {
        isAuthenticated: true,
        user: profileResult.user
      };
    } else {
      // Token might be invalid
      clearAuthData();
      return {
        isAuthenticated: false,
        user: null
      };
    }
  } catch (error) {
    clearAuthData();
    return {
      isAuthenticated: false,
      user: null
    };
  }
};

// ========== SOCIAL LOGIN ==========

/**
 * Initiate social login
 * @param {string} provider - Social provider (google, github, etc.)
 * @returns {string} Redirect URL
 */
export const socialLogin = (provider) => {
  return `${API_BASE_URL}/auth/${provider}`;
};

/**
 * Handle social login callback
 * @param {object} params - URL parameters
 * @returns {Promise<object>} Auth result
 */
export const handleSocialCallback = async (params) => {
  try {
    const response = await api.get('/auth/social/callback', { params });
    
    const { token, user } = response.data;
    
    // Save auth data
    saveToken(token);
    saveUser(user);
    
    return {
      success: true,
      user,
      token
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Social login failed'
    };
  }
};

// ========== PASSWORD STRENGTH CHECKER ==========

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {object} Strength analysis
 */
export const checkPasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      strength: 'Very Weak',
      message: 'Password is required',
      isValid: false
    };
  }
  
  let score = 0;
  const messages = [];
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length < 8) messages.push('At least 8 characters');
  
  // Complexity checks
  if (/[a-z]/.test(password)) score += 1; // Lowercase
  if (/[A-Z]/.test(password)) score += 1; // Uppercase
  if (/[0-9]/.test(password)) score += 1; // Numbers
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special characters
  
  // Determine strength
  let strength, color;
  if (score >= 5) {
    strength = 'Strong';
    color = 'text-green-600';
  } else if (score >= 3) {
    strength = 'Medium';
    color = 'text-yellow-600';
  } else {
    strength = 'Weak';
    color = 'text-red-600';
  }
  
  // Add missing requirements
  if (!/[a-z]/.test(password)) messages.push('Lowercase letter');
  if (!/[A-Z]/.test(password)) messages.push('Uppercase letter');
  if (!/[0-9]/.test(password)) messages.push('Number');
  if (!/[^A-Za-z0-9]/.test(password)) messages.push('Special character');
  
  return {
    score,
    strength,
    color,
    messages,
    isValid: score >= 5
  };
};

// ========== USER PREFERENCES ==========

/**
 * Save user preferences
 * @param {object} preferences - User preferences
 * @returns {Promise<object>} Result
 */
export const savePreferences = async (preferences) => {
  try {
    const response = await api.put('/auth/preferences', preferences);
    
    // Update user data
    const user = getUser();
    if (user) {
      user.preferences = response.data.preferences;
      saveUser(user);
    }
    
    return {
      success: true,
      preferences: response.data.preferences,
      message: response.data.message || 'Preferences saved'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to save preferences'
    };
  }
};

/**
 * Get user preferences
 * @returns {object} User preferences
 */
export const getPreferences = () => {
  const user = getUser();
  return user?.preferences || {};
};

// ========== EXPORT ALL FUNCTIONS ==========

export default {
  // Token Management
  saveToken,
  getToken,
  clearAuthData,
  isTokenExpired,
  saveUser,
  getUser,
  
  // Authentication
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  logout,
  deleteAccount,
  
  // Auth State
  isAuthenticated,
  hasRole,
  isVerified,
  
  // Session Management
  refreshToken,
  initializeAuth,
  
  // Social Login
  socialLogin,
  handleSocialCallback,
  
  // Password Strength
  checkPasswordStrength,
  
  // User Preferences
  savePreferences,
  getPreferences,
  
  // Helper
  api // Export axios instance for other services
};