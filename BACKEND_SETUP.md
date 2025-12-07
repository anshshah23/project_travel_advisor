# Backend Setup Instructions

## Prerequisites
- MongoDB Atlas account (free tier available)
- Supabase account (free tier available)

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Click "Create a New Cluster" (select free tier M0)
4. Wait for cluster to be created (2-3 minutes)
5. Click "Connect" button
6. Add your IP address (or use 0.0.0.0/0 for any IP)
7. Create a database user with username and password
8. Select "Connect your application"
9. Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
10. Replace `<username>` and `<password>` with your credentials
11. Add the connection string to `.env` file as `MONGODB_URI`

## Step 2: Supabase Setup

1. Go to [Supabase](https://supabase.com/)
2. Create a free account or sign in
3. Click "New Project"
4. Fill in:
   - Project name: `travel-advisor` (or any name)
   - Database password: (create a strong password)
   - Region: (select closest to you)
5. Wait for project to be created (1-2 minutes)
6. Go to Project Settings → API
7. Copy the following:
   - Project URL → Add to `.env` as `SUPABASE_URL`
   - Project API keys → anon/public key → Add to `.env` as `SUPABASE_ANON_KEY`
8. Go to Authentication → Providers
9. Enable Email provider (should be on by default)

## Step 3: Environment Variables

Update your `.env` file with the values from above:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/travel-advisor?retryWrites=true&w=majority
JWT_SECRET=your-random-secret-key-min-32-characters
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-long-anon-key-here
```

For `JWT_SECRET`, generate a random string (at least 32 characters). You can use:
- Online generator: https://randomkeygen.com/
- Or PowerShell: `[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))`

## Step 4: Running the Backend

```powershell
# Start the backend server (from project root)
node server/index.js
```

The server will run on http://localhost:5000

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```

- **POST** `/api/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **GET** `/api/auth/me` - Get current user (requires token)

### Favorites
- **GET** `/api/favorites` - Get user's favorites (requires token)
- **POST** `/api/favorites/add` - Add to favorites (requires token)
  ```json
  {
    "geoId": "12345",
    "name": "Restaurant Name",
    "photo": "photo_url",
    "rating": 4.5,
    "numReviews": 150,
    "priceLevel": "$$",
    "address": "123 Main St",
    "phone": "+1234567890",
    "website": "https://example.com",
    "latitude": 40.7128,
    "longitude": -74.0060
  }
  ```
- **DELETE** `/api/favorites/remove/:geoId` - Remove from favorites (requires token)
- **GET** `/api/favorites/check/:geoId` - Check if favorited (requires token)

### Authorization Header
For protected routes, include JWT token:
```
Authorization: Bearer your-jwt-token-here
```

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string is correct
- Ensure IP whitelist includes your IP (or 0.0.0.0/0)
- Check username/password are URL-encoded
- Ensure cluster is running

### Supabase Issues
- Verify URL and anon key are correct
- Check email auth is enabled in Supabase dashboard
- Ensure project is not paused (free tier limitation)

### Server Won't Start
- Check all environment variables are set
- Ensure port 5000 is not in use
- Run `npm install` to ensure all dependencies are installed
