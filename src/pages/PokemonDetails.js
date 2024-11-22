import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/PokemonDetails.css";

const PokemonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState(null);
    const [weaknesses, setWeaknesses] = useState([]);
    const [evolutionChain, setEvolutionChain] = useState([]);
    const [hatchTime, setHatchTime] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true); // Ensure loading state is visible while fetching data
        axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`).then((response) => {
            setPokemon(response.data);

            // Fetch type weaknesses
            const types = response.data.types.map((t) => t.type.url);
            Promise.all(types.map((url) => axios.get(url))).then((responses) => {
                const allWeaknesses = responses.flatMap((res) =>
                    res.data.damage_relations.double_damage_from.map((type) => type.name)
                );
                setWeaknesses([...new Set(allWeaknesses)]); // Remove duplicates
            });

            // Fetch species data
            axios.get(response.data.species.url).then((speciesResponse) => {
                const eggCycles = speciesResponse.data.egg_groups.includes("Undiscovered")
                    ? "Cannot Hatch"
                    : speciesResponse.data.hatch_counter * 257;
                setHatchTime(eggCycles);

                axios.get(speciesResponse.data.evolution_chain.url).then((evolutionResponse) => {
                    const chain = [];
                    let current = evolutionResponse.data.chain;

                    while (current) {
                        chain.push(current.species.name);
                        current = current.evolves_to[0]; // Assumes linear evolution for simplicity
                    }

                    // Fetch sprites for each evolution stage
                    const evolutionPromises = chain.map((name) =>
                        axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`).then((res) => ({
                            name,
                            sprite: res.data.sprites.front_default,
                        }))
                    );
                    Promise.all(evolutionPromises).then(setEvolutionChain);
                });
            });

            setLoading(false); // End loading state after data is fetched
        });
    }, [id]);

    const typeGradient = () => {
        if (!pokemon) return "";
        const colors = {
            fire: "#F08030",
            water: "#6890F0",
            grass: "#78C850",
            electric: "#F8D030",
            psychic: "#F85888",
            ice: "#98D8D8",
            dragon: "#7038F8",
            dark: "#705848",
            fairy: "#EE99AC",
            normal: "#A8A878",
            fighting: "#C03028",
            flying: "#A890F0",
            poison: "#A040A0",
            ground: "#E0C068",
            rock: "#B8A038",
            bug: "#A8B820",
            ghost: "#705898",
            steel: "#B8B8D0",
        };
        const typeColors = pokemon.types.map((t) => colors[t.type.name]);
        return `linear-gradient(135deg, ${typeColors.join(", ")})`;
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div
            className="pokemon-details"
            style={{ background: typeGradient() }}
        >
            <h1>{pokemon.name.toUpperCase()}</h1>
            <div className="circle">
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            </div>
            <p><strong>Height:</strong> {pokemon.height / 10} m</p>
            <p><strong>Weight:</strong> {pokemon.weight / 10} kg</p>
            <p><strong>Types:</strong> {pokemon.types.map((t) => t.type.name).join(", ")}</p>
            <p><strong>Abilities:</strong> {pokemon.abilities.map((a) => a.ability.name).join(", ")}</p>
            <p><strong>Weaknesses:</strong> {weaknesses.length > 0 ? weaknesses.join(", ") : "None"}</p>
            <p><strong>Hatch Time:</strong> {hatchTime} steps</p>
            <p><strong>Evolution Chain:</strong></p>
            <ul className="evolution-chain">
                {evolutionChain.map((evo) => (
                    <li key={evo.name} onClick={() => navigate(`/pokemon/${evo.name}`)}>
                        <img src={evo.sprite} alt={evo.name} />
                        <span>{evo.name.toUpperCase()}</span>
                    </li>
                ))}
            </ul>
            <p><strong>Base Stats:</strong></p>
            <ul className="stats">
                {pokemon.stats.map((stat) => (
                    <li key={stat.stat.name}>
                        {stat.stat.name.toUpperCase()}: {stat.base_stat}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PokemonDetails;
