import { getYForXInLine } from "./calculateTrajectory";
import { getCurrentTank, getCurrentShotDamage} from "./data";
// import { getCoordinatesOnCircle } from "./circleManipulation";

const calculateStartingHeight = (props) => {
  const { canvasHeight, minHeightCoefficient, maxHeightCoefficient } = props;
  const maxHeight = canvasHeight * maxHeightCoefficient;
  let startingHeight = Math.random() * maxHeight;
  if (startingHeight < minHeightCoefficient * canvasHeight) startingHeight = minHeightCoefficient * canvasHeight;
  return startingHeight
};

export const createInitialTopography = (props) => {
  const {
    canvasHeight,
    canvasWidth,
    increments,
    maxVariationCoefficient,
    minHeightCoefficient,
    maxHeightCoefficient,
  } = props;
  const points = [];
  const maxHeight = canvasHeight * maxHeightCoefficient;
  const incrementWidth = canvasWidth / increments;
  points.push([
    0,
    calculateStartingHeight({ canvasHeight, minHeightCoefficient, maxHeightCoefficient }),
  ]);
  let incrementCount = 1;
  while (incrementCount <= increments) {
    const previousX = points[incrementCount - 1][0];
    const previousY = points[incrementCount - 1][1];
    const currentX = previousX + incrementWidth;
    const negativeOrPositive = Math.random() > 0.5 ? 1 : -1;
    const variation =
      negativeOrPositive *
      canvasHeight *
      maxVariationCoefficient *
      Math.random();
    let currentY = previousY + variation;
    if (currentY > maxHeight) currentY = maxHeight;
    if (currentY < 0) currentY = 0;
    points.push([currentX, currentY]);
    incrementCount++;
  }


  return points.map(point => [point[0], canvasHeight - point[1]]);
};

export const updateTopographyOnStrike = props => {
  const {gameState, point} = props;
  const { topography } = gameState;
  const damage = getCurrentShotDamage(gameState);
  const damageRadius = damage;
  const leftX = point[0] - damageRadius;
  const rightX = point[0] + damageRadius;
  const leftCraterRightIndex = topography.findIndex((segment) => segment[0] >= leftX);
    const leftCraterLeftIndex = leftCraterRightIndex - 1;
  const leftCrater = [leftX, getYForXInLine({point1: topography[leftCraterLeftIndex], point2: topography[leftCraterRightIndex], currentX: leftX})]
  
  const rightCraterRightIndex = topography.findIndex((segment) => segment[0] >= rightX);
  const rightCraterLeftIndex = rightCraterRightIndex -1;
  const rightCrater = [rightX, getYForXInLine({point1: topography[rightCraterLeftIndex], point2: topography[rightCraterRightIndex], currentX: rightX})]
  const leftTopography = topography.slice(0, leftCraterLeftIndex + 1);
  const rightTopography = topography. slice(rightCraterRightIndex, topography.length)

  const rightCraterWall = getCoordinatesOnCircle({center: point, radius: damage, angle: 45});
  const leftCraterWall = getCoordinatesOnCircle({center: point, radius: damage, angle: -225})
  const craterBase = [point[0], point[1] + damage]
  console.log("crater", leftCrater, leftCraterWall, craterBase, rightCraterWall, rightCrater)
  return [...leftTopography, leftCrater, leftCraterWall, craterBase, rightCraterWall, rightCrater, ...rightTopography]

}

const getCoordinatesOnCircle = (props) => {
  const {center, radius, angle} = props;
  const [x, y] = center;
  const xPosition = x + radius * Math.cos(Math.PI * 2 * angle / 360);
  const yPosition = y + radius * Math.sin(Math.PI * 2 * angle / 360);
  return [xPosition, yPosition]
}
