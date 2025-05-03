// src/services/sekretarisService.js
import { API_ENDPOINTS, getHeaders } from '@/config/api';

export const sekretarisService = {
  getSuratMasuk: async (token) => {
    const response = await fetch(API_ENDPOINTS.SEKRETARIS.SURAT_MASUK_GET_ALL, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await response.json();
  },
  addSuratMasuk: async (token, data) => {
    const response = await fetch(API_ENDPOINTS.SEKRETARIS.SURAT_MASUK_ADD, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  // Tambahkan fungsi lain untuk surat keluar, permohonan surat
};