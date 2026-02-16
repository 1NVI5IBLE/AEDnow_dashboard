import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert
} from '@mui/material';

type LoginProps = {
  onLogin: () => void;
};

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://api.aednow.online/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.admin));
        
        // Trigger login callback
        onLogin();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 360,
          borderRadius: 2
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 1, textAlign: 'center' }}
        >
          AEDnow Admin
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: 'center' }}
        >
          Sign in to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            type="text"
            fullWidth
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              backgroundColor: '#DC0000',
              '&:hover': {
                backgroundColor: '#b30000'
              }
            }}
          >
            {loading ? 'Signing In...' : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
