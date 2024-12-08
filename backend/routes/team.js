const express = require('express');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

require('dotenv').config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);


// Add a new team
router.post('/add', protect, async (req, res) => {
    const { name, members } = req.body;

    if (!name || !members || members.length === 0) {
        return res.status(400).json({ message: 'Team name and members are required' }); // Validate input
    }

    try {
        const user = await User.findById(req.user.userId); // Find the user from the token
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // User not found error
        }

        if (user.teams.some((team) => team.name === name)) {
            return res.status(400).json({ message: 'Team name already exists' }); // Check for duplicate team name
        }

        user.teams.push({ name, members }); // Add the new team
        await user.save();

        res.status(201).json({ message: 'Team added successfully', teams: user.teams }); // Return success
    } catch (error) {
        console.error('Error adding team:', error);
        res.status(500).json({ message: 'Server error' }); // Server error
    }
});

// Fetch all saved teams for the user
router.get('/saved-teams', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); // Find the user from the token
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // User not found error
        }
        res.status(200).json({ teams: user.teams }); // Return the user's teams
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ message: 'Server error' }); // Server error
    }
});

// Delete a team by name
router.delete('/delete/:teamName', protect, async (req, res) => {
    const { teamName } = req.params;

    try {
        const user = await User.findById(req.user.userId); // Find the user from the token
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // User not found error
        }

        const teamIndex = user.teams.findIndex((team) => team.name === teamName); // Find team by name

        if (teamIndex === -1) {
            return res.status(404).json({ message: 'Team not found' }); // Team not found error
        }

        user.teams.splice(teamIndex, 1); // Remove the team
        await user.save();

        res.status(200).json({ message: 'Team deleted successfully', teams: user.teams }); // Return success
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ message: 'Server error' }); // Server error
    }
});

module.exports = router; // Export router to use in the server
