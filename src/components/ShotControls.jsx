import { useId } from "react";
import Form from "react-bootstrap/Form";
import {
  setTurretAngle,
  advancePlayerTurn,
  setShotPower,
} from "../gameplay/gameControls";

const ShotControls = (props) => {
  const { gameState, setGameState } = props;
  const turretAngleInputId = useId();
  const shotPowerIndexId = useId();
  const { currentPlayer, tanks } = gameState;
  const currentTank = tanks[currentPlayer - 1];
  const { turretAngle, shotPower } = currentTank;
  return (
    <div className="align-items-center">
      {/* <label htmlFor={turretAngleInputId}>Turret Angle:</label>
      <input
        value={turretAngle + 90}
        onChange={(e) =>
          setTurretAngle({ gameState, setGameState, value: e.target.value })
        }
        id={turretAngleInputId}
        name="turretAngle"
        min={-90}
        max={90}
        type="number"
      /> */}
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
      {/* <label htmlFor={shotPowerIndexId}>Shot Power:</label>
      <input
        value={shotPower}
        onChange={(e) =>
          setShotPower({ gameState, setGameState, value: e.target.value })
        }
        id={shotPowerIndexId}
        name="shotPower"
        min={0}
        max={100}
        type="number"
      /> */}
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
    </div>
  );
};

export default ShotControls;
