import React, { useState, useEffect } from "react";
import axios from "axios";

const BattlePage = () => {
    const [player1Team, setPlayer1Team] = useState([]);
    const [player2Team, setPlayer2Team] = useState([]);
    const [selectedPlayer1Pokemon, setSelectedPlayer1Pokemon] = useState(null);
    const [selectedPlayer2Pokemon, setSelectedPlayer2Pokemon] = useState(null);
    const [battleInProgress, setBattleInProgress] = useState(false);
    const [turn, setTurn] = useState("player1");
    const [battleLog, setBattleLog] = useState([]);

    const savedTeams = JSON.parse(localStorage.getItem("savedTeams")) || [];

    useEffect(() => {
        if (savedTeams.length > 0) {
            setPlayer1Team(savedTeams[0].members || []); // Ensure the first team is selected for Player 1
            setPlayer2Team(savedTeams[1]?.members || []); // Ensure the second team is selected for Player 2 (if available)
        }
    }, [savedTeams]);

    const handleStartBattle = () => {
        if (player1Team.length > 0 && player2Team.length > 0) {
            setSelectedPlayer1Pokemon(player1Team[0]);
            setSelectedPlayer2Pokemon(player2Team[0]);
            setBattleInProgress(true);
            setBattleLog([
                `Battle started: ${player1Team[0]?.name || "Pokemon 1"} vs ${player2Team[0]?.name || "Pokemon 2"}`,
            ]);
        } else {
            alert("Both teams need to have Pokémon selected!");
        }
    };

    const handleAttack = (attacker, defender) => {
        const damage = calculateDamage(attacker, defender);
        defender.hp -= damage;

        setBattleLog([
            ...battleLog,
            `${attacker?.name} used ${attacker?.moves[0]?.name || "an attack"} and dealt ${damage} damage to ${defender?.name}`,
        ]);

        if (defender.hp <= 0) {
            setBattleLog([
                ...battleLog,
                `${defender?.name} has fainted! ${attacker?.name} wins!`,
            ]);
            setBattleInProgress(false);
        } else {
            setTurn(turn === "player1" ? "player2" : "player1");
        }
    };

    const calculateDamage = (attacker, defender) => {
        const baseDamage = 10;
        const criticalHit = Math.random() < 0.1 ? 2 : 1;
        return baseDamage * criticalHit;
    };

    return (
        <div className="battle-page">
            <h1>Interactive Pokémon Battle</h1>
            <div className="players">
                <div className="player">
                    <h2>Player 1</h2>
                    {player1Team.map((pokemon) => (
                        <div key={pokemon?.id}>
                            <img src={pokemon?.image} alt={pokemon?.name} />
                            <h3>{pokemon?.name || "Unknown"}</h3>
                            <p>Health: {pokemon?.stats?.find(stat => stat.name === 'hp')?.value || 0}</p>
                            <p>Abilities: {pokemon?.abilities?.join(", ") || "N/A"}</p>
                            {selectedPlayer1Pokemon === null && (
                                <button onClick={() => setSelectedPlayer1Pokemon(pokemon)}>
                                    Select {pokemon?.name || "Pokemon"}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <div className="player">
                    <h2>Player 2</h2>
                    {player2Team.map((pokemon) => (
                        <div key={pokemon?.id}>
                            <img src={pokemon?.image} alt={pokemon?.name} />
                            <h3>{pokemon?.name || "Unknown"}</h3>
                            <p>Health: {pokemon?.stats?.find(stat => stat.name === 'hp')?.value || 0}</p>
                            <p>Abilities: {pokemon?.abilities?.join(", ") || "N/A"}</p>
                            {selectedPlayer2Pokemon === null && (
                                <button onClick={() => setSelectedPlayer2Pokemon(pokemon)}>
                                    Select {pokemon?.name || "Pokemon"}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {battleInProgress && (
                <div>
                    <h3>Battle Log</h3>
                    <ul>
                        {battleLog.map((log, index) => (
                            <li key={index}>{log}</li>
                        ))}
                    </ul>
                    <div>
                        {turn === "player1" && selectedPlayer1Pokemon && (
                            <div>
                                <h4>Player 1's Turn</h4>
                                <p>{selectedPlayer1Pokemon?.name} is ready to attack!</p>
                                {selectedPlayer1Pokemon?.moves?.map((move) => (
                                    <button
                                        key={move?.name}
                                        onClick={() =>
                                            handleAttack(selectedPlayer1Pokemon, selectedPlayer2Pokemon)
                                        }
                                    >
                                        {move?.name || "Attack"}
                                    </button>
                                ))}
                            </div>
                        )}

                        {turn === "player2" && selectedPlayer2Pokemon && (
                            <div>
                                <h4>Player 2's Turn</h4>
                                <p>{selectedPlayer2Pokemon?.name} is ready to attack!</p>
                                {selectedPlayer2Pokemon?.moves?.map((move) => (
                                    <button
                                        key={move?.name}
                                        onClick={() =>
                                            handleAttack(selectedPlayer2Pokemon, selectedPlayer1Pokemon)
                                        }
                                    >
                                        {move?.name || "Attack"}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <button onClick={handleStartBattle} disabled={battleInProgress}>
                Start Battle
            </button>

            <button onClick={() => setBattleInProgress(false)} disabled={!battleInProgress}>
                End Battle
            </button>
        </div>
    );
};

export default BattlePage;