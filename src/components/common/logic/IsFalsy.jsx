import { isTruthy } from "../../../utilities/evaluate";

const IsFalsy = props => {
    const {value, validationFunction = isTruthy, children} = props;
    return validationFunction(value) ? null : children;
}

export default IsFalsy