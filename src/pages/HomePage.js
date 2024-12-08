import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/HomePage.css";

const HomePage = () => {
    const [pokemon, setPokemon] = useState([]); // List of all available Pokémon
    const [filteredPokemon, setFilteredPokemon] = useState([]); // Filtered Pokémon based on search and type
    const [search, setSearch] = useState(""); // Search input for Pokémon names
    const [filterType, setFilterType] = useState(""); // Selected Pokémon type filter
    const [availableTypes, setAvailableTypes] = useState([]); // List of available Pokémon types
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const [itemsPerPage] = useState(20); // Number of items per page for pagination
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark"); // Dark mode toggle state
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch Pokémon data
        axios.get("https://pokeapi.co/api/v2/pokemon?limit=1000").then((response) => {
            const details = response.data.results.map((p) =>
                axios.get(p.url).then((res) => res.data)
            );
            Promise.all(details).then((data) => {
                setPokemon(data); // Set all Pokémon data
                setFilteredPokemon(data); // Set filtered Pokémon initially
            });
        });

        // Fetch types of Pokémon
        axios.get("https://pokeapi.co/api/v2/type").then((response) => {
            const types = response.data.results.map((type) => type.name);
            setAvailableTypes(types); // Set available Pokémon types
        });
    }, []);

    useEffect(() => {
        document.body.className = darkMode ? "dark" : "light"; // Apply dark mode or light mode based on the state
        localStorage.setItem("theme", darkMode ? "dark" : "light"); // Save the theme to localStorage
    }, [darkMode]);

    useEffect(() => {
        // Filter Pokémon based on search query and type filter
        const filtered = pokemon.filter((p) => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()); // Filter by name
            const matchesType =
                !filterType || p.types.some((t) => t.type.name === filterType.toLowerCase()); // Filter by type
            return matchesSearch && matchesType;
        });
        setFilteredPokemon(filtered); // Set filtered Pokémon
        setCurrentPage(1); // Reset to page 1 after filtering
    }, [search, filterType, pokemon]);

    const handleNextPage = () => {
        if (currentPage * itemsPerPage < filteredPokemon.length) {
            setCurrentPage(currentPage + 1); // Go to next page
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1); // Go to previous page
        }
    };

    const paginatedPokemon = filteredPokemon.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Function to reset filters
    const resetFilters = () => {
        setSearch(""); // Reset search field
        setFilterType(""); // Reset type filter
    };

    return (
        <div className="homepage">
            <h1 className="title">Pokémon Team Builder</h1>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} // Handle search input change
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
                        onClick={() => navigate(`/pokemon/${p.id}`)} // Navigate to details page on click
                        role="button"
                        tabIndex={0} // Make div accessible for keyboard navigation
                        onKeyPress={(e) => {
                            if (e.key === "Enter") navigate(`/pokemon/${p.id}`); // Navigate when Enter key is pressed
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
            {/* Pagination */}
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

export default HomePage; // Export the HomePage component