// src/services/bendaharaService.js
import { API_ENDPOINTS, getHeaders } from '@/config/api';

export const bendaharaService = {
  getPemasukan: async (token) => {
    const response = await fetch(API_ENDPOINTS.BENDAHARA.PEMASUKAN_GET_ALL, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await response.json();
  },
  addPemasukan: async (token, data) => {
    const response = await fetch(API_ENDPOINTS.BENDAHARA.PEMASUKAN_ADD, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  // Tambahkan fungsi lain untuk pengeluaran, laporan, iuran, sumbangan
};