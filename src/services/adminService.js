// src/services/adminService.js
import { API_ENDPOINTS, getHeaders } from '@/config/api';

export const adminService = {
  getPenduduk: async (token) => {
    const response = await fetch(API_ENDPOINTS.ADMIN.PENDUDUK_GET_ALL, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await response.json();
  },
  addPenduduk: async (token, data) => {
    const response = await fetch(API_ENDPOINTS.ADMIN.PENDUDUK_ADD, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  // Tambahkan fungsi lain untuk update, delete penduduk
};