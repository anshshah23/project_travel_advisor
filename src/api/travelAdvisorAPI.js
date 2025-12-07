import axios from 'axios';
import { apiCache, rateLimiter } from '../utils/apiCache';

export const getPlacesData = async (type, sw, ne, geoId = null) => {
  try {
    const bounds = { sw, ne };
    
    // Check cache first
    const cachedData = apiCache.get(type, bounds);
    if (cachedData) {
      return cachedData;
    }
    
    // Check rate limit
    const stats = rateLimiter.getStats();
    if (!rateLimiter.canMakeRequest()) {
      console.warn(`⚠️ Rate limit exceeded! ${stats.remaining}/${stats.limit} requests remaining. Reset in ${stats.resetInMinutes} minutes.`);
      
      // Show user-friendly message
      alert(`API rate limit reached (${stats.limit} requests per hour). Please wait ${stats.resetInMinutes} minutes or use cached data.`);
      
      return [];
    }
    
    console.log(`📡 API Request - ${stats.remaining - 1}/${stats.limit} remaining after this request`);
    
    // Use list-in-boundary for restaurants and attractions only
    const endpoint = `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`;
    const params = {
      bl_latitude: sw.lat,
      bl_longitude: sw.lng,
      tr_longitude: ne.lng,
      tr_latitude: ne.lat,
      currency: 'USD',
      lunit: 'km',
      lang: 'en_US'
    };
    
    console.log(`Fetching ${type} in boundary`);
    
    const response = await axios.get(endpoint, {
      params,
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_TRAVEL_API_KEY,
        'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
      },
    });
    
    // Record successful API call
    rateLimiter.recordRequest();
    
    const places = response.data?.data || [];
    console.log(`Found ${places.length} ${type}`, places.slice(0, 2).map(p => ({ 
      name: p.name, 
      location_id: p.location_id,
      rating: p.rating
    })));
    
    // Cache the results
    apiCache.set(type, bounds, places);
    
    return places;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error.response?.data || error.message);
    if (error.response) {
      console.error('API Response:', error.response.status, error.response.statusText);
    }
    return [];
  }
};

export const getWeatherData = async (lat, lng) => {
  try {
    if (lat && lng) {
      const { data } = await axios.get('https://community-open-weather-map.p.rapidapi.com/find', {
        params: { lat, lon: lng },
        headers: {
          'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_TRAVEL_API_KEY,
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
    const { data } = await axios.get(
      'https://travel-advisor.p.rapidapi.com/locations/auto-complete',
      {
        params: {
          query: query,
          lang: 'en_US',
          units: 'km'
        },
        headers: {
          'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_TRAVEL_API_KEY,
          'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        }
      }
    );

    // Parse the v1 API response structure
    const suggestions = (data?.data || [])
      .filter(item => {
        const obj = item.result_object || {};
        return obj.latitude && obj.longitude;
      })
      .map(item => {
        const obj = item.result_object || {};
        return {
          name: obj.name || '',
          address: obj.location_string || '',
          lat: Number(obj.latitude),
          lng: Number(obj.longitude),
          location_id: obj.location_id,
          geoId: obj.location_id
        };
      });

    return { data: suggestions };
  } catch (error) {
    console.error('Autocomplete error:', error);
    return { data: [] };
  }
};


