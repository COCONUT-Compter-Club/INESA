'use client'

import React, { useState, useEffect } from 'react';
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import './navbar-styles.css';

const Navbar = () => {
  const pages = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Contact', id: 'contact' },
  ];
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
      console.log('Scroll position:', window.scrollY, 'Scrolled state:', isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Panggil sekali saat komponen dimuat untuk set state awal

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    handleCloseNavMenu();
  };

  const handleLogin = () => {
    router.push('/authentication/sign-in');
    handleCloseNavMenu();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AppBar
        position="fixed"
        sx={{
          top: 0,
          width: '100%',
          background: scrolled ? 'rgba(2, 132, 199, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
          height: 56,
          transition: 'background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease',
          zIndex: 1000,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: '56px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="/image.png"
                alt="Desa Bontomanai Logo"
                style={{ width: 24, height: 24, marginRight: 6 }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: scrolled ? 'white' : '#333', fontSize: '1.25rem' }}
              >
                Desa Bontomanai
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
              <IconButton
                size="medium"
                onClick={handleOpenNavMenu}
                sx={{ color: scrolled ? 'white' : '#333' }}
              >
                <MenuIcon fontSize="medium" />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.name} onClick={() => handleNavClick(page.id)}>
                    <Typography textAlign="center" sx={{ fontSize: '0.875rem', color: '#333' }}>
                      {page.name}
                    </Typography>
                  </MenuItem>
                ))}
                {/* Tambahkan tombol Login di menu dropdown */}
                <MenuItem onClick={handleLogin}>
                  <Typography textAlign="center" sx={{ fontSize: '0.875rem', color: '#333', fontWeight: 700 }}>
                    Login
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-start', marginLeft: 25, gap: 1.5 }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={() => handleNavClick(page.id)}
                  sx={{
                    color: scrolled ? 'white' : '#333',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    borderRadius: '16px',
                    px: 2,
                    py: 0.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: scrolled ? '#38bdf8' : 'rgba(0, 0, 0, 0.1)',
                      color: scrolled ? 'white' : '#333',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleLogin}
                sx={{
                  borderColor: scrolled ? 'white' : '#333',
                  color: scrolled ? 'white' : '#333',
                  borderRadius: '16px',
                  px: 2,
                  py: 0.5,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  '&:hover': {
                    bgcolor: scrolled ? '#38bdf8' : 'rgba(0, 0, 0, 0.1)',
                    color: scrolled ? 'white' : '#333',
                    borderColor: scrolled ? '#38bdf8' : '#333',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                Login
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </motion.div>
  );
};

export default Navbar;