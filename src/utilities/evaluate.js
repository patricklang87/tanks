export const isTruthy = (value) => {
    const truthyValues = [1, "1", "Y", true, "true"];
    return truthyValues.includes(value);
}

export const isFalsy = (value) => {
    const truthyValues = [0, "0", "N", false, "false"];
    return truthyValues.includes(value);
}