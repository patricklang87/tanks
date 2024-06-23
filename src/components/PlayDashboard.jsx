import React from "react";
import Shields from "./Shields";
import TankControls from "./TankControls";
import { advancePlayerTurn } from "../gameplay/gameControls";

export const PlayDashboard = (props) => {
  const { gameState, setGameState } = props;
  return (
    <div style={{ backgroundColor: "lightgrey", padding: "10px" }}>
      <div className="row">
        <div className="col-4">
          <Shields gameState={gameState} />
        </div>
        <div className="col-7">
          <TankControls gameState={gameState} setGameState={setGameState} />
        </div>
        <div className="col-1">
        <button onClick={() => advancePlayerTurn({ gameState, setGameState })}>
        Shoot!
      </button>
        </div>
      </div>
    </div>
  );
};
