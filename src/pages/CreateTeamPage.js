import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/CreateTeamPage.css";

const CreateTeamPage = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [team, setTeam] = useState([]);
    const [teamName, setTeamName] = useState("");
    const [teamLimit, setTeamLimit] = useState(6);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("https://pokeapi.co/api/v2/pokemon?limit=200").then((res) => {
            const pokemonData = res.data.results;
            const fetchDetails = pokemonData.map((pokemon) =>
                axios.get(pokemon.url).then((response) => ({
                    id: response.data.id,
                    name: pokemon.name,
                    types: response.data.types,
                    image: response.data.sprites.other["official-artwork"].front_default,
                    stats: response.data.stats.reduce((acc, stat) => {
                        acc[stat.stat.name] = stat.base_stat;
                        return acc;
                    }, {}),
                }))
            );
            Promise.all(fetchDetails).then((results) => {
                setPokemonList(results);
                setLoading(false);
            });
        });
        axios.get("https://pokeapi.co/api/v2/type").then((res) => {
            setTypes(res.data.results);
        });
    }, []);

    const addToTeam = (pokemon) => {
        if (team.length < teamLimit && !team.some((p) => p.name === pokemon.name)) {
            setTeam([...team, pokemon]);
        }
    };

    const removeFromTeam = (pokemon) => {
        setTeam(team.filter((p) => p.name !== pokemon.name));
    };

    const handleSaveTeam = () => {
        if (team.length === 0 || teamName.trim() === "") {
            alert("Please enter a team name and add Pokémon to your team.");
            return;
        }

        const teamData = team.map((pokemon) => ({
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.types.map((t) => t.type.name),
            image: pokemon.image,
            stats: pokemon.stats,
        }));

        const token = localStorage.getItem("token");

        if (!token) {
            alert("You must be logged in to save your team.");
            return;
        }

        axios
            .post(
                "http://localhost:5000/api/team/add",
                { name: teamName, members: teamData },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                alert("Team saved!");
                setTeam([]);
                setTeamName("");
            })
            .catch((error) => {
                console.error("Error saving team: ", error);
                alert("There was an error saving your team.");
            });
    };

    const filteredPokemon = pokemonList.filter((pokemon) => {
        const matchesSearch = pokemon.name.toLowerCase().includes(search.toLowerCase());
        const matchesType =
            !filterType || pokemon.types.some((type) => type.type.name === filterType);
        return matchesSearch && matchesType;
    });

    return (
        <div className="create-team-page">
            <h1>Build Your Pokémon Team</h1>
            <div className="team-settings">
                <label>
                    Team Limit:
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={teamLimit}
                        onChange={(e) => setTeamLimit(Number(e.target.value))}
                    />
                </label>
                <input
                    type="text"
                    placeholder="Enter team name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />
                <button onClick={handleSaveTeam} className="save-team-button">
                    Save Team
                </button>
            </div>

            <div className="team">
                <h2>Your Team</h2>
                <div className="pokemon-container">
                    {team.length > 0 ? (
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
                        <p>No Pokémon in your team yet!</p>
                    )}
                </div>
            </div>

            <div className="pokemon-list">
                <h2>Available Pokémon</h2>
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search Pokémon"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        onChange={(e) => setFilterType(e.target.value)}
                        value={filterType}
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
                    <p>Loading Pokémon...</p>
                ) : (
                    <div className="pokemon-container">
                        {filteredPokemon.map((p) => (
                            <div
                                key={p.name}
                                className="pokemon-card"
                                onClick={() => addToTeam(p)}
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