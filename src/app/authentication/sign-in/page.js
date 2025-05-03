'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function SignIn() {
  const [formData, setFormData] = useState({ nikadmin: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/image.png');
  const [title, setTitle] = useState('');
  const [contentLoading, setContentLoading] = useState(true);
  const [openForgotDialog, setOpenForgotDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState(null);
  const [forgotError, setForgotError] = useState(null);
  const router = useRouter();

  // JWT Decode Function
  const decodeJWT = (token) => {
    try {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('http://192.168.1.85:8080/api/content', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          credentials: 'include',
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`Gagal mengambil data konten: ${res.status}`);
        }

        const result = await res.json();
        console.log('[FETCH] Respons JSON (konten):', result);
        const data = result.data ? result.data : result;

        if (data.logo) {
          setLogoUrl(`http://192.168.1.85:8080/${data.logo}`);
          localStorage.setItem('logo', data.logo);
        } else {
          setLogoUrl('/image.png');
          localStorage.removeItem('logo');
        }

        if (data.title) setTitle(data.title);
      } catch (err) {
        console.error('Gagal fetch konten:', err.message);
        const logoPath = localStorage.getItem('logo');
        if (logoPath) {
          const decodedLogoPath = decodeURIComponent(logoPath);
          setLogoUrl(`http://192.168.1.85:8080/${decodedLogoPath}`);
        }
      } finally {
        setContentLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { nikadmin, password } = formData;

    if (!nikadmin || nikadmin.length !== 8) {
      setError('NIK harus 8 digit.');
      setLoading(false);
      return;
    }

    if (!password) {
      setError('Password harus diisi.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://192.168.1.85:8080/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nikadmin, password }),
        credentials: 'include',
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        throw new Error('Respons bukan JSON: ' + text);
      }

      if (response.ok && data.code === 200 && data.data) {
        const token = data.data;
        document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Lax`;
        
        // Decode the JWT token
        const decoded = decodeJWT(token);
        if (!decoded) {
          throw new Error('Gagal decode token');
        }

        localStorage.setItem('userRole', decoded.role_id);
        localStorage.setItem('userName', decoded.namalengkap || '');
        localStorage.setItem('userEmail', decoded.email || '');

        switch(decoded.role_id) {
          case 'ROLE000': // Admin
            router.push('/admin/dashboard');
            break;
          case 'ROLE001': // Bendahara
            router.push('/bendahara/dashboard');
            break;
          case 'ROLE002': 
            router.push('/sekretaris/dashboard');
            break;
          default:
            router.push('/unauthorized');
        }
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (err) {
      setError('Gagal terhubung ke server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotLoading(true);
    setForgotError(null);
    setForgotMessage(null);

    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotError('Masukkan email yang valid.');
      setForgotLoading(false);
      return;
    }

    try {
      const response = await fetch('http://192.168.1.85:8080/api/user/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        throw new Error('Respons bukan JSON: ' + text);
      }

      if (response.ok && data.code === 200) {
        setForgotMessage(data.message || 'Instruksi reset password telah dikirim ke email Anda.');
        setForgotEmail('');
      } else {
        setForgotError(data.message || 'Gagal mengirim permintaan reset password.');
      }
    } catch (err) {
      setForgotError('Gagal terhubung ke server: ' + err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleOpenForgotDialog = () => {
    setOpenForgotDialog(true);
    setForgotEmail('');
    setForgotError(null);
    setForgotMessage(null);
  };

  const handleCloseForgotDialog = () => {
    setOpenForgotDialog(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            {contentLoading ? (
              <CircularProgress />
            ) : (
              <>
                <img
                  src={logoUrl}
                  alt="Logo"
                  width={80}
                  height={80}
                  style={{ 
                    marginBottom: '16px', 
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/image.png';
                  }}
                />
                <Typography component="h1" variant="h5" sx={{ fontWeight: 600, color: '#1a237e', textAlign: 'center' }}>
                  {title || 'Masuk'}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1, textAlign: 'center' }}>
                  Masukkan NIP dan kata sandi Anda
                </Typography>
              </>
            )}
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              name="nikadmin"
              label="NIP"
              type="text"
              id="nikadmin"
              value={formData.nikadmin}
              onChange={handleChange}
              disabled={loading || contentLoading}
              error={!!error}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Kata Sandi"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading || contentLoading}
              error={!!error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading || contentLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />
            <Typography
              variant="body2"
              color="primary"
              sx={{ textAlign: 'right', cursor: 'pointer', mb: 2 }}
              onClick={handleOpenForgotDialog}
            >
              Lupa Password?
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || contentLoading}
              sx={{ mt: 2, mb: 2, py: 1.5, backgroundColor: '#1a237e', '&:hover': { backgroundColor: '#0d47a1' } }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Dialog open={openForgotDialog} onClose={handleCloseForgotDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Lupa Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Masukkan alamat email Anda untuk menerima instruksi reset password.
          </Typography>
          {forgotMessage && <Alert severity="success" sx={{ mb: 2 }}>{forgotMessage}</Alert>}
          {forgotError && <Alert severity="error" sx={{ mb: 2 }}>{forgotError}</Alert>}
          <TextField
            margin="normal"
            required
            fullWidth
            name="email"
            label="Email"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value.trim())}
            disabled={forgotLoading}
            error={!!forgotError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotDialog} disabled={forgotLoading}>
            Batal
          </Button>
          <Button
            onClick={handleForgotPassword}
            disabled={forgotLoading || !forgotEmail}
            variant="contained"
            sx={{ backgroundColor: '#1a237e', '&:hover': { backgroundColor: '#0d47a1' } }}
          >
            {forgotLoading ? <CircularProgress size={24} color="inherit" /> : 'Kirim'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}