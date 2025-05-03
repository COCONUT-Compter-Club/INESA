'use client'

import React from 'react';
import { Box, Container, Grid, Typography, Card } from '@mui/material';
import { motion } from 'framer-motion';
import './styles.css';

const About = () => {
  return (
    <Box className="page-background"  sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Card sx={{ p: 3, bgcolor: 'background.card', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary', fontSize: '2.25rem' }}
          >
            Tentang Desa
          </Typography>
          <Grid container spacing={3} alignItems="flex-start">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                <Box
                  sx={{
                    backgroundImage: 'url(/desa1.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '12px',
                    height: '400px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
               <Box sx={{ px: 2, mt: 2 }}>
  <Typography variant="h5" align="left" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold', fontSize: '1.25rem' }}>
    Tentang Desa Bontomanai
  </Typography>
  <Typography variant="body2" align="left" paragraph sx={{ color: 'text.primary', fontSize: '0.85rem', lineHeight: 1.6 }}>
    Desa Bontomanai masih mempertahankan berbagai tradisi lokal, seperti pesta panen dan kegiatan keagamaan yang diadakan secara rutin. Kegiatan ini tidak hanya mempererat hubungan antarwarga, tetapi juga menjadi salah satu daya tarik tersendiri bagi siapa saja yang berkunjung ke desa ini.
  </Typography>
  <Typography variant="body2" align="left" paragraph sx={{ color: 'text.primary', fontSize: '0.85rem', lineHeight: 1.6 }}>
    Anak-anak muda di Bontomanai pun aktif dalam berbagai organisasi desa, ikut menjaga dan melestarikan adat istiadat yang diwariskan oleh leluhur mereka.
  </Typography>
  <Typography variant="body2" align="left" paragraph sx={{ color: 'text.primary', fontSize: '0.85rem', lineHeight: 1.6 }}>
    Meski kehidupan di Bontomanai tergolong sederhana, desa ini memiliki potensi besar untuk berkembang, terutama di bidang pertanian modern dan pariwisata berbasis alam. Dengan dukungan pemerintah daerah serta inisiatif masyarakat setempat, Bontomanai perlahan mulai berbenah, memperbaiki infrastruktur dan meningkatkan kualitas pendidikan serta kesehatan.
  </Typography>
  <Typography variant="body2" align="left" paragraph sx={{ color: 'text.primary', fontSize: '0.85rem', lineHeight: 1.6 }}>
    Harapannya, Desa Bontomanai ke depan bisa menjadi contoh desa mandiri dan berdaya saing di Kabupaten Jeneponto.
  </Typography>
</Box>

              </motion.div>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
};

export default About;