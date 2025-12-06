import React, { useState, useEffect } from 'react';
import { CssBaseline, Grid, Box } from '@mui/material';
import { LoadScript } from '@react-google-maps/api';

import { getPlacesData, searchPlacesByLocation } from './api/travelAdvisorAPI';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

const libraries = ['places'];
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const App = () => {
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bounds, setBounds] = useState(null);

  // Get user's current location on mount and set initial bounds
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        const coords = { lat: latitude, lng: longitude };
        setCenter(coords);
        
        // Set initial bounds (approximately 10km radius)
        const latOffset = 0.1;
        const lngOffset = 0.1;
        setBounds({
          sw: { lat: latitude - latOffset, lng: longitude - lngOffset },
          ne: { lat: latitude + latOffset, lng: longitude + lngOffset }
        });
      },
      () => {
        // Default to New York if geolocation fails
        const lat = 40.7128;
        const lng = -74.0060;
        setCenter({ lat, lng });
        
        // Set initial bounds
        const latOffset = 0.1;
        const lngOffset = 0.1;
        setBounds({
          sw: { lat: lat - latOffset, lng: lng - lngOffset },
          ne: { lat: lat + latOffset, lng: lng + lngOffset }
        });
      }
    );
  }, []);

  // Filter places based on rating
  useEffect(() => {
    if (rating) {
      const filtered = places.filter((place) => Number(place.rating) >= Number(rating));
      setFilteredPlaces(filtered);
    } else {
      setFilteredPlaces(places);
    }
  }, [rating, places]);

  // Fetch places when bounds or type changes
  useEffect(() => {
    if (bounds) {
      setIsLoading(true);

      getPlacesData(type, bounds.sw, bounds.ne)
        .then((data) => {
          const validPlaces = data?.filter((place) => place.name && place.num_reviews > 0) || [];
          setPlaces(validPlaces);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching places:', error);
          setIsLoading(false);
        });
    }
  }, [bounds, type]);

  const handlePlaceSelected = async (location) => {
    setCenter({ lat: location.lat, lng: location.lng });
    
    // If we have a geoId, fetch places for that specific location
    if (location.geoId) {
      setIsLoading(true);
      try {
        const data = await searchPlacesByLocation(location.geoId, type);
        const validPlaces = data?.filter((place) => place.name && place.num_reviews > 0) || [];
        setPlaces(validPlaces);
      } catch (error) {
        console.error('Error fetching places for location:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Otherwise, set bounds around the location
      const latOffset = 0.1;
      const lngOffset = 0.1;
      setBounds({
        sw: { lat: location.lat - latOffset, lng: location.lng - lngOffset },
        ne: { lat: location.lat + latOffset, lng: location.lng + lngOffset }
      });
    }
  };

  const handleMarkerClick = (index) => {
    setChildClicked(index);
  };

  const handleBoundsChanged = (newBounds) => {
    setBounds(newBounds);
  };

  return (
    <LoadScript 
      googleMapsApiKey={GOOGLE_MAPS_API_KEY} 
      libraries={libraries}
    >
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header 
          onPlaceSelected={handlePlaceSelected}
        />
        <Grid 
          container 
          spacing={2} 
          sx={{ 
            flexGrow: 1, 
            p: 2, 
            height: 'calc(100vh - 80px)',
            overflow: 'hidden'
          }}
        >
          <Grid item xs={12} md={4}>
            <List
              isLoading={isLoading}
              childClicked={childClicked}
              places={filteredPlaces.length ? filteredPlaces : places}
              type={type}
              setType={setType}
              rating={rating}
              setRating={setRating}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Map
              center={center}
              places={filteredPlaces.length ? filteredPlaces : places}
              onMarkerClick={handleMarkerClick}
              onBoundsChanged={handleBoundsChanged}
              isLoaded={true}
            />
          </Grid>
        </Grid>
      </Box>
    </LoadScript>
  );
};

export default App;