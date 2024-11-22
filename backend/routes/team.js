const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Pokemon = require('../models/Pokemon');
const protect = require('../middleware/authMiddleware');

// Add Pokémon to Team
router.post('/add', protect, async (req, res) => {
    const { pokemonId } = req.body; // Pokemon ID should be passed
    try {
        const user = await User.findById(req.user.userId);
        const pokemon = await Pokemon.findById(pokemonId);

        if (!pokemon) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }

        user.team.push(pokemon._id);
        await user.save();

        res.status(200).json({ message: 'Pokemon added to team', team: user.team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get User's Team
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('team');
        res.status(200).json(user.team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
