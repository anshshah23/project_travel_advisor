import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Paper, Typography, useMediaQuery } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Rating from '@mui/lab/Rating';

import mapStyles from '../../mapStyles';
import useStyles from './styles.js';

const Map = ({ coords, places, setCoords, setBounds, setChildClicked, weatherData }) => {
  const matches = useMediaQuery('(min-width:600px)');
  const classes = useStyles();

  return (
    <div className={classes.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyCHor5aL_GCg7p6JkcHZMHU-0hMkpwOtWA' }}
        defaultCenter={coords}
        center={coords}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={{ disableDefaultUI: true, zoomControl: true, styles: mapStyles }}
      >
      </GoogleMapReact>
    </div>
  );
};

export default Map;
