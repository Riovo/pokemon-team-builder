import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/CreateTeamPage.css";

const CreateTeamPage = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [team, setTeam] = useState([]);
    const [teamLimit, setTeamLimit] = useState(6);

    useEffect(() => {
        axios.get("https://pokeapi.co/api/v2/pokemon?limit=150").then((res) => {
            setPokemonList(res.data.results);
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
                {team.map((p) => (
                    <div key={p.name} className="team-member">
                        <span>{p.name.toUpperCase()}</span>
                        <button onClick={() => removeFromTeam(p)}>Remove</button>
                    </div>
                ))}
            </div>
            <div className="pokemon-list">
                <h2>Available Pokémon</h2>
                <div className="list">
                    {pokemonList.map((p) => (
                        <button
                            key={p.name}
                            onClick={() => addToTeam(p)}
                            disabled={team.some((member) => member.name === p.name)}
                        >
                            {p.name.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreateTeamPage;
