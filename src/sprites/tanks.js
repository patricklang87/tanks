export const tankDimensions = {
  height: 10,
  width: 20,
  turretLength: 15,
};

const tankColors = ["red", "black", "white", "yellow"];

export const initiateTank = (props) => {
  const { index, tankPosition } = props;

  return {
    turretAngle: -90,
    shotPower: 50,
    shields: 100,
    position: tankPosition,
    color: tankColors[index],
  };
};
