const mongoose = require('mongoose');

// Pokemon Schema
const pokemonSchema = new mongoose.Schema({
    name: String,
    type: String,
    abilities: [String], // Can store multiple abilities for each pokemon
    stats: {
        hp: Number,
        attack: Number,
        defense: Number,
        specialAttack: Number,
        specialDefense: Number,
        speed: Number
    }
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = Pokemon;
