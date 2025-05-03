'use client'

import { useState, useEffect } from 'react'
import {
  Box, Typography, Grid, Card, CardContent, CircularProgress, Fade, Chip, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import PeopleIcon from '@mui/icons-material/People'
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import MailIcon from '@mui/icons-material/Mail'
import SendIcon from '@mui/icons-material/Send'
import AssignmentIcon from '@mui/icons-material/Assignment'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import { API_ENDPOINTS, getHeaders } from '@/config/api'
import { laporanService } from '@/services/laporanService'

// Styled Components
const DashboardCard = styled(Card)(({ theme }) => ({
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  },
}))

const StatCard = styled(DashboardCard)({
  padding: '16px',
})

const HeaderBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#1a237e',
  padding: '16px',
  color: 'white',
  borderRadius: '12px',
  marginBottom: '24px',
}))

const StatIcon = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '8px',
}))

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1a237e',
  color: 'white',
  borderRadius: '8px',
  padding: '6px 12px',
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#0d47a1',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
}))

const TextNoCursor = styled(Typography)({
  cursor: 'default',
})

const fetchWithTimeout = async (url, options, timeout = 15000) => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    console.log(`[FETCH] Mengirim permintaan ke: ${url}`)
    const response = await fetch(url, { ...options, signal: controller.signal })
    if (!response.ok) {
      const text = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${text}`)
    }
    console.log(`[FETCH] Status: ${response.status}, Content-Type: ${response.headers.get('Content-Type')}`)
    clearTimeout(id)
    return response.json()
  } catch (error) {
    clearTimeout(id)
    console.error(`[FETCH] Error ke ${url}:`, error.message)
    throw error
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPenduduk: 0,
    lakiLaki: 0,
    perempuan: 0,
    totalPemasukan: 0,
    totalPengeluaran: 0,
    suratMasuk: 0,
    suratKeluar: 0,
    permohonanSurat: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogContent, setDialogContent] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async (retryCount = 3) => {
    try {
      setLoading(true)
      setError(null)
      const token = Cookies.get('token')
      if (!token) {
        setError('Token tidak ditemukan, silakan login kembali')
        return
      }

      const headers = getHeaders(token)

      // Fetch data penduduk (langsung ke endpoint yang benar)
      let pendudukData = { total: 0, laki: 0, perempuan: 0 }
      try {
        pendudukData = await fetchWithTimeout('http://192.168.1.85:8080/api/dashboard/stats', {
          headers,
          credentials: 'include',
        })
      } catch (error) {
        console.error('Error fetching penduduk:', error)
      }

      // Fetch data keuangan menggunakan laporanService seperti Dashboard Bendahara
      let pemasukanData = { total: 0 }
      let pengeluaranData = { total: 0 }
      try {
        const laporanData = await laporanService.getAllLaporan()
        if (laporanData && laporanData.length > 0) {
          // Hitung total pemasukan dan pengeluaran seperti di Dashboard Bendahara
          const pemasukan = laporanData.reduce((sum, item) => sum + (item.pemasukan || 0), 0)
          const pengeluaran = laporanData.reduce((sum, item) => sum + (item.pengeluaran || 0), 0)

          pemasukanData = { total: pemasukan }
          pengeluaranData = { total: pengeluaran }
        } else {
          console.warn('Data laporan keuangan tidak tersedia')
        }
      } catch (error) {
        console.error('Error fetching laporan keuangan:', error)
      }

      // Fetch data surat masuk menggunakan API_ENDPOINTS seperti Dashboard Sekretaris
      let suratMasukData = []
      try {
        suratMasukData = await fetchWithTimeout(API_ENDPOINTS.SEKRETARIS.SURAT_MASUK_GET_ALL, {
          headers,
          credentials: 'include',
        })
      } catch (error) {
        console.error('Error fetching surat masuk:', error)
      }

      // Fetch data surat keluar menggunakan API_ENDPOINTS seperti Dashboard Sekretaris
      let suratKeluarData = []
      try {
        suratKeluarData = await fetchWithTimeout(API_ENDPOINTS.SEKRETARIS.SURAT_KELUAR_GET_ALL, {
          headers,
          credentials: 'include',
        })
      } catch (error) {
        console.error('Error fetching surat keluar:', error)
      }

      // Fetch data permohonan surat menggunakan API_ENDPOINTS seperti Dashboard Sekretaris
      let permohonanSuratData = []
      try {
        permohonanSuratData = await fetchWithTimeout(API_ENDPOINTS.SEKRETARIS.PERMOHONAN_SURAT_GET_ALL, {
          headers,
          credentials: 'include',
        })
      } catch (error) {
        console.error('Error fetching permohonan surat:', error)
      }

      setStats({
        totalPenduduk: pendudukData.total || 0,
        lakiLaki: pendudukData.laki || 0,
        perempuan: pendudukData.perempuan || 0,
        totalPemasukan: pemasukanData.total || 0,
        totalPengeluaran: pengeluaranData.total || 0,
        suratMasuk: suratMasukData.length || 0,
        suratKeluar: suratKeluarData.length || 0,
        permohonanSurat: permohonanSuratData.length || 0,
      })
    } catch (error) {
      console.error('[FETCH] Gagal mengambil data statistik:', error)
      if (retryCount > 0) {
        console.log(`[FETCH] Mencoba lagi, sisa percobaan: ${retryCount}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return fetchStats(retryCount - 1)
      }
      let errorMessage = error.message
      if (error.name === 'AbortError') {
        errorMessage = 'Permintaan timeout, silakan coba lagi'
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Gagal terhubung ke server, periksa backend atau koneksi'
      } else if (error.message.includes('401')) {
        errorMessage = 'Token tidak valid, silakan login kembali'
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const suratData = [
    { jenis: 'Surat Masuk', jumlah: stats.suratMasuk, path: '/surat/masuk' },
    { jenis: 'Surat Keluar', jumlah: stats.suratKeluar, path: '/surat/keluar' },
    { jenis: 'Permohonan Surat', jumlah: stats.permohonanSurat, path: '/surat/permohonan' },
  ]

  const handleViewDetails = (item) => {
    setDialogContent({
      jenis: item.jenis,
      jumlah: item.jumlah,
    })
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setDialogContent(null)
  }

  return (
    <Box sx={{ padding: '24px', bgcolor: '#f5f5f5', minHeight: 'calc(100vh - 48px)' }}>
      <Fade in={error !== null}>
        <Alert severity="error" sx={{ mb: 3, display: error ? 'flex' : 'none' }}>
          {error}
        </Alert>
      </Fade>

      <Fade in={!loading}>
        <Box>
          <HeaderBox>
            <Breadcrumbs sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              <Link underline="hover" color="inherit" href="/">
                Home
              </Link>
              <TextNoCursor color="inherit">Dashboard</TextNoCursor>
            </Breadcrumbs>
            <TextNoCursor variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Dashboard Admin
            </TextNoCursor>
            <TextNoCursor variant="subtitle2" sx={{ opacity: 0.8, mb: 2 }}>
              Sistem Informasi Desa Bontomanai Kec. Rumbia, Kab. Jeneponto
            </TextNoCursor>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ActionButton
                startIcon={<AccountBalanceWalletIcon />}
                onClick={() => router.push('/bendahara/dashboard')}
              >
                Dashboard Bendahara
              </ActionButton>
              <ActionButton
                startIcon={<AdminPanelSettingsIcon />}
                onClick={() => router.push('/sekretaris/dashboard')}
              >
                Dashboard Sekretaris
              </ActionButton>
            </Box>
          </HeaderBox>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <>
              <Box sx={{ bgcolor: 'white', borderRadius: '12px', p: 3, mb: 4, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)' }}>
                <TextNoCursor variant="h5" sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
                  Statistik Desa
                </TextNoCursor>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <StatCard>
                      <CardContent sx={{ textAlign: 'center', p: 0 }}>
                        <StatIcon>
                          <PeopleIcon sx={{ fontSize: 24, color: '#1a237e' }} />
                        </StatIcon>
                        <TextNoCursor variant="body2" color="textSecondary">
                          Total Penduduk
                        </TextNoCursor>
                        <TextNoCursor variant="h5" sx={{ fontWeight: 700, color: '#1a237e' }}>
                          {stats.totalPenduduk}
                        </TextNoCursor>
                      </CardContent>
                    </StatCard>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <StatCard>
                      <CardContent sx={{ textAlign: 'center', p: 0 }}>
                        <StatIcon>
                          <MaleIcon sx={{ fontSize: 24, color: '#1976d2' }} />
                        </StatIcon>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                          <TextNoCursor variant="body2" color="textSecondary">
                            Laki-laki
                          </TextNoCursor>
                          <Chip
                            label={`${((stats.lakiLaki / stats.totalPenduduk) * 100 || 0).toFixed(1)}%`}
                            color="primary"
                            size="small"
                          />
                        </Box>
                        <TextNoCursor variant="h5" sx={{ fontWeight: 700, color: '#1976d2', mt: 1 }}>
                          {stats.lakiLaki}
                        </TextNoCursor>
                      </CardContent>
                    </StatCard>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <StatCard>
                      <CardContent sx={{ textAlign: 'center', p: 0 }}>
                        <StatIcon>
                          <FemaleIcon sx={{ fontSize: 24, color: '#f06292' }} />
                        </StatIcon>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                          <TextNoCursor variant="body2" color="textSecondary">
                            Perempuan
                          </TextNoCursor>
                          <Chip
                            label={`${((stats.perempuan / stats.totalPenduduk) * 100 || 0).toFixed(1)}%`}
                            size="small"
                            sx={{ bgcolor: '#f06292', color: 'white' }}
                          />
                        </Box>
                        <TextNoCursor variant="h5" sx={{ fontWeight: 700, color: '#f06292', mt: 1 }}>
                          {stats.perempuan}
                        </TextNoCursor>
                      </CardContent>
                    </StatCard>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3 }}>
                  <TextNoCursor variant="body1" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
                    Detail Keuangan
                  </TextNoCursor>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <StatCard>
                        <CardContent sx={{ textAlign: 'center', p: 0 }}>
                          <TextNoCursor variant="body2" color="textSecondary">
                            Total Pemasukan
                          </TextNoCursor>
                          <TextNoCursor variant="h5" sx={{ fontWeight: 700, color: '#22c55e' }}>
                            {formatRupiah(stats.totalPemasukan)}
                          </TextNoCursor>
                        </CardContent>
                      </StatCard>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StatCard>
                        <CardContent sx={{ textAlign: 'center', p: 0 }}>
                          <TextNoCursor variant="body2" color="textSecondary">
                            Total Pengeluaran
                          </TextNoCursor>
                          <TextNoCursor variant="h5" sx={{ fontWeight: 700, color: '#ef4444' }}>
                            {formatRupiah(stats.totalPengeluaran)}
                          </TextNoCursor>
                        </CardContent>
                      </StatCard>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Box sx={{ bgcolor: 'white', borderRadius: '12px', p: 3, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)' }}>
                <TextNoCursor variant="h5" sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
                  Statistik Surat
                </TextNoCursor>
                <Grid container spacing={2}>
                  {suratData.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.jenis}>
                      <StatCard>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <StatIcon>
                              {item.jenis === 'Surat Masuk' ? (
                                <MailIcon sx={{ fontSize: 24, color: '#3b82f6' }} />
                              ) : item.jenis === 'Surat Keluar' ? (
                                <SendIcon sx={{ fontSize: 24, color: '#f59e0b' }} />
                              ) : (
                                <AssignmentIcon sx={{ fontSize: 24, color: '#10b981' }} />
                              )}
                            </StatIcon>
                            <Box>
                              <TextNoCursor variant="body1" color="textSecondary">
                                {item.jenis}
                              </TextNoCursor>
                              <TextNoCursor variant="h5" sx={{ fontWeight: 700, color: item.jenis === 'Surat Masuk' ? '#3b82f6' : item.jenis === 'Surat Keluar' ? '#f59e0b' : '#10b981' }}>
                                {item.jumlah}
                              </TextNoCursor>
                            </Box>
                          </Box>
                         
                        </CardContent>
                      </StatCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          )}
        </Box>
      </Fade>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Detail {dialogContent?.jenis}</DialogTitle>
        <DialogContent>
          {dialogContent && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography><strong>Jenis Surat:</strong> {dialogContent.jenis}</Typography>
              <Typography><strong>Jumlah:</strong> {dialogContent.jumlah}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}