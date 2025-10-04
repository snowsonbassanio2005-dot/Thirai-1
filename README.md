# Netflix Clone

A fully functional Netflix clone built with HTML, CSS, JavaScript, and Netlify Functions. Features movie browsing by genre, user authentication, and responsive design.

## Features

- 🎬 Movie browsing by genre (AI, Food, Drama, Horror, Comedy)
- 🔐 User authentication (Login/Signup)
- 📱 Responsive design for desktop and mobile
- 🎥 Hero section with video background
- 🖼️ Movie posters with hover effects
- 🔒 Secure API key handling via Netlify Functions
- 🎯 TMDb API integration

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Netlify Functions (Node.js)
- **API**: The Movie Database (TMDb)
- **Deployment**: Netlify

## Project Structure

```
netflix-clone/
├── index.html              # Main HTML file
├── style.css              # CSS styles
├── script.js              # JavaScript functionality
├── netlify.toml           # Netlify configuration
├── package.json           # Dependencies
├── README.md              # This file
└── netlify/
    └── functions/
        ├── tmdb.js        # TMDb API proxy
        └── auth.js        # Authentication handler
```

## Setup Instructions

### 1. Get TMDb API Key

1. Go to [TMDb](https://www.themoviedb.org/)
2. Create an account
3. Go to Settings > API
4. Request an API key
5. Copy your API key

### 2. Deploy to Netlify

#### Option A: Drag & Drop Deployment

1. Download all project files
2. Create a ZIP file of the project
3. Go to [Netlify](https://netlify.com)
4. Sign up/Login
5. Drag and drop the ZIP file to deploy
6. Go to Site Settings > Environment Variables
7. Add `TMDB_API_KEY` with your TMDb API key
8. Redeploy the site

#### Option B: GitHub Deployment

1. Create a new repository on GitHub
2. Upload all project files to the repository
3. Go to [Netlify](https://netlify.com)
4. Click "New site from Git"
5. Connect your GitHub account
6. Select your repository
7. Set build command: `echo 'No build step required'`
8. Set publish directory: `.`
9. Click "Deploy site"
10. Go to Site Settings > Environment Variables
11. Add `TMDB_API_KEY` with your TMDb API key
12. Go to Deploys and click "Trigger deploy"

### 3. Environment Variables

Make sure to set the following environment variable in Netlify:

- `TMDB_API_KEY`: Your TMDb API key

## Local Development

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variable:
   ```bash
   netlify env:set TMDB_API_KEY your_api_key_here
   ```

4. Start local development server:
   ```bash
   netlify dev
   ```

5. Open http://localhost:8888 in your browser

## API Endpoints

### TMDb Proxy
- `GET /.netlify/functions/tmdb?genre={genreId}`
- Fetches movies by genre from TMDb API

### Authentication
- `POST /.netlify/functions/auth`
- Handles user login and signup

## Genres

- AI Movies (878)
- Food Movies (528)
- Drama (18)
- Horror (27)
- Comedy (35)

## Features in Detail

### Movie Browsing
- Horizontal scrollable movie rows
- Movie posters with hover effects
- Genre-based organization
- Responsive design

### Authentication
- User registration with email validation
- Secure login system
- Session management with localStorage
- Form validation

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Adaptive layouts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Features

- API keys stored securely in environment variables
- CORS headers configured
- Input validation and sanitization
- Secure authentication flow

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

---

**Note**: This is a demo project. In production, you would want to implement proper password hashing, database storage, and additional security measures.

