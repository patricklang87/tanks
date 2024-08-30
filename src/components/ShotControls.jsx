import { useId } from "react";
import Form from "react-bootstrap/Form";
import {
  setTurretAngle,
  setShotPower,
} from "../gameplay/gameControls";
import { getSelectedActionData } from "../utilities/data";

const ShotControls = (props) => {
  const { gameState, setGameState } = props;
  const turretAngleInputId = useId();
  const shotPowerIndexId = useId();
  const { currentPlayer, tanks } = gameState;
  const currentTank = tanks[currentPlayer - 1];
  const { turretAngle, shotPower } = currentTank;
  const selectedActionData = getSelectedActionData(
    currentTank.selectedAction,
    currentTank.availableActions
  );
  const remainingRounds = selectedActionData.rounds
  return (
    <div className="align-items-center">
      <div className="row">
        <div className="col-2">
          <Form.Label>Turret Angle</Form.Label>
        </div>
        <div className="col-1">
          <span>{turretAngle}&deg;</span>
        </div>
        <div className="col-9">
          {" "}
          <Form.Range
            value={turretAngle + 90}
            onChange={(e) =>
              setTurretAngle({
                gameState,
                setGameState,
                value: e.target.value,
              })
            }
            id={turretAngleInputId}
            name="turretAngle"
            min={-90}
            max={90}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-2">
          <Form.Label>Shot Power</Form.Label>
        </div>
        <div className="col-1">
          <span>{shotPower}%</span>
        </div>
        <div className="col-9">
          {" "}
          <Form.Range
            value={shotPower}
            onChange={(e) =>
              setShotPower({
                gameState,
                setGameState,
                value: e.target.value,
              })
            }
            id={shotPowerIndexId}
            name="shotPower"
            min={0}
            max={100}
            type="number"
          />
        </div>
      </div>
      <div>
        <span>Rounds: {remainingRounds}</span>
      </div>
    </div>
  );
};

export default ShotControls;
