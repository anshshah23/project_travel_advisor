import React, { useEffect, useRef } from 'react';
import { Typography, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import PlaceDetails from '../PlaceDetails/PlaceDetails';

import useStyles from './styles';

const List = ({ places, type, setType, rating, setRating, isLoading, selectedPlace }) => {
  const classes = useStyles();
  const listRef = useRef(null);

  useEffect(() => {
    if (selectedPlace && listRef.current) {
      const selectedElement = listRef.current.querySelector(`[data-place-id="${selectedPlace.id}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedPlace]);

  return (
    <div className={classes.container} ref={listRef}>
      <Typography variant="h5" style={{ paddingBottom: 10 }}>
        Restaurants, Hotels & Attractions around you
      </Typography>
      <FormControl className={classes.formControl} style={{ marginRight: 12 }}>
        <InputLabel>Types</InputLabel>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <MenuItem value="restaurants">Restaurants</MenuItem>
          <MenuItem value="hotels">Hotels</MenuItem>
          <MenuItem value="attractions">Attractions</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel>Rating</InputLabel>
        <Select value={rating} onChange={(e) => setRating(e.target.value)}>
          <MenuItem value={0}>All</MenuItem>
          <MenuItem value={3}>Above 3.0</MenuItem>
          <MenuItem value={4}>Above 4.0</MenuItem>
          <MenuItem value={4.5}>Above 4.5</MenuItem>
        </Select>
      </FormControl>
      {isLoading ? (
        <Typography variant="h6" style={{ textAlign: 'center' }}>Loading...</Typography>
      ) : (
        <Grid container spacing={3} className={classes.list} style={{ marginTop: '5px' }}>
          {places?.map((place, i) => (
            <Grid item key={i} xs={12} data-place-id={place.id}>
              <PlaceDetails place={place} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default List;
