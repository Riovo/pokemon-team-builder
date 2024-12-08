import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/TeamsPage.css";

// Type effectiveness data for calculating team strengths and weaknesses
const TYPE_EFFECTIVENESS = {
    normal: { weakTo: ["fighting"], strongAgainst: [] },
    fire: { weakTo: ["water", "rock", "ground"], strongAgainst: ["grass", "bug", "ice", "steel"] },
    water: { weakTo: ["electric", "grass"], strongAgainst: ["fire", "ground", "rock"] },
    grass: { weakTo: ["fire", "bug", "flying", "ice"], strongAgainst: ["water", "rock", "ground"] },
    electric: { weakTo: ["ground"], strongAgainst: ["water", "flying"] },
    ice: { weakTo: ["fire", "rock", "steel", "fighting"], strongAgainst: ["grass", "ground", "flying", "dragon"] },
    fighting: { weakTo: ["flying", "psychic", "fairy"], strongAgainst: ["normal", "ice", "rock", "dark", "steel"] },
    poison: { weakTo: ["ground", "psychic"], strongAgainst: ["grass", "fairy"] },
    ground: { weakTo: ["water", "grass"], strongAgainst: ["fire", "electric", "poison", "rock", "steel"] },
    flying: { weakTo: ["electric", "ice", "rock"], strongAgainst: ["grass", "fighting", "bug"] },
    psychic: { weakTo: ["bug", "ghost", "dark"], strongAgainst: ["fighting", "poison"] },
    bug: { weakTo: ["fire", "flying", "rock"], strongAgainst: ["grass", "psychic", "dark"] },
    rock: { weakTo: ["water", "grass", "fighting", "ground", "steel"], strongAgainst: ["fire", "ice", "flying", "bug"] },
    ghost: { weakTo: ["ghost", "dark"], strongAgainst: ["psychic", "ghost"] },
    dragon: { weakTo: ["ice", "dragon", "fairy"], strongAgainst: ["dragon"] },
    dark: { weakTo: ["fighting", "bug", "fairy"], strongAgainst: ["psychic", "ghost"] },
    steel: { weakTo: ["fire", "fighting", "ground"], strongAgainst: ["ice", "rock", "fairy"] },
    fairy: { weakTo: ["poison", "steel"], strongAgainst: ["fighting", "dragon", "dark"] },
};

const TeamsPage = () => {
    const [teams, setTeams] = useState([]); // State for storing user's teams
    const [loading, setLoading] = useState(true); // State to indicate if teams are being loaded
    const [searchQuery, setSearchQuery] = useState(""); // State for the search input value

    // Fetch saved teams from the backend
    useEffect(() => {
        const token = localStorage.getItem("token"); // Get the token from localStorage

        if (!token) {
            alert("You must be logged in to view your teams.");
            return;
        }

        axios
            .get("http://localhost:5000/api/team/saved-teams", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setTeams(response.data.teams || []); // Store the fetched teams in state
                setLoading(false); // Stop loading once data is fetched
            })
            .catch((error) => {
                console.error("Error fetching teams: ", error);
                alert("There was an error fetching your teams.");
                setLoading(false); // Stop loading even if there’s an error
            });
    }, []);

    // Filter teams based on the search query
    const filteredTeams = teams.filter((team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Function to delete a team
    const handleDeleteTeam = (teamName) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You must be logged in to delete a team.");
            return;
        }

        if (window.confirm(`Are you sure you want to delete the team "${teamName}"?`)) {
            axios
                .delete(`http://localhost:5000/api/team/delete/${teamName}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    alert("Team deleted successfully!");
                    setTeams(response.data.teams || []); // Update teams after deletion
                })
                .catch((error) => {
                    console.error("Error deleting team: ", error);
                    alert("There was an error deleting the team.");
                });
        }
    };

    if (loading) {
        return <p>Loading teams...</p>; // Display a loading message while fetching data
    }

    return (
        <div className="teams-page">
            <h1>Your Saved Teams</h1>

            {/* Search bar for filtering teams */}
            <div className="team-search-bar">
                <input
                    type="text"
                    placeholder="Search team names..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update the search query state on input change
                />
                <button onClick={() => setSearchQuery("")}>Clear</button> {/* Optional Clear Button */}
            </div>

            {filteredTeams.length > 0 ? (
                filteredTeams.map((team, index) => (
                    <TeamCard key={index} team={team} handleDeleteTeam={handleDeleteTeam} />
                ))
            ) : (
                <p>No teams match your search!</p> // Display if no teams match the search query
            )}
        </div>
    );
};

// TeamCard component for rendering team details and stats
const TeamCard = ({ team, handleDeleteTeam }) => {
    const [showInfo, setShowInfo] = useState(false); // State for toggling additional team info

    // Function to calculate team strengths and weaknesses
    const calculateTypeSummary = (team) => {
        const weaknesses = {};
        const strengths = {};

        if (team && team.length > 0) {
            team.forEach((pokemon) => {
                pokemon.types.forEach((type) => {
                    const typeName = type;
                    const typeData = TYPE_EFFECTIVENESS[typeName] || {};

                    typeData.weakTo?.forEach((weak) => {
                        weaknesses[weak] = (weaknesses[weak] || 0) + 1;
                    });

                    typeData.strongAgainst?.forEach((strong) => {
                        strengths[strong] = (strengths[strong] || 0) + 1;
                    });
                });
            });
        }

        return { weaknesses, strengths };
    };

    const { weaknesses, strengths } = calculateTypeSummary(team.members || []); // Calculate strengths and weaknesses for the team

    return (
        <div className="team-card">
            <h2>{team.name || "Unnamed Team"}</h2>

            <div className="pokemon-container">
                {team.members?.length > 0 ? (
                    team.members.map((pokemon) => (
                        <div key={pokemon.id} className="pokemon-card">
                            <img
                                src={pokemon.image || "https://via.placeholder.com/150"}
                                alt={pokemon.name}
                            />
                            <h3>{pokemon.name.toUpperCase()}</h3>

                            <div className="type-badge-grid">
                                {pokemon.types?.map((type) => (
                                    <div key={type} className={`type-badge ${type.toLowerCase()}`}>
                                        {type.toUpperCase()}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Pokémon found in this team!</p>
                )}
            </div>

            <button
                className="delete-team-button"
                onClick={() => handleDeleteTeam(team.name)}
            >
                Delete Team
            </button>
            <button
                className="more-info-button"
                onClick={() => setShowInfo((prev) => !prev)}
            >
                {showInfo ? "Hide Info" : "More Info"}
            </button>

            {showInfo && (
                <div className="team-info">
                    <div className="team-summary">
                        <div className="strengths">
                            <h3>Team Strengths</h3>
                            <div className="type-list">
                                {Object.entries(strengths).map(([type, count]) => (
                                    <div key={type} className="type-item">
                                        <span className={`type-badge ${type.toLowerCase()}`}>
                                            {type.toUpperCase()}
                                        </span>
                                        <span className="type-count">x{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="weaknesses">
                            <h3>Team Weaknesses</h3>
                            <div className="type-list">
                                {Object.entries(weaknesses).map(([type, count]) => (
                                    <div key={type} className="type-item">
                                        <span className={`type-badge ${type.toLowerCase()}`}>
                                            {type.toUpperCase()}
                                        </span>
                                        <span className="type-count">x{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="pokemon-stats-container">
                        {team.members?.map((pokemon) => (
                            <PokemonStats key={pokemon.name} pokemonName={pokemon.name} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// PokemonStats component for rendering individual Pokémon stats
const PokemonStats = ({ pokemonName }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios
            .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
            .then((response) => setStats(response.data.stats))
            .catch((error) => console.error("Error fetching Pokémon stats:", error));
    }, [pokemonName]);

    if (!stats) {
        return <p>Loading stats for {pokemonName.toUpperCase()}...</p>;
    }

    const statNameToClass = {
        hp: "hp",
        attack: "attack",
        defense: "defense",
        "special-attack": "special-attack",
        "special-defense": "special-defense",
        speed: "speed",
    };

    return (
        <div className="pokemon-stats">
            <h4>{pokemonName.toUpperCase()} Stats</h4>
            {stats.map((stat) => (
                <div key={stat.stat.name} className="stat">
                    <span className="stat-name">{stat.stat.name.toUpperCase()}</span>
                    <div className="stat-bar-container">
                        <div
                            className={`stat-bar ${statNameToClass[stat.stat.name]}`}
                            style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                        ></div>
                    </div>
                    <span className="stat-value">{stat.base_stat}</span>
                </div>
            ))}
        </div>
    );
};

export default TeamsPage;
