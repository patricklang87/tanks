import { textConstants } from "../gameplay/constants";
import { getRandomIndexItem } from "../utilities/data";

const isDriving = (tanks) => {
    return tanks.some(tank => tank.tankDriveAnimationExecuting);
}
const isShooting = (lastShotAnimationCompleted, lastShot) => {
    return lastShot.length > 0 && !lastShotAnimationCompleted
}

const isFalling = (tanks) => {
    return tanks.some(tank => tank.tankFallAnimationExecuting);
}
export const animationsAreExecuting = (gameState)=> {
    const { tanks, lastShotAnimationCompleted, lastShot} = gameState;
    const driveAnimationExecuting = isDriving(tanks);
    const fallAnimationExecuting = isFalling(tanks);
    const lastShotAnimationExecuting = isShooting(lastShotAnimationCompleted, lastShot)
    return driveAnimationExecuting || lastShotAnimationExecuting || fallAnimationExecuting;
}

export const getAnimationStatement = (gameState) => {
    const { tanks, lastShotAnimationCompleted, lastShot} = gameState;
    const driveAnimationExecuting = isDriving(tanks);
    const lastShotAnimationExecuting = isShooting(lastShotAnimationCompleted, lastShot);
    const fallAnimationExecuting = isFalling(tanks);
    if (driveAnimationExecuting) return getRandomIndexItem(textConstants.drivingStatements);
    if (lastShotAnimationExecuting) return getRandomIndexItem(textConstants.firingStatements);
    if (fallAnimationExecuting) return getRandomIndexItem(textConstants.fallingStatements);
    return "Please wait..."
}