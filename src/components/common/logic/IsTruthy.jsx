import { isTruthy } from "../../../utilities/evaluate";

const IsTruthy = (props) => {
const {value, validationFunction = isTruthy, children} = props;
return (validationFunction(value) && children) || null;
};

export default IsTruthy