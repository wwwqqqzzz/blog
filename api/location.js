// Vercel Serverless Function for getting user location
// This function uses a free IP geolocation API to get the user's location

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the user's IP address
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Use a free IP geolocation API
    const apiUrl = `https://ipapi.co/${ip}/json/`;
    
    // Fetch location data
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Return the location data
    return res.status(200).json({
      city: data.city,
      region: data.region,
      country: data.country_name,
      latitude: data.latitude,
      longitude: data.longitude
    });
  } catch (error) {
    console.error('Error fetching location data:', error);
    return res.status(500).json({ error: 'Failed to fetch location data' });
  }
}
