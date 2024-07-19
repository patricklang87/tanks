import { textConstants } from "../gameplay/constants";
import { getRandomIndexItem } from "../utilities/data";

const isDriving = (tanks) => {
    return tanks.some(tank => tank.tankDriveAnimationExecuting);
}
const isShooting = (lastShotAnimationCompleted, lastShot) => {
    return lastShot.length > 0 && !lastShotAnimationCompleted
}
export const animationsAreExecuting = (gameState)=> {
    const { tanks, lastShotAnimationCompleted, lastShot} = gameState;
    const tankAnimationExecuting = isDriving(tanks);
    const lastShotAnimationExecuting = isShooting(lastShotAnimationCompleted, lastShot)
    return tankAnimationExecuting || lastShotAnimationExecuting
}

export const getAnimationStatement = (gameState) => {
    const { tanks, lastShotAnimationCompleted, lastShot} = gameState;
    const tankAnimationExecuting = isDriving(tanks);
    const lastShotAnimationExecuting = isShooting(lastShotAnimationCompleted, lastShot)
    if (tankAnimationExecuting) return getRandomIndexItem(textConstants.drivingStatements);
    if (lastShotAnimationExecuting) return getRandomIndexItem(textConstants.firingStatements);
    return "Please wait..."
}