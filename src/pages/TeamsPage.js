import React, { useState } from "react";
import axios from "axios";
import "../css/TeamsPage.css";

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
    const savedTeams = JSON.parse(localStorage.getItem("savedTeams")) || [];

    const calculateTypeSummary = (team) => {
        const weaknesses = {};
        const strengths = {};

        team?.members?.forEach((pokemon) => {
            pokemon?.types?.forEach((type) => {
                const typeName = type.type.name;
                const typeData = TYPE_EFFECTIVENESS[typeName] || {};

                typeData.weakTo?.forEach((weak) => {
                    weaknesses[weak] = (weaknesses[weak] || 0) + 1;
                });

                typeData.strongAgainst?.forEach((strong) => {
                    strengths[strong] = (strengths[strong] || 0) + 1;
                });
            });
        });

        return { weaknesses, strengths };
    };

    return (
        <div className="teams-page">
            <h1>Saved Teams</h1>
            {savedTeams.length > 0 ? (
                savedTeams.map((team, index) => (
                    <TeamCard key={index} team={team} calculateTypeSummary={calculateTypeSummary} />
                ))
            ) : (
                <p>No teams saved yet!</p>
            )}
        </div>
    );
};

const TeamCard = ({ team, calculateTypeSummary }) => {
    const [showInfo, setShowInfo] = useState(false);
    const { weaknesses, strengths } = calculateTypeSummary(team);

    return (
        <div className="team-card">
            <h2>{team?.name || "Unnamed Team"}</h2>

            {/* Pokémon Display */}
            <div className="pokemon-container">
                {team?.members?.map((p) => (
                    <div key={p?.id || p?.name} className="pokemon-card">
                        <img src={p?.image} alt={p?.name} />
                        <h3>{p?.name?.toUpperCase()}</h3>
                        <div className="type-badges">
                            {p?.types?.map((t) => (
                                <span key={t?.type?.name} className={`type-badge ${t?.type?.name}`}>
                                    {t?.type?.name}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* More Info Button */}
            <button
                className="more-info-button"
                onClick={() => setShowInfo((prev) => !prev)}
            >
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
                                        <span className={`type-badge ${type.toLowerCase()}`}>{type.toUpperCase()}</span>
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
                                        <span className={`type-badge ${type.toLowerCase()}`}>{type.toUpperCase()}</span>
                                        <span className="type-count">x{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Individual Pokémon Stats */}
                    <div className="team-stats">
                        {team?.members?.map((p) => (
                            <PokemonStats key={p?.id || p?.name} pokemonName={p?.name} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const PokemonStats = ({ pokemonName }) => {
    const [stats, setStats] = useState(null);

    React.useEffect(() => {
        axios
            .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
            .then((response) => setStats(response.data.stats))
            .catch((error) => console.error("Error fetching Pokémon stats:", error));
    }, [pokemonName]);

    if (!stats) {
        return <p>Loading stats for {pokemonName.toUpperCase()}...</p>;
    }

    return (
        <div className="pokemon-stats">
            <h4>{pokemonName.toUpperCase()} Stats</h4>
            {stats.map((stat) => (
                <div key={stat.stat.name} className="stat">
                    <span className="stat-name">{stat.stat.name.toUpperCase()}</span>
                    <div className="stat-bar-container">
                        <div
                            className={`stat-bar ${stat.stat.name.toLowerCase()}`}
                            style={{
                                width: `${(stat.base_stat / 255) * 100}%`, // Scale relative to max stat
                            }}
                        ></div>
                    </div>
                    <span className="stat-value">{stat.base_stat}</span>
                </div>
            ))}
        </div>
    );
};






export default TeamsPage;
