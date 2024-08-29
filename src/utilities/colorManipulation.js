export const arrayToRgba = (array) => {
  let rgbaString = "rgba(";
  array.forEach((item, index) => {
    rgbaString += item;
    if (index !== array.length - 1) rgbaString += ", ";
  });
  return rgbaString;
};

export const fadeToStandard = (currentColor, localColor) => {
  return currentColor.map((hue, index) => {
    if (localColor[index] === hue) return;
    if (localColor[index] > hue) return hue++;
    if (localColor[index] < hue) return hue--;
  });
};
