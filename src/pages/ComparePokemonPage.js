import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/ComparePokemonPage.css";

const ComparePokemonPage = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [firstPokemon, setFirstPokemon] = useState(null);
    const [secondPokemon, setSecondPokemon] = useState(null);

    useEffect(() => {
        axios.get("https://pokeapi.co/api/v2/pokemon?limit=150").then((res) => {
            setPokemonList(res.data.results);
        });
    }, []);

    const fetchPokemonData = (name, setPokemon) => {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`).then((res) => {
            setPokemon(res.data);
        });
    };

    return (
        <div className="compare-page">
            <h1>Compare Pokémon</h1>
            <div className="compare-select">
                <select onChange={(e) => fetchPokemonData(e.target.value, setFirstPokemon)}>
                    <option value="">Select First Pokémon</option>
                    {pokemonList.map((p) => (
                        <option key={p.name} value={p.name}>
                            {p.name.toUpperCase()}
                        </option>
                    ))}
                </select>
                <select onChange={(e) => fetchPokemonData(e.target.value, setSecondPokemon)}>
                    <option value="">Select Second Pokémon</option>
                    {pokemonList.map((p) => (
                        <option key={p.name} value={p.name}>
                            {p.name.toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>
            <div className="comparison">
                {firstPokemon && (
                    <div className="pokemon-card">
                        <h2>{firstPokemon.name.toUpperCase()}</h2>
                        <img src={firstPokemon.sprites.front_default} alt={firstPokemon.name} />
                        <p>HP: {firstPokemon.stats[0].base_stat}</p>
                        <p>Attack: {firstPokemon.stats[1].base_stat}</p>
                        <p>Defense: {firstPokemon.stats[2].base_stat}</p>
                        <p>Speed: {firstPokemon.stats[5].base_stat}</p>
                    </div>
                )}
                {secondPokemon && (
                    <div className="pokemon-card">
                        <h2>{secondPokemon.name.toUpperCase()}</h2>
                        <img src={secondPokemon.sprites.front_default} alt={secondPokemon.name} />
                        <p>HP: {secondPokemon.stats[0].base_stat}</p>
                        <p>Attack: {secondPokemon.stats[1].base_stat}</p>
                        <p>Defense: {secondPokemon.stats[2].base_stat}</p>
                        <p>Speed: {secondPokemon.stats[5].base_stat}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComparePokemonPage;
