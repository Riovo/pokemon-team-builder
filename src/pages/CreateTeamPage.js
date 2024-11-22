import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/CreateTeamPage.css";

const CreateTeamPage = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [team, setTeam] = useState([]);
    const [teamLimit, setTeamLimit] = useState(6);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("https://pokeapi.co/api/v2/pokemon?limit=150")
            .then((res) => {
                const pokemonData = res.data.results;

                const fetchDetails = pokemonData.map((pokemon) => {
                    return axios.get(pokemon.url)
                        .then((response) => ({
                            name: pokemon.name,
                            types: response.data.types,
                            image: response.data.sprites.other["official-artwork"].front_default,
                            id: response.data.id,
                        }));
                });

                Promise.all(fetchDetails).then((results) => {
                    setPokemonList(results);
                    setLoading(false);
                });
            });

        axios.get("https://pokeapi.co/api/v2/type")
            .then((res) => {
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

    const handleSearchChange = (e) => {
        setSearch(e.target.value.toLowerCase());
    };

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    const filteredPokemon = pokemonList.filter(pokemon => {
        const matchesSearch = pokemon.name.toLowerCase().includes(search);
        const matchesType = !filterType || (pokemon.types && pokemon.types.some(type => type.type.name === filterType));
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
            </div>

            <div className="team">
                <h2>Your Team</h2>
                {team.length > 0 ? (
                    team.map((p) => (
                        <div key={p.name} className="team-member">
                            <img src={p.image} alt={p.name} />
                            <span>{p.name.toUpperCase()}</span>
                            <button onClick={() => removeFromTeam(p)}>Remove</button>
                            <p>Types: {p.types.map(t => t.type.name).join(', ')}</p>
                            <button className="details-button" onClick={() => alert(`Details for ${p.name}`)}>View Details</button>
                        </div>
                    ))
                ) : (
                    <p>No Pokémon in your team yet!</p>
                )}
            </div>

            <div className="pokemon-list">
                <h2>Available Pokémon</h2>

                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search Pokémon"
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <select onChange={handleFilterChange} value={filterType}>
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
                    <div className="list">
                        {filteredPokemon.map((p) => (
                            <button
                                key={p.name}
                                onClick={() => addToTeam(p)}
                                disabled={team.some((member) => member.name === p.name)}
                            >
                                <img src={p.image} alt={p.name} />
                                {p.name.toUpperCase()}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateTeamPage;