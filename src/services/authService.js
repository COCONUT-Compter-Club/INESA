import axios from 'axios';
import { API_ENDPOINTS, getHeaders } from '@/config/api';

export const authService = {
  login: async (nik, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, { nik, password }, {
        headers: getHeaders(),
        withCredentials: true,
      });
      if (response.data.status === 'OK' && response.data.data) {
        return {
          success: true,
          data: {
            token: response.data.data.token,
            user: {
              name: response.data.data.user?.name || 'User',
              role: response.data.data.user?.role || 'admin',
            },
          },
        };
      }
      return {
        success: false,
        error: response.data.message || 'Login gagal',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal terhubung ke server',
      };
    }
  },
  validateToken: async (token) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.LOGIN.replace('/login', '/me')}`, {
        headers: getHeaders(token),
      });
      if (response.data.status === 'OK') {
        return {
          success: true,
          data: {
            user: response.data.data.user,
          },
        };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  },
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(API_ENDPOINTS.FORGOT_PASSWORD, { email }, {
        headers: getHeaders(),
      });
      if (response.data.status === 'OK') {
        return {
          success: true,
          message: response.data.message || 'Instruksi reset password telah dikirim.',
        };
      }
      return {
        success: false,
        error: response.data.message || 'Gagal mengirim permintaan reset password.',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal terhubung ke server.',
      };
    }
  },
};