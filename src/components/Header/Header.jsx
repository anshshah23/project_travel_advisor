import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  TextField, 
  InputAdornment,
  Autocomplete,
  styled,
  alpha,
  CircularProgress,
  Button,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../contexts/AuthContext';
import { getAutocompleteSuggestions } from '../../api/travelAdvisorAPI';

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    '& fieldset': {
      borderColor: alpha(theme.palette.common.white, 0.3),
    },
    '&:hover fieldset': {
      borderColor: alpha(theme.palette.common.white, 0.5),
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.common.white,
    },
  },
  '& .MuiOutlinedInput-input': {
    color: theme.palette.common.white,
    '&::placeholder': {
      color: alpha(theme.palette.common.white, 0.7),
      opacity: 1,
    },
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    color: theme.palette.common.white,
  },
  '& .MuiAutocomplete-popupIndicator': {
    color: theme.palette.common.white,
  },
  '& .MuiAutocomplete-clearIndicator': {
    color: theme.palette.common.white,
  },
}));

const Header = ({ onPlaceSelected }) => {
  const [searchValue, setSearchValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;
    
    if (searchValue && searchValue.length > 2) {
      setLoading(true);
      
      timeoutId = setTimeout(async () => {
        try {
          console.log('Searching for:', searchValue);
          const result = await getAutocompleteSuggestions(searchValue);
          console.log('Autocomplete API response:', result);
          
          if (result?.data && Array.isArray(result.data)) {
            console.log('Suggestions:', result.data);
            setOptions(result.data);
          } else {
            console.log('No data in result');
            setOptions([]);
          }
        } catch (error) {
          console.error('Error fetching autocomplete:', error);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      }, 500); // Debounce by 500ms
    } else {
      setOptions([]);
      setLoading(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [searchValue]);

  const handleInputChange = useCallback((event, newValue) => {
    setSearchValue(newValue);
  }, []);

  const handlePlaceSelect = useCallback((event, value) => {
    if (value && value.lat && value.lng) {
      // Send coordinates to parent to fetch places for that location
      onPlaceSelected({
        lat: value.lat,
        lng: value.lng,
        geoId: value.geoId,
        name: value.name
      });
    }
  }, [onPlaceSelected]);

  return (
    <AppBar position="static" elevation={3} sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}>
      <Toolbar sx={{ 
        py: 1,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 0 }
      }}>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
          <ExploreIcon sx={{ fontSize: 40, mr: 2 }} />
          <Box>
        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              Travel Advisor
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.9,
                display: { xs: 'none', sm: 'block' }
              }}
              >
              Discover amazing places around the world
            </Typography>
        </a>
          </Box>
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 400 }, ml: { sm: 2 }, mr: { sm: 2 } }}>
          <Autocomplete
            freeSolo
            options={options}
            loading={loading}
            getOptionLabel={(option) => 
              typeof option === 'string' ? option : option.name
            }
            inputValue={searchValue}
            onInputChange={handleInputChange}
            onChange={handlePlaceSelect}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="body2">{option.name}</Typography>
                  {option.address && (
                    <Typography variant="caption" color="text.secondary">
                      {option.address}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <SearchTextField
                {...params}
                placeholder="Search places (e.g., Eiffel Tower, Paris)..."
                size="small"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {user ? (
            <>
              <Button 
                color="inherit" 
                startIcon={<FavoriteIcon />}
                onClick={() => navigate('/favorites')}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                Favorites
              </Button>
              <IconButton 
                color="inherit" 
                onClick={() => navigate('/favorites')}
                sx={{ display: { xs: 'flex', sm: 'none' } }}
              >
                <FavoriteIcon />
              </IconButton>
              <Button 
                color="inherit" 
                startIcon={<LogoutIcon />}
                onClick={logout}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                Logout
              </Button>
              <IconButton 
                color="inherit" 
                onClick={logout}
                sx={{ display: { xs: 'flex', sm: 'none' } }}
              >
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;