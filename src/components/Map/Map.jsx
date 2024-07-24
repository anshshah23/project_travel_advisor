import React from 'react'
import GoogleMapReact from 'google-map-react'
import { Paper, Typography, useMediaQuery } from '@mui/material'
import { LocationOnOutlined } from '@mui/icons-material'
import Rating from '@mui/lab/Rating'

import useStyles from './styles'

const Map = ({ setCoordinates, setBounds, coordinates} ) => {
  const classes = useStyles()
  const isMobile = useMediaQuery('(min-width:600px)')

  return (
    <div className={classes.mapContainer}>
      <GoogleMapReact 
        bootstrapURLKeys={{ key: 'AIzaSyCHor5aL_GCg7p6JkcHZMHU-0hMkpwOtWA' }}
        defaultCenter={coordinates}
        center={coordinates}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={''}
        onChange={(e) => {
          setCoordinates({ lat: e.center.lat, lng: e.center.lng })
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw })
        }
        }
        onChildClick={''}
      >
        <LocationOnOutlined lat={coordinates.lat} lng={coordinates.lng} />
      </GoogleMapReact>
    </div>
  )
}

export default Map