'use client'

import { useState, Suspense } from 'react' // Tambahkan Suspense
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Komponen utama untuk halaman reset password
function ResetPasswordContent() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validasi input
    if (!password) {
      setError('Password wajib diisi')
      return
    }
    if (!token) {
      setError('Token reset password tidak ditemukan.')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`http://192.168.1.85:8080/api/user/reset-password?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Password berhasil direset! Silahkan Login Kembali')
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setError(data.message || 'Gagal mereset password')
      }
    } catch (err) {
      setError('Terjadi kesalahan pada server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormContainer>
      <FormBox>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
          Ganti Password
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Password Baru"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            disabled={loading}
          />
          <SubmitButton type="submit" disabled={loading} fullWidth>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Simpan Password'}
          </SubmitButton>
        </form>
      </FormBox>
    </FormContainer>
  )
}

// Komponen utama dengan Suspense
export default function ResetPassword() {
  return (
    <Suspense fallback={<CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />}>
      <ResetPasswordContent />
    </Suspense>
  )
}

// Styled components (tidak berubah)
const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1a237e 0%, #ffffff 100%)',
  padding: '24px',
}))

const FormBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '32px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '400px',
}))

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1a237e',
  color: 'white',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  marginTop: '16px',
  '&:hover': {
    backgroundColor: '#0d47a1',
  },
}))