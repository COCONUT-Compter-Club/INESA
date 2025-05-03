import React, { useRef } from 'react';
import { Box, Typography, Card, Avatar, Container, IconButton } from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { motion } from 'framer-motion';

const strukturDesa = {
  periode: "2021-2026",
  kepengurusan: [
    {
      jabatan: "KEPALA DESA",
      nama: "NURLENI",
      foto: "/pengurus/kades.png",
    },
    {
      jabatan: "SEKRETARIS",
      nama: "NOVIANTI",
      foto: "/pengurus/sekretaris.jpg",
    },
    {
      jabatan: "BENDAHARA",
      nama: "PATTOLA DG BALI",
      foto: "/pengurus/bendahara.jpg",
    },
    {
      jabatan: "KASI PEMERINTAHAN",
      nama: "MUHAMMAD SAKIR",
      foto: "/pengurus/kasi.jpg",
    },
    {
      jabatan: "KASI PEMBANGUNAN",
      nama: "HADALIA DG. CAYA",
      foto: "/pengurus/kasi2.jpg",
    },
  ],
};

const StrukturDesaCard = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 300;
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 300;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'rgba(2, 132, 199, 0.9)', fontSize: { xs: '2rem', md: '3rem' } }}
        >
          Struktur Organisasi
        </Typography>
      </Box>

      {/* Daftar Pengurus dengan Navigasi Panah */}
      <Box sx={{ position: 'relative' }}>
        {/* Tombol Panah Kiri */}
        <IconButton
          onClick={scrollLeft}
          sx={{
            position: 'absolute',
            left: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(2, 132, 199, 0.9)',
            color: 'white',
            zIndex: 1,
            '&:hover': {
              bgcolor: 'rgba(2, 132, 199, 1)',
              transform: 'translateY(-50%) scale(1.1)',
            },
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          <ArrowLeft />
        </IconButton>

        {/* Daftar Kartu */}
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 3,
            pb: 2,
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none', // Fixed: Changed from '-ms-overflow-style'
            scrollbarWidth: 'none',  // Fixed: Changed from 'scrollbar-width'
          }}
        >
          {strukturDesa.kepengurusan?.length > 0 ? (
            strukturDesa.kepengurusan.map((petugas, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    flex: '0 0 auto',
                    width: 260,
                    textAlign: 'center',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <Box sx={{ p: 4 }}>
                    <Avatar
                      alt={petugas.nama}
                      src={petugas.foto}
                      sx={{
                        width: 160,
                        height: 160,
                        mx: 'auto',
                        mb: 2,
                        border: '4px solid rgba(2, 132, 199, 0.9)',
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        color: '#333',
                        mb: 1,
                        textTransform: 'uppercase',
                        fontSize: '1.1rem',
                      }}
                    >
                      {petugas.nama}
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: 'rgba(2, 132, 199, 0.9)', p: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white',
                        textTransform: 'uppercase',
                        fontSize: '0.9rem',
                        fontWeight: 'medium',
                      }}
                    >
                      {petugas.jabatan}
                    </Typography>
                  </Box>
                </Card>
              </motion.div>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: 'white', textAlign: 'center', width: '100%' }}>
              Tidak ada data pengurus.
            </Typography>
          )}
        </Box>

        {/* Tombol Panah Kanan */}
        <IconButton
          onClick={scrollRight}
          sx={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(2, 132, 199, 0.9)',
            color: 'white',
            zIndex: 1,
            '&:hover': {
              bgcolor: 'rgba(2, 132, 199, 1)',
              transform: 'translateY(-50%) scale(1.1)',
            },
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          <ArrowRight />
        </IconButton>
      </Box>
    </Container>
  );
};

export default StrukturDesaCard;