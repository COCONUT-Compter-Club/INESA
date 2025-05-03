'use client';

import { useRouter } from 'next/navigation';
import { Button, Container, Typography, Box } from '@mui/material';

export default function Unauthorized() {
  const router = useRouter();
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Akses Ditolak
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => router.push('/')}
          sx={{ backgroundColor: '#1a237e', '&:hover': { backgroundColor: '#0d47a1' } }}
        >
          Kembali ke Halaman Utama
        </Button>
      </Box>
    </Container>
  );
}