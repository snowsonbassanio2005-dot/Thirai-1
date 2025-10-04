const fetch = require('node-fetch');

// Simple in-memory storage for demo purposes
// In production, you would use a proper database
let users = [];

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
        const { action, name, email, password } = JSON.parse(event.body);

        if (action === 'signup') {
            return await handleSignup(name, email, password, headers);
        } else if (action === 'login') {
            return await handleLogin(email, password, headers);
        } else {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    message: 'Invalid action' 
                }),
            };
        }

    } catch (error) {
        console.error('Auth error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false, 
                message: 'Server error' 
            }),
        };
    }
};

async function handleSignup(name, email, password, headers) {
    // Validate input
    if (!name || !email || !password) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ 
                success: false, 
                message: 'All fields are required' 
            }),
        };
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ 
                success: false, 
                message: 'User already exists' 
            }),
        };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ 
                success: false, 
                message: 'Invalid email format' 
            }),
        };
    }

    // Validate password strength
    if (password.length < 6) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ 
                success: false, 
                message: 'Password must be at least 6 characters long' 
            }),
        };
    }

    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password, // In production, hash this password
        createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ 
            success: true, 
            user: userWithoutPassword,
            message: 'User created successfully' 
        }),
    };
}

async function handleLogin(email, password, headers) {
    // Validate input
    if (!email || !password) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ 
                success: false, 
                message: 'Email and password are required' 
            }),
        };
    }

    // Find user
    const user = users.find(u => u.email === email.toLowerCase().trim());
    
    if (!user) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ 
                success: false, 
                message: 'Invalid email or password' 
            }),
        };
    }

    // Check password (in production, compare hashed passwords)
    if (user.password !== password) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ 
                success: false, 
                message: 'Invalid email or password' 
            }),
        };
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
            success: true, 
            user: userWithoutPassword,
            message: 'Login successful' 
        }),
    };
}

