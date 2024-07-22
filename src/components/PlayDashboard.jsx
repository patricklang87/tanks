import React from "react";
import Shields from "./Shields";
import ShotControls from "./ShotControls";
import DriveControls from "./DriveControls";
import { advancePlayerTurn, setSelectedAction } from "../gameplay/gameControls";
import { animationsAreExecuting } from "./playDashboardHooks";
import { getAnimationStatement } from "./playDashboardHooks";
import { actions } from "../sprites/actions";
import { getSelectedActionData } from "../utilities/data";

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
        <option defaultValue>{selectedAction.displayName}</option>
        {availableActionsFiltered.map((action) => {
          return (<option key={action.name} value={action.name} disabled={action.rounds === 0}>
            {action.displayName}
          </option>)
        })}
      </select>
      {selectedAction.type === "PROJECTILE" && (
        <ShotControls gameState={gameState} setGameState={setGameState} />
      )}
      {selectedAction.type === "DRIVE" && (
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

  const selectedAction = getSelectedActionData(currentTank.selectedAction, currentTank.availableActions)
  console.log("actions", actions);
  console.log("selectedAction pulled out", selectedAction);
  const availableActions = currentTank.availableActions;
  const availableActionsFiltered = availableActions.filter(
    (action) => action.name !== selectedAction.name
  );
  const animationStatement = getAnimationStatement(gameState);
  const noRoundsRemain = selectedAction.rounds === 0 && selectedAction.type === "PROJECTILE"

  return (
    <div style={{ backgroundColor: "lightgrey", padding: "10px" }}>
      <div className="row">
        <div className="col-4">
          <Shields gameState={gameState} />
        </div>
        <div className="col-7">
          {animationsExecuting && <p>&quot;{animationStatement}&quot;</p>}
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
            disabled={animationsExecuting || noRoundsRemain}
            onClick={() => advancePlayerTurn({ gameState, setGameState })}
          >
            {selectedAction.type === "DRIVE" ? "Drive!" : "Fire!"}
          </button>
        </div>
      </div>
    </div>
  );
};
