'use client'

import React from 'react';
import { Card, CardContent, CardActionArea, Typography, Grid, Box, Container } from '@mui/material';
import { AccountTree as ProfileIcon, Description as LayananIcon, AttachMoney as BendaharaIcon, Drafts as SekretarisIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import './styles.css';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const CardIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  '& svg': {
    fontSize: '3rem',
  },
}));

const FeatureCard = () => {
  const services = [
    {
      title: 'Profile Desa',
      description: 'Informasi lengkap tentang Desa Bontomanai termasuk sejarah, visi misi, dan struktur pemerintahan.',
      icon: <ProfileIcon />,
      color: '#4caf50',
    },
    {
      title: 'Layanan Administrasi',
      description: 'Pelayanan surat menyurat seperti SKTM, domisili, kelahiran, dan lainnya.',
      icon: <LayananIcon />,
      color: '#2196f3',
    },
    {
      title: 'Bendahara',
      description: 'Informasi keuangan desa, laporan anggaran, dan pertanggungjawaban keuangan.',
      icon: <BendaharaIcon />,
      color: '#ff9800',
    },
    {
      title: 'Sekretaris & Persuratan',
      description: 'Pelayanan administrasi persuratan dan dokumentasi resmi desa.',
      icon: <SekretarisIcon />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box className="page-background">
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 6, color: 'text.primary' }}>
          Pelayanan Desa Bontomanai
        </Typography>
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StyledCard>
                <CardActionArea sx={{ p: 3, height: '100%' }}>
                  <CardIcon sx={{ color: service.color }}>
                    {service.icon}
                  </CardIcon>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3" align="center">
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {service.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeatureCard;