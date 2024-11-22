import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
    const [pokemon, setPokemon] = useState([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        axios
            .get("https://pokeapi.co/api/v2/pokemon?limit=150")
            .then((response) => {
                const fetchDetails = response.data.results.map((p) =>
                    axios.get(p.url).then((res) => res.data)
                );
                Promise.all(fetchDetails).then((details) => {
                    setPokemon(details);
                    setFilteredPokemon(details);
                });
            })
            .catch((error) => console.error(error));
    }, []);

    // Update filtered Pokémon whenever search or filterType changes
    useEffect(() => {
        const filtered = pokemon.filter((p) => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
            const matchesType =
                !filterType || p.types.some((t) => t.type.name === filterType.toLowerCase());
            return matchesSearch && matchesType;
        });
        setFilteredPokemon(filtered);
    }, [search, filterType, pokemon]);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        document.body.className = darkMode ? "light" : "dark";
    };

    return (
        <div>
            <h1>Pokemon Team Builder</h1>


            {/* Theme Toggle */}
            <div className="theme-toggle-container">
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    title={`Switch to ${darkMode ? "Light" : "Dark"} Mode`}
                >
                    {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
            </div>



            {/* Filters */}
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="">All Types</option>
                    <option value="fire">Fire</option>
                    <option value="water">Water</option>
                    <option value="grass">Grass</option>
                    <option value="electric">Electric</option>
                    <option value="psychic">Psychic</option>
                    <option value="ice">Ice</option>
                    <option value="dragon">Dragon</option>
                    <option value="dark">Dark</option>
                    <option value="fairy">Fairy</option>
                </select>
            </div>

            {/* Pokemon Grid */}
            <div className="pokemon-container">
                {filteredPokemon.map((p) => (
                    <div key={p.id} className="pokemon-card">
                        <img src={p.sprites.front_default} alt={p.name} />
                        <h3>{p.name.toUpperCase()}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;