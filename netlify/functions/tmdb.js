const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    try {
        // Get API key from environment variables
        const apiKey = process.env.TMDB_API_KEY;
        
        console.log('TMDB_API_KEY exists:', !!apiKey);
        
        if (!apiKey) {
            console.error('TMDB API key not configured');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'TMDB API key not configured' }),
            };
        }

        // Get genre from query parameters
        const { genre } = event.queryStringParameters || {};
        
        console.log('Genre parameter:', genre);
        
        if (!genre) {
            console.error('No genre parameter provided');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Genre parameter is required' }),
            };
        }

        // Validate genre ID
        const validGenres = [878, 528, 18, 27, 35]; // AI, Food, Drama, Horror, Comedy
        if (!validGenres.includes(parseInt(genre))) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid genre ID' }),
            };
        }

        // Fetch movies from TMDb API
        const tmdbUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&sort_by=popularity.desc&page=1&language=en-US`;
        
        const response = await fetch(tmdbUrl);
        
        if (!response.ok) {
            throw new Error(`TMDb API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the data
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error('Error fetching movies:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to fetch movies',
                details: error.message 
            }),
        };
    }
};

