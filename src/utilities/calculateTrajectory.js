// https://openstax.org/books/college-physics-2e/pages/3-4-projectile-motion#:~:text=Projectile%20motion%20is%20the%20motion,path%20is%20called%20its%20trajectory.
import { environmentConstants } from "../gameplay/constants";
import { degreesToRadians } from "./turretPosition";
import { tankDimensions } from "../sprites/tanks";

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
  const { initialX, currentTime, initialVelocity, launchAngle } = props;
  const velocityX = initialVelocity * Math.cos(degreesToRadians(launchAngle));
  return initialX + currentTime * velocityX;
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

const getTimeAtY = (props) => {
  const { initialY, currentY, initialVelocity, launchAngle } = props;

  const initialVelocityY =
    initialVelocity * Math.sin(degreesToRadians(launchAngle));
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
    (-1 *
      (initialVelocityY +
        Math.sqrt(
          initialVelocityY ** 2 -
            4 * 0.5 * gravity * initialY +
            4 * 0.5 * gravity * currentY
        ))) /
    (2 * 0.5 * gravity);
  const minusTime =
    (-1 *
      (initialVelocityY -
        Math.sqrt(
          initialVelocityY ** 2 -
            4 * 0.5 * gravity * initialY +
            4 * 0.5 * gravity * currentY
        ))) /
    (2 * 0.5 * gravity);
  const intersectionTimes = [];
  if (plusTime >= 0) intersectionTimes.push(plusTime);
  if (minusTime >= 0) intersectionTimes.push(minusTime);
  return intersectionTimes;
};

export const getXAtY = (props) => {
  const { initialX, initialY, currentY, initialVelocity, launchAngle } = props;
  const intersectionTimes = getTimeAtY({
    initialY,
    currentY,
    initialVelocity,
    launchAngle,
  });
  const xValuesAtY = intersectionTimes.map((currentTime) =>
    getXAtTime({ initialX, currentTime, initialVelocity, launchAngle })
  );
  return xValuesAtY;
};

export const getPositionAtTime = (props) => {
  const {
    initialX,
    initialY,
    initialVelocity,
    launchAngle,
    projectileDirection,
    time,
  } = props;
  const initialVelocityY =
    projectileDirection *
    -initialVelocity *
    Math.sin(degreesToRadians(launchAngle));
  const initialVelocityX =
    initialVelocity * Math.cos(degreesToRadians(launchAngle));
  // x1 = xo + vx*t
  const positionXAtTime = initialX + initialVelocityX * time;
  const positionYAtTime =
    initialY +
    initialVelocityY * time +
    0.5 * environmentConstants.gravity * time ** 2;
  return [positionXAtTime, positionYAtTime];
};

export const createTrajectory = (props) => {
  const {
    initialX,
    initialY,
    initialVelocity,
    launchAngle,
    projectileDirection,
    gameState,
  } = props;
  const { canvasHeight, canvasWidth, timeout, frameRate } =
    environmentConstants;
  let trajectory = [];
  let time = 0;
  let tanksHit = [];
  let groundHit = null;
  while (time <= timeout) {
    const currentPoint = getPositionAtTime({
      initialX,
      initialY,
      initialVelocity,
      launchAngle,
      projectileDirection,
      time,
    });
    trajectory.push(currentPoint);
    if (
      currentPoint[0] < 0 ||
      currentPoint[0] > canvasWidth ||
      currentPoint[1] > canvasHeight
    ) {
      break;
    }
    const tankHit = checkForCollision({ point: currentPoint, gameState });
    groundHit = checkForGroundCollision({point: currentPoint, gameState})
    if (tankHit !== null) {
      tanksHit.push(tankHit);
      break;
    }
    if (groundHit !== null) {
      break;
    }
    time += frameRate;
  }

  return { trajectory, tanksHit, groundHit };
};

export const checkForCollision = (props) => {
  const { point, gameState } = props;
  const { tanks } = gameState;
  let tankHit = null;
  tanks.forEach((tank, index) => {
    const tankStart = tank.position[0];
    const tankEnd = tank.position[0] + tankDimensions.width;
    const tankTop = tank.position[1];
    const tankBottom = tank.position[1] + tankDimensions.height;
    if (
      point[0] >= tankStart &&
      point[0] <= tankEnd &&
      point[1] >= tankTop &&
      point[1] <= tankBottom
    ) {
      tankHit = index;
    }
  });
  return tankHit;
};

export const checkForGroundCollision = (props) => {
  const { point, gameState } = props;
  const { topography } = gameState;
  const currentSectorEndIndex = topography.findIndex((sector) => sector[0] >= point[0]);
  if (currentSectorEndIndex === -1) return null;
  const currentSectorStartIndex = currentSectorEndIndex - 1;
  const startPoint = topography[currentSectorStartIndex];
  const endPoint = topography[currentSectorEndIndex];

  const topographyLineY = getYForXInLine({point1: startPoint, point2: endPoint, currentX: point[0]})
  if (topographyLineY < point[1]) {
    return [point[0], topographyLineY]
  }
  return null;
};

export const getYForXInLine = (props) => {
  // y = mx + c
  const {point1, point2, currentX} = props;
  const slope = getSlopeOfLine({point1, point2})
  const yIntercept = getYInterceptForLine({slope, point: point1});
  return (slope * currentX) + yIntercept
};

export const getYInterceptForLine = (props) => {
  const { slope, point } = props;
  const [xValue, yValue] = point;
  return yValue - (slope * xValue);
};

export const getSlopeOfLine = (props) => {
  const {point1, point2} = props;
  return (point2[1] - point1[1]) / (point2[0] - point1[0])
};
