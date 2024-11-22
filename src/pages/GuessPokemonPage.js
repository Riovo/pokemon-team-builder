import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/GuessPokemonPage.css";

const GuessPokemonPage = () => {
    const [pokemon, setPokemon] = useState(null);
    const [guess, setGuess] = useState("");
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        fetchRandomPokemon();
    }, []);

    const fetchRandomPokemon = () => {
        const randomId = Math.floor(Math.random() * 150) + 1;
        axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`).then((res) => {
            setPokemon(res.data);
            setFeedback("");
        });
    };

    const checkGuess = () => {
        if (guess.toLowerCase() === pokemon.name) {
            setFeedback("Correct! 🎉");
            fetchRandomPokemon();
        } else {
            setFeedback("Try Again!");
        }
        setGuess("");
    };

    if (!pokemon) return <div>Loading...</div>;

    return (
        <div className="guess-pokemon-page">
            <h1>Guess That Pokémon!</h1>
            <div className="pokemon-shadow">
                <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    style={{ filter: "brightness(0)" }}
                />
            </div>
            <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter Pokémon Name"
            />
            <button onClick={checkGuess}>Submit</button>
            <p>{feedback}</p>
        </div>
    );
};

export default GuessPokemonPage;
