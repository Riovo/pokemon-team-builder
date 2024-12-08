import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/AuthPage.css';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState(''); // Store email input
    const [password, setPassword] = useState(''); // Store password input
    const [error, setError] = useState(null); // Store error message
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure email and password are being sent correctly
            const loginData = { email, password };
            const response = await axios.post('http://localhost:5000/api/auth/login', loginData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Store JWT token and email in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userEmail', email);  // Store email to identify the user in future requests

            // Set login state in parent component
            onLogin();
            navigate('/');  // Redirect to home page or dashboard
        } catch (error) {
            // Debugging 
            console.log('Login Error:', error);
            // Handle errors (e.g. invalid credentials)
            if (error.response) {
                setError(error.response.data.message || 'Something went wrong');
            } else {
                setError('Network error. Please try again later.');
            }
        }
    };

    return (
        <div className="auth-page">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Handle email change
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Handle password change
                    required
                />
                {error && <p className="error-message">{error}</p>} {/* Display error if exists */}
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <a href="/register">Register here</a> {/* Link to Register page */}
            </p>
        </div>
    );
};

export default LoginPage; // Export LoginPage component