import { getHeaders } from '@/config/api'
import Cookies from 'js-cookie'
import dayjs from 'dayjs'

export const laporanService = {
  getAllLaporan: async () => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        window.location.href = '/authentication/sign-in'
        throw new Error('Token tidak ditemukan')
      }
      const response = await fetch(`/api/bendahara/laporan/getall`, {
        method: 'GET',
        headers: {
          ...getHeaders(token),
          'ngrok-skip-browser-warning': 'true'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Gagal mengambil data laporan')
      }
      const { data } = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      throw new Error(error.message || 'Terjadi kesalahan saat mengambil data laporan')
    }
  },

  getSaldo: async () => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        window.location.href = '/authentication/sign-in'
        throw new Error('Token tidak ditemukan')
      }
      const response = await fetch(`/api/bendahara/laporan/saldo`, {
        method: 'GET',
        headers: {
          ...getHeaders(token),
          'ngrok-skip-browser-warning': 'true'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Gagal mengambil saldo')
      }
      const result = await response.json()
      const saldo = result.data ?? result.saldo ?? result.total ?? 0
      return Number.isFinite(Number(saldo)) ? Number(saldo) : 0
    } catch (error) {
      throw new Error(error.message || 'Terjadi kesalahan saat mengambil saldo')
    }
  },

  getTotalPengeluaran: async () => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        window.location.href = '/authentication/sign-in'
        throw new Error('Token tidak ditemukan')
      }
      const response = await fetch(`/api/bendahara/laporan/pengeluaran`, {
        method: 'GET',
        headers: {
          ...getHeaders(token),
          'ngrok-skip-browser-warning': 'true'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Gagal mengambil total pengeluaran')
      }
      const { total } = await response.json()
      return Number.isFinite(Number(total)) ? Number(total) : 0
    } catch (error) {
      throw new Error(error.message || 'Terjadi kesalahan saat mengambil total pengeluaran')
    }
  },

  getTotalPemasukan: async () => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        window.location.href = '/authentication/sign-in'
        throw new Error('Token tidak ditemukan')
      }
      const response = await fetch(`/api/bendahara/laporan/pemasukan`, {
        method: 'GET',
        headers: {
          ...getHeaders(token),
          'ngrok-skip-browser-warning': 'true'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Gagal mengambil total pemasukan')
      }
      const { total } = await response.json()
      return Number.isFinite(Number(total)) ? Number(total) : 0
    } catch (error) {
      throw new Error(error.message || 'Terjadi kesalahan saat mengambil total pemasukan')
    }
  },

  getLaporanByDateRange: async (startDate, endDate) => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        window.location.href = '/authentication/sign-in'
        throw new Error('Token tidak ditemukan')
      }
      if (!dayjs(startDate, 'YYYY-MM-DD', true).isValid() || !dayjs(endDate, 'YYYY-MM-DD', true).isValid()) {
        throw new Error('Format tanggal tidak valid (harus: YYYY-MM-DD)')
      }
      if (dayjs(startDate).isAfter(dayjs(endDate))) {
        throw new Error('Tanggal mulai harus sebelum tanggal akhir')
      }
      const response = await fetch(
        `/api/bendahara/laporan?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
        {
          method: 'GET',
          headers: {
            ...getHeaders(token),
            'ngrok-skip-browser-warning': 'true'
          },
          credentials: 'include'
        }
      )
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Gagal mengambil laporan berdasarkan rentang tanggal')
      }
      const { data } = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      throw new Error(error.message || 'Terjadi kesalahan saat mengambil laporan')
    }
  }
}