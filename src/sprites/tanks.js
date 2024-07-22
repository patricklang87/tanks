import { actions } from "./actions";

export const tankDimensions = {
  height: 10,
  width: 20,
  turretLength: 15,
};

const tankColors = ["#FF76CE", "#FDFFC2", "#94FFD8", "#A3D8FF"];

export const initiateTank = (props) => {
  const { index, tankPosition } = props;

  return {
    turretAngle: -90,
    shotPower: 50,
    driveDistance: 0,
    shields: 100,
    position: tankPosition,
    targetPosition: tankPosition,
    tankDriveAnimationExecuting: false,
    color: tankColors[index],
    fuel: 100,
    selectedAction: "standardShot",
    availableActions: [
      actions.standardShot,
      actions.steelShotput,
      actions.drive,
    ],
  };
};
