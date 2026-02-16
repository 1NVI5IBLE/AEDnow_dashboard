import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Container,
  Box,
  Button,
  CircularProgress
} from '@mui/material';
import { useState, useEffect } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';

import Dashboard from './pages/Dashboard';
import Login from './pages/login';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Verify token on app load
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('adminToken');
      const user = localStorage.getItem('adminUser');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://api.aednow.online/api/admin/verify', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          setIsLoggedIn(true);
          setAdminUser(user ? JSON.parse(user) : data.admin);
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      } catch (error) {
        console.error('Token verification error:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const handleLogin = () => {
    const user = localStorage.getItem('adminUser');
    setAdminUser(user ? JSON.parse(user) : null);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsLoggedIn(false);
    setAdminUser(null);
  };

  // Show loading spinner while verifying token
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 🔐 LOGIN — FULL SCREEN
  if (!isLoggedIn) {
    return (
      <>
        <CssBaseline />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  // LOGGED IN — SHOW DASHBOARD
  return (
    <>
      <CssBaseline />

      {/* RED BACKGROUND LAYER */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: 200,
          backgroundColor: '#DC0000',
          zIndex: 0
        }}
      />

      {/* NAVBAR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          color: '#ffffff',
          zIndex: 1
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AEDnow Admin
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              Welcome, {adminUser?.username || 'Admin'}
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* MAIN CONTENT */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          mt: '96px'
        }}
      >
        <Dashboard />
      </Container>
    </>
  );
}
