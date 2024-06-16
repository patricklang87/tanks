import { useId } from "react";
import {
  setTurretAngle,
  advancePlayerTurn,
  setShotPower,
} from "../gameplay/gameControls";

const TankControls = (props) => {
  const { gameState, setGameState } = props;
  const turretAngleInputId = useId();
  const shotPowerIndexId = useId();
  const { currentPlayer, tanks } = gameState;
  const currentTank = tanks[currentPlayer - 1];
  const { turretAngle, shotPower } = currentTank;
  return (
    <>
      <label htmlFor={turretAngleInputId}>Turret Angle:</label>
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
      />
      <hr />
      <label htmlFor={shotPowerIndexId}>Shot Power:</label>
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
      />
      <button onClick={() => advancePlayerTurn({ gameState, setGameState })}>
        Shoot!
      </button>
    </>
  );
};

export default TankControls;
