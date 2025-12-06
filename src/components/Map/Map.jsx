import React, { useState, useCallback } from 'react';
import { GoogleMap, MarkerF, InfoWindowF, OverlayView } from '@react-google-maps/api';
import { 
  Paper, 
  Typography, 
  Box, 
  Chip,
  useTheme,
  useMediaQuery,
  Avatar,
  Stack
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import RestaurantIcon from '@mui/icons-material/Restaurant';

import mapStyles from '../../mapStyles';

const containerStyle = {
  width: '100%',
  height: '85vh',
};

const Map = ({ center, places, onMarkerClick, isLoaded, onBoundsChanged }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const [map, setMap] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = (place, index) => {
    setSelectedPlace({ place, index });
    onMarkerClick(index);
  };

  const handleBoundsChanged = useCallback(() => {
    if (map && onBoundsChanged) {
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        onBoundsChanged({
          ne: { lat: ne.lat(), lng: ne.lng() },
          sw: { lat: sw.lat(), lng: sw.lng() }
        });
      }
    }
  }, [map, onBoundsChanged]);

  const options = {
    styles: mapStyles,
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  };

  if (!isLoaded || !center.lat) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={options}
      onDragEnd={handleBoundsChanged}
      onZoomChanged={handleBoundsChanged}
    >
      {places?.map((place, index) => {
        const lat = Number(place.latitude);
        const lng = Number(place.longitude);
        
        if (isNaN(lat) || isNaN(lng)) return null;

        const isSelected = selectedPlace?.index === index;
        const isHovered = hoveredPlace === index;

        return (
          <React.Fragment key={index}>
            {/* Custom Marker Card - Always visible */}
            <OverlayView
              position={{ lat, lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <Paper
                elevation={isSelected ? 8 : isHovered ? 6 : 3}
                onClick={() => handleMarkerClick(place, index)}
                onMouseEnter={() => setHoveredPlace(index)}
                onMouseLeave={() => setHoveredPlace(null)}
                sx={{
                  position: 'absolute',
                  transform: 'translate(-50%, -100%)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  bgcolor: 'white',
                  border: isSelected ? 3 : 2,
                  borderColor: isSelected ? 'primary.main' : 'white',
                  borderRadius: 2,
                  minWidth: isMobile ? 100 : 140,
                  maxWidth: isMobile ? 120 : 180,
                  '&:hover': {
                    transform: 'translate(-50%, -100%) scale(1.05)',
                    zIndex: 1000,
                  },
                  zIndex: isSelected ? 999 : isHovered ? 998 : 1,
                  mb: 1,
                }}
              >
                {/* Image */}
                {place.photo && (
                  <Box
                    component="img"
                    src={place.photo.images.small?.url || place.photo.images.thumbnail?.url}
                    alt={place.name}
                    sx={{
                      width: '100%',
                      height: isMobile ? 60 : 80,
                      objectFit: 'cover',
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                  />
                )}
                
                {/* Content */}
                <Box sx={{ p: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontSize: isMobile ? '0.65rem' : '0.75rem',
                      lineHeight: 1.2,
                      mb: 0.5,
                    }}
                  >
                    {place.name}
                  </Typography>

                  {/* Rating */}
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <StarIcon sx={{ fontSize: isMobile ? 12 : 14, color: '#ffa726' }} />
                    <Typography variant="caption" sx={{ fontSize: isMobile ? '0.6rem' : '0.7rem' }}>
                      {place.rating || 'N/A'}
                    </Typography>
                    {place.num_reviews && (
                      <Typography variant="caption" sx={{ fontSize: isMobile ? '0.55rem' : '0.65rem', color: 'text.secondary' }}>
                        ({place.num_reviews})
                      </Typography>
                    )}
                  </Stack>

                  {/* Price Level */}
                  {place.price_level && (
                    <Typography variant="caption" sx={{ fontSize: isMobile ? '0.6rem' : '0.7rem', color: 'text.secondary', mt: 0.5 }}>
                      {place.price_level}
                    </Typography>
                  )}
                </Box>

                {/* Location Pin at bottom */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <LocationOnIcon 
                    sx={{ 
                      fontSize: 24, 
                      color: isSelected ? 'primary.main' : theme.palette.error.main,
                      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))',
                    }} 
                  />
                </Box>
              </Paper>
            </OverlayView>
          </React.Fragment>
        );
      })}
    </GoogleMap>
  );
};

export default Map;