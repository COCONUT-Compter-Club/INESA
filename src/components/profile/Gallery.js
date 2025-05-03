import React from 'react';
import Carousel from 'react-material-ui-carousel';
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  ZoomIn
} from '@mui/icons-material';

const Gallery = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const items = [
    {
      img: '/gallery/gbr-1.jpg',
      title: 'Panen Raya Desa',
      description: 'Kegiatan panen tahunan warga Desa Bontomanai'
    },
    {
      img: '/gallery/gbr-2.jpg',
      title: 'Wisata Alam',
      description: 'Pemandangan alam indah di sekitar desa'
    },
    {
      img: '/gallery/gbr-3.jpg',
      title: 'Gotong Royong',
      description: 'Kegiatan kerja bakti membersihkan lingkungan'
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', my: 8, px: isMobile ? 2 : 0 }} id="gallery">
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 4
        }}
      >
        Galeri Desa Bontomanai
      </Typography>

      <Carousel
        autoPlay={true}
        interval={5000}
        animation="fade"
        duration={800}
        navButtonsAlwaysVisible={!isMobile}
        fullHeightHover={false}
        indicators={true}
        NavButton={({ onClick, next, prev }) => (
          <Button
            onClick={onClick}
            variant="contained"
            color="primary"
            sx={{
              minWidth: 40,
              width: 40,
              height: 40,
              borderRadius: '50%',
              position: 'absolute',
              top: '50%',
              [next ? 'right' : 'left']: isMobile ? 10 : 30,
              transform: 'translateY(-50%)',
              zIndex: 2,
            }}
          >
            {next ? <ArrowForward /> : <ArrowBack />}
          </Button>
        )}
        IndicatorIcon={
          <Box sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            mx: 0.5
          }} />
        }
      >
        {items.map((item, i) => (
          <Paper
            key={i}
            elevation={6}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
              height: isMobile ? 300 : 500
            }}
          >
            <Box
              component="img"
              src={item.img}
              alt={item.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.9)'
              }}
            />

            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              p: 3,
              backdropFilter: 'blur(4px)',
              textAlign: 'center' // Memusatkan teks secara horizontal
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {item.title}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {item.description}
              </Typography>

              {/* <Button
                variant="outlined"
                color="inherit"
                startIcon={<ZoomIn />}
                sx={{
                  mt: 2,
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderColor: 'white'
                  }
                }}
              >
                Lihat Detail
              </Button> */}
            </Box>
          </Paper>
        ))}
      </Carousel>
    </Box>
  );
};

export default Gallery;