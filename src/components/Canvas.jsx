import { useRef, useEffect } from "react";
import { createInitialTopography } from "../utilities/topography";
import { generateTankPositions } from "../utilities/tankPosition";
import { tankDimensions } from "../sprites/tanks";
import { calculateTurretEndpoints } from "../utilities/turretPosition";

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
  const { height = 600, width = 800 } = props;

  const canvasRef = useRef(null);

  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "blue");

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    // yellow circle
    ctx.fillStyle = "#ffff11";
    ctx.beginPath();
    ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
    ctx.fill();

    // topography
    const initialTopography = createInitialTopography({
      canvasHeight: height,
      canvasWidth: width,
      increments: 50,
      maxVariationCoefficient: 0.05,
      minHeightCoefficient: 0.2,
      maxHeightCoefficient: 0.8,
    });

    initialTopography.forEach((point, index) => {
      const positionX = point[0];
      const positionY = point[1];
      if (index === 0) {
        ctx.moveTo(positionX, positionY);
      } else {
        ctx.lineTo(positionX, positionY);
      }
    });
    ctx.stroke();

    // add tanks
    const tankPositions = generateTankPositions({
      canvasWidth: width,
      topography: initialTopography,
      numberOfTanks: 3,
    });
    console.log("tps", tankPositions);

    tankPositions.forEach((tank) => {
      const [tankX, tankY] = tank;
      // ctx.fillStyle = "#000000";
      // ctx.beginPath();
      // ctx.arc(tankX, tankY, 10, 0, 2 * Math.PI);
      // ctx.fill();

      console.log(
        "fillRect props",
        tankX,
        tankY,
        tankDimensions.height,
        tankDimensions.width
      );

      ctx.fillStyle = "red";
      ctx.fillRect(tankX, tankY, tankDimensions.width, tankDimensions.height);

      const { startingPoint, endingPoint } = calculateTurretEndpoints({
        tankPosition: tank,
        turretAngle: 180 + Math.random() * 180,
      });
      console.log(startingPoint, endingPoint)
      ctx.moveTo(...startingPoint);
      ctx.lineTo(...endingPoint);
      ctx.stroke();
    });

    // add turrets
  };

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

  return <canvas ref={canvasRef} {...props} height={height} width={width} />;
};

export default Canvas;
