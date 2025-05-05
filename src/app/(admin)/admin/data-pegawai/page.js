'use client'

import AddIcon from '@mui/icons-material/Add'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PeopleIcon from '@mui/icons-material/People'
import {
  Alert,
  Box,
  Button,
  Card, CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  overflow: 'hidden'
}))

const HeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  padding: '24px',
  color: 'white',
  borderRadius: '16px',
  marginBottom: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)'
}))

const AddButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: '#1a237e',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)'
  }
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: 'none',
  '& .MuiTableCell-head': {
    backgroundColor: '#f8f9fa',
    fontWeight: 600,
    color: '#1a237e'
  }
}))

export default function DataPegawai() {
  const [rows, setRows] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [adminId, setAdminId] = useState(null)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminRole, setAdminRole] = useState('')
  const [formData, setFormData] = useState({
    nip: '',
    namalengkap: '',
    email: '',
    jabatan: '',
    foto: null
  })
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('success')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPegawaiData()
  }, [])

  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  const fetchWithTimeout = async (url, options, timeout = 10000) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
      const response = await fetch(url, { ...options, signal: controller.signal })
      clearTimeout(id)
      return response
    } catch (error) {
      clearTimeout(id)
      throw error
    }
  }

  const fetchPegawaiData = async (retryCount = 3) => {
    try {
      setLoading(true)
      const token = getCookie('token')

      const headers = token
        ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        : {
            'Content-Type': 'application/json'
          }

      const res = await fetchWithTimeout('https://bontomanai.inesa.id/api/pegawai/getall', {
        method: 'GET',
        headers,
        credentials: 'include'
      }, 10000)

      const text = await res.text()

      let data
      try {
        data = JSON.parse(text)
      } catch (jsonError) {
        throw new Error(`Respons bukan JSON: ${text}`)
      }

      if (!res.ok) {
        throw new Error(data.message || `Gagal mengambil data pegawai: ${res.status}`)
      }

      const pegawaiData = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.result)
        ? data.result
        : Array.isArray(data)
        ? data
        : []

      const normalizedData = pegawaiData.map(item => ({
        id: item.id || item.ID || '',
        nip: item.nip || item.NIP || '-',
        namalengkap: item.namalengkap || item.nama_lengkap || item.NamaLengkap || '-',
        email: item.email || item.Email || '-',
        jabatan: item.jabatan || item.Jabatan || '-',
        foto: item.foto || item.Foto || '-'
      }))

      setRows(normalizedData)
      if (normalizedData.length === 0) {
        showAlertMessage('Tidak ada data pegawai di database', 'info')
      }
    } catch (err) {
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return fetchPegawaiData(retryCount - 1)
      }
      let errorMessage = err.message
      if (err.name === 'AbortError') {
        errorMessage = 'Permintaan timeout, silakan coba lagi'
      } else if (err.message.includes('Failed to fetch') || err.message.includes('net::ERR_FAILED')) {
        errorMessage = 'Gagal terhubung ke server, periksa backend atau koneksi'
      } else if (err.message.includes('401')) {
        errorMessage = 'Token tidak valid, silakan login kembali'
      } else if (err.message.includes('Respons bukan JSON')) {
        errorMessage = `Server mengembalikan respons tidak valid: ${err.message}`
      }
      showAlertMessage(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'foto') {
      setFormData(prev => ({ ...prev, foto: files[0] || null }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAdd = () => {
    setEditingId(null)
    setFormData({
      nip: '',
      namalengkap: '',
      email: '',
      jabatan: '',
      foto: null
    })
    setShowModal(true)
  }

  const handleEdit = async (row) => {
    try {
      setLoading(true)
      const token = getCookie('token')
      const res = await fetchWithTimeout(`https://bontomanai.inesa.id/api/pegawai/getpegawaibyid/${row.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }, 10000)

      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
  
      } catch (jsonError) {
       
        throw new Error(`Respons bukan JSON: ${text}`)
      }

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengambil data pegawai')
      }

      const pegawai = data.data || data
      setEditingId(row.id)
      setFormData({
        nip: pegawai.nip || '',
        namalengkap: pegawai.namalengkap || pegawai.nama_lengkap || '',
        email: pegawai.email || '',
        jabatan: pegawai.jabatan || '',
        foto: null
      })
      setShowModal(true)
    } catch (err) {
      showAlertMessage(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return
    try {
      setLoading(true)
      const token = getCookie('token')
      if (!token) {
       
        showAlertMessage('Token tidak ditemukan, silakan login kembali', 'error')
        return
      }
      
      const res = await fetchWithTimeout(`https://bontomanai.inesa.id/api/pegawai/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }, 10000)

      const text = await res.text()
      let data

      try {
        data = JSON.parse(text)
      
      } catch (jsonError) {
        throw new Error(`Respons bukan JSON: ${text}`)
      }

      if (!res.ok) {
        throw new Error(data.message || 'Gagal menghapus data')
      }
      showAlertMessage(data.message || 'Data berhasil dihapus', 'success')
      fetchPegawaiData()
    } catch (err) {
      let errorMessage = err.message
      if (err.name === 'AbortError') {
        errorMessage = 'Permintaan timeout, silakan coba lagi'
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Gagal terhubung ke server, periksa backend atau koneksi'
      } else if (err.message.includes('401')) {
        errorMessage = 'Token tidak valid, silakan login kembali'
      }
      showAlertMessage(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    const { nip, namalengkap, email, jabatan, foto } = formData

    if (!nip || !namalengkap || !jabatan) {
      showAlertMessage('NIP, Nama Lengkap, dan Jabatan wajib diisi', 'error')
      return
    }

    // Validasi NIP hanya untuk tambah data baru
    if (!editingId && !/^\d{8,}$/.test(nip)) {
      showAlertMessage('NIP harus minimal 8 digit angka', 'error')
      return
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showAlertMessage('Email tidak valid', 'error')
      return
    }

    try {
      setLoading(true)
      const token = getCookie('token')
      if (!token) {
        showAlertMessage('Token tidak ditemukan, silakan login kembali', 'error')
        return
      }

      const endpoint = editingId ? `https://bontomanai.inesa.id/api/pegawai/update/${editingId}` : 'https://bontomanai.inesa.id/api/pegawai/create'
      const method = editingId ? 'PUT' : 'POST'

      const formDataToSend = new FormData()
      formDataToSend.append('nip', nip)
      formDataToSend.append('namalengkap', namalengkap)
      formDataToSend.append('email', email)
      formDataToSend.append('jabatan', jabatan)
      if (foto) {
        formDataToSend.append('foto', foto)
      }

      for (let [key, value] of formDataToSend.entries()) {
      }

      const res = await fetchWithTimeout(endpoint, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend,
        credentials: 'include'
      }, 10000)

      const contentType = res.headers.get('content-type')

      const text = await res.text()

      let data
      if (contentType && contentType.includes('application/json')) {
        try {
          data = JSON.parse(text)

        } catch (jsonError) {
          throw new Error(`Respons bukan JSON yang valid: ${text}`)
        }
      } else {
        throw new Error(text || 'Gagal menyimpan data: Respons bukan JSON')
      }

      if (!res.ok) {
        throw new Error(data.message || `Gagal menyimpan data: ${res.status}`)
      }

      showAlertMessage(data.message || (editingId ? 'Data berhasil diperbarui' : 'Data berhasil disimpan'), 'success')
      setShowModal(false)
      setEditingId(null)
      setFormData({
        nip: '',
        namalengkap: '',
        email: '',
        jabatan: '',
        foto: null
      })
      fetchPegawaiData()
    } catch (err) {
      let errorMessage = err.message
      if (err.name === 'AbortError') {
        errorMessage = 'Permintaan timeout, silakan coba lagi'
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Gagal terhubung ke server, periksa backend atau koneksi'
      } else if (err.message.includes('401')) {
        errorMessage = 'Token tidak valid, silakan login kembali'
      }
      showAlertMessage(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdminModal = (id) => {
    setAdminId(id)
    setAdminPassword('')
    setAdminRole('')
    setShowAdminModal(true)
  }

  const handleMakeAdmin = async () => {
    if (!adminPassword) {
      showAlertMessage('Password wajib diisi', 'error')
      return
    }

    if (adminPassword.length < 8) {
      showAlertMessage('Password harus minimal 8 karakter', 'error')
      return
    }

    if (!adminRole) {
      showAlertMessage('Role wajib dipilih', 'error')
      return
    }

    try {
      setLoading(true)
      const token = getCookie('token')
      if (!token) {
  
        showAlertMessage('Token tidak ditemukan, silakan login kembali', 'error')
        return
      }

      const payload = {
        id: adminId,
        pass: adminPassword,
        role_id: adminRole
      }
      const res = await fetchWithTimeout('https://bontomanai.inesa.id/api/admin/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      }, 10000)

      const contentType = res.headers.get('content-type')

      const text = await res.text()

      let data
      if (contentType && contentType.includes('application/json')) {
        try {
          data = JSON.parse(text)
        } catch (jsonError) {
          throw new Error(`Respons bukan JSON yang valid: ${text}`)
        }
      } else {
        throw new Error(text || 'Gagal membuat admin: Respons bukan JSON')
      }

      if (!res.ok) {
        throw new Error(data.message || `Gagal membuat admin: ${res.status}`)
      }

      showAlertMessage(data.message || 'Admin berhasil dibuat', 'success')
      setShowAdminModal(false)
      setAdminId(null)
      setAdminPassword('')
      setAdminRole('')
      fetchPegawaiData()
    } catch (err) {
      let errorMessage = err.message
      if (err.name === 'AbortError') {
        errorMessage = 'Permintaan timeout, silakan coba lagi'
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Gagal terhubung ke server, periksa backend atau koneksi'
      } else if (err.message.includes('401')) {
        errorMessage = 'Token tidak valid, silakan login kembali'
      }
      showAlertMessage(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const showAlertMessage = (message, type) => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  return (
    <Box sx={{ padding: '24px', mt: '-20px' }}>
      <Fade in={showAlert}>
        <Alert severity={alertType} sx={{ position: 'fixed', top: 24, right: 24, zIndex: 9999 }}>
          {alertMessage}
        </Alert>
      </Fade>

      <HeaderBox>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Data Pegawai
        </Typography>
        <AddButton variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Tambah Data Pegawai
        </AddButton>
      </HeaderBox>

      <StyledCard>
        <CardContent>
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>NIP</TableCell>
                  <TableCell>Nama Lengkap</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Jabatan</TableCell>
                  <TableCell>Foto</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <PeopleIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                      <Typography variant="body1" color="textSecondary">
                        Belum ada data pegawai
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id || row.nip}>
                      <TableCell>{row.nip}</TableCell>
                      <TableCell>{row.namalengkap}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.jabatan}</TableCell>
                      <TableCell>
                        <img
                          src="/foto1.jpeg"
                          alt={`Foto ${row.namalengkap}`}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                          onLoad={() => console.log(`[IMG] Gambar foto1.jpeg berhasil dimuat`)}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = '/default-avatar.png'
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEdit(row)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hapus">
                          <IconButton onClick={() => handleDelete(row.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Jadikan Admin">
                          <IconButton onClick={() => handleOpenAdminModal(row.id)}>
                            <AdminPanelSettingsIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </CardContent>
      </StyledCard>

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Data Pegawai' : 'Tambah Data Pegawai'}</DialogTitle>
        <DialogContent>
          <TextField
            label="NIP"
            name="nip"
            value={formData.nip}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ maxLength: 20, pattern: '[0-9]*' }}
            disabled={loading}
            error={showAlert && !formData.nip}
            helperText={showAlert && !formData.nip ? 'NIP wajib diisi' : ''}
          />
          <TextField
            label="Nama Lengkap"
            name="namalengkap"
            value={formData.namalengkap}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            disabled={loading}
            error={showAlert && !formData.namalengkap}
            helperText={showAlert && !formData.namalengkap ? 'Nama lengkap wajib diisi' : ''}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={loading}
            error={showAlert && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
            helperText={showAlert && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'Email tidak valid' : ''}
          />
          <TextField
            label="Jabatan"
            name="jabatan"
            value={formData.jabatan}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            disabled={loading}
            error={showAlert && !formData.jabatan}
            helperText={showAlert && !formData.jabatan ? 'Jabatan wajib diisi' : ''}
          />
          <TextField
            label="Foto (Opsional)"
            name="foto"
            type="file"
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={loading}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showAdminModal} onClose={() => setShowAdminModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Jadikan Admin</DialogTitle>
        <DialogContent>
          <TextField
            label="Password"
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            disabled={loading}
            error={showAlert && !adminPassword}
            helperText={showAlert && !adminPassword ? 'Password wajib diisi' : ''}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Role</InputLabel>
            <Select
              value={adminRole}
              onChange={(e) => setAdminRole(e.target.value)}
              label="Role"
              disabled={loading}
              error={showAlert && !adminRole}
            >
              <MenuItem value="">Pilih Role</MenuItem>
              <MenuItem value="ROLE000">Admin</MenuItem>
              <MenuItem value="ROLE001">Bendahara</MenuItem>
              <MenuItem value="ROLE002">Sekretaris</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAdminModal(false)} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleMakeAdmin} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}