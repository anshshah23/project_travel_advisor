# Travel Advisor - Modern UI

A beautiful, modern travel advisor application built with React and Google Maps API.

## 🚀 Features

- **Modern UI**: Complete redesign with Material-UI v6+ components
- **Google Maps Integration**: Interactive maps with custom markers using `@react-google-maps/api`
- **Place Search**: Elastic search functionality with Google Places Autocomplete
- **Scroll-to-View**: Clicking a map marker automatically scrolls to the corresponding card
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Filter Options**: Filter by type (Restaurants, Hotels, Attractions) and rating
- **Beautiful Cards**: Modern card design with images, ratings, and detailed information

## 🔑 IMPORTANT: API Key Setup

**The Google Maps API key needs to be configured before running the app.**

### Get Your Google Maps API Key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Copy your API key

### Update the `.env` file:

```env
REACT_APP_GOOGLE_MAP_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

**⚠️ Note**: The existing API key in the code is expired. You MUST replace it with your own key.

## 📦 Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

## 🛠️ Technologies Used

- **React 18** - Latest React with createRoot API
- **Material-UI v6** - Modern component library with beautiful styling
- **@react-google-maps/api** - Official React wrapper for Google Maps
- **Axios** - HTTP client for API requests
- **TravelAdvisor API** - Places data from RapidAPI

## 📱 Features Breakdown

### 1. Interactive Map
- Click on markers to see place details
- Custom marker styling with theme colors
- Info windows on hover (desktop)
- Smooth animations and transitions

### 2. Smart Search
- Google Places Autocomplete integration
- Search for any location worldwide
- Automatic map centering on selected place

### 3. List View with Scroll-to
- When you click a marker on the map, the list automatically scrolls to that place
- Visual indication of selected card
- Smooth scroll animations

### 4. Filtering
- Filter by type: Restaurants, Hotels, or Attractions
- Filter by rating: All, 3+, 4+, or 4.5+
- Real-time filtering without reloading

## 🎨 UI Improvements

- Gradient header with modern styling
- Card hover effects and animations
- Custom scrollbar styling
- Loading states with spinners
- Responsive grid layout
- Theme-based color palette

## 📝 Notes

- The weather API has been removed due to API restrictions
- The app uses geolocation to get your current position
- If geolocation is denied, it defaults to New York City

## 🐛 Troubleshooting

### "ExpiredKeyMapError"
- Your Google Maps API key is expired or invalid
- Update the key in `.env` file
- Restart the development server after updating

### Map not loading
- Check console for API errors
- Verify all required APIs are enabled in Google Cloud Console
- Check billing is enabled (Google Maps requires it)

### Search not working
- Ensure Places API is enabled
- Check API key restrictions
- Verify autocomplete service is available

## 📄 License

MIT License - feel free to use this project for learning or personal use.
