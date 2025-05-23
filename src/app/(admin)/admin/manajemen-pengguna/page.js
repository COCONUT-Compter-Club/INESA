'use client'

import DeleteIcon from '@mui/icons-material/Delete'
import PeopleIcon from '@mui/icons-material/People'
import {
  Alert,
  Box,
  Card, CardContent,
  CircularProgress,
  Fade,
  IconButton,
  Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: 'none',
  '& .MuiTableCell-head': {
    backgroundColor: '#f8f9fa',
    fontWeight: 600,
    color: '#1a237e'
  }
}))

export default function ManajemenPengguna() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('success')

  useEffect(() => {
    fetchUsers()
  }, [])

  const getCookie = (name) => {
    try {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
      return null
    } catch (err) {
      return null
    }
  }

  const fetchUsers = async () => {
    try {
      const token = getCookie('token')
      if (!token) {
        showAlertMessage('Token tidak ditemukan, silakan login kembali', 'error')
        return
      }

      setLoading(true)
      const res = await fetch('https://bontomanai.inesa.id/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const text = await res.text()

      let data
      try {
        data = JSON.parse(text)
      } catch (jsonError) {
        throw new Error(`Respons bukan JSON: ${text}`)
      }

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengambil data pengguna')
      }

      const userList = Array.isArray(data.data) ? data.data.map(user => ({
        id: user.Id,
        nikadmin: user.Nikadmin,
        email: user.Email,
        password: user.Password,
        namalengkap: user.NamaLengkap,
        role_id: user.RoleID
      })) : []
      setUsers(userList)
      if (userList.length === 0) {
        showAlertMessage('Tidak ada data pengguna di database', 'info')
      }
    } catch (err) {
      showAlertMessage(err.message || 'Gagal memuat data pengguna', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus pengguna dengan ID ${id}?`)) {
      return
    }

    try {
      const token = getCookie('token')
      if (!token) {
        showAlertMessage('Token tidak ditemukan, silakan login kembali', 'error')
        return
      }

      setLoading(true)
      const res = await fetch(`https://bontomanai.inesa.id/api/deleteusers/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const text = await res.text()

      let data
      try {
        data = JSON.parse(text)
      } catch (jsonError) {
        throw new Error(`Respons bukan JSON: ${text}`)
      }

      if (!res.ok) {
        throw new Error(data.message || 'Gagal menghapus pengguna')
      }

      showAlertMessage('Pengguna berhasil dihapus', 'success')
      fetchUsers()
    } catch (err) {
      showAlertMessage(err.message || 'Gagal menghapus pengguna', 'error')
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
          Manajemen Pengguna
        </Typography>
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
                  <TableCell>Peran</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <PeopleIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                      <Typography variant="body1" color="textSecondary">
                        Belum ada data pengguna
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.nikadmin}</TableCell>
                      <TableCell>{user.namalengkap}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.role_id === 'ROLE000' ? 'Admin' :
                         user.role_id === 'ROLE001' ? 'Bendahara' :
                         user.role_id === 'ROLE002' ? 'Sekretaris' : user.role_id}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Hapus">
                          <IconButton onClick={() => handleDelete(user.id)}>
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
    </Box>
  )
}