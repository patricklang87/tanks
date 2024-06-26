import { useState } from "react";
import { generateTankPositions } from "../utilities/tankPosition";
import { initiateTank } from "../sprites/tanks";
import {
  createInitialTopography,
  updateTopographyOnStrike,
} from "../utilities/topography";
import { calculateTurretEndpoints } from "../utilities/turretPosition";
import {
  getYAtX,
  getYAtTopOfTrajectory,
  getTimeAtTopOfTrajectory,
  getXAtTopOfTrajectory,
  createTrajectory,
} from "../utilities/calculateTrajectory";
import { environmentConstants } from "./constants";
import { tankDimensions } from "../sprites/tanks";
import { actions } from "../sprites/actions";
import { getNewTankPosition } from "../utilities/tankPosition";

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

export const setDriveDistance = (props) => {
  const { gameState, setGameState, value } = props;
  const { currentPlayer, tanks } = gameState;
  const currentTank = tanks[currentPlayer - 1];
  const newCurrentTank = { ...currentTank, driveDistance: value };
  const newTanks = [...tanks];
  newTanks[currentPlayer - 1] = newCurrentTank;
  setGameState({ ...gameState, tanks: newTanks });
};

export const setSelectedAction = (props) => {
  const { gameState, setGameState, value } = props;
  const { currentPlayer, tanks } = gameState;
  const currentTank = tanks[currentPlayer - 1];
  const newCurrentTank = { ...currentTank, selectedAction: value };
  const newTanks = [...tanks];
  newTanks[currentPlayer - 1] = newCurrentTank;
  setGameState({ ...gameState, tanks: newTanks });
};

export const advancePlayerTurn = (props) => {
  const { gameState, setGameState } = props;
  const { numberOfPlayers, currentPlayer, topography } = gameState;

  const currentTank = gameState.tanks[currentPlayer - 1];
  const selectedAction = currentTank.selectedAction;
  let updatedLastShot = [];
  let tanksUpdatedGameState = [...gameState.tanks];
  let newTopography = topography;

  if (selectedAction === "Standard Shot") {
    const { newLastShot, tanksNewGameState, groundHit } =
      launchProjectile(props);
    updatedLastShot = newLastShot;
    tanksUpdatedGameState = tanksNewGameState;
    if (groundHit !== null) {
      newTopography = updateTopographyOnStrike({ gameState, point: groundHit });
    }
  }

  if (selectedAction === "Drive") {
    const { position, driveDistance } = currentTank;
    const newTankPosition = getNewTankPosition({
      topography,
      tankX: position[0],
      distance: driveDistance,
    });
    const updatedTank = { ...currentTank, position: newTankPosition };
    tanksUpdatedGameState[currentPlayer - 1] = updatedTank;
  }

  const nextPlayer = getNextPlayer({
    currentPlayer,
    numberOfPlayers,
    tanksUpdatedGameState,
  });
  setGameState({
    ...gameState,
    currentPlayer: nextPlayer,
    lastShot: updatedLastShot,
    tanks: tanksUpdatedGameState,
    topography: newTopography,
  });
};

const getNextPlayer = (props) => {
  const { currentPlayer, numberOfPlayers, tanksUpdatedGameState } = props;
  let nextPlayer;
  if (currentPlayer === numberOfPlayers) nextPlayer = 1;
  else nextPlayer = currentPlayer + 1;
  console.log(tanksUpdatedGameState[nextPlayer - 1].shields);
  while (tanksUpdatedGameState[nextPlayer - 1].shields <= 0) {
    if (nextPlayer === numberOfPlayers) nextPlayer = 1;
    else nextPlayer++;
  }
  console.log("np", nextPlayer);
  return nextPlayer;
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
    projectileDirection,
  });
  const pointAtTop = [xAtTop, yAtTop];

  // const strikes = checkForStrikes({
  //   initialX,
  //   initialY,
  //   initialVelocity,
  //   launchAngle,
  //   projectileDirection,
  //   tanks,
  //   currentPlayer,
  // });

  const {
    trajectory: newTrajectory,
    tanksHit,
    groundHit,
  } = createTrajectory({
    initialX,
    initialY,
    initialVelocity,
    launchAngle,
    projectileDirection,
    gameState,
  });

  const tanksNewGameState = tanks.map((tank, index) => {
    if (tanksHit.includes(index)) {
      const strikeType = tanks[currentPlayer - 1].selectedAction;
      const damage = actions[strikeType].damage;
      return {
        ...tank,
        shields: tank.shields - damage,
      };
    }
    return tank;
  });

  if (turretAngle === -90) {
    return {
      newLastShot: newTrajectory,
      // newLastShot: [endingPoint, pointAtTop, endingPoint],
      tanksNewGameState,
      groundHit,
    };
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

  let trimmedNewLastShotWithEndingPoint = [endingPoint, ...trimmedNewLastShot];
  if (projectileDirection === -1)
    trimmedNewLastShotWithEndingPoint = [...trimmedNewLastShot, endingPoint];

  let newLastShotWithApex = trimmedNewLastShotWithEndingPoint;
  if (pointAtTop[0] >= 0 || pointAtTop[0] <= environmentConstants.canvasWidth) {
    const xAtTopIndex = newLastShotWithApex.findIndex(
      (point) => point[0] >= pointAtTop[0]
    );
    if (xAtTopIndex !== -1) {
      newLastShotWithApex.splice(xAtTopIndex, 0, pointAtTop);
    }
  }

  return { newLastShot: newTrajectory, tanksNewGameState, groundHit };
  // return { newLastShot: newLastShotWithApex, tanksNewGameState };
};

// const checkForStrikes = props => {
//   { initialX, initialY, currentY, initialVelocity, launchAngle, tanks }
//   const strikes = tanks.map((tank, index) => {
//     const startingPoint = [tank.position[0] , tank.position[1]]
//     const endingPoint = [tank.position[0] + tankDimensions.width, tank.position[1]]
//     const xIntersectsAtTankY = getXAtY({initialX, initialY, currentY: tank.position[1], initialVelocity, launchAngle});
//     const strikeObject = {tankIndex: index, hit: false, startingPoint, endingPoint, xIntersectsAtTankY}
//     if (xIntersectsAtTankY.some(intersect => intersect >= startingPoint[0] && intersect <= endingPoint[0])) {
//       strikeObject.hit = true
//     }
//     return strikeObject
//   });

//   return strikes;
// }

const checkForStrikes = (props) => {
  const {
    initialX,
    initialY,
    initialVelocity,
    launchAngle,
    tanks,
    projectileDirection,
    currentPlayer,
  } = props;
  const strikes = tanks.map((tank, index) => {
    const tankStartX = tank.position[0];
    const tankEndX = tank.position[0] + tankDimensions.width;
    const tankTopY = tank.position[1];
    const tankBottomY = tank.position[1] + tankDimensions.height;
    const yIntersectTankStart = getYAtX({
      initialX,
      initialY,
      currentX: tankStartX,
      initialVelocity: initialVelocity,
      launchAngle,
      projectileDirection,
    });
    const yIntersectTankEnd = getYAtX({
      initialX,
      initialY,
      currentX: tankEndX,
      initialVelocity,
      launchAngle,
      projectileDirection,
    });
    const intersectsStartWall =
      yIntersectTankStart >= tankTopY &&
      yIntersectTankStart <= tankBottomY &&
      currentPlayer !== index + 1;
    const intersectsEndWall =
      yIntersectTankEnd >= tankTopY &&
      yIntersectTankEnd <= tankBottomY &&
      currentPlayer !== index + 1;
    const risesThroughTank =
      yIntersectTankStart >= tankBottomY &&
      yIntersectTankEnd <= tankTopY &&
      currentPlayer !== index + 1;
    const fallsThroughTank =
      yIntersectTankStart <= tankTopY &&
      yIntersectTankEnd >= tankBottomY &&
      currentPlayer !== index + 1;

    const timeAtTop = getTimeAtTopOfTrajectory({
      initialVelocity,
      launchAngle,
    });
    const xAtTop = getXAtTopOfTrajectory({
      initialVelocity,
      launchAngle,
      initialX,
      projectileDirection,
    });
    const yAtTop = getYAtTopOfTrajectory({
      timeAtTop,
      initialY,
      initialVelocity,
      launchAngle,
    });
    const strikesFromBelow =
      yAtTop >= tankBottomY &&
      yAtTop <= tankTopY &&
      xAtTop >= tankStartX &&
      xAtTop <= tankEndX;

    const fallsThroughSelf =
      xAtTop >= tankStartX &&
      xAtTop <= tankEndX &&
      yAtTop >= yAtTop &&
      (yIntersectTankStart >= tankBottomY || yIntersectTankEnd >= tankBottomY);

    const hit =
      intersectsEndWall ||
      intersectsStartWall ||
      risesThroughTank ||
      fallsThroughTank ||
      strikesFromBelow ||
      fallsThroughSelf;

    //   let lastShotIntersection = null;
    // if (hit) {
    //   if (intersectsStartWall) {
    //     lastShotIntersection = [tankStartX, yIntersectTankStart]
    //   } else if (intersectsEndWall) {
    //     lastShotIntersection = [tankEndX, yIntersectTankEnd]
    //   } else if (risesThroughTank) {
    //     lastShotIntersection = [getXAtY(), tankTopY]
    //   } else if (fallsThroughTank) {
    //     lastShotIntersection = tankTopY
    //   } else if (strikesFromBelow) {
    //     lastShotIntersection = tankBottomY
    //   }
    //   else lastShotIntersection = tankTop
    // }

    return {
      hit,
      yIntersectTankStart,
      yIntersectTankEnd,
      tankStartX,
      tankEndX,
      tankTopY,
      tankBottomY,
      intersectsStartWall,
      intersectsEndWall,
      risesThroughTank,
      fallsThroughTank,
      yAtTop,
      xAtTop,
      strikesFromBelow,
      fallsThroughSelf,
      // lastShotIntersection,
    };
  });

  return strikes;
};
