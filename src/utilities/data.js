import { actions } from "../sprites/actions";

export const getCurrentTank = gameState => {
    const {tanks, currentPlayer} = gameState;
    return tanks[currentPlayer - 1]
}

export const getCurrentShotDamage = gameState => {
    const currentTank = getCurrentTank(gameState);
    const selectedAction = currentTank.selectedAction;
    if (!actions[selectedAction].damage) return 0;
    return actions[selectedAction]. damage;
}

export const getRandomIndexItem = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
}