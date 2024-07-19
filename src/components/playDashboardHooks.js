export const animationsAreExecuting = (gameState)=> {
    const { tanks, lastShotAnimationCompleted, lastShot} = gameState;
    const tankAnimationExecuting = tanks.some(tank => tank.tankDriveAnimationExecuting);
    const lastShotAnimationExecuting = lastShot.length > 0 && !lastShotAnimationCompleted
    return tankAnimationExecuting || lastShotAnimationExecuting
}