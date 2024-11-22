import React, { useState } from "react";
import "../css/BattlePage.css";

const BattlePage = () => {
    const [player1, setPlayer1] = useState(null);
    const [player2, setPlayer2] = useState(null);

    return (
        <div className="battle-page">
            <h1>Interactive Pokémon Battle</h1>
            <div className="players">
                <div className="player">
                    <h2>Player 1</h2>
                    {/* Add Pokémon Select */}
                </div>
                <div className="player">
                    <h2>Player 2</h2>
                    {/* Add Pokémon Select */}
                </div>
            </div>
            <button>Start Battle</button>
        </div>
    );
};

export default BattlePage;
