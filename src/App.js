import React, { useState, useEffect } from 'react';
import { CssBaseline, Grid } from '@mui/material';
import { LoadScript } from '@react-google-maps/api';

import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

import { getPlacesData, getWeatherData } from './api/travelAdvisorAPI';

const libraries = ['places'];

const App = () => {
  const [places, setPlaces] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState(null);
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('3');
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [autocomplete, setAutocomplete] = useState(null);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoordinates({ lat: latitude, lng: longitude });
    });
  }, []);

  useEffect(() => {
    if (Array.isArray(places)) {
      const filtered = places.filter((place) => place.rating >= rating);
      setFilteredPlaces(filtered);
    }
  }, [places, rating]);

  useEffect(() => {
    if (bounds) {
      setIsLoading(true);

      getWeatherData(coordinates.lat, coordinates.lng).then((data) => setWeatherData(data));

      getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
        if (Array.isArray(data)) {
          setPlaces(data.filter((place) => place.name && place.num_reviews > 0));
        } else {
          setPlaces([]);
        }
        setFilteredPlaces([]);
        setRating('3');
        setIsLoading(false);
      });
    }
  }, [type, bounds, coordinates]);

  const onLoad = (autoC) => {
    console.log('Autocomplete loaded:', autoC);
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setCoordinates({ lat, lng });
        console.log('Place changed:', { lat, lng });
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBFvPaROum9S-qCCxZBCGgwL6vQrsETOpU" libraries={libraries}>
      <CssBaseline />
      <Header onPlaceChanged={onPlaceChanged} onLoad={onLoad} />
      <Grid container spacing={3} style={{ width: '100%', padding:'0px' }}>
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
        <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filteredPlaces.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </LoadScript>
  );
};

export default App;
