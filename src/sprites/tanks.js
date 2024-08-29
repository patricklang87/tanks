import { actions } from "./actions";
import { arrayToRgba } from "../utilities/colorManipulation";

export const tankDimensions = {
  height: 10,
  width: 20,
  turretLength: 15,
};

const tankColors = [
  [255, 118, 206, 1],
  [253, 255, 194, 1],
  [148, 255, 216, 1],
  [163, 216, 255, 1],
];



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
    localColor: arrayToRgba(tankColors[index]),
    currentColor: arrayToRgba(tankColors[index]),
    fuel: 100,
    selectedAction: "standardShot",
    availableActions: [
      actions.standardShot,
      actions.steelShotput,
      actions.drive,
    ],
  };
};
