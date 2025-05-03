'use client'

import { useState, useEffect } from 'react'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box,
  Typography, Card, CardContent, IconButton, Tooltip, Alert, Fade,
  CircularProgress, MenuItem
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import PeopleIcon from '@mui/icons-material/People'
import { styled } from '@mui/material/styles'

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

export default function DataPenduduk() {
  const [rows, setRows] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nik: '',
    nama_lengkap: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    pendidikan: '',
    pekerjaan: '',
    pekerjaanLainnya: '', // State baru untuk pekerjaan manual
    agama: '',
    status_pernikahan: '',
    kewarganegaraan: ''
  })
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('success')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUserData()
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
      console.log(`[FETCH] Mengirim permintaan ke: ${url}`)
      const response = await fetch(url, { ...options, signal: controller.signal })
      console.log(`[FETCH] Status: ${response.status}, Content-Type: ${response.headers.get('Content-Type')}`)
      clearTimeout(id)
      return response
    } catch (error) {
      clearTimeout(id)
      console.error(`[FETCH] Error ke ${url}:`, error)
      throw error
    }
  }

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const token = getCookie('token')
      if (!token) {
        console.error('[FETCH] Token tidak ditemukan')
        showAlertMessage('Token tidak ditemukan, silakan login kembali', 'error')
        return
      }
      console.log('[FETCH] Mengambil data warga dengan token:', token)
      const res = await fetchWithTimeout('http://192.168.1.85:8080/api/warga', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }, 10000)

      console.log('[FETCH] Status:', res.status)
      const text = await res.text()
      console.log('[FETCH] Respons teks:', text)

      let data
      try {
        data = JSON.parse(text)
        console.log('[FETCH] Respons JSON:', data)
      } catch (jsonError) {
        console.error('[FETCH] Gagal parsing JSON:', jsonError)
        throw new Error(`Respons bukan JSON: ${text}`)
      }

      if (!res.ok) {
        console.error('[FETCH] Respons tidak OK:', res.status, data)
        throw new Error(data.message || `Gagal mengambil data penduduk: ${res.status}`)
      }

      const wargaData = Array.isArray(data.data) ? data.data :
                        Array.isArray(data.result) ? data.result :
                        Array.isArray(data) ? data : []

      const normalizedData = wargaData.map(item => ({
        id: item.id || item.ID || '',
        nik: item.nik || item.Nik || '-',
        nama_lengkap: item.nama_lengkap || item.NamaLengkap || '-',
        tempat_lahir: item.tempat_lahir || item.TempatLahir || '-',
        tanggal_lahir: item.tanggal_lahir || item.TanggalLahir || '-',
        jenis_kelamin: item.jenis_kelamin || item.JenisKelamin || '-',
        pendidikan: item.pendidikan || item.Pendidikan || '-',
        pekerjaan: item.pekerjaan || item.Pekerjaan || '-',
        agama: item.agama || item.Agama || '-',
        status_pernikahan: item.status_pernikahan || item.StatusPernikahan || '-',
        kewarganegaraan: item.kewarganegaraan || item.Kewarganegaraan || '-'
      }))

      console.log('[FETCH] Data ternormalisasi:', normalizedData)
      setRows(normalizedData)
      if (normalizedData.length === 0) {
        showAlertMessage('Tidak ada data penduduk di database', 'info')
      }
    } catch (err) {
      console.error('[FETCH] Error saat fetch data:', err)
      let errorMessage = err.message
      if (err.name === 'AbortError') {
        errorMessage = 'Permintaan timeout, silakan coba lagi'
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Gagal terhubung ke server, periksa backend atau koneksi'
      } else if (err.message.includes('500')) {
        errorMessage = `Kesalahan server: ${err.message}`
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
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAdd = () => {
    setEditingId(null)
    setFormData({
      nik: '',
      nama_lengkap: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      jenis_kelamin: '',
      pendidikan: '',
      pekerjaan: '',
      pekerjaanLainnya: '',
      agama: '',
      status_pernikahan: '',
      kewarganegaraan: ''
    })
    setShowModal(true)
  }

  const handleEdit = (row) => {
    console.log('[EDIT] Mengedit data:', row)
    setEditingId(row.id)
    const validPekerjaan = [
      'Belum Bekerja', 'Pelajar/Mahasiswa', 'Petani', 'Nelayan', 'PNS', 'TNI/Polri', 'Karyawan Swasta',
      'Wiraswasta', 'Buruh', 'Pensiunan', 'Ibu Rumah Tangga', 'Lainnya'
    ]
    const isPekerjaanLainnya = !validPekerjaan.includes(row.pekerjaan) && row.pekerjaan !== '-'
    setFormData({
      nik: row.nik || '',
      nama_lengkap: row.nama_lengkap || '',
      tempat_lahir: row.tempat_lahir || '',
      tanggal_lahir: row.tanggal_lahir || '',
      jenis_kelamin: row.jenis_kelamin || '',
      pendidikan: row.pendidikan || '',
      pekerjaan: isPekerjaanLainnya ? 'Lainnya' : row.pekerjaan || '',
      pekerjaanLainnya: isPekerjaanLainnya ? row.pekerjaan : '',
      agama: row.agama || '',
      status_pernikahan: row.status_pernikahan || '',
      kewarganegaraan: row.kewarganegaraan || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return
    try {
      setLoading(true)
      const token = getCookie('token')
      if (!token) {
        console.error('[DELETE] Token tidak ditemukan')
        showAlertMessage('Token tidak ditemukan, silakan login kembali', 'error')
        return
      }
      console.log('[DELETE] Menghapus data dengan ID:', id)
      const res = await fetchWithTimeout(`http://192.168.1.85:8080/api/warga/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }, 10000)

      const text = await res.text()
      console.log('[DELETE] Respons teks:', text)
      let data

      try {
        data = JSON.parse(text)
        console.log('[DELETE] Respons JSON:', data)
      } catch (jsonError) {
        console.error('[DELETE] Gagal parsing JSON:', jsonError)
        throw new Error(`Respons bukan JSON: ${text}`)
      }

      if (!res.ok) {
        console.error('[DELETE] Respons tidak OK:', res.status, data)
        throw new Error(data.message || 'Gagal menghapus data')
      }
      showAlertMessage(data.message || 'Data berhasil dihapus', 'success')
      fetchUserData()
    } catch (err) {
      console.error('[DELETE] Error:', err)
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
    const { nik, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, pendidikan, pekerjaan, pekerjaanLainnya, agama, status_pernikahan, kewarganegaraan } = formData

    if (!nik || !nama_lengkap || !tempat_lahir || !tanggal_lahir || !jenis_kelamin || !pendidikan || !pekerjaan || !agama || !status_pernikahan || !kewarganegaraan) {
      showAlertMessage('Semua field wajib diisi', 'error')
      return
    }

    if (!/^\d{16}$/.test(nik)) {
      showAlertMessage('NIK harus 16 digit angka', 'error')
      return
    }

    const validAgama = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']
    if (!validAgama.includes(agama)) {
      showAlertMessage('Pilih agama yang valid', 'error')
      return
    }

    const validStatus = ['Belum Menikah', 'Menikah', 'Cerai Mati', 'Cerai Hidup']
    if (!validStatus.includes(status_pernikahan)) {
      showAlertMessage('Pilih status pernikahan yang valid', 'error')
      return
    }

    const validPendidikan = ['Tidak Sekolah', 'SD', 'SMP', 'SMA', 'SMK', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3']
    if (!validPendidikan.includes(pendidikan)) {
      showAlertMessage('Pilih pendidikan yang valid', 'error')
      return
    }

    const validPekerjaan = [
      'Belum Bekerja', 'Pelajar/Mahasiswa', 'Petani', 'Nelayan', 'PNS', 'TNI/Polri', 'Karyawan Swasta',
      'Wiraswasta', 'Buruh', 'Pensiunan', 'Ibu Rumah Tangga', 'Lainnya'
    ]
    if (!validPekerjaan.includes(pekerjaan)) {
      showAlertMessage('Pilih pekerjaan yang valid', 'error')
      return
    }

    if (pekerjaan === 'Lainnya' && !pekerjaanLainnya) {
      showAlertMessage('Masukkan pekerjaan lainnya', 'error')
      return
    }

    const validKewarganegaraan = ['WNI', 'WNA']
    if (!validKewarganegaraan.includes(kewarganegaraan)) {
      showAlertMessage('Pilih kewarganegaraan yang valid', 'error')
      return
    }

    try {
      setLoading(true)
      const token = getCookie('token')
      if (!token) {
        console.error('[SAVE] Token tidak ditemukan')
        showAlertMessage('Token tidak ditemukan, silakan login kembali', 'error')
        return
      }
      const endpoint = editingId ? `http://192.168.1.85:8080/api/warga/${editingId}` : 'http://192.168.1.85:8080/api/warga'
      const method = editingId ? 'PUT' : 'POST'
      const dataToSend = {
        ...formData,
        pekerjaan: pekerjaan === 'Lainnya' ? pekerjaanLainnya : pekerjaan
      }
      delete dataToSend.pekerjaanLainnya // Hapus field tambahan dari data yang dikirim
      console.log('[SAVE] Mengirim data:', dataToSend, 'ke endpoint:', endpoint)
      const res = await fetchWithTimeout(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend),
        credentials: 'include'
      }, 10000)

      const text = await res.text()
      console.log('[SAVE] Respons teks:', text)
      let data

      try {
        data = JSON.parse(text)
        console.log('[SAVE] Respons JSON:', data)
      } catch (jsonError) {
        console.error('[SAVE] Gagal parsing JSON:', jsonError)
        throw new Error(`Respons bukan JSON: ${text}`)
      }

      if (!res.ok) {
        console.error('[SAVE] Respons tidak OK:', res.status, data)
        throw new Error(data.message || 'Gagal menyimpan data')
      }
      showAlertMessage(data.message || 'Data berhasil disimpan', 'success')
      setShowModal(false)
      setEditingId(null)
      setFormData({
        nik: '',
        nama_lengkap: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        pendidikan: '',
        pekerjaan: '',
        pekerjaanLainnya: '',
        agama: '',
        status_pernikahan: '',
        kewarganegaraan: ''
      })
      fetchUserData()
    } catch (err) {
      console.error('[SAVE] Error:', err)
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

  const calculateAge = (tanggal) => {
    if (!tanggal) return '-'
    const birth = new Date(tanggal)
    const now = new Date()
    let age = now.getFullYear() - birth.getFullYear()
    const m = now.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
    return age >= 0 ? age : '-'
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
          Data Penduduk
        </Typography>
        <AddButton variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Tambah Data Penduduk
        </AddButton>
      </HeaderBox>

      <StyledCard>
        <CardContent>
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>NIK</TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell>Tempat Lahir</TableCell>
                  <TableCell>Tanggal Lahir (Umur)</TableCell>
                  <TableCell>Jenis Kelamin</TableCell>
                  <TableCell>Pendidikan</TableCell>
                  <TableCell>Pekerjaan</TableCell>
                  <TableCell>Agama</TableCell>
                  <TableCell>Status Pernikahan</TableCell>
                  <TableCell>Kewarganegaraan</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      <PeopleIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                      <Typography variant="body1" color="textSecondary">
                        Belum ada data penduduk
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id || row.nik}>
                      <TableCell>{row.nik}</TableCell>
                      <TableCell>{row.nama_lengkap}</TableCell>
                      <TableCell>{row.tempat_lahir}</TableCell>
                      <TableCell>{row.tanggal_lahir} ({calculateAge(row.tanggal_lahir)})</TableCell>
                      <TableCell>{row.jenis_kelamin}</TableCell>
                      <TableCell>{row.pendidikan}</TableCell>
                      <TableCell>{row.pekerjaan}</TableCell>
                      <TableCell>{row.agama}</TableCell>
                      <TableCell>{row.status_pernikahan}</TableCell>
                      <TableCell>{row.kewarganegaraan}</TableCell>
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
        <DialogTitle>{editingId ? 'Edit Data Penduduk' : 'Tambah Data Penduduk'}</DialogTitle>
        <DialogContent>
          <TextField
            label="NIK"
            name="nik"
            value={formData.nik}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ maxLength: 16, pattern: '[0-9]*' }}
            disabled={loading}
            error={showAlert && !formData.nik}
            helperText={showAlert && !formData.nik ? 'NIK wajib diisi' : ''}
          />
          <TextField
            label="Nama Lengkap"
            name="nama_lengkap"
            value={formData.nama_lengkap}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            disabled={loading}
            error={showAlert && !formData.nama_lengkap}
            helperText={showAlert && !formData.nama_lengkap ? 'Nama wajib diisi' : ''}
          />
          <TextField
            label="Tempat Lahir"
            name="tempat_lahir"
            value={formData.tempat_lahir}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            disabled={loading}
            error={showAlert && !formData.tempat_lahir}
            helperText={showAlert && !formData.tempat_lahir ? 'Tempat lahir wajib diisi' : ''}
          />
          <TextField
            label="Tanggal Lahir"
            name="tanggal_lahir"
            type="date"
            value={formData.tanggal_lahir}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
            disabled={loading}
            error={showAlert && !formData.tanggal_lahir}
            helperText={showAlert && !formData.tanggal_lahir ? 'Tanggal lahir wajib diisi' : ''}
          />
          <TextField
            label="Jenis Kelamin"
            name="jenis_kelamin"
            select
            value={formData.jenis_kelamin}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            disabled={loading}
            error={showAlert && !formData.jenis_kelamin}
            helperText={showAlert && !formData.jenis_kelamin ? 'Jenis kelamin wajib diisi' : ''}
          >
            <MenuItem value="Laki-laki">Laki-laki</MenuItem>
            <MenuItem value="Perempuan">Perempuan</MenuItem>
          </TextField>
          <TextField
            label="Pendidikan"
            name="pendidikan"
            select
            value={formData.pendidikan}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            disabled={loading}
            error={showAlert && !formData.pendidikan}
            helperText={showAlert && !formData.pendidikan ? 'Pendidikan wajib diisi' : ''}
          >
            <MenuItem value="Tidak Sekolah">Tidak Sekolah</MenuItem>
            <MenuItem value="SD">SD</MenuItem>
            <MenuItem value="SMP">SMP</MenuItem>
            <MenuItem value="SMA">SMA</MenuItem>
            <MenuItem value="SMK">SMK</MenuItem>
            <MenuItem value="D1">D1</MenuItem>
            <MenuItem value="D2">D2</MenuItem>
            <MenuItem value="D3">D3</MenuItem>
            <MenuItem value="S1">S1</MenuItem>
            <MenuItem value="S2">S2</MenuItem>
            <MenuItem value="S3">S3</MenuItem>
          </TextField>
          <TextField
            label="Pekerjaan"
            name="pekerjaan"
            select
            value={formData.pekerjaan}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            disabled={loading}
            error={showAlert && !formData.pekerjaan}
            helperText={showAlert && !formData.pekerjaan ? 'Pekerjaan wajib diisi' : ''}
          >
            <MenuItem value="Belum Bekerja">Belum Bekerja</MenuItem>
            <MenuItem value="Pelajar/Mahasiswa">Pelajar/Mahasiswa</MenuItem>
            <MenuItem value="Petani">Petani</MenuItem>
            <MenuItem value="Nelayan">Nelayan</MenuItem>
            <MenuItem value="PNS">PNS</MenuItem>
            <MenuItem value="TNI/Polri">TNI/Polri</MenuItem>
            <MenuItem value="Karyawan Swasta">Karyawan Swasta</MenuItem>
            <MenuItem value="Wiraswasta">Wiraswasta</MenuItem>
            <MenuItem value="Buruh">Buruh</MenuItem>
            <MenuItem value="Pensiunan">Pensiunan</MenuItem>
            <MenuItem value="Ibu Rumah Tangga">Ibu Rumah Tangga</MenuItem>
            <MenuItem value="Lainnya">Lainnya</MenuItem>
          </TextField>
          {formData.pekerjaan === 'Lainnya' && (
            <TextField
              label="Pekerjaan Lainnya"
              name="pekerjaanLainnya"
              value={formData.pekerjaanLainnya}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              disabled={loading}
              error={showAlert && !formData.pekerjaanLainnya}
              helperText={showAlert && !formData.pekerjaanLainnya ? 'Pekerjaan lainnya wajib diisi' : ''}
            />
          )}
          <TextField
            label="Agama"
            name="agama"
            select
            value={formData.agama}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            disabled={loading}
            error={showAlert && !formData.agama}
            helperText={showAlert && !formData.agama ? 'Agama wajib diisi' : ''}
          >
            <MenuItem value="Islam">Islam</MenuItem>
            <MenuItem value="Kristen">Kristen</MenuItem>
            <MenuItem value="Katolik">Katolik</MenuItem>
            <MenuItem value="Hindu">Hindu</MenuItem>
            <MenuItem value="Buddha">Buddha</MenuItem>
            <MenuItem value="Konghucu">Konghucu</MenuItem>
          </TextField>
          <TextField
            label="Status Pernikahan"
            name="status_pernikahan"
            select
            value={formData.status_pernikahan}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            disabled={loading}
            error={showAlert && !formData.status_pernikahan}
            helperText={showAlert && !formData.status_pernikahan ? 'Status pernikahan wajib diisi' : ''}
          >
            <MenuItem value="Belum Menikah">Belum Menikah</MenuItem>
            <MenuItem value="Menikah">Menikah</MenuItem>
            <MenuItem value="Cerai Mati">Cerai Mati</MenuItem>
            <MenuItem value="Cerai Hidup">Cerai Hidup</MenuItem>
          </TextField>
          <TextField
            label="Kewarganegaraan"
            name="kewarganegaraan"
            select
            value={formData.kewarganegaraan}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            disabled={loading}
            error={showAlert && !formData.kewarganegaraan}
            helperText={showAlert && !formData.kewarganegaraan ? 'Kewarganegaraan wajib diisi' : ''}
          >
            <MenuItem value="WNI">WNI</MenuItem>
            <MenuItem value="WNA">WNA</MenuItem>
          </TextField>
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
    </Box>
  )
}