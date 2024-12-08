import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/CompareTeamsPage.css";

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

const CompareTeamsPage = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam1, setSelectedTeam1] = useState(null);
    const [selectedTeam2, setSelectedTeam2] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pokemonImages, setPokemonImages] = useState({});
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

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
                setTeams(response.data.teams || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching teams: ", error);
                alert("There was an error fetching your teams.");
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        document.body.className = darkMode ? "dark" : "light";
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    const fetchPokemonImage = (pokemonName) => {
        return axios
            .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            .then((response) => response.data.sprites.front_default)
            .catch(() => "https://via.placeholder.com/100");
    };

    useEffect(() => {
        const loadImages = async () => {
            const images = {};
            if (selectedTeam1) {
                await Promise.all(
                    selectedTeam1.members.map(async (pokemon) => {
                        const image = await fetchPokemonImage(pokemon.name);
                        images[pokemon.name] = image;
                    })
                );
            }

            if (selectedTeam2) {
                await Promise.all(
                    selectedTeam2.members.map(async (pokemon) => {
                        const image = await fetchPokemonImage(pokemon.name);
                        images[pokemon.name] = image;
                    })
                );
            }

            setPokemonImages(images);
        };

        loadImages();
    }, [selectedTeam1, selectedTeam2]);

    const calculateAverageStats = (team) => {
        const statTotals = {};
        let numMembers = 0;

        team.members.forEach((pokemon) => {
            numMembers += 1;
            Object.entries(pokemon.stats).forEach(([statName, statValue]) => {
                statTotals[statName] = (statTotals[statName] || 0) + statValue;
            });
        });

        const averages = {};
        Object.entries(statTotals).forEach(([statName, total]) => {
            averages[statName] = total / numMembers;
        });

        return averages;
    };

    const calculateTypeAdvantage = (team1, team2) => {
        let team1Advantage = 0;
        let team2Advantage = 0;

        team1.members.forEach((pokemon1) => {
            pokemon1.types.forEach((type1) => {
                team2.members.forEach((pokemon2) => {
                    pokemon2.types.forEach((type2) => {
                        if (TYPE_EFFECTIVENESS[type1]?.strongAgainst.includes(type2)) {
                            team1Advantage++;
                        }
                        if (TYPE_EFFECTIVENESS[type2]?.strongAgainst.includes(type1)) {
                            team2Advantage++;
                        }
                    });
                });
            });
        });

        return { team1Advantage, team2Advantage };
    };

    const calculateWinPercentage = (stats1, stats2, typeAdvantage1, typeAdvantage2) => {
        const statWeight = 0.6;
        const typeWeight = 0.4;

        const team1Score =
            statWeight * stats1 +
            typeWeight * (typeAdvantage1 / (typeAdvantage1 + typeAdvantage2 + 1));
        const team2Score =
            statWeight * stats2 +
            typeWeight * (typeAdvantage2 / (typeAdvantage1 + typeAdvantage2 + 1));

        const totalScore = team1Score + team2Score;

        return {
            team1WinPercent: (team1Score / totalScore) * 100,
            team2WinPercent: (team2Score / totalScore) * 100,
        };
    };

    const compareTeams = () => {
        if (!selectedTeam1 || !selectedTeam2) return null;

        const team1Stats = calculateAverageStats(selectedTeam1);
        const team2Stats = calculateAverageStats(selectedTeam2);

        const { team1Advantage, team2Advantage } = calculateTypeAdvantage(
            selectedTeam1,
            selectedTeam2
        );

        return calculateWinPercentage(
            Object.values(team1Stats).reduce((sum, val) => sum + val, 0),
            Object.values(team2Stats).reduce((sum, val) => sum + val, 0),
            team1Advantage,
            team2Advantage
        );
    };

    const comparisonResult = compareTeams();

    if (loading) {
        return <p>Loading teams...</p>;
    }

    return (
        <div className={`compare-teams-page ${darkMode ? "dark" : "light"}`}>
            <h1>Compare Two Teams</h1>

            <div className="team-selection">
                <h2>Select Team 1</h2>
                <select onChange={(e) => setSelectedTeam1(teams[e.target.value])}>
                    <option value="">-- Choose Team --</option>
                    {teams.map((team, index) => (
                        <option key={team.name} value={index}>
                            {team.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="team-selection">
                <h2>Select Team 2</h2>
                <select onChange={(e) => setSelectedTeam2(teams[e.target.value])}>
                    <option value="">-- Choose Team --</option>
                    {teams.map((team, index) => (
                        <option key={team.name} value={index}>
                            {team.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedTeam1 && selectedTeam2 && (
    <div className="teams-facing-container">
    {/* Team 1 Section */}
    <div
        className={`team1-section ${
            comparisonResult?.team1WinPercent > comparisonResult?.team2WinPercent
                ? "team-win"
                : "team-lose"
        }`}
    >
        <h3>{selectedTeam1.name}</h3>
        <p>
            Win Chance:{" "}
            {comparisonResult ? comparisonResult.team1WinPercent.toFixed(2) : 0}%
        </p>
        <div className="team-graphics">
            {selectedTeam1.members.map((pokemon) => (
                <div key={pokemon.name} className="pokemon-stats">
                    <h4>{pokemon.name}</h4>
                    <img
                        src={pokemonImages[pokemon.name] || "https://via.placeholder.com/120"}
                        alt={pokemon.name}
                    />
                    <ul>
                        {Object.entries(pokemon.stats).map(([statName, statValue]) => (
                            <li key={statName}>
                                {statName.toUpperCase()}: <span>{statValue}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>

    {/* Team 2 Section */}
    <div
        className={`team2-section ${
            comparisonResult?.team2WinPercent > comparisonResult?.team1WinPercent
                ? "team-win"
                : "team-lose"
        }`}
    >
        <h3>{selectedTeam2.name}</h3>
        <p>
            Win Chance:{" "}
            {comparisonResult ? comparisonResult.team2WinPercent.toFixed(2) : 0}%
        </p>
            <div className="team-graphics">
                {selectedTeam2.members.map((pokemon) => (
                    <div key={pokemon.name} className="pokemon-stats">
                        <h4>{pokemon.name}</h4>
                        <img
                            src={pokemonImages[pokemon.name] || "https://via.placeholder.com/120"}
                            alt={pokemon.name}
                        />
                        <ul>
                            {Object.entries(pokemon.stats).map(([statName, statValue]) => (
                                <li key={statName}>
                                    {statName.toUpperCase()}: <span>{statValue}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </div>

)}


            {!selectedTeam1 || !selectedTeam2 ? (
                <p>Please select two teams to compare.</p>
            ) : null}
        </div>
    );
};

export default CompareTeamsPage;
