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

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    const result = await register(email, password, name);
    
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
          Register
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
            autoComplete="name"
            autoFocus
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoComplete="email"
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="new-password"
            helperText="Must be at least 6 characters"
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="new-password"
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
                Login here
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

export default Register;
