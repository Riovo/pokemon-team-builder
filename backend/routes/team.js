const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Add Pokémon to Team
router.post('/add', protect, async (req, res) => {
    const { team } = req.body; // team is an array of Pokémon names (not ObjectId initially)
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch Pokémon details from PokeAPI using the provided names
        const pokemonList = await Promise.all(
            team.map(async (pokemonName) => {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
                return {
                    id: response.data.id,
                    name: response.data.name,
                    types: response.data.types.map(type => type.type.name),
                    abilities: response.data.abilities.map(ability => ability.ability.name),
                    stats: response.data.stats.map(stat => ({
                        name: stat.stat.name,
                        value: stat.base_stat,
                    })),
                    image: response.data.sprites.other['official-artwork'].front_default
                };
            })
        );

        // Check if all the Pokémon were found
        if (pokemonList.length !== team.length) {
            return res.status(404).json({ message: 'Some Pokémon were not found' });
        }

        // Save the Pokémon data into the user's team
        user.team = pokemonList; // Save full Pokémon details, not just IDs
        await user.save();

        res.status(200).json({ message: 'Team saved successfully', team: user.team });
    } catch (error) {
        console.error("Error saving team: ", error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

// Fetch user's saved teams and populate Pokémon details from the database
router.get("/saved-teams", protect, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the populated Pokémon details (team with full data)
        res.status(200).json({ teams: user.team });
    } catch (error) {
        console.error("Error fetching teams:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;