import { tankDimensions } from "../sprites/tanks";
export const calculateTurretEndpoints = (props) => {
  const { tankPosition, turretAngle } = props;
  const [tankX, tankY] = tankPosition;
  const { turretLength, width: tankWidth } = tankDimensions;
  const turretStartingX = tankX + tankWidth / 2;
  const turretStartingY = tankY;
  const angleInRad = degreesToRadians(turretAngle);
  const turretEndingX = turretStartingX + Math.cos(angleInRad) * turretLength;
  const turretEndingY = turretStartingY + Math.sin(angleInRad) * turretLength;
  return {
    startingPoint: [turretStartingX, turretStartingY],
    endingPoint: [turretEndingX, turretEndingY],
  };
};

const degreesToRadians = (degrees) => {
  const pi = Math.PI;
  return degrees * (pi / 180);
};
