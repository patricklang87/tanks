import { useId } from "react";
import Form from "react-bootstrap/Form";
import {
  setDriveDistance
} from "../gameplay/gameControls";

const DriveControls = (props) => {
  const { gameState, setGameState } = props;
  const driveInputId = useId();
  const { currentPlayer, tanks } = gameState;
  const currentTank = tanks[currentPlayer - 1];
  const { driveDistance } = currentTank;
  return (
    <div className="align-items-center">
      <div className="row">
        <div className="col-2">
          <Form.Label>Drive to</Form.Label>
        </div>
        <div className="col-1">
          <span>{driveDistance}</span>
        </div>
        <div className="col-9">
          {" "}
          <Form.Range
            value={driveDistance}
            onChange={(e) =>
              setDriveDistance({
                gameState,
                setGameState,
                value: e.target.value,
              })
            }
            id={driveInputId}
            name="driveDistance"
            min={-150}
            max={150}
          />
        </div>
      </div>
      </div>
  );
};

export default DriveControls;
