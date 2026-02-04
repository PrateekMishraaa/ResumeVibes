// src/utils/env.js
export const getEnv = (key, defaultValue = '') => {
  // 在 Vite 中
  if (import.meta.env[key]) {
    return import.meta.env[key];
  }
  // 在开发中也可以检查 process.env（如果需要）
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return defaultValue;
};

// 或者更简单的版本
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';