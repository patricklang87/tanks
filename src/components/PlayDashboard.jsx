import React from "react";
import Shields from "./Shields";
import ShotControls from "./ShotControls";
import DriveControls from "./DriveControls";
import { advancePlayerTurn, setSelectedAction } from "../gameplay/gameControls";
import { animationsAreExecuting } from "./playDashboardHooks";

const ControlSection = (props) => {
  const { gameState, setGameState, selectedAction, availableActionsFiltered } =
    props;
  return (
    <>
      {" "}
      <select
        onChange={(e) =>
          setSelectedAction({
            gameState,
            setGameState,
            value: e.target.value,
          })
        }
        className="form-select"
        aria-label="Select action"
      >
        <option defaultValue>{selectedAction}</option>
        {availableActionsFiltered.map((action) => (
          <option key={action} value={action}>
            {action}
          </option>
        ))}
      </select>
      {selectedAction === "Standard Shot" && (
        <ShotControls gameState={gameState} setGameState={setGameState} />
      )}
      {selectedAction === "Drive" && (
        <DriveControls gameState={gameState} setGameState={setGameState} />
      )}{" "}
    </>
  );
};

export const PlayDashboard = (props) => {
  const { gameState, setGameState } = props;

  const animationsExecuting = animationsAreExecuting(gameState);

  const { currentPlayer, tanks } = gameState;
  const currentTank = tanks[currentPlayer - 1];
  const selectedAction = currentTank.selectedAction;
  const availableActions = currentTank.availableActions;
  const availableActionsFiltered = availableActions.filter(
    (action) => action !== selectedAction
  );

  return (
    <div style={{ backgroundColor: "lightgrey", padding: "10px" }}>
      <div className="row">
        <div className="col-4">
          <Shields gameState={gameState} />
        </div>
        <div className="col-7">
          {animationsExecuting && <p>Please wait...</p>}
          {!animationsExecuting && (
            <ControlSection
              gameState={gameState}
              setGameState={setGameState}
              selectedAction={selectedAction}
              availableActionsFiltered={availableActionsFiltered}
            />
          )}
        </div>

        <div className="col-1">
          <button
            disabled={animationsExecuting}
            onClick={() => advancePlayerTurn({ gameState, setGameState })}
          >
            {selectedAction === "Drive" ? "Drive!" : "Fire!"}
          </button>
        </div>
      </div>
    </div>
  );
};
