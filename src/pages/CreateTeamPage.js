import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/CreateTeamPage.css";

const CreateTeamPage = () => {
    // State variables to manage the Pokémon list, team, team name, and search/filter functionality
    const [pokemonList, setPokemonList] = useState([]); // List of all available Pokémon
    const [team, setTeam] = useState([]); // The team that the user is building
    const [teamName, setTeamName] = useState(""); // The name of the team
    const [teamLimit, setTeamLimit] = useState(6); // The maximum number of Pokémon in a team
    const [search, setSearch] = useState(""); // Search term for filtering Pokémon by name
    const [filterType, setFilterType] = useState(""); // Filter Pokémon by type
    const [types, setTypes] = useState([]); // List of Pokémon types (for filtering)
    const [loading, setLoading] = useState(true); // Loading state for the Pokémon data

    // Fetch the initial Pokémon data and available types from the PokeAPI
    useEffect(() => {
        // Fetching the list of Pokémon
        axios.get("https://pokeapi.co/api/v2/pokemon?limit=200").then((res) => {
            const pokemonData = res.data.results;
            // Fetch detailed information for each Pokémon
            const fetchDetails = pokemonData.map((pokemon) =>
                axios.get(pokemon.url).then((response) => ({
                    id: response.data.id,
                    name: pokemon.name,
                    types: response.data.types,
                    image: response.data.sprites.other["official-artwork"].front_default, // Pokémon image
                    stats: response.data.stats.reduce((acc, stat) => {
                        acc[stat.stat.name] = stat.base_stat; // Stats in a simplified form
                        return acc;
                    }, {}),
                }))
            );
            // Once all details are fetched, update the state
            Promise.all(fetchDetails).then((results) => {
                setPokemonList(results); // Set the fetched Pokémon list
                setLoading(false); // Set loading to false after data is fetched
            });
        });

        // Fetching available Pokémon types for the filter
        axios.get("https://pokeapi.co/api/v2/type").then((res) => {
            setTypes(res.data.results); // Set the available Pokémon types
        });
    }, []);

    // Function to add a Pokémon to the team
    const addToTeam = (pokemon) => {
        // Only add Pokémon if the team is not full and the Pokémon is not already in the team
        if (team.length < teamLimit && !team.some((p) => p.name === pokemon.name)) {
            setTeam([...team, pokemon]); // Add the Pokémon to the team
        }
    };

    // Function to remove a Pokémon from the team
    const removeFromTeam = (pokemon) => {
        setTeam(team.filter((p) => p.name !== pokemon.name)); // Remove the Pokémon from the team
    };

    // Function to save the team
    const handleSaveTeam = () => {
        // Validate that the team has at least one Pokémon and a team name
        if (team.length === 0 || teamName.trim() === "") {
            alert("Please enter a team name and add Pokémon to your team.");
            return;
        }

        // Prepare the team data to be sent to the backend
        const teamData = team.map((pokemon) => ({
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.types.map((t) => t.type.name),
            image: pokemon.image,
            stats: pokemon.stats,
        }));

        // Get the token from localStorage (for authentication)
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You must be logged in to save your team.");
            return;
        }

        // Send the team data to the backend to save it
        axios
            .post(
                "http://localhost:5000/api/team/add",
                { name: teamName, members: teamData },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass token for authorization
                    },
                }
            )
            .then(() => {
                alert("Team saved!"); // Success message
                setTeam([]); // Clear the team
                setTeamName(""); // Reset the team name
            })
            .catch((error) => {
                console.error("Error saving team: ", error); // Log any errors
                alert("There was an error saving your team.");
            });
    };

    // Filter the Pokémon based on the search term and type filter
    const filteredPokemon = pokemonList.filter((pokemon) => {
        const matchesSearch = pokemon.name.toLowerCase().includes(search.toLowerCase()); // Search filter
        const matchesType =
            !filterType || pokemon.types.some((type) => type.type.name === filterType); // Type filter
        return matchesSearch && matchesType;
    });

    return (
        <div className="create-team-page">
            <h1>Build Your Pokémon Team</h1>
            <div className="team-settings">
                {/* Team settings */}
                <label>
                    Team Limit:
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={teamLimit}
                        onChange={(e) => setTeamLimit(Number(e.target.value))} // Update team limit
                    />
                </label>
                <input
                    type="text"
                    placeholder="Enter team name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)} // Update team name
                />
                <button onClick={handleSaveTeam} className="save-team-button">
                    Save Team
                </button>
            </div>

            <div className="team">
                <h2>Your Team</h2>
                <div className="pokemon-container">
                    {team.length > 0 ? (
                        // Display the team Pokémon
                        team.map((p) => (
                            <div key={p.name} className="pokemon-card">
                                <img src={p.image} alt={p.name} />
                                <h3>{p.name.toUpperCase()}</h3>
                                <div className="type-badges">
                                    {p.types.map((t) => (
                                        <span
                                            key={t.type.name}
                                            className={`type-badge ${t.type.name}`}
                                        >
                                            {t.type.name}
                                        </span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => removeFromTeam(p)}
                                    className="remove-button"
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No Pokémon in your team yet!</p> // Message when no Pokémon is added
                    )}
                </div>
            </div>

            <div className="pokemon-list">
                <h2>Available Pokémon</h2>
                <div className="filters">
                    {/* Search and type filter */}
                    <input
                        type="text"
                        placeholder="Search Pokémon"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} // Update search term
                    />
                    <select
                        onChange={(e) => setFilterType(e.target.value)}
                        value={filterType} // Update selected type filter
                    >
                        <option value="">All Types</option>
                        {types.map((type) => (
                            <option key={type.name} value={type.name}>
                                {type.name.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
                {loading ? (
                    <p>Loading Pokémon...</p> // Show loading message if Pokémon data is still being fetched
                ) : (
                    <div className="pokemon-container">
                        {filteredPokemon.map((p) => (
                            <div
                                key={p.name}
                                className="pokemon-card"
                                onClick={() => addToTeam(p)} // Add Pokémon to team on click
                            >
                                <img src={p.image} alt={p.name} />
                                <h3>{p.name.toUpperCase()}</h3>
                                <div className="type-badges">
                                    {p.types.map((t) => (
                                        <span
                                            key={t.type.name}
                                            className={`type-badge ${t.type.name}`}
                                        >
                                            {t.type.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateTeamPage;