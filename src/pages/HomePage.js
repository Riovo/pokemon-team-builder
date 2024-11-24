import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/HomePage.css";

const HomePage = () => {
    const [pokemon, setPokemon] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [availableTypes, setAvailableTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch Pokémon data
        axios.get("https://pokeapi.co/api/v2/pokemon?limit=1000").then((response) => {
            const details = response.data.results.map((p) =>
                axios.get(p.url).then((res) => res.data)
            );
            Promise.all(details).then((data) => {
                setPokemon(data);
                setFilteredPokemon(data);
            });
        });

        // Fetch types
        axios.get("https://pokeapi.co/api/v2/type").then((response) => {
            const types = response.data.results.map((type) => type.name);
            setAvailableTypes(types);
        });
    }, []);

    useEffect(() => {
        document.body.className = darkMode ? "dark" : "light";
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    useEffect(() => {
        const filtered = pokemon.filter((p) => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
            const matchesType =
                !filterType || p.types.some((t) => t.type.name === filterType.toLowerCase());

            return matchesSearch && matchesType;
        });
        setFilteredPokemon(filtered);
        setCurrentPage(1); // Reset to page 1 after filtering
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

    // Function to reset filters
    const resetFilters = () => {
        setSearch("");
        setFilterType("");
    };

    return (
        <div className="homepage">
            <h1 className="title">Pokémon Team Builder</h1>
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
                {/* Reset Filter Button */}
                <button onClick={resetFilters} className="reset-filter-button">
                    Reset Filters
                </button>
            </div>
            <div className="pokemon-container">
                {paginatedPokemon.map((p) => (
                    <div
                        key={p.id}
                        className="pokemon-card"
                        onClick={() => navigate(`/pokemon/${p.id}`)} // Navigate to details page
                        role="button"
                        tabIndex={0} // Make div accessible for keyboard navigation
                        onKeyPress={(e) => {
                            if (e.key === "Enter") navigate(`/pokemon/${p.id}`);
                        }}
                    >
                        <img src={p.sprites.front_default} alt={p.name} />
                        <h3>{p.name.toUpperCase()}</h3>
                        <div className="type-badges">
                            {p.types.map((type) => (
                                <span key={type.type.name} className={`type-badge ${type.type.name}`}>
                                    {type.type.name}
                                </span>
                            ))}
                        </div>
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
