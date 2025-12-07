# 🚀 How to Run the Travel Advisor Application

## Prerequisites
✅ Node.js installed (v16 or higher)
✅ MongoDB Atlas account with cluster created
✅ Supabase project created
✅ Environment variables configured in `.env`

---

## 🎯 Quick Start (Two Terminal Method)

### Terminal 1: Start Backend Server
```powershell
# Navigate to server directory
cd server

# Install dependencies (first time only)
npm install

# Start the backend server
npm start
```

**Expected Output:**
```
Server is running on port 5000
MongoDB connected successfully
```

### Terminal 2: Start Frontend App
```powershell
# Open a NEW terminal in the project root
# If React dev server asks about port conflict, choose 'Y' to use another port
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view travel_advisor in the browser.
Local: http://localhost:3000 (or another port if 3000 is busy)
```

---

## 🎯 Alternative: Run from Project Root

### Backend Only
```powershell
cd server
npm install
npm start
```

### Frontend Only
```powershell
# From project root
npm start
```

---

## 📋 First Time Setup Checklist

### 1. Install Backend Dependencies
```powershell
cd server
npm install
cd ..
```

### 2. Install Frontend Dependencies (if not done)
```powershell
npm install
```

### 3. Verify Environment Variables
Check that your `.env` file has all required values:
- ✅ REACT_APP_GOOGLE_MAP_API_KEY
- ✅ REACT_APP_RAPIDAPI_TRAVEL_API_KEY
- ✅ REACT_APP_API_URL=http://localhost:5000/api
- ✅ REACT_APP_SUPABASE_URL
- ✅ REACT_APP_SUPABASE_ANON_KEY
- ✅ MONGODB_URI
- ✅ JWT_SECRET
- ✅ PORT=5000
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY

### 4. Test Backend Connection
```powershell
# After starting backend, test health check
# Open browser to: http://localhost:5000/api/health
# Should return: {"status":"OK","message":"Server is running"}
```

---

## 🔍 Testing the Application

### 1. Test Frontend
- Open `http://localhost:3000`
- You should see the Travel Advisor homepage with map and search

### 2. Test Authentication
- Click "Login" button in header
- Click "Register here" link
- Create a new account:
  - Name: Your Name
  - Email: test@example.com
  - Password: test123456 (min 6 chars)
- You should be redirected to homepage
- Header should show "Favorites" and "Logout" buttons

### 3. Test Search
- Type a location in the search bar (e.g., "Paris")
- Select a location from dropdown
- Map should move to that location
- Places should load in the list

### 4. Test Favorites
- Hover over any place card
- Click the heart icon (❤️) in the top-right corner
- Heart should turn red (favorited)
- Click "Favorites" button in header
- You should see your saved place

### 5. Test Mobile View
- Resize browser to mobile width (< 900px)
- You should see either List OR Map
- Click "Show Map" / "Show List" button to toggle
- Both buttons should work smoothly

---

## 🐛 Troubleshooting

### Backend won't start
**Problem:** Port 5000 already in use
**Solution:** 
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
# Note the PID number
taskkill /PID <PID_NUMBER> /F
# Or change PORT in .env to 5001
```

**Problem:** MongoDB connection error
**Solution:**
- Check MONGODB_URI in `.env`
- Verify MongoDB Atlas IP whitelist includes your IP
- Ensure password doesn't contain special characters (URL encode if needed)

**Problem:** Module not found errors
**Solution:**
```powershell
cd server
rm -rf node_modules
npm install
```

### Frontend won't start
**Problem:** Port 3000 already in use
**Solution:** 
- Choose 'Y' when prompted to use different port
- Or kill the process:
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

**Problem:** API calls failing (404 errors)
**Solution:**
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in `.env` is `http://localhost:5000/api`
- Restart React app after changing `.env`: `npm start`

**Problem:** Authentication not working
**Solution:**
- Verify Supabase URL and anon key in `.env`
- Check Supabase project is active (not paused)
- Ensure Email auth is enabled in Supabase dashboard

### Favorites not working
**Problem:** Heart icon doesn't change
**Solution:**
- Make sure you're logged in
- Check browser console for errors
- Verify backend is running
- Check MongoDB connection

**Problem:** "Remove from favorites" not working
**Solution:**
- Check network tab in browser DevTools
- Ensure token is being sent in request headers
- Verify MongoDB has write permissions

---

## 📦 Project Structure

```
project_travel_advisor/
├── server/                    # Backend API
│   ├── index.js              # Express server entry
│   ├── models/
│   │   └── User.js           # MongoDB User schema
│   ├── routes/
│   │   ├── auth.js           # Login/Register routes
│   │   └── favorites.js      # Favorites CRUD routes
│   └── package.json          # Backend dependencies
│
├── src/                       # Frontend React app
│   ├── App.js                # Main app with routing
│   ├── contexts/
│   │   └── AuthContext.js    # Auth state management
│   ├── pages/
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx      # Register page
│   │   └── Favorites.jsx     # Favorites page
│   ├── components/
│   │   ├── Header/           # Search + Navigation
│   │   ├── List/             # Places list
│   │   ├── Map/              # Google Maps
│   │   └── PlaceDetails/     # Place card with ❤️
│   └── api/
│       └── travelAdvisorAPI.js  # RapidAPI integration
│
├── .env                       # Environment variables
└── package.json              # Frontend dependencies
```

---

## 🎨 Key Features Implemented

✅ **Authentication System**
- User registration with Supabase Auth
- Secure login with JWT tokens
- Protected routes
- Session persistence

✅ **Favorites System**
- Add/remove favorites with heart icon
- MongoDB storage
- Favorites page to view all saved places
- Real-time favorite status

✅ **Responsive Design**
- Mobile toggle between list/map view
- Adaptive header (icons on mobile)
- Touch-friendly UI

✅ **Search & Discovery**
- Google Maps integration
- RapidAPI autocomplete
- Real-time place search
- Rating filters

✅ **UI/UX**
- Scroll-to-top button
- Loading states
- Error handling
- Blue gradient theme

---

## 🚧 Remaining Tasks

### Task 6: Place Details Page (Optional)
Create a dedicated page for full place details with:
- Larger images
- Reviews section
- Extended information
- Embedded map

### Task 7: Tailwind Migration (Optional)
- Replace Material-UI with Tailwind CSS
- Maintain all current functionality
- Keep blue theme and responsive design

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Favorites (Requires Authentication)
- `GET /api/favorites` - Get all favorites
- `POST /api/favorites/add` - Add to favorites
- `DELETE /api/favorites/remove/:geoId` - Remove favorite
- `GET /api/favorites/check/:geoId` - Check if favorited

---

## 🔐 Security Notes

- JWT tokens expire after 7 days
- Passwords hashed with bcrypt
- CORS enabled for localhost
- API keys in `.env` only
- Never commit `.env` to git

---

## 💡 Tips

1. **Keep both terminals open** - Backend and frontend must run simultaneously
2. **Check MongoDB Atlas** - Ensure cluster isn't paused (free tier limitation)
3. **Clear browser cache** - If seeing old data after updates
4. **Use DevTools** - Network tab for API debugging, Console for errors
5. **Restart servers** - After changing `.env` variables

---

## ✨ Success Indicators

When everything is working:
- ✅ Backend shows "MongoDB connected successfully"
- ✅ Frontend opens at `http://localhost:3000`
- ✅ Search works and shows autocomplete
- ✅ Map displays and moves with search
- ✅ Can register and login
- ✅ Heart icon works on place cards
- ✅ Favorites page displays saved places
- ✅ Mobile toggle button appears on small screens

---

**Enjoy your Travel Advisor app! 🗺️✈️**
