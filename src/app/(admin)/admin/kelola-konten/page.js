'use client';

import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

const WebsiteContentPage = () => {
  const [formData, setFormData] = useState({
    logo: '',
    title: '',
    description: '',
    address: '',
    email: '',
    phone: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ambil token dari cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  // Fetch data on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getCookie('token');
        if (!token) {
          throw new Error('Token tidak ditemukan, silakan login kembali');
        }
        console.log('[FETCH] Mengambil konten dengan token:', token);
        const res = await axios.get('http://192.168.1.85:8080/api/content', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });

        console.log('[FETCH] Respons:', res.data);
        const result = res.data?.data ?? res.data;
        setFormData({
          logo: result.logo || '',
          title: result.title || '',
          description: result.description || '',
          address: result.address || '',
          email: result.email || '',
          phone: result.phone || ''
        });
      } catch (error) {
        console.error('[FETCH] Error:', error);
        let message = 'Gagal memuat konten';
        if (error.response) {
          message = error.response.data.message || `Error ${error.response.status}`;
        } else if (error.message.includes('timeout')) {
          message = 'Permintaan timeout, silakan coba lagi';
        } else if (error.message.includes('Token')) {
          message = error.message;
        }
        setAlert({ open: true, message, severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle logo file change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setAlert({ open: true, message: 'File harus berupa gambar', severity: 'error' });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setAlert({ open: true, message: 'Ukuran file maksimum 2MB', severity: 'error' });
        return;
      }
      setLogoFile(file);
      setImgError(false);
    }
  };

  // Submit content changes
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!formData.title || !formData.description || !formData.address || !formData.email || !formData.phone) {
      setAlert({ open: true, message: 'Semua field wajib diisi', severity: 'error' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setAlert({ open: true, message: 'Email tidak valid', severity: 'error' });
      return;
    }
    if (!/^\+?\d{10,13}$/.test(formData.phone)) {
      setAlert({ open: true, message: 'Nomor telepon tidak valid', severity: 'error' });
      return;
    }

    const formToSend = new FormData();
    formToSend.append('title', formData.title);
    formToSend.append('description', formData.description);
    formToSend.append('address', formData.address);
    formToSend.append('email', formData.email);
    formToSend.append('phone', formData.phone);

    if (logoFile) {
      formToSend.append('logo', logoFile);
    } else {
      formToSend.append('logo', formData.logo);
    }

    try {
      setLoading(true);
      const token = getCookie('token');
      if (!token) {
        throw new Error('Token tidak ditemukan, silakan login kembali');
      }
      console.log('[SUBMIT] Mengirim data ke /api/content');
      await axios.put('http://192.168.1.85:8080/api/content', formToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 10000
      });

      setAlert({ open: true, message: 'Konten berhasil diperbarui', severity: 'success' });
      setLogoFile(null);

      // Refresh data after save
      const res = await axios.get('http://192.168.1.85:8080/api/content', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      console.log('[FETCH] Respons setelah simpan:', res.data);
      const result = res.data?.data ?? res.data;
      setFormData({
        logo: result.logo || '',
        title: result.title || '',
        description: result.description || '',
        address: result.address || '',
        email: result.email || '',
        phone: result.phone || ''
      });
    } catch (error) {
      console.error('[SUBMIT] Error:', error);
      let message = 'Gagal menyimpan konten';
      if (error.response) {
        message = error.response.data.message || `Error ${error.response.status}`;
      } else if (error.message.includes('timeout')) {
        message = 'Permintaan timeout, silakan coba lagi';
      } else if (error.message.includes('Token')) {
        message = error.message;
      }
      setAlert({ open: true, message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 3 }}>
        {/* Logo Display */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          {formData.logo && !imgError ? (
            <img
              src={`http://192.168.1.85:8080/${formData.logo}`}
              alt="Logo Website"
              style={{ maxHeight: 100, objectFit: 'contain' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {imgError ? 'Gagal memuat logo.' : 'Pilih file logo untuk melihat pratinjau.'}
            </Typography>
          )}
        </Box>

        {/* Title */}
        <Typography variant="h5" gutterBottom align="center">
          Kelola Konten Website
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Logo (Upload File)
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              style={{ width: '100%' }}
              disabled={loading}
            />
          </Box>
          <TextField
            fullWidth
            label="Judul"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            disabled={loading}
            error={alert.open && !formData.title}
            helperText={alert.open && !formData.title ? 'Judul wajib diisi' : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'grey.500' },
                '&:hover fieldset': { borderColor: 'grey.700' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
          />
          <TextField
            fullWidth
            label="Deskripsi"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            variant="outlined"
            disabled={loading}
            error={alert.open && !formData.description}
            helperText={alert.open && !formData.description ? 'Deskripsi wajib diisi' : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'grey.500' },
                '&:hover fieldset': { borderColor: 'grey.700' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
          />
          <TextField
            fullWidth
            label="Alamat"
            name="address"
            value={formData.address}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            disabled={loading}
            error={alert.open && !formData.address}
            helperText={alert.open && !formData.address ? 'Alamat wajib diisi' : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'grey.500' },
                '&:hover fieldset': { borderColor: 'grey.700' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            disabled={loading}
            error={alert.open && !formData.email}
            helperText={alert.open && !formData.email ? 'Email wajib diisi' : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'grey.500' },
                '&:hover fieldset': { borderColor: 'grey.700' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
          />
          <TextField
            fullWidth
            label="No. HP"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            disabled={loading}
            error={alert.open && !formData.phone}
            helperText={alert.open && !formData.phone ? 'No. HP wajib diisi' : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'grey.500' },
                '&:hover fieldset': { borderColor: 'grey.700' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2, width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'SIMPAN'}
          </Button>
        </Box>

        <Snackbar
          open={alert.open}
          autoHideDuration={3000}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          <Alert severity={alert.severity}>{alert.message}</Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default WebsiteContentPage;