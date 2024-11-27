const mongoose = require('mongoose');

// Pokemon Schema
const pokemonSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Pokémon name (must be unique)
    type: { type: [String], required: true },  // Allow multiple types (e.g., Water, Flying)
    abilities: { type: [String], required: true },  // Pokémon can have multiple abilities
    moves: [
        {
            moveName: { type: String, required: true }, // Name of the move (e.g., Flamethrower)
            power: { type: Number, required: true },    // Move power (e.g., 90)
            accuracy: { type: Number, required: true }, // Accuracy of the move (e.g., 100)
            pp: { type: Number, required: true },       // Power points for the move (e.g., 10)
        }
    ],
    stats: {
        hp: { type: Number, required: true },           // HP (e.g., 100)
        attack: { type: Number, required: true },       // Attack stat (e.g., 50)
        defense: { type: Number, required: true },      // Defense stat (e.g., 50)
        specialAttack: { type: Number, required: true },// Special Attack stat (e.g., 60)
        specialDefense: { type: Number, required: true }, // Special Defense stat (e.g., 60)
        speed: { type: Number, required: true },        // Speed stat (e.g., 55)
    }
});

// Index to make the Pokémon name unique
pokemonSchema.index({ name: 1 }, { unique: true });

// Create the Pokémon model using the schema
const Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = Pokemon;
