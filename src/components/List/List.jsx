import React from 'react';
import { Typography, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import PlaceDetails from '../PlaceDetails/PlaceDetails';

import useStyles from './styles';

const List = ({ places, type, setType, rating, setRating,childClicked, isLoading }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h5" style={{padding:'0px'}}>
        Restaurants, Hotels & Attractions around you
      </Typography>
      {isLoading ? (
        <div className={classes.loading}>
          <Typography variant="h5">Loading...</Typography>
        </div>
      ) : (
        <>
          <FormControl className={classes.formControl} style={{paddingBottom: '30px'}}>
            <InputLabel>Type</InputLabel>
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
          <Grid container spacing={3} className={classes.list}>
            {places?.map((place, i) => (
              <Grid item key={i} xs={12}>
                <PlaceDetails place={place} selected={Number(childClicked) === i} refProp={childClicked} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
};

export default List;
