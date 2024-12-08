const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

require('dotenv').config(); // Load environment variables

// Register Route
router.post('/register', async (req, res) => {
    const { email, password, confirmPassword } = req.body; // Extract user input

    if (!email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' }); // Validate required fields
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' }); // Check if passwords match
    }

    try {
        const userExists = await User.findOne({ email }); // Check if user already exists
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' }); // User exists error
        }
        const user = new User({ email, password }); // Create a new user
        await user.save();

        // Create JWT token after successful registration
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully', token }); // Return success message with token
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later' }); // Return server error if something goes wrong
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // Extract user input

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' }); // Validate required fields
    }

    try {
        const user = await User.findOne({ email }); // Find user by email
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // User not found error
        }

        // Compare entered password with hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password); // Compare password
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' }); // Invalid credentials error
        }

        // Generate JWT token on successful login
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token }); // Return success message with token
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later' }); // Return server error if something goes wrong
    }
});

module.exports = router; // Export router to use in the server