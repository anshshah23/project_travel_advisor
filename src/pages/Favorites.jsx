import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Button,
  CircularProgress,
  Alert,
  Box,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header/Header';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [user, navigate]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data.favorites);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Failed to load favorites');
      setLoading(false);
    }
  };

  const handleRemove = async (geoId) => {
    try {
      await axios.delete(`${API_URL}/favorites/remove/${geoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(favorites.filter(fav => fav.geoId !== geoId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      setError('Failed to remove favorite');
    }
  };

  if (loading) {
    return (
      <>
        <Header onPlaceSelected={() => {}} />
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  return (
    <>
      <Header onPlaceSelected={() => {}} />
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
        <Container maxWidth="lg">
          <Paper 
            elevation={6} 
            sx={{ 
              p: 4, 
              mb: 4,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              color: 'white',
              borderRadius: 2,
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" sx={{ mb: 1 }}>
              ❤️ My Favorites
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95 }}>
              {favorites.length} {favorites.length === 1 ? 'place' : 'places'} saved
            </Typography>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {favorites.length === 0 ? (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 6, 
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: 'white'
              }}
            >
              <Typography variant="h5" color="text.secondary" gutterBottom>
                📍 No favorites yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Start exploring and save your favorite places!
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/')}
                sx={{ 
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                }}
              >
                Explore Places
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {favorites.map((place) => (
                <Grid item xs={12} sm={6} md={4} key={place.geoId}>
                  <Card 
                    elevation={3}
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      position: 'relative',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6,
                      }
                    }}
                  >
                    <IconButton
                      onClick={() => handleRemove(place.geoId)}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        boxShadow: 2,
                        '&:hover': {
                          backgroundColor: 'white',
                          transform: 'scale(1.1)',
                        },
                        zIndex: 2,
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>

                    {place.photo ? (
                      <CardMedia
                        component="img"
                        height="220"
                        image={place.photo}
                        alt={place.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 220,
                          bgcolor: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <LocationOnIcon sx={{ fontSize: 80, color: 'white', opacity: 0.5 }} />
                      </Box>
                    )}

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography 
                        variant="h6" 
                        component="h2" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 700,
                          mb: 2,
                          lineHeight: 1.3
                        }}
                      >
                        {place.name}
                      </Typography>

                      {place.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Rating value={Number(place.rating)} readOnly precision={0.5} size="small" />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            {place.rating} ({place.numReviews || 0} reviews)
                          </Typography>
                        </Box>
                      )}

                      <Stack spacing={1.5} sx={{ mb: 2 }}>
                        {place.priceLevel && (
                          <Chip 
                            label={place.priceLevel} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        )}

                        {place.address && (
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <LocationOnIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                              {place.address}
                            </Typography>
                          </Box>
                        )}

                        {place.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon fontSize="small" color="primary" />
                            <Typography variant="body2" color="primary">
                              {place.phone}
                            </Typography>
                          </Box>
                        )}

                        {place.website && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LanguageIcon fontSize="small" color="primary" />
                            <a 
                              href={place.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ 
                                color: '#1976d2', 
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                              }}
                            >
                              Visit Website
                            </a>
                          </Box>
                        )}
                      </Stack>

                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ 
                          display: 'block', 
                          mt: 2,
                          pt: 2,
                          borderTop: 1,
                          borderColor: 'divider'
                        }}
                      >
                        Added on {new Date(place.addedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Favorites;
