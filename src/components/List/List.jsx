import React, { useEffect, useRef, createRef } from 'react';
import { 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box,
  CircularProgress,
  Divider,
  Paper,
  Stack
} from '@mui/material';
import PlaceDetails from '../PlaceDetails/PlaceDetails';

const List = ({ places, type, setType, rating, setRating, isLoading, childClicked }) => {
  const elRefs = useRef([]);

  useEffect(() => {
    elRefs.current = Array(places?.length).fill().map((_, i) => elRefs.current[i] || createRef());
  }, [places]);

  useEffect(() => {
    if (childClicked !== null && elRefs.current[childClicked]) {
      elRefs.current[childClicked].current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [childClicked]);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: '85vh', 
        overflow: 'auto',
        p: 3,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#555',
          },
        },
      }}
    >
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 700, 
          mb: 2,
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Discover Amazing Places
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Restaurants & Attractions around you
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Type</InputLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)} label="Type">
            <MenuItem value="restaurants">🍽️ Restaurants</MenuItem>
            <MenuItem value="attractions">🎭 Attractions</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth size="small">
          <InputLabel>Rating</InputLabel>
          <Select value={rating} onChange={(e) => setRating(e.target.value)} label="Rating">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="3">⭐ Above 3.0</MenuItem>
            <MenuItem value="4">⭐⭐ Above 4.0</MenuItem>
            <MenuItem value="4.5">⭐⭐⭐ Above 4.5</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: 300 }}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={60} />
            <Typography variant="body1" color="text.secondary">
              Loading amazing places...
            </Typography>
          </Stack>
        </Box>
      ) : (
        <Stack spacing={2}>
          {places?.map((place, i) => (
            <Box key={i} ref={elRefs.current[i]}>
              <PlaceDetails 
                place={place} 
                selected={childClicked === i}
                refProp={elRefs.current[i]}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
};

export default List;
