import React from 'react';
import { Box, Card, Button, Typography, CardContent, CardMedia, CardActions, Chip } from '@mui/material';
import Rating from '@mui/lab/Rating';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const PlaceDetails = ({ place }) => {
    return (
        <Card elevation={6}>
            <CardMedia
                style={{ height: 350 }}
                image={place.photo ? place.photo.images.large.url : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
                title={place.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5">{place.name}</Typography>
                <Box display="flex" justifyContent="space-between" my={2}>
                    <Rating value={Number(place.rating)} readOnly />
                    <Typography gutterBottom variant="subtitle1">out of {place.num_reviews} reviews</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" my={2}>
                    <Typography variant="subtitle1">Price</Typography>
                    <Typography gutterBottom variant="subtitle1">{place.price_level}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" my={2}>
                    <Typography variant="subtitle1">Ranking</Typography>
                    <Typography gutterBottom variant="subtitle1">{place.ranking}</Typography>
                </Box>
                {place?.awards?.map((award, index) => (
                    <Box key={index} my={1} display="flex" justifyContent="space-between" alignItems="center">
                        <img src={award.images.small} alt={award.display_name} />
                        <Typography variant="subtitle2" color="textSecondary">{award.display_name}</Typography>
                    </Box>
                ))}
                <Box display="flex" flexWrap="wrap" my={2}>
                    {place?.cuisine?.map(({ name }, index) => (
                        <Chip key={index} size="small" label={name} style={{ margin: '2px' }} />
                    ))}
                </Box>
                {place?.address && (
                    <Typography gutterBottom variant="subtitle2" color="textSecondary" style={{ marginTop: '10px' }}>
                        <LocationOnIcon /> {place.address}
                    </Typography>
                )}
                {place?.phone && (
                    <Typography variant="subtitle2" color="textSecondary">
                        <PhoneIcon /> {place.phone}
                    </Typography>
                )}
                <CardActions>
                    {place.web_url && (
                        <Button size="small" color="primary" onClick={() => window.open(place.web_url, '_blank')}>
                            Trip Advisor
                        </Button>
                    )}
                    {place.website && (
                        <Button size="small" color="primary" onClick={() => window.open(place.website, '_blank')}>
                            Website
                        </Button>
                    )}
                </CardActions>
            </CardContent>
        </Card>
    );
};

export default PlaceDetails;
