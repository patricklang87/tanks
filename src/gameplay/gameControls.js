import { useState } from "react";
import { generateTankPositions } from "../utilities/tankPosition";
import { initiateTank } from "../sprites/tanks";
import { createInitialTopography } from "../utilities/topography";
import { calculateTurretEndpoints } from "../utilities/turretPosition";
import {
  getYAtX,
  getYAtTopOfTrajectory,
  getTimeAtTopOfTrajectory,
  getXAtTopOfTrajectory,
} from "../utilities/calculateTrajectory";
import { environmentConstants } from "./constants";

export const useInitiateGame = (props) => {
  const {
    numberOfPlayers,
    canvasHeight,
    canvasWidth,
    increments,
    maxVariationCoefficient,
    minHeightCoefficient,
    maxHeightCoefficient,
  } = props;

  const initialTopography = createInitialTopography({
    canvasHeight,
    canvasWidth,
    increments,
    maxVariationCoefficient,
    minHeightCoefficient,
    maxHeightCoefficient,
  });

  const tankPositions = generateTankPositions({
    canvasWidth,
    topography: initialTopography,
    numberOfTanks: numberOfPlayers,
  });

  const [gameState, setGameState] = useState({
    numberOfPlayers,
    currentPlayer: 1,
    topography: initialTopography,
    lastShot: [],
    tanks: tankPositions.map((tankPosition, index) =>
      initiateTank({ tankPosition, index })
    ),
  });

  return { gameState, setGameState };
};

export const setTurretAngle = (props) => {
  const { gameState, setGameState, value } = props;
  const { currentPlayer, tanks } = gameState;
  const currentTank = tanks[currentPlayer - 1];
  const newCurrentTank = { ...currentTank, turretAngle: value - 90 };
  const newTanks = [...tanks];
  newTanks[currentPlayer - 1] = newCurrentTank;
  setGameState({ ...gameState, tanks: newTanks });
};

export const setShotPower = (props) => {
  const { gameState, setGameState, value } = props;
  const { currentPlayer, tanks } = gameState;
  const currentTank = tanks[currentPlayer - 1];
  const newCurrentTank = { ...currentTank, shotPower: value };
  const newTanks = [...tanks];
  newTanks[currentPlayer - 1] = newCurrentTank;
  setGameState({ ...gameState, tanks: newTanks });
};

export const advancePlayerTurn = (props) => {
  const { gameState, setGameState } = props;
  const { numberOfPlayers, currentPlayer } = gameState;

  const newLastShot = launchProjectile(props);
  if (numberOfPlayers === currentPlayer) {
    setGameState({ ...gameState, currentPlayer: 1, lastShot: newLastShot });
  } else {
    const nextPlayer = currentPlayer + 1;
    setGameState({
      ...gameState,
      currentPlayer: nextPlayer,
      lastShot: newLastShot,
    });
  }
};

const getLaunchAngle = (props) => {
  const { turretAngle } = props;
  let turretAngleAgainstHorizon;
  if (turretAngle <= 0 && turretAngle >= -90)
    turretAngleAgainstHorizon = turretAngle * -1;
  if (turretAngle < -90 && turretAngle >= -180)
    turretAngleAgainstHorizon = 180 + turretAngle;
  return turretAngleAgainstHorizon;
};

export const launchProjectile = (props) => {
  const { gameState } = props;
  const { topography, tanks, currentPlayer } = gameState;
  const tank = tanks[currentPlayer - 1];
  const { position, shotPower, turretAngle } = tank;

  const launchAngle = getLaunchAngle({ turretAngle });
  const { endingPoint } = calculateTurretEndpoints({
    tankPosition: position,
    turretAngle,
  });
  const [initialX, initialY] = endingPoint;
  const projectileDirection = turretAngle >= -90 ? 1 : -1;
  const initialVelocity = shotPower * projectileDirection;

  const timeAtTop = getTimeAtTopOfTrajectory({
    initialVelocity,
    launchAngle,
  });

  const yAtTop = getYAtTopOfTrajectory({
    timeAtTop,
    initialY,
    initialVelocity,
    launchAngle,
  });

  const xAtTop = getXAtTopOfTrajectory({
    initialX,
    initialVelocity,
    launchAngle,
  });
  const pointAtTop = [xAtTop, yAtTop];

  if (turretAngle === -90) {
    return [endingPoint, pointAtTop, endingPoint];
  }
  const newLastShot = topography.map((point) => {
    return [
      point[0],
      getYAtX({
        initialY,
        initialX,
        launchAngle,
        initialVelocity,
        currentX: point[0],
        projectileDirection,
      }),
    ];
  });
  const trimmedNewLastShot = newLastShot.filter((point) => {
    if (projectileDirection > 0) {
      return point[0] > initialX;
    } else return point[0] < initialX;
  });
  console.log("trimmedNewLastShot", trimmedNewLastShot);

  let trimmedNewLastShotWithEndingPoint = [endingPoint, ...trimmedNewLastShot];
  if (projectileDirection === -1)
    trimmedNewLastShotWithEndingPoint = [...trimmedNewLastShot, endingPoint];

  let newLastShotWithApex = trimmedNewLastShotWithEndingPoint;
  console.log("pointAtTop", pointAtTop);
  if (pointAtTop[0] >= 0 || pointAtTop[0] <= environmentConstants.canvasWidth) {
    const xAtTopIndex = newLastShotWithApex.findIndex(
      (point) => point[0] >= pointAtTop[0]
    );
    console.log("xAtTopIndex", xAtTopIndex);
    console.log("nslaw1", newLastShotWithApex);
    if (xAtTopIndex !== -1) {
    newLastShotWithApex.splice(
      xAtTopIndex,
      0,
      pointAtTop
    );
    }

    console.log("newLastShotWithApex", newLastShotWithApex);
  }
  return newLastShotWithApex;
  // return trimmedNewLastShot
};
