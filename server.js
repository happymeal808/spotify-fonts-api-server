// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all requests
app.use(cors());
app.options('*', cors());

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Google Fonts endpoint
console.log('GOOGLE_FONTS_API_KEY:', process.env.GOOGLE_FONTS_API_KEY);
app.get('/api/fonts', async (req, res) => {
  try {
    const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${process.env.GOOGLE_FONTS_API_KEY}`);
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch (error) {
    console.error('Error fetching fonts:', error);
    res.status(500).json({ error: 'Failed to fetch fonts' });
  }
});

// Spotify Token endpoint
app.get('/api/spotify-token', async (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();
    console.log('Spotify Token:', tokenData.access_token);  // Log the access token for debugging

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ access_token: tokenData.access_token });
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    res.status(500).json({ error: 'Failed to fetch Spotify token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
