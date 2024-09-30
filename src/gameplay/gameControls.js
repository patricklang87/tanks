import { useState } from "react";
import { generateTankPositions } from "../utilities/tankPosition";
import { initiateTank, tankDimensions } from "../sprites/tanks";
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
import { actions } from "../sprites/actions";
import {
  getNewTankPosition,
  getTankY,
} from "../utilities/tankPosition";
import { getSelectedActionData } from "../utilities/data";
import { arrayToRgba } from "../utilities/colorManipulation";

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
    updatedTopography: initialTopography,
    lastShot: [],
    lastShotAnimationCompleted: false,
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
  const selectedAction = getSelectedActionData(
    currentTank.selectedAction,
    currentTank.availableActions
  );
  let updatedLastShot = [];
  let tanksUpdatedGameState = gameState.tanks.map((tank) => {return {...tank, currentColor: tank.localColor}});
  let newTopography = topography;

  if (selectedAction.type === "PROJECTILE") {
    const { newLastShot, tanksNewGameState, groundHit } =
      launchProjectile({gameState, tanksUpdatedGameState});
    updatedLastShot = newLastShot;
    tanksUpdatedGameState = tanksNewGameState;
    if (groundHit !== null) {
      newTopography = updateTopographyOnStrike({ gameState, point: groundHit });
      tanksUpdatedGameState = makeTanksFall({ gameState, newTopography });
    }
  }

  if (selectedAction.type === "DRIVE") {
    const { position, driveDistance } = currentTank;
    const newTankPosition = getNewTankPosition({
      topography,
      tankX: position[0],
      distance: driveDistance,
    });
    const centeredTankPosition = newTankPosition;
    const updatedTank = {
      ...currentTank,
      targetPosition: centeredTankPosition,
      tankDriveAnimationExecuting: true,
    };
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
    lastShotAnimationCompleted: false,
    tanks: 
      selectedAction.type === "DRIVE" ? tanksUpdatedGameState : gameState.tanks,
    tanksUpdatedGameState,
    updatedTopography: newTopography,
  });
};

const getNextPlayer = (props) => {
  const { currentPlayer, numberOfPlayers, tanksUpdatedGameState } = props;
  let nextPlayer;
  if (currentPlayer === numberOfPlayers) nextPlayer = 1;
  else nextPlayer = currentPlayer + 1;
  while (tanksUpdatedGameState[nextPlayer - 1].shields <= 0) {
    if (nextPlayer === numberOfPlayers) nextPlayer = 1;
    else nextPlayer++;
  }

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
  const { gameState, tanksUpdatedGameState } = props;
  const { topography, currentPlayer } = gameState;
  const tank = tanksUpdatedGameState[currentPlayer - 1];
  const { position, shotPower, turretAngle, selectedAction } = tank;

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

  const tanksNewGameState = tanksUpdatedGameState.map((tank, index) => {
    let tankUpdated = { ...tank };
    if (tanksHit.includes(index)) {
      const strikeType = tanksUpdatedGameState[currentPlayer - 1].selectedAction;
      const damage = actions[strikeType].damage;
      tankUpdated = {
        ...tankUpdated,
        shields: tankUpdated.shields - damage,
        currentColor: arrayToRgba(environmentConstants.struckTankColor),
      };
    }
    if (index === currentPlayer - 1) {
      const selectedActionData = getSelectedActionData(
        tank.selectedAction,
        tank.availableActions
      );
      const selectedActionIndex = tank.availableActions.findIndex(
        (action) => action.name === selectedAction
      );
      const rounds = selectedActionData.rounds;
      if (typeof rounds === "number") {
        const availableActions = [...tank.availableActions];
        availableActions[selectedActionIndex] = {
          ...selectedActionData,
          rounds: rounds - 1,
        };
        tankUpdated = { ...tankUpdated, availableActions };
      }
    }
    return tankUpdated;
  });

  if (turretAngle === -90) {
    return {
      newLastShot: newTrajectory,
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
};

export const makeTanksFall = (props) => {
  const { gameState, newTopography } = props;
  const { tanks } = gameState;
  const updatedTanks = tanks.map((tank) => {
    const newTankY = getTankY({ topography: newTopography, tankX: tank.position[0] });
    const newTankPosition = [tank.position[0], newTankY  - tankDimensions.height]
    if (tank.position[1] < newTankPosition[1]) {
      return {
        ...tank,
        targetPosition: newTankPosition,
        tankFallAnimationExecuting: true,
      };
    }
    return tank;
  });
  return updatedTanks;
};
