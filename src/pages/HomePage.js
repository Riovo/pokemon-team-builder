import React, { useState, useEffect } from "react";
import axios from "axios";

const HomePage = () => {
    const [pokemon, setPokemon] = useState([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [availableTypes, setAvailableTypes] = useState([]); // Holds all types fetched from API
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setDarkMode(savedTheme === "dark");
            document.body.className = savedTheme;
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = darkMode ? "light" : "dark";
        setDarkMode(!darkMode);
        document.body.className = newTheme;
        localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
        // Fetch Pokémon data
        axios.get("https://pokeapi.co/api/v2/pokemon?limit=150").then((response) => {
            const details = response.data.results.map((p) =>
                axios.get(p.url).then((res) => res.data)
            );
            Promise.all(details).then((data) => {
                setPokemon(data);
                setFilteredPokemon(data);
            });
        });

        // Fetch Pokémon types
        axios.get("https://pokeapi.co/api/v2/type").then((response) => {
            const types = response.data.results.map((type) => type.name);
            setAvailableTypes(types);
        });
    }, []);

    useEffect(() => {
        const filtered = pokemon.filter((p) => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
            const matchesType =
                !filterType || p.types.some((t) => t.type.name === filterType.toLowerCase());
            return matchesSearch && matchesType;
        });
        setFilteredPokemon(filtered);
    }, [search, filterType, pokemon]);

    const handleNextPage = () => {
        if (currentPage * itemsPerPage < filteredPokemon.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const paginatedPokemon = filteredPokemon.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div>
            <h1>Pokemon Team Builder</h1>
            <button className="dark-mode-toggle" onClick={toggleTheme}>
                {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
                    <option value="">All Types</option>
                    {availableTypes.map((type) => (
                        <option key={type} value={type}>
                            {type.toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>
            <div className="pokemon-container">
                {paginatedPokemon.map((p) => (
                    <div key={p.id} className="pokemon-card">
                        <img src={p.sprites.front_default} alt={p.name} />
                        <h3>{p.name.toUpperCase()}</h3>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {Math.ceil(filteredPokemon.length / itemsPerPage)}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage * itemsPerPage >= filteredPokemon.length}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default HomePage;