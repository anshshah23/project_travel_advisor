import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Grid, Box, Fab, Zoom, useMediaQuery, useTheme } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MapIcon from '@mui/icons-material/Map';
import ListIcon from '@mui/icons-material/List';
import { LoadScript } from '@react-google-maps/api';

import { AuthProvider } from './contexts/AuthContext';
import { getPlacesData } from './api/travelAdvisorAPI';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import APIStatsPanel from './components/APIStatsPanel/APIStatsPanel';

const libraries = ['places'];
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const HomePage = () => {
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bounds, setBounds] = useState(null);
  const [selectedGeoId, setSelectedGeoId] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get user's current location on mount and set initial bounds (only once)
  useEffect(() => {
    if (!isInitialized) {
      // Try to restore from localStorage first
      try {
        const savedState = localStorage.getItem('travelAdvisor_mapState');
        if (savedState) {
          const { center, bounds, places, timestamp } = JSON.parse(savedState);
          const fiveMinutes = 5 * 60 * 1000;
          
          // Use saved state if less than 5 minutes old
          if (Date.now() - timestamp < fiveMinutes) {
            console.log('✅ Restored map state from localStorage');
            setCenter(center);
            setBounds(bounds);
            if (places && places.length > 0) {
              setPlaces(places);
            }
            setIsInitialized(true);
            return;
          }
        }
      } catch (error) {
        console.error('Error loading saved map state:', error);
      }

      // If no saved state, get current location
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
          setIsInitialized(true);
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
          setIsInitialized(true);
        }
      );
    }
  }, [isInitialized]);

  // Filter places based on rating
  useEffect(() => {
    if (rating) {
      const filtered = places.filter((place) => Number(place.rating) >= Number(rating));
      setFilteredPlaces(filtered);
    } else {
      setFilteredPlaces(places);
    }
  }, [rating, places]);

  // Fetch places when bounds or type changes (with debouncing)
  useEffect(() => {
    if (bounds && isInitialized) {
      // Debounce API calls to avoid rapid successive calls during map movement
      const timeoutId = setTimeout(() => {
        setIsLoading(true);

        getPlacesData(type, bounds.sw, bounds.ne, selectedGeoId)
          .then((data) => {
            const validPlaces = data?.filter((place) => place.name && place.num_reviews > 0) || [];
            setPlaces(validPlaces);
            setIsLoading(false);
            
            // Save map state to localStorage
            try {
              localStorage.setItem('travelAdvisor_mapState', JSON.stringify({
                center,
                bounds,
                places: validPlaces,
                timestamp: Date.now()
              }));
            } catch (error) {
              console.error('Error saving map state:', error);
            }
          })
          .catch((error) => {
            console.error('Error fetching places:', error);
            setIsLoading(false);
          });
      }, 500); // Wait 500ms after bounds stop changing

      return () => clearTimeout(timeoutId);
    }
  }, [bounds, type, selectedGeoId, isInitialized, center]);

  const handlePlaceSelected = (location) => {
    // Location now comes with lat/lng and geoId from autocomplete
    if (location.lat && location.lng) {
      setCenter({ lat: location.lat, lng: location.lng });
      
      // Store geoId for hotels API
      if (location.geoId) {
        setSelectedGeoId(location.geoId);
      }
      
      // Set bounds around the location
      const latOffset = 0.1;
      const lngOffset = 0.1;
      setBounds({
        sw: { lat: location.lat - latOffset, lng: location.lng - lngOffset },
        ne: { lat: location.lat + latOffset, lng: location.lng + lngOffset }
      });
    }
  };

  const handleBoundsChanged = (newBounds) => {
    setBounds(newBounds);
  };

  const handleMarkerClick = (index) => {
    setChildClicked(index);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleView = () => {
    setShowMap(!showMap);
  };

  return (
    <>
      <Header onPlaceSelected={handlePlaceSelected} />
      <Box sx={{ flexGrow: 1 }}>
        <Grid 
          container 
          spacing={2} 
          sx={{ 
            flexGrow: 1, 
            p: 2, 
            height: { xs: 'auto', md: 'calc(100vh - 80px)' },
            overflow: { xs: 'visible', md: 'hidden' }
          }}
        >
          <Grid 
            item 
            xs={12} 
            md={4}
            sx={{ 
              display: { 
                xs: showMap ? 'none' : 'block', 
                md: 'block' 
              } 
            }}
          >
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
          <Grid 
            item 
            xs={12} 
            md={8} 
            sx={{ 
              display: { 
                xs: showMap ? 'block' : 'none', 
                md: 'block' 
              },
              height: { xs: '70vh', md: '100%' }
            }}
          >
            <Map
              center={center}
              places={filteredPlaces.length ? filteredPlaces : places}
              childClicked={childClicked}
              onBoundsChanged={handleBoundsChanged}
              onMarkerClick={handleMarkerClick}
              googleMapsLoaded={true}
            />
          </Grid>
        </Grid>
        
        {/* Toggle View Button (Mobile Only) */}
        {isMobile && (
          <Fab
            onClick={toggleView}
            color="primary"
            variant="extended"
            sx={{
              position: 'fixed',
              bottom: showScrollTop ? 88 : 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000
            }}
            aria-label="toggle view"
          >
            {showMap ? <ListIcon sx={{ mr: 1 }} /> : <MapIcon sx={{ mr: 1 }} />}
            {showMap ? 'Show List' : 'Show Map'}
          </Fab>
        )}

        {/* Scroll to Top Button */}
        <Zoom in={showScrollTop}>
          <Fab
            onClick={scrollToTop}
            color="primary"
            size="medium"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000
            }}
            aria-label="scroll to top"
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </Zoom>

        {/* API Stats Panel */}
        <APIStatsPanel />
      </Box>
    </>
  );
};

const App = () => {
  return (
    <LoadScript 
      googleMapsApiKey={GOOGLE_MAPS_API_KEY} 
      libraries={libraries}
    >
      <AuthProvider>
        <Router>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LoadScript>
  );
};

export default App;
