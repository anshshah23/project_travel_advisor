import axios from 'axios';

export const getPlacesData = async (type, sw, ne) => {
  try {
    const endpoint = type === 'hotels' 
      ? 'https://travel-advisor.p.rapidapi.com/hotels/v2/list'
      : `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`;
    
    let response;
    
    if (type === 'hotels') {
      // POST request for hotels
      response = await axios.post(
        `${endpoint}?currency=USD&units=km&lang=en_US`,
        {
          boundingBox: {
            northEastCorner: {
              latitude: ne.lat,
              longitude: ne.lng
            },
            southWestCorner: {
              latitude: sw.lat,
              longitude: sw.lng
            }
          },
          updateToken: ""
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_TRAVEL_API_KEY || '7e30ce8b94msh2f566c88a27ea8fp14517bjsnf0e3b114ef98',
            'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
          }
        }
      );
      return response.data?.data?.data || [];
    } else {
      // GET request for restaurants and attractions
      response = await axios.get(endpoint, {
        params: {
          bl_latitude: sw.lat,
          bl_longitude: sw.lng,
          tr_longitude: ne.lng,
          tr_latitude: ne.lat,
        },
        headers: {
          'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_TRAVEL_API_KEY || '7e30ce8b94msh2f566c88a27ea8fp14517bjsnf0e3b114ef98',
          'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        },
      });
      return response.data?.data || [];
    }
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
};

export const getWeatherData = async (lat, lng) => {
  try {
    if (lat && lng) {
      const { data } = await axios.get('https://community-open-weather-map.p.rapidapi.com/find', {
        params: { lat, lon: lng },
        headers: {
          'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_TRAVEL_API_KEY || '7e30ce8b94msh2f566c88a27ea8fp14517bjsnf0e3b114ef98',
          'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
        },
      });

      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAutocompleteSuggestions = async (query) => {
  try {
    const { data } = await axios.post(
      'https://travel-advisor.p.rapidapi.com/locations/v2/search?currency=USD&units=km&lang=en_US',
      {
        query: query,
        updateToken: ""
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_TRAVEL_API_KEY || '7e30ce8b94msh2f566c88a27ea8fp14517bjsnf0e3b114ef98',
          'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        }
      }
    );

    return data;
  } catch (error) {
    console.error('Autocomplete error:', error);
    return { data: [] };
  }
};

export const searchPlacesByLocation = async (geoId, type = 'restaurants') => {
  try {
    // This function can be used to get places for a specific geoId from search
    const endpoint = type === 'hotels'
      ? 'https://travel-advisor.p.rapidapi.com/hotels/v2/list'
      : `https://travel-advisor.p.rapidapi.com/${type}/list`;
    
    const { data } = await axios.post(
      `${endpoint}?currency=USD&units=km&lang=en_US`,
      {
        geoId: geoId,
        updateToken: ""
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_TRAVEL_API_KEY || '7e30ce8b94msh2f566c88a27ea8fp14517bjsnf0e3b114ef98',
          'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        }
      }
    );
    
    return data?.data?.data || [];
  } catch (error) {
    console.error('Error searching places by location:', error);
    return [];
  }
};
