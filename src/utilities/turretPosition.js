import { tankDimensions } from "../sprites/tanks";
import { getCoordinatesOnCircle } from "./circleManipulation";

export const calculateTurretEndpoints = (props) => {
  const { tankPosition, turretAngle } = props;
  const [tankX, tankY] = tankPosition;
  const { turretLength, width: tankWidth } = tankDimensions;
  const turretStartingX = tankX + tankWidth / 2;
  const turretStartingY = tankY;
  const turretEnding = getCoordinatesOnCircle({
    center: [turretStartingX, turretStartingY],
    radius: turretLength,
    angle: turretAngle,
  });

  return {
    startingPoint: [turretStartingX, turretStartingY],
    endingPoint: turretEnding,
  };
};
