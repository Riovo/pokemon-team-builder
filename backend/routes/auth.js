
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

require('dotenv').config(); // Load environment variables

// Register Route
router.post('/register', async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    // Basic Validation
    if (!email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user without hashing the password
        const user = new User({ email, password }); // Store password as it is for testing
        await user.save();

        // Generate a token (you can skip token generation for now if you just want to test login)
        const token = 'test-jwt-token'; // Temporary token for testing purposes

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});



// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic Validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords directly (without hashing)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = 'test-jwt-token'; // Temporary token for testing purposes

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});





module.exports = router;
