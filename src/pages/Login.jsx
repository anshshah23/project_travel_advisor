import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header/Header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <>
      <Header onPlaceSelected={() => {}} />
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', py: 4 }}>
        <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          Login
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoComplete="email"
            autoFocus
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              color: 'white',
              fontWeight: 'bold',
              py: 1.5,
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
                Register here
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Login;
