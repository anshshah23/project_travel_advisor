import React, { useState, useEffect } from 'react';
import { CssBaseline, Grid } from '@mui/material';

import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

import { getPlacesData } from './api/travelAdvisorAPI';

const App = () => {
  const [places, setPlaces] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState(null);
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('3');
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoordinates({ lat: latitude, lng: longitude });
    });
  }, []);

  useEffect(() => {
    const filteredPlaces = places.filter((place) => place.rating>= rating);
    setFilteredPlaces(filteredPlaces);
  }, [places, rating]);

  useEffect(() => {
    if (bounds) {
      getPlacesData(type, bounds.sw, bounds.ne)
        .then((data) => {
          console.log(data);
          setPlaces(data);
        });
    }
  }, [type, bounds]);

  return (
    <>
      <CssBaseline />
      <Header />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List
            isLoading={isLoading}
            childClicked={childClicked}
            places = {filteredPlaces.length ? filteredPlaces : places}
             type={type} setType={setType} rating={rating} setRating={setRating} />
        </Grid>
        <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filteredPlaces.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
