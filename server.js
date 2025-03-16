require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleAuth } = require('google-auth-library');
const app = express();

const PORT = process.env.PORT || 3000;
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || 'texttovoicehindi';
let ACCESS_TOKEN = ''; // Will be updated by refreshAccessToken

// Google Auth setup
const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

// Function to refresh access token
async function refreshAccessToken() {
  try {
    const client = await auth.getClient();
    const { token } = await client.getAccessToken();
    ACCESS_TOKEN = token;
    console.log('Access token refreshed:', token);
    return token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to expose project ID and access token
app.get('/config', async (req, res) => {
  if (!ACCESS_TOKEN) {
    await refreshAccessToken();
  }
  res.json({
    projectId: PROJECT_ID,
    accessToken: ACCESS_TOKEN || 'Token not available'
  });
});

// Refresh token on startup and every hour (tokens typically last 1 hour)
refreshAccessToken().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
setInterval(refreshAccessToken, 60 * 60 * 1000); // Refresh every hour
