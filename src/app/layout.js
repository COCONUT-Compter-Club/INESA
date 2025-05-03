import { SoftUIProvider } from '@/context/SoftUIContext';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import { Box } from '@mui/material';

export const metadata = {
  title: 'Sistem Informasi Desa Bontomanai',
  description: 'Aplikasi untuk admin, bendahara, dan sekretaris desa',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <SoftUIProvider>
          <AuthProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              {children}
            </Box>
          </AuthProvider>
        </SoftUIProvider>
      </body>
    </html>
  );
}