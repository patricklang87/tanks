import { tankDimensions } from "../sprites/tanks";

export const centerTank = (uncenteredPoint) => {
  const { width: tankWidth, height: tankHeight } = tankDimensions;
  const [tankX, tankY] = uncenteredPoint;
  return [tankX - tankWidth / 2, tankY - tankHeight];
};

export const centerTankVertically = (uncenteredPoint) => {
  const { height: tankHeight } = tankDimensions;
  return [uncenteredPoint[0], uncenteredPoint[1] - tankHeight];
}

export const generateTankPositions = (props) => {
  const { canvasWidth, topography, numberOfTanks = 2 } = props;
  const rangeWidth = canvasWidth / numberOfTanks;
  const rangeStarts = [];
  let count = 0;
  while (count < numberOfTanks) {
    rangeStarts.push(count * rangeWidth);
    count++;
  }
  return rangeStarts.map((start) => {
    const tankX = start + Math.random() * rangeWidth;
    const tankY = getTankY({ topography, tankX });
    return centerTank([tankX, tankY]);
  });
};

export const getTankY = (props) => {
  const { topography, tankX } = props;
  const tankRightIndex = topography.findIndex((point) => point[0] >= tankX);
  const tankRightPoint = topography[tankRightIndex];
  const tankLeftPoint = topography[tankRightIndex - 1];
  if (tankLeftPoint[0] === tankX) return tankLeftPoint[1];
  const gradient =
    (tankRightPoint[1] - tankLeftPoint[1]) /
    (tankRightPoint[0] - tankLeftPoint[0]);
  const yIntercept = tankLeftPoint[1] - gradient * tankLeftPoint[0];
  return gradient * tankX + yIntercept;
};

export const getNewTankPosition = (props) => {
  const { topography, tankX, distance } = props;
  const newTankX = Number(tankX) + Number(distance);
  const newTankY = getTankY({ topography, tankX: newTankX });
  return centerTank([newTankX, newTankY]);
};
