import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  Button, 
  Typography, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Chip,
  Stack,
  Divider,
  alpha,
  IconButton,
  Tooltip
} from '@mui/material';
import Rating from '@mui/material/Rating';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PlaceDetails = ({ place, selected }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if place is favorited when component mounts or user changes
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && token && place?.location_id) {
        try {
          const response = await axios.get(`${API_URL}/favorites/check/${place.location_id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsFavorited(response.data.isFavorited);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };
    checkFavoriteStatus();
  }, [user, token, place?.location_id]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      if (isFavorited) {
        // Remove from favorites
        await axios.delete(`${API_URL}/favorites/remove/${place.location_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorited(false);
      } else {
        // Add to favorites
        await axios.post(`${API_URL}/favorites/add`, {
          geoId: place.location_id,
          name: place.name,
          photo: place.photo?.images?.large?.url || '',
          rating: place.rating,
          numReviews: place.num_reviews,
          priceLevel: place.price_level,
          address: place.address,
          phone: place.phone,
          website: place.website,
          latitude: place.latitude,
          longitude: place.longitude,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      elevation={selected ? 8 : 3}
      sx={{ 
        transition: 'all 0.3s ease-in-out',
        border: selected ? 2 : 0,
        borderColor: 'primary.main',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="240"
          image={
            place.photo 
              ? place.photo.images.large.url 
              : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'
          }
          alt={place.name}
          sx={{ 
            objectFit: 'cover',
          }}
        />
        <Tooltip title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}>
          <IconButton
            onClick={handleFavoriteToggle}
            disabled={loading}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            }}
          >
            {isFavorited ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            lineHeight: 1.3,
            mb: 2,
          }}
        >
          {place.name}
        </Typography>

        {/* Rating Section */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Rating 
            value={Number(place.rating) || 0} 
            precision={0.5} 
            readOnly 
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            ({place.num_reviews || 0} reviews)
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Price and Ranking */}
        <Stack spacing={1.5}>
          {place.price_level && (
            <Box display="flex" alignItems="center" gap={1}>
              <AttachMoneyIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Price:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {place.price_level}
              </Typography>
            </Box>
          )}

          {place.ranking && (
            <Box display="flex" alignItems="flex-start" gap={1}>
              <TripOriginIcon fontSize="small" color="action" sx={{ mt: 0.3 }} />
              <Typography variant="body2" color="text.secondary">
                {place.ranking}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Awards */}
        {place?.awards?.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {place.awards.map((award, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  mb: 1,
                  p: 1,
                  borderRadius: 1,
                  bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                }}
              >
                <EmojiEventsIcon fontSize="small" color="warning" />
                <Typography variant="caption" sx={{ flex: 1 }}>
                  {award.display_name}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Cuisine Tags */}
        {place?.cuisine?.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {place.cuisine.map(({ name }, index) => (
                <Chip 
                  key={index} 
                  label={name} 
                  size="small" 
                  variant="outlined"
                  sx={{ mb: 0.5 }}
                />
              ))}
            </Stack>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Contact Information */}
        <Stack spacing={1}>
          {place?.address && (
            <Box display="flex" alignItems="flex-start" gap={1}>
              <LocationOnIcon fontSize="small" color="action" sx={{ mt: 0.2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                {place.address}
              </Typography>
            </Box>
          )}

          {place?.phone && (
            <Box display="flex" alignItems="center" gap={1}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {place.phone}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
          {place.web_url && (
            <Button 
              size="small" 
              variant="outlined"
              startIcon={<OpenInNewIcon />}
              onClick={() => window.open(place.web_url, '_blank')}
              sx={{ flex: 1 }}
            >
              TripAdvisor
            </Button>
          )}
          {place.website && (
            <Button 
              size="small" 
              variant="contained"
              startIcon={<OpenInNewIcon />}
              onClick={() => window.open(place.website, '_blank')}
              sx={{ flex: 1 }}
            >
              Website
            </Button>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
};

export default PlaceDetails;
