import { environmentConstants } from "../gameplay/constants";
import { degreesToRadians } from "./turretPosition";

export const getTimeAtTopOfTrajectory = (props) => {
  const { initialVelocity, launchAngle } = props;
  const initialVelocityY =
    -initialVelocity * Math.sin(degreesToRadians(launchAngle));
  return initialVelocityY / environmentConstants.gravity;
};

export const getYAtTopOfTrajectory = (props) => {
  const { timeAtTop, initialY, initialVelocity, launchAngle } = props;
  const initialVelocityY =
    -initialVelocity * Math.sin(degreesToRadians(launchAngle));
  return (
    initialY +
    initialVelocityY * timeAtTop -
    0.5 * environmentConstants.gravity * timeAtTop ** 2
  );
};

export const getXAtTopOfTrajectory = (props) => {
  const { initialVelocity, launchAngle, initialX } = props;
  const velocityX = initialVelocity * Math.cos(degreesToRadians(launchAngle));
  const timeAtTop = getTimeAtTopOfTrajectory({initialVelocity, launchAngle})
  return initialX + velocityX * timeAtTop;
};

// const getTimeAtBottomOfCanvas = (props) => {
//   const { initialVelocityY, gravity, turretEndingPointY, canvasHeight } = props;
//   return 2(canvasHeight - turretPointY);
// };

const getTimeAtX = (props) => {
  const { initialX, currentX, initialVelocity, launchAngle } = props;
  const velocityX = initialVelocity * Math.cos(degreesToRadians(launchAngle));
  return (currentX - initialX) / velocityX;
};

export const getYAtX = (props) => {
  const {
    initialX,
    currentX,
    initialY,
    initialVelocity,
    launchAngle,
    projectileDirection,
  } = props;
  let timeAtCurrentX = getTimeAtX({
    initialX,
    currentX,
    initialVelocity,
    launchAngle,
  });
  timeAtCurrentX =
    projectileDirection === -1 ? -timeAtCurrentX : timeAtCurrentX;
  const initialVelocityY =
    -initialVelocity * Math.sin(degreesToRadians(launchAngle));
  return (
    initialY +
    initialVelocityY * timeAtCurrentX -
    0.5 * environmentConstants.gravity * timeAtCurrentX ** 2
  );
};
