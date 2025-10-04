// Global variables
let currentUser = null;
const genres = {
    'ai': { id: 878, name: 'AI Movies', element: 'ai-movies' },
    'food': { id: 528, name: 'Food Movies', element: 'food-movies' },
    'drama': { id: 18, name: 'Drama', element: 'drama-movies' },
    'horror': { id: 27, name: 'Horror', element: 'horror-movies' },
    'comedy': { id: 35, name: 'Comedy', element: 'comedy-movies' }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadMovies();
});

// Initialize app
function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('netflixUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateNavForLoggedInUser();
    }
    
    // Setup navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Signup form
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const loginModal = document.getElementById('loginModal');
        const signupModal = document.getElementById('signupModal');
        const moviePreview = document.getElementById('moviePreview');
        
        if (event.target === loginModal) {
            closeLoginModal();
        }
        if (event.target === signupModal) {
            closeSignupModal();
        }
        if (event.target === moviePreview) {
            closeMoviePreview();
        }
    });
}

// Handle navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Load movies for all genres
async function loadMovies() {
    for (const [key, genre] of Object.entries(genres)) {
        try {
            await loadMoviesByGenre(genre.id, genre.element);
        } catch (error) {
            console.error(`Error loading ${genre.name}:`, error);
            showError(genre.element, `Failed to load ${genre.name}`);
        }
    }
}

// Load movies by genre
async function loadMoviesByGenre(genreId, containerId) {
    const container = document.getElementById(containerId);
    
    try {
        console.log(`Fetching movies for genre ${genreId}...`);
        const response = await fetch(`/.netlify/functions/tmdb?genre=${genreId}`);
        
        console.log(`Response status: ${response.status}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log(`Received data for genre ${genreId}:`, data);
        
        if (data.results && data.results.length > 0) {
            displayMovies(data.results, container);
        } else {
            showError(containerId, 'No movies found');
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
        showError(containerId, `Failed to load movies: ${error.message}`);
    }
}

// Display movies in container
function displayMovies(movies, containerId) {
    const containerElement = document.getElementById(containerId);
    
    if (!containerElement) {
        console.error(`Container with ID '${containerId}' not found`);
        return;
    }
    
    containerElement.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        containerElement.appendChild(movieCard);
    });
}

// Create movie card element
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.onclick = () => showMoviePreview(movie);
    
    const poster = document.createElement('img');
    poster.className = 'movie-poster';
    poster.src = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/200x300/333/fff?text=No+Image';
    poster.alt = movie.title;
    poster.loading = 'lazy';
    
    const info = document.createElement('div');
    info.className = 'movie-info';
    
    const title = document.createElement('h3');
    title.className = 'movie-title';
    title.textContent = movie.title;
    
    const overview = document.createElement('p');
    overview.className = 'movie-overview';
    overview.textContent = movie.overview || 'No description available';
    
    info.appendChild(title);
    info.appendChild(overview);
    
    card.appendChild(poster);
    card.appendChild(info);
    
    return card;
}

// Show movie preview modal
function showMoviePreview(movie) {
    const modal = document.getElementById('moviePreview');
    const video = document.getElementById('previewVideo');
    const title = document.getElementById('previewTitle');
    const overview = document.getElementById('previewOverview');
    
    // Set movie info
    title.textContent = movie.title;
    overview.textContent = movie.overview || 'No description available';
    
    // Try to load a preview video (using placeholder for demo)
    video.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    video.play();
    
    modal.style.display = 'block';
}

// Close movie preview modal
function closeMoviePreview() {
    const modal = document.getElementById('moviePreview');
    const video = document.getElementById('previewVideo');
    
    video.pause();
    video.currentTime = 0;
    modal.style.display = 'none';
}

// Show error message
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container with ID '${containerId}' not found for error display`);
        return;
    }
    
    container.innerHTML = `<div class="error">${message}</div>`;
}

// Modal functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.getElementById('signupModal').style.display = 'none';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function openSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
    document.getElementById('loginModal').style.display = 'none';
}

function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
}

function switchToSignup() {
    closeLoginModal();
    openSignupModal();
}

function switchToLogin() {
    closeSignupModal();
    openLoginModal();
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/.netlify/functions/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'login',
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('netflixUser', JSON.stringify(currentUser));
            updateNavForLoggedInUser();
            closeLoginModal();
            showSuccess('Login successful!');
        } else {
            showError('loginForm', data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('loginForm', 'Login failed. Please try again.');
    }
}

// Handle signup
async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
        const response = await fetch('/.netlify/functions/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'signup',
                name: name,
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('netflixUser', JSON.stringify(currentUser));
            updateNavForLoggedInUser();
            closeSignupModal();
            showSuccess('Account created successfully!');
        } else {
            showError('signupForm', data.message || 'Signup failed');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showError('signupForm', 'Signup failed. Please try again.');
    }
}

// Update navigation for logged in user
function updateNavForLoggedInUser() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.innerHTML = `
        <span>Welcome, ${currentUser.name}!</span>
        <button class="login-btn" onclick="logout()">Logout</button>
    `;
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('netflixUser');
    location.reload();
}

// Show success message
function showSuccess(message) {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    successDiv.style.position = 'fixed';
    successDiv.style.top = '20px';
    successDiv.style.right = '20px';
    successDiv.style.zIndex = '3000';
    successDiv.style.padding = '15px 20px';
    successDiv.style.backgroundColor = '#4CAF50';
    successDiv.style.color = 'white';
    successDiv.style.borderRadius = '4px';
    successDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        document.body.removeChild(successDiv);
    }, 3000);
}

// Show error message in form
function showError(formId, message) {
    const form = document.getElementById(formId);
    let errorDiv = form.querySelector('.error-message');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#e50914';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.marginTop = '10px';
        form.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    
    setTimeout(() => {
        if (errorDiv && errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Smooth scrolling for movie rows
function setupSmoothScrolling() {
    const movieRows = document.querySelectorAll('.movies-row');
    
    movieRows.forEach(row => {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        row.addEventListener('mousedown', (e) => {
            isDown = true;
            row.style.cursor = 'grabbing';
            startX = e.pageX - row.offsetLeft;
            scrollLeft = row.scrollLeft;
        });
        
        row.addEventListener('mouseleave', () => {
            isDown = false;
            row.style.cursor = 'grab';
        });
        
        row.addEventListener('mouseup', () => {
            isDown = false;
            row.style.cursor = 'grab';
        });
        
        row.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - row.offsetLeft;
            const walk = (x - startX) * 2;
            row.scrollLeft = scrollLeft - walk;
        });
    });
}

// Initialize smooth scrolling after movies are loaded
setTimeout(setupSmoothScrolling, 2000);

