// https://openstax.org/books/college-physics-2e/pages/3-4-projectile-motion#:~:text=Projectile%20motion%20is%20the%20motion,path%20is%20called%20its%20trajectory.
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
  const { initialVelocity, launchAngle, initialX, projectileDirection } = props;
  const velocityX = initialVelocity * Math.cos(degreesToRadians(launchAngle));
  const timeAtTop = getTimeAtTopOfTrajectory({ initialVelocity, launchAngle });
  return initialX + projectileDirection * velocityX * timeAtTop;
};

const getTimeAtX = (props) => {
  const { initialX, currentX, initialVelocity, launchAngle } = props;
  const velocityX = initialVelocity * Math.cos(degreesToRadians(launchAngle));
  return (currentX - initialX) / velocityX;
};

const getXAtTime = (props) => {
  const {initialX, currentTime, initialVelocity, launchAngle} = props; 
  const velocityX = initialVelocity * Math.cos(degreesToRadians(launchAngle));
  return initialX + currentTime * velocityX;
}

const getTimeAtY = (props) => {
  const { initialY, currentY, initialVelocity, launchAngle } = props;

  const initialVelocityY = initialVelocity * Math.sin(degreesToRadians(launchAngle));
  const { gravity } = environmentConstants;
  // newY = inititalY + initialVelocityY * time  - 1/2 * gravity * time ** 2
  // newY - initialY = initialVelocityY * time - 1/2 * gravity * time ** 2
  // ax2 + bx + c = y
  // c = initialY
  // b = initialVelocityY
  // a = 1/2 gravity
  // y = currentY
  // https://www.mathway.com/popular-problems/Algebra/212621
  const plusTime =
    -1 * ((initialVelocityY +
      Math.sqrt(
        initialVelocityY ** 2 -
          4 * 0.5 * gravity * initialY +
          4 * 0.5 * gravity * currentY
      ))) /
     ( 2 *
    0.5 *
    gravity);
  const minusTime =
    -1 *((initialVelocityY -
      Math.sqrt(
        initialVelocityY ** 2 -
          4 * 0.5 * gravity * initialY +
          4 * 0.5 * gravity * currentY
      ))) /
      (2 *
    0.5 *
    gravity);
  const intersectionTimes = [];
  if (plusTime >= 0) intersectionTimes.push(plusTime);
  if (minusTime >= 0) intersectionTimes.push(minusTime);
  return intersectionTimes;
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

export const getXAtY = (props) => {
  const { initialX, initialY, currentY, initialVelocity, launchAngle } = props;
  const intersectionTimes = getTimeAtY({initialY, currentY, initialVelocity, launchAngle});
  const xValuesAtY = intersectionTimes.map(currentTime => getXAtTime({initialX, currentTime, initialVelocity, launchAngle}));
  return xValuesAtY;
};
