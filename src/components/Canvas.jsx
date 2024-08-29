import { useRef, useEffect, useCallback } from "react";
import { tankDimensions } from "../sprites/tanks";
import { calculateTurretEndpoints } from "../utilities/turretPosition";
import { environmentConstants } from "../gameplay/constants";
import {
  centerTank,
  getTankY,
} from "../utilities/tankPosition";

const Canvas = (props) => {
  const { gameState, setGameState } = props;
  const {
    topography,
    tanks,
    currentPlayer,
    lastShot,
    lastShotAnimationCompleted,
  } = gameState;
  const { canvasHeight, canvasWidth, destroyedTankColor } =
    environmentConstants;

  const canvasRef = useRef(null);

  const draw = useCallback((ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "skyblue");

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // yellow circle
    ctx.fillStyle = "#ffff11";
    ctx.beginPath();
    ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    topography.forEach((point, index) => {
      const positionX = point[0];
      const positionY = point[1];
      if (index === 0) {
        ctx.moveTo(positionX, positionY);
      } else {
        ctx.lineTo(positionX, positionY);
      }
    });
    ctx.lineTo(
      environmentConstants.canvasWidth,
      environmentConstants.canvasHeight +
        environmentConstants.landscapeStrokeWidth
    );
    ctx.lineTo(0, environmentConstants.canvasHeight);
    ctx.strokeStyle = "darkgreen";
    ctx.lineWidth = environmentConstants.landscapeStrokeWidth;
    ctx.stroke();
    ctx.fillStyle = "lightgreen";
    ctx.fill();
    ctx.closePath();

    drawProjectile(ctx, frameCount);

    tanks.forEach((tank, index) => {
      const { color, shields, turretAngle } = tank;
      const [tankX, tankY] = getTankDisplayPosition(
        frameCount,
        tank,
        index
      );
      const tankFillColor = shields > 0 ? color : destroyedTankColor;
      ctx.fillStyle = tankFillColor;
      ctx.fillRect(tankX, tankY, tankDimensions.width, tankDimensions.height);

      ctx.fillStyle = tankFillColor;
      ctx.beginPath();
      ctx.arc(
        tankX + tankDimensions.width / 2,
        tankY,
        tankDimensions.height / 2,
        0,
        2 * Math.PI
      );
      ctx.fill();

      const { startingPoint, endingPoint } = calculateTurretEndpoints({
        tankPosition: [tankX, tankY],
        turretAngle: turretAngle,
      });
      ctx.beginPath();
      ctx.moveTo(...startingPoint);
      ctx.lineTo(...endingPoint);
      ctx.strokeStyle = tankFillColor;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.closePath();
    });

    // current turn display

    const currentTank = tanks[currentPlayer - 1];
    const displayTankX = tankDimensions.width * 2;
    const displayTankY = canvasHeight - tankDimensions.width * 2;

    ctx.strokeStyle = currentTank.color;
    ctx.beginPath();
    ctx.arc(
      displayTankX + tankDimensions.width / 2,
      displayTankY,
      tankDimensions.height * 2.5,
      0,
      2 * Math.PI
    );
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = currentTank.color;
    ctx.fillRect(
      displayTankX,
      displayTankY,
      tankDimensions.width,
      tankDimensions.height
    );

    ctx.fillStyle = currentTank.color;
    ctx.beginPath();
    ctx.arc(
      displayTankX + tankDimensions.width / 2,
      displayTankY,
      tankDimensions.height / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.closePath();

    const { startingPoint, endingPoint } = calculateTurretEndpoints({
      tankPosition: [displayTankX, displayTankY],
      turretAngle: -30,
    });
    ctx.beginPath();
    ctx.moveTo(...startingPoint);
    ctx.lineTo(...endingPoint);
    ctx.strokeStyle = currentTank.color;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
  });


  const drawProjectile = (context, frameCount) => {
    if (!lastShotAnimationCompleted && lastShot.length > 0) {
      context.fillStyle = "#000000";
      context.beginPath();
      context.arc(
        lastShot[frameCount][0],
        lastShot[frameCount][1],
        2,
        0,
        2 * Math.PI
      );
      context.fill();
    }
    if (frameCount === lastShot.length - 1 && !lastShotAnimationCompleted) {
      const updatedTopography = gameState.updatedTopography;
      setGameState({
        ...gameState,
        topography: updatedTopography,
        tanks: gameState.tanksUpdatedGameState,
        lastShotAnimationCompleted: true,
      });
    }
  };

  const getTankDisplayPosition = (frameCount, tank, tankIndex) => {
    const tankDriveStep = 1;
    const tankFallStep = 2;
    const tankPosition = tank.position;
    const targetPosition = tank.targetPosition;
    const driveDirection = tankPosition[0] <= targetPosition[0] ? 1 : -1;
    const { tankDriveAnimationExecuting, tankFallAnimationExecuting } = tank;

    if (!tankDriveAnimationExecuting && !tankFallAnimationExecuting) return tankPosition;

    let displayTankPosition;

    if (targetPosition[0] !== tankPosition[0]) {
      const newTankX =
        tankPosition[0] + frameCount * tankDriveStep * driveDirection;
      displayTankPosition = centerTank([
        newTankX,
        getTankY({ topography, tankX: newTankX }),
      ]);

      if (
        Math.abs(targetPosition[0] - displayTankPosition[0]) <= tankDriveStep
      ) {
        displayTankPosition = targetPosition;
      }
    }

    if (
      targetPosition[0] === tankPosition[0] &&
      targetPosition[1] > tankPosition[1]
    ) {
      const newTankY = tankPosition[1] + environmentConstants.tankFallConstant * environmentConstants.gravity * frameCount**2;
      displayTankPosition = [tankPosition[0], newTankY];

      if (Math.abs(targetPosition[1] - newTankY) <= tankFallStep || newTankY > targetPosition[1]) {
        displayTankPosition = targetPosition;
      }
    }

    if (displayTankPosition === targetPosition) {
      let tanksUpdatedGameState = [...tanks];
      console.log("tugs1", tankIndex, tanksUpdatedGameState)
      const updatedTank = {
        ...tank,
        position: targetPosition,
        tankFallAnimationExecuting: false,
      };
      tanksUpdatedGameState[tankIndex] = updatedTank;
      console.log("tugs2", tankIndex, tanksUpdatedGameState)
      setGameState({ ...gameState, tanks: tanksUpdatedGameState });
    } else {
      console.log("no match", tankIndex)
    }
    return displayTankPosition;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let frameCount = 0;
    let animationFrameId;

    //Our draw came here
    const render = () => {
      frameCount++;

      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, lastShotAnimationCompleted]);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext("2d");
  //   // const frameCount = 100;
  //   draw(context);
  // }, [draw]);

  return <canvas ref={canvasRef} height={canvasHeight} width={canvasWidth} />;
};

export default Canvas;
