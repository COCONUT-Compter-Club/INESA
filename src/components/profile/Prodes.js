'use client'

import React from 'react';
import { Box, Container, Grid, Typography, Card } from '@mui/material';
import { motion } from 'framer-motion';
import './styles.css';

const Pizza = () => {
  return (
    <Box className="page-background"  id="about" sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Card sx={{ p: 3, bgcolor: 'background.card', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary', fontSize: '2.25rem' }}
          >
            Profil Desa
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
                    backgroundImage: 'url(/desa4.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '12px',
                    height: '400px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                />
                <Typography variant="body2" className="image-credit" sx={{ mt: 1, fontSize: '0.75rem' }}>
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <Box sx={{ px: 2 }}>
                <Typography variant="h4" align="left" gutterBottom sx={{ color: 'text.primary', fontSize: '1.75rem' }}>
                  Desa Bontomanai
                </Typography>
                <Typography variant="body1" align="left" paragraph sx={{ color: 'text.primary', fontSize: '0.875rem' }}>
                  <strong>Desa Bontomanai</strong> merupakan salah satu desa yang terletak di Kecamatan Rumbia, Kabupaten Jeneponto, Sulawesi Selatan. Desa ini memiliki suasana pedesaan yang tenang dan alami, dengan hamparan sawah dan kebun yang menjadi ciri khas wilayahnya. Kehidupan masyarakat di Bontomanai masih sangat menjunjung tinggi nilai-nilai gotong royong, mencerminkan kekayaan budaya sosial yang tetap terjaga di tengah perkembangan zaman. Letak geografisnya yang strategis juga memberikan kemudahan akses menuju wilayah-wilayah lain di sekitar Kecamatan Rumbia.
                </Typography>
                <Typography variant="body1" align="left" paragraph sx={{ color: 'text.primary', fontSize: '0.875rem' }}>
                  Mayoritas penduduk Desa Bontomanai bermata pencaharian sebagai petani dan peternak. Padi dan jagung merupakan komoditas pertanian utama yang dihasilkan, ditambah dengan hasil perkebunan seperti pisang, singkong, dan kelapa. Dalam bidang peternakan, sapi dan kambing menjadi hewan ternak yang paling banyak dipelihara oleh warga. Selain kegiatan pertanian dan peternakan, sebagian masyarakat juga menjalankan usaha kecil seperti kerajinan lokal dan perdagangan hasil tani, yang turut berkontribusi dalam meningkatkan taraf ekonomi desa.
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

export default Pizza;