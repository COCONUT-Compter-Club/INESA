'use client'

import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'

const drawerWidth = 280

const StyledDrawer = styled(Drawer)`
  width: ${drawerWidth}px;
  flex-shrink: 0;
  
  & .MuiDrawer-paper {
    width: ${drawerWidth}px;
    box-sizing: border-box;
    background: linear-gradient(180deg, #1a237e 0%, #0d47a1 100%);
    color: white;
    border-right: none;
  }
`

const Header = styled(Box)`
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
`

const HeaderText = styled(Box)`
  display: flex;
  flex-direction: column;
`

const StyledListItem = styled(ListItem)`
  margin: 4px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.7);

  &:hover {
    background: #4caf50;
    transform: none;
    box-shadow: none;
    color: #fff;
  }

  &.active {
    background: #4caf50;
    color: #fff;
    
    .MuiListItemIcon-root {
      color: #fff;
    }
    
    .MuiTypography-root {
      font-weight: 600;
      color: #fff;
    }
  }

  .MuiListItemIcon-root {
    color: inherit;
    min-width: 40px;
    transition: color 0.2s ease;
  }

  .MuiTypography-root {
    color: inherit;
    transition: color 0.2s ease;
  }
`

const menuItems = [
  { title: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { title: 'Surat Masuk', icon: <TrendingUpIcon />, path: '/pemasukan' },
  { title: 'Surat Keluar', icon: <TrendingDownIcon />, path: '/pengeluaran' },
  { title: 'Laporan Keuangan', icon: <AssessmentIcon />, path: '/laporan' },
  { title: 'Data Penduduk', icon: <PersonIcon />, path: '/dashboard/penduduk' }, // Ditambahkan untuk konsistensi
]

const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}

const removeCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
}

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [content, setContent] = useState({
    logo: '/image.png',
    title: 'Desa Bonto Ujung',
    description: 'Kec. Tarowang, Kab. Jeneponto',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8080/api/content', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          credentials: 'include',
          cache: 'no-store',
        })

        const text = await response.text()
        console.log('[FETCH] Respons teks (konten):', text)
        let data

        try {
          data = JSON.parse(text)
          console.log('[FETCH] Respons JSON (konten):', data)
        } catch (parseErr) {
          console.error('[FETCH] Gagal parsing JSON:', parseErr)
          throw new Error('Respons bukan JSON: ' + text)
        }

        if (!response.ok) {
          console.error('[FETCH] Respons tidak OK:', response.status, data)
          throw new Error(data.message || `Gagal mengambil data konten: ${response.status}`)
        }

        const contentData = data.data ? data.data : data

        if (contentData.logo) {
          localStorage.setItem('logo', contentData.logo)
        }

        const logoPath = localStorage.getItem('logo')
        const logoUrl = logoPath ? `http://localhost:8080/${decodeURIComponent(logoPath)}` : '/image.png'

        setContent({
          logo: logoUrl,
          title: contentData.title || 'Desa Bonto Ujung',
          description: contentData.description || 'Kec. Tarowang, Kab. Jeneponto',
        })
      } catch (err) {
        console.error('[FETCH] Gagal mengambil data konten:', err)
        setError('Gagal mengambil data konten: ' + err.message)

        setContent({
          logo: '/image.png',
          title: 'Desa Bonto Ujung',
          description: 'Kec. Tarowang, Kab. Jeneponto',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [pathname])

  const handleNavigation = (path) => {
    router.push(path)
  }

  const handleLogout = () => {
    console.log('[LOGOUT] Menghapus cookie token') // Debugging
    removeCookie('token')
    localStorage.removeItem('logo') // Bersihkan logo dari localStorage
    console.log('[LOGOUT] Mengarahkan ke /authentication/sign-in') // Debugging
    router.push('/authentication/sign-in')
  }

  return (
    <StyledDrawer variant="permanent">
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      ) : (
        <>
          <Header>
            <Image
              src={content.logo}
              alt="Logo"
              width={60}
              height={60}
              style={{ borderRadius: '50%' }}
              onError={(e) => {
                e.target.src = '/image.png'
              }}
            />
            <HeaderText>
              <Typography
                variant="h6"
                sx={{
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  lineHeight: 1.2,
                  mb: 0.5,
                }}
              >
                {content.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                {content.description}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  pt: 1,
                }}
              >
                MENU BENDAHARA
              </Typography>
            </HeaderText>
          </Header>

          {error && (
            <Box sx={{ px: 2, pb: 2 }}>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}
              >
                Error: {error}
              </Typography>
            </Box>
          )}

          <List sx={{ mt: 2 }}>
            {menuItems.map((item) => (
              <StyledListItem
                key={item.title}
                button
                onClick={() => handleNavigation(item.path)}
                className={pathname === item.path ? 'active' : ''}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    sx: {
                      fontSize: '0.95rem',
                      fontWeight: pathname === item.path ? 600 : 400,
                    },
                  }}
                />
              </StyledListItem>
            ))}
          </List>

          <Box sx={{ mt: 'auto', mb: 2 }}>
            <StyledListItem
              button
              onClick={handleLogout}
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                },
              }}
            >
              <ListItemIcon>
                <PersonIcon sx={{ color: 'inherit' }} />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  sx: { fontSize: '0.95rem' },
                }}
              />
            </StyledListItem>
          </Box>
        </>
      )}
    </StyledDrawer>
  )
}