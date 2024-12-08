const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema with email, password, and teams
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Email should be unique
    password: { type: String, required: true }, // Password field
    teams: [ // Teams array to store user's Pokémon teams
        {
            name: { type: String, required: true }, // Team name
            members: [
                {
                    id: { type: Number, required: true }, // Pokémon ID
                    name: { type: String, required: true }, // Pokémon name
                    types: { type: [String], required: true }, // Pokémon types
                    image: { type: String, required: true }, // Image URL
                    stats: { type: Object, required: true }, // Pokémon stats stored as an object
                },
            ],
        },
    ],
});

// Pre-save middleware to hash the password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) { // Check if password was modified
        const salt = await bcrypt.genSalt(10); // Generate salt for hashing
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
    }
    next(); // Continue to save the user
});

const User = mongoose.model('User', userSchema); // Create the User model

module.exports = User; // Export the User model