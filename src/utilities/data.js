import { actions } from "../sprites/actions";

export const getCurrentTank = gameState => {
    const {tanks, currentPlayer} = gameState;
    return tanks[currentPlayer - 1]
}

export const getCurrentShotDamage = gameState => {
    const currentTank = getCurrentTank(gameState);
    const selectedAction = currentTank.selectedAction;
    const availableActions = currentTank.availableActions;
    const selectedActionData = getSelectedActionData(selectedAction, availableActions)
    if (!selectedActionData.damage) return 0;
    return selectedActionData.damage;
}

export const getRandomIndexItem = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
}

export const getSelectedActionData = (selectedAction, availableActions) => {
    return availableActions.find(action => action.name === selectedAction) || {}
}