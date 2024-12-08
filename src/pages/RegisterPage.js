import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/CompareTeamsPage.css";

const CompareTeamsPage = () => {
    // State variables to store teams, selected teams, loading state, images, and dark mode preference
    const [teams, setTeams] = useState([]); // List of saved teams
    const [selectedTeam1, setSelectedTeam1] = useState(null); // Selected team 1
    const [selectedTeam2, setSelectedTeam2] = useState(null); // Selected team 2
    const [loading, setLoading] = useState(true); // Loading state for fetching data
    const [pokemonImages, setPokemonImages] = useState({}); // Store fetched Pokémon images
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark"); // Dark mode state

    // Fetch saved teams from the backend
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You must be logged in to view your teams.");
            return;
        }

        // Fetch the saved teams from the backend API
        axios
            .get("http://localhost:5000/api/team/saved-teams", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setTeams(response.data.teams || []); // Set teams data to state
                setLoading(false); // Set loading to false once data is fetched
            })
            .catch((error) => {
                console.error("Error fetching teams: ", error);
                alert("There was an error fetching your teams.");
                setLoading(false); // Set loading to false if there's an error
            });
    }, []); // Empty dependency array, runs only once after the component mounts

    // Apply dark or light mode based on the state and save it in localStorage
    useEffect(() => {
        document.body.className = darkMode ? "dark" : "light"; // Apply dark/light mode to body element
        localStorage.setItem("theme", darkMode ? "dark" : "light"); // Save the theme in localStorage
    }, [darkMode]); // Runs whenever darkMode state changes

    // Handle the team selection for Team 1
    const handleTeam1Select = (team) => {
        setSelectedTeam1(team); // Set selected team 1
    };

    // Handle the team selection for Team 2
    const handleTeam2Select = (team) => {
        setSelectedTeam2(team); // Set selected team 2
    };

    // Fetch Pokémon image from the PokeAPI based on Pokémon name
    const fetchPokemonImage = (pokemonName) => {
        return axios
            .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            .then((response) => {
                return response.data.sprites.front_default; // Return the front sprite image URL
            })
            .catch((error) => {
                console.error("Error fetching Pokémon image: ", error);
                return "https://via.placeholder.com/100"; // Return a placeholder image if error occurs
            });
    };

    // Fetch images for all selected Pokémon in both teams
    useEffect(() => {
        const loadImages = async () => {
            const images = {};
            if (selectedTeam1) {
                // Fetch images for team 1
                await Promise.all(
                    selectedTeam1.members.map(async (pokemon) => {
                        const image = await fetchPokemonImage(pokemon.name);
                        images[pokemon.name] = image;
                    })
                );
            }

            if (selectedTeam2) {
                // Fetch images for team 2
                await Promise.all(
                    selectedTeam2.members.map(async (pokemon) => {
                        const image = await fetchPokemonImage(pokemon.name);
                        images[pokemon.name] = image;
                    })
                );
            }

            setPokemonImages(images); // Set the fetched images in the state
        };

        loadImages(); // Call the loadImages function when the selected teams change
    }, [selectedTeam1, selectedTeam2]); // Runs when selectedTeam1 or selectedTeam2 changes

    // If the teams are still being fetched, show loading message
    if (loading) {
        return <p>Loading teams...</p>;
    }

    return (
        <div className={`compare-teams-page ${darkMode ? "dark" : "light"}`}>
            <h1>Compare Two Teams</h1>

            {/* Dropdown for selecting team 1 */}
            <div className="team-selection">
                <h2>Select Team 1</h2>
                <select onChange={(e) => handleTeam1Select(teams[e.target.value])}>
                    <option value="">-- Choose Team --</option>
                    {teams.map((team, index) => (
                        <option key={team.name} value={index}>
                            {team.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dropdown for selecting team 2 */}
            <div className="team-selection">
                <h2>Select Team 2</h2>
                <select onChange={(e) => handleTeam2Select(teams[e.target.value])}>
                    <option value="">-- Choose Team --</option>
                    {teams.map((team, index) => (
                        <option key={team.name} value={index}>
                            {team.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Compare the stats of the selected teams */}
            {selectedTeam1 && selectedTeam2 && (
                <div className="stats-comparison">
                    <h2>Stats Comparison</h2>
                    <div className="team-stats">
                        <div className="team1-stats">
                            <h3>{selectedTeam1.name} Stats</h3>
                            {selectedTeam1.members.map((pokemon, index) => (
                                <div key={index} className="pokemon-stats">
                                    <h4>{pokemon.name}</h4>
                                    <img
                                        src={pokemonImages[pokemon.name] || "https://via.placeholder.com/100"} // Fetch and display image
                                        alt={pokemon.name}
                                    />
                                    <ul>
                                        {Object.entries(pokemon.stats).map(([statName, statValue]) => (
                                            <li key={statName}>
                                                {statName.toUpperCase()}: {statValue}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="team2-stats">
                            <h3>{selectedTeam2.name} Stats</h3>
                            {selectedTeam2.members.map((pokemon, index) => (
                                <div key={index} className="pokemon-stats">
                                    <h4>{pokemon.name}</h4>
                                    <img
                                        src={pokemonImages[pokemon.name] || "https://via.placeholder.com/100"} // Fetch and display image
                                        alt={pokemon.name}
                                    />
                                    <ul>
                                        {Object.entries(pokemon.stats).map(([statName, statValue]) => (
                                            <li key={statName}>
                                                {statName.toUpperCase()}: {statValue}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* If no teams are selected, prompt the user */}
            {!selectedTeam1 || !selectedTeam2 ? (
                <p>Please select two teams to compare.</p>
            ) : null}
        </div>
    );
};

export default CompareTeamsPage;