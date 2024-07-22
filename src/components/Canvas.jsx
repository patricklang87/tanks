import { useRef, useEffect } from "react";
import { tankDimensions } from "../sprites/tanks";
import { calculateTurretEndpoints } from "../utilities/turretPosition";
import { environmentConstants } from "../gameplay/constants";
import { getNewTankPosition, centerTank, getTankY } from "../utilities/tankPosition";

const Canvas = (props) => {
  const { gameState, setGameState } = props;
  const { topography, tanks, currentPlayer, lastShot, lastShotAnimationCompleted } = gameState;
  const { canvasHeight, canvasWidth, destroyedTankColor } = environmentConstants;

  const canvasRef = useRef(null);

  const draw = (ctx, frameCount) => {
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
      environmentConstants.canvasHeight
    );
    ctx.lineTo(0, environmentConstants.canvasHeight);
    ctx.strokeStyle = "darkgreen";
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.fillStyle = "lightgreen";
    ctx.fill();
    ctx.closePath();

    tanks.forEach((tank, index) => {
      const { color, shields, turretAngle} = tank;
        const [tankX, tankY] = getTankDisplayPosition(frameCount, tank, index)
      const tankFillColor = shields > 0 ? color : destroyedTankColor
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


    drawProjectile(ctx, frameCount);
  };

  // parabola

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
    if (frameCount === lastShot.length - 1) {
      const updatedTopography = gameState.updatedTopography;
      setGameState({...gameState, topography: updatedTopography, lastShotAnimationCompleted: true})
    }
  };

  const getTankDisplayPosition = (frameCount, tank, tankIndex) => {
    const tankDriveStep = 1;
    const tankPosition = tank.position;
    const targetPosition = tank.targetPosition;
    const driveDirection = tankPosition[0] <= targetPosition[0] ? 1 : -1
    const tankDriveAnimationExecuting = tank.tankDriveAnimationExecuting
    if (!tankDriveAnimationExecuting) return tankPosition
    
    const newTankX = tankPosition[0] + frameCount * tankDriveStep * driveDirection
    let newTankPosition = [newTankX, getTankY({topography, tankX: newTankX})]
   

    if (Math.abs(targetPosition[0] - newTankX) <= tankDriveStep) {
      newTankPosition = targetPosition }
    
   
    if (newTankPosition === targetPosition) {
      let tanksUpdatedGameState = [...tanks]
      const updatedTank = { ...tank, position: targetPosition, tankDriveAnimationExecuting: false };
      tanksUpdatedGameState[tankIndex] = updatedTank;
      setGameState({...gameState, tanks: tanksUpdatedGameState})
    }
    return centerTank({uncenteredPoint: newTankPosition})
  }

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
