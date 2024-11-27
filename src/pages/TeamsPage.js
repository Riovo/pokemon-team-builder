import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/TeamsPage.css";

// Type effectiveness information
const TYPE_EFFECTIVENESS = {
    normal: { weakTo: ["fighting"], strongAgainst: [] },
    fire: { weakTo: ["water", "rock", "ground"], strongAgainst: ["grass", "bug", "ice", "steel"] },
    water: { weakTo: ["electric", "grass"], strongAgainst: ["fire", "ground", "rock"] },
    grass: { weakTo: ["fire", "bug", "flying", "ice"], strongAgainst: ["water", "rock", "ground"] },
    electric: { weakTo: ["ground"], strongAgainst: ["water", "flying"] },
    ice: { weakTo: ["fire", "rock", "steel", "fighting"], strongAgainst: ["grass", "ground", "flying", "dragon"] },
    fighting: { weakTo: ["flying", "psychic", "fairy"], strongAgainst: ["normal", "ice", "rock", "dark", "steel"] },
    poison: { weakTo: ["ground", "psychic"], strongAgainst: ["grass", "fairy"] },
    ground: { weakTo: ["water", "grass", "ice"], strongAgainst: ["fire", "electric", "poison", "rock", "steel"] },
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
    const [teams, setTeams] = useState([]); // Initialize teams as empty array
    const [loading, setLoading] = useState(true);

    // Fetch saved teams when the component mounts
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You must be logged in to view your teams.");
            return;
        }

        axios
            .get("http://localhost:5000/api/team/saved-teams", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log("Response from backend:", response.data); // Log the backend response

                const teamsData = response.data.teams || []; // Ensure teams are an array
                setTeams(teamsData); // Set the teams data to the state
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching teams: ", error);
                alert("There was an error fetching your teams.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading teams...</p>;
    }

    return (
        <div className="teams-page">
            <h1>Your Saved Teams</h1>
            {teams.length > 0 ? (
                teams.map((team, index) => (
                    <TeamCard key={index} team={team} />
                ))
            ) : (
                <p>No teams saved yet!</p>
            )}
        </div>
    );
};

const TeamCard = ({ team }) => {
    const [showInfo, setShowInfo] = useState(false);

    // Calculate type effectiveness
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

    const { weaknesses, strengths } = calculateTypeSummary(team?.members || []);

    return (
        <div className="team-card">
            <h2>{team?.name || "Unnamed Team"}</h2>

            {/* Pokémon Display */}
            <div className="pokemon-container">
                {team?.members?.length > 0 ? (
                    team.members.map((p) => (
                        <div key={p?.id || p?.name} className="pokemon-card">
                            <img
                                src={p?.image || "https://via.placeholder.com/150"}
                                alt={p?.name}
                            />
                            <h3>{p?.name?.toUpperCase()}</h3>
                            <div className="type-badges">
                                {p?.types?.map((t) => (
                                    <span key={t} className={`type-badge ${t}`}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Pokémon found in this team!</p>
                )}
            </div>

            {/* More Info Button */}
            <button className="more-info-button" onClick={() => setShowInfo((prev) => !prev)}>
                {showInfo ? "Hide Info" : "More Info"}
            </button>

            {/* Team Info */}
            {showInfo && (
                <div className="team-info">
                    {/* Strengths and Weaknesses */}
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
                </div>
            )}
        </div>
    );
};

export default TeamsPage;