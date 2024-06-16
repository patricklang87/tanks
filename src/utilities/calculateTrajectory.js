import { degreesToRadians } from "./turretPosition";
// y = x tan θ − gx2/2v2 cos2 θ
// y is the horizontal component,
// x is the vertical component,
// θ is the angle at which projectile is thrown from the horizontal,
// g is a constant called the acceleration due to gravity,
// v is the initial velocity of projectile.

// // x and y components of velocity
// const initialVelocityX = initialVelocity * Math.cos(turretAngle);
// const initialVelocityY = initialVelocity * Math.sin(turretAngle);

// position calculations
// const currentX = initialX + (initialVelocityX * time);
// const currentY = initialY + (initialVelocityY * time) - 0.5 * accelrationGravity * time**2

// https://rhettallain.com/2020/03/29/projectile-motion-trajectory-equation/

export const getCurrentY = (props) => {
  const {
    initialY,
    initialX,
    launchAngle,
    initialVelocity,
    currentX,
    accelerationGravity,
  } = props;
  if (currentX === 0) {    console.log(props);
    console.log("currentX", currentX)
  console.log("launchAngle", launchAngle);
  console.log("degToRad", degreesToRadians(launchAngle));
  console.log("tan", Math.tan(degreesToRadians(launchAngle)));
console.log("y",     initialY +
Math.tan(degreesToRadians(launchAngle)) * (currentX - initialX) -
((accelerationGravity / (2 * initialVelocity ** 2) *
  Math.cos(launchAngle) ** 2) *
  (currentX - initialX) ** 2))}



  return (
    initialY +
    Math.tan(degreesToRadians(launchAngle)) * (currentX - initialX) -
    ((accelerationGravity / (2 * initialVelocity ** 2) *
      Math.cos(degreesToRadians(launchAngle)) ** 2) *
      (currentX - initialX) ** 2)
  );
};

const getTimeAtTopOfTrajectory = (props) => {
  const { initialVelocityY, gravity } = props;
  return initialVelocityY / gravity;
};

const getXAtTopOfTrajectory = (props) => {
  const { initialVelocityY, gravity, velocityX } = props;
  return velocityX * getTimeAtTopOfTrajectory({ initialVelocityY, gravity });
};

const getTimeAtBottomOfCanvas = (props) => {
  const { initialVelocityY, gravity, turretEndingPointY, canvasHeight } = props;
  return 2(canvasHeight - turretPointY);
};
