// src/config/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.1.85:8080';
const SEKRETARIS_API_BASE_URL = process.env.NEXT_PUBLIC_SEKRETARIS_API_BASE_URL || 'http://192.168.1.85:8088/api';
const PRODUCTION_API_BASE_URL = process.env.NEXT_PUBLIC_PRODUCTION_API_BASE_URL || 'http://192.168.1.85:8087';

export const API_ENDPOINTS = {
  // Endpoint umum (autentikasi)
  LOGIN: `${API_BASE_URL}/api/user/login`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/user/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/user/reset-password`,

  // Endpoint admin
  ADMIN: {
    PENDUDUK_GET_ALL: `${API_BASE_URL}/api/warga`,
    PENDUDUK_ADD: `${API_BASE_URL}/api/warga`,
    PENDUDUK_UPDATE: (id) => `${API_BASE_URL}/api/warga/${id}`,
    PENDUDUK_DELETE: (id) => `${API_BASE_URL}/api/warga/${id}`,
  },

  // Endpoint sekretaris
  SEKRETARIS: {
    SURAT_KELUAR_ADD: `${SEKRETARIS_API_BASE_URL}/suratkeluar`,
    SURAT_KELUAR_GET_ALL: `${SEKRETARIS_API_BASE_URL}/suratkeluar`,
    SURAT_KELUAR_GET_BY_ID: (id) => `${SEKRETARIS_API_BASE_URL}/suratkeluar/get/${id}`,
    SURAT_KELUAR_UPDATE: (id) => `${SEKRETARIS_API_BASE_URL}/suratkeluar/${id}`,
    SURAT_KELUAR_DELETE: (id) => `${SEKRETARIS_API_BASE_URL}/suratkeluar/delete/${id}`,
    SURAT_KELUAR_COUNT: `${SEKRETARIS_API_BASE_URL}/suratkeluar/count`,
    SURAT_MASUK_ADD: `${SEKRETARIS_API_BASE_URL}/suratmasuk`,
    SURAT_MASUK_GET_ALL: `${SEKRETARIS_API_BASE_URL}/suratmasuk`,
    SURAT_MASUK_GET_BY_ID: (id) => `${SEKRETARIS_API_BASE_URL}/suratmasuk/get/${id}`,
    SURAT_MASUK_UPDATE: (id) => `${SEKRETARIS_API_BASE_URL}/suratmasuk/update/${id}`,
    SURAT_MASUK_DELETE: (id) => `${SEKRETARIS_API_BASE_URL}/suratmasuk/delete/${id}`,
    SURAT_MASUK_COUNT: `${SEKRETARIS_API_BASE_URL}/suratmasuk/count`,
    PERMOHONAN_SURAT_ADD: `${SEKRETARIS_API_BASE_URL}/permohonansurat`,
    PERMOHONAN_SURAT_GET_ALL: `${SEKRETARIS_API_BASE_URL}/permohonansurat`,
    PERMOHONAN_SURAT_GET_BY_ID: (id) => `${SEKRETARIS_API_BASE_URL}/permohonansurat/${id}`,
    PERMOHONAN_SURAT_UPDATE: (id) => `${SEKRETARIS_API_BASE_URL}/permohonansurat/${id}`,
    PERMOHONAN_SURAT_UPDATE_STATUS: (id) => `${SEKRETARIS_API_BASE_URL}/permohonansurat/patch/${id}`,
  },

  // Endpoint bendahara
  BENDAHARA: {
    PEMASUKAN_ADD: `${PRODUCTION_API_BASE_URL}/api/pemasukan/add`,
    PEMASUKAN_UPDATE: (id) => `${PRODUCTION_API_BASE_URL}/api/pemasukan/update/${id}`,
    PEMASUKAN_GET_ALL: `${PRODUCTION_API_BASE_URL}/api/pemasukan/getall`,
    PEMASUKAN_GET_BY_ID: (id) => `${PRODUCTION_API_BASE_URL}/api/pemasukan/get/${id}`,
    PEMASUKAN_DELETE: (id) => `${PRODUCTION_API_BASE_URL}/api/pemasukan/delete/${id}`,
    PENGELUARAN_ADD: `${PRODUCTION_API_BASE_URL}/api/pengeluaran/add`,
    PENGELUARAN_UPDATE: (id) => `${PRODUCTION_API_BASE_URL}/api/pengeluaran/update/${id}`,
    PENGELUARAN_GET_ALL: `${PRODUCTION_API_BASE_URL}/api/pengeluaran/getall`,
    PENGELUARAN_GET_BY_ID: (id) => `${PRODUCTION_API_BASE_URL}/api/pengeluaran/get/${id}`,
    PENGELUARAN_DELETE: (id) => `${PRODUCTION_API_BASE_URL}/api/pengeluaran/delete/${id}`,
    TRANSAKSI_GET_ALL: `${PRODUCTION_API_BASE_URL}/api/transaksi/getall`,
    TRANSAKSI_GET_LAST: `${PRODUCTION_API_BASE_URL}/api/transaksi/getlast`,
    LAPORAN_GET_ALL: `${PRODUCTION_API_BASE_URL}/api/laporan/getall`,
    LAPORAN_GET_SALDO: `${PRODUCTION_API_BASE_URL}/api/laporan/saldo`,
    LAPORAN_GET_PEMASUKAN: `${PRODUCTION_API_BASE_URL}/api/laporan/pemasukan`,
    LAPORAN_GET_PENGELUARAN: `${PRODUCTION_API_BASE_URL}/api/laporan/pengeluaran`,
    LAPORAN_DELETE: (id) => `${PRODUCTION_API_BASE_URL}/api/laporan/delete/${id}`,
    IURAN_ADD: `${PRODUCTION_API_BASE_URL}/api/iuran/add`,
    IURAN_UPDATE: `${PRODUCTION_API_BASE_URL}/api/iuran/update`,
    IURAN_GET_ALL: `${PRODUCTION_API_BASE_URL}/api/iuran/all`,
    IURAN_DELETE: (id) => `${PRODUCTION_API_BASE_URL}/api/iuran/delete/${id}`,
    SUMBANGAN_ADD: `${PRODUCTION_API_BASE_URL}/api/sumbangan/add`,
    SUMBANGAN_UPDATE: `${PRODUCTION_API_BASE_URL}/api/sumbangan/update`,
    SUMBANGAN_GET_ALL: `${PRODUCTION_API_BASE_URL}/api/sumbangan/all`,
    SUMBANGAN_IMAGE: (filename) => `${PRODUCTION_API_BASE_URL}/api/image/sumbangan/${filename}`,
    SUMBANGAN_DELETE: (id) => `${PRODUCTION_API_BASE_URL}/api/sumbangan/delete/${id}`,
    UPLOAD_URL: `${PRODUCTION_API_BASE_URL}/api/uploads/`,
  },
};

export const getHeaders = (token = '') => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': token ? `Bearer ${token}` : '',
  'ngrok-skip-browser-warning': 'true',
});