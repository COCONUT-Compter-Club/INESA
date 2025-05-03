import React from 'react';
import { Box, Container, Typography, Grid, Link, IconButton } from '@mui/material';
import { Email, Phone, LocationOn, Facebook, Instagram, AccessTime } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: 'rgba(2, 132, 199, 0.9)',
        background: 'linear-gradient(180deg, rgba(2, 132, 199, 0.9) 0%, rgba(1, 105, 158, 0.9) 100%)',
        color: 'white',
        pt: 4,
        pb: 2,
        mt: 4,
      }}
    >
      {/* Garis Pemisah Dekoratif */}
      <Box sx={{ borderTop: '3px solid rgba(255, 255, 255, 0.3)', mb: 3 }} />

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Bagian Kiri: Logo dan Info Desa */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img
                  src="/image.png"
                  alt="Desa Bontomanai Logo"
                  style={{ width: 40, height: 40, marginRight: 8 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Desa Bontomanai
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ mr: 1, fontSize: '1.2rem' }} />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                Jl. Pendidikan, Desa Bontomanai, Kec. Rumbia, Kab. Jeneponto, Sulawesi Selatan
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ mr: 1, fontSize: '1.2rem' }} />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  +62 812-3456-7890
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1, fontSize: '1.2rem' }} />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  desabontomanai@example.com
                </Typography>
              </Box>
            </motion.div>
          </Grid>

          {/* Bagian Tengah: Tautan Cepat dan Layanan */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Tautan Cepat
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['Home', 'About', 'Gallery', 'Contact'].map((page) => (
                  <Link
                    key={page}
                    href={`#${page.toLowerCase()}`}
                    sx={{
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: '#38bdf8',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {page}
                  </Link>
                ))}
                <Link
                  href="https://www.kabupatenexample.go.id"
                  target="_blank"
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: '#38bdf8',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Situs Resmi Kabupaten
                </Link>
              </Box>
            </motion.div>
          </Grid>

          {/* Bagian Kanan: Info Tambahan */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Informasi
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTime sx={{ mr: 1, fontSize: '1.2rem' }} />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  Jam Operasional: Senin-Jumat, 08:00-16:00
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', mb: 1 }}>
                Layanan: KTP, Akta Kelahiran, Surat Keterangan
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  href="https://facebook.com"
                  target="_blank"
                  sx={{
                    color: 'white',
                    '&:hover': { color: '#38bdf8', transform: 'scale(1.1)' },
                    transition: 'transform 0.3s ease, color 0.3s ease',
                  }}
                >
                  <Facebook sx={{ fontSize: '1.2rem' }} />
                </IconButton>
                <IconButton
                  href="https://instagram.com"
                  target="_blank"
                  sx={{
                    color: 'white',
                    '&:hover': { color: '#38bdf8', transform: 'scale(1.1)' },
                    transition: 'transform 0.3s ease, color 0.3s ease',
                  }}
                >
                  <Instagram sx={{ fontSize: '1.2rem' }} />
                </IconButton>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Bagian Bawah: Copyright */}
        <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', mt: 3, pt: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
            © 2025 COCONUT. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;