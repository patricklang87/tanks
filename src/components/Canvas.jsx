import { useRef, useEffect } from "react";
import { tankDimensions } from "../sprites/tanks";
import { calculateTurretEndpoints } from "../utilities/turretPosition";
import { environmentConstants } from "../gameplay/constants";

/* eslint-disable react/prop-types */
// const Canvas = props => {

//   const canvasRef = useRef(null)

//   const draw = (ctx, frameCount) => {
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

//     var grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
// grd.addColorStop(0, "red");
// grd.addColorStop(1, "white");

// // Fill with gradient
// ctx.fillStyle = grd;
// ctx.fillRect(10, 10, 150, 80);

//     ctx.fillStyle = '#ffff11'
//     ctx.beginPath()
//     ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
//     ctx.fill()

//   }

//   useEffect(() => {

//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
//     let frameCount = 0;
//     let animationFrameId;

//     //Our draw came here
//     const render = () => {
//       frameCount++;
//       draw(context, frameCount);
//       animationFrameId = window.requestAnimationFrame(render);
//     }
//     render()

//     return () => {
//       window.cancelAnimationFrame(animationFrameId)
//     }
//   }, [draw])

//   return <canvas ref={canvasRef} {...props}/>
// }

// export default Canvas

const Canvas = (props) => {
  const { gameState } = props;
  const { topography, tanks, currentPlayer, lastShot } = gameState;
  const { canvasHeight, canvasWidth } = environmentConstants;

  const canvasRef = useRef(null);

  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "blue");

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // yellow circle
    ctx.fillStyle = "#ffff11";
    ctx.beginPath();
    ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
    ctx.fill();

    // topography
    // const initialTopography = createInitialTopography({
    //   canvasHeight: height,
    //   canvasWidth: width,
    //   increments: 50,
    //   maxVariationCoefficient: 0.05,
    //   minHeightCoefficient: 0.2,
    //   maxHeightCoefficient: 0.8,
    // });

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
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    // add tanks
    // const tankPositions = generateTankPositions({
    //   canvasWidth: width,
    //   topography: initialTopography,
    //   numberOfTanks: 3,
    // });

    tanks.forEach((tank) => {
      const { color, position, turretAngle } = tank;
      const [tankX, tankY] = position;
      // ctx.fillStyle = "#000000";
      // ctx.beginPath();
      // ctx.arc(tankX, tankY, 10, 0, 2 * Math.PI);
      // ctx.fill();

      ctx.fillStyle = color;
      ctx.fillRect(tankX, tankY, tankDimensions.width, tankDimensions.height);

      ctx.fillStyle = color;
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
        tankPosition: position,
        turretAngle: turretAngle,
      });
      ctx.beginPath();
      ctx.moveTo(...startingPoint);
      ctx.lineTo(...endingPoint);
      ctx.strokeStyle = color;
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

    // lastShot
    ctx.beginPath();
    if (lastShot.length > 0) {
      ctx.moveTo(...lastShot[0]);
      lastShot.forEach((point) => ctx.lineTo(...point));
      ctx.lineWidth = 2;
      ctx.strokeStyle = "grey";
      ctx.stroke();
      ctx.closePath();
    }

    // 100 px markers
    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.lineTo(100, 800);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(200, 0);
    ctx.lineTo(200, 800);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(300, 0);
    ctx.lineTo(300, 800);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(400, 0);
    ctx.lineTo(400, 800);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(500, 0);
    ctx.lineTo(500, 800);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(600, 0);
    ctx.lineTo(600, 800);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(700, 0);
    ctx.lineTo(700, 800);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(800, 0);
    ctx.lineTo(800, 800);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(900, 0);
    ctx.lineTo(900, 800);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(1000, 0);
    ctx.lineTo(1000, 800);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(1100, 0);
    ctx.lineTo(1100, 800);
    ctx.stroke();
    ctx.closePath();
  };

  // parabola

  // useEffect(() => {

  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext('2d');
  //   let frameCount = 0;
  //   let animationFrameId;

  //   //Our draw came here
  //   const render = () => {
  //     frameCount++;
  //     draw(context, frameCount);
  //     animationFrameId = window.requestAnimationFrame(render);
  //   }
  //   render()

  //   return () => {
  //     window.cancelAnimationFrame(animationFrameId)
  //   }
  // }, [draw])

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const frameCount = 100;
    draw(context, frameCount);
  }, [draw]);

  return <canvas ref={canvasRef} height={canvasHeight} width={canvasWidth} />;
};

export default Canvas;
