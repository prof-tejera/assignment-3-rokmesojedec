import PropTypes from 'prop-types';
import './Input.scss';

const Input = (props) => {
  const { type, value, disabled, className, min, max, onValueChange, title } = props;
  return <input className={["timer-input timer-font", className].join(" ")}
    type={type}
    value={value}
    min={min}
    max={max}
    disabled={disabled}
    title={title}
    onChange={e => onValueChange(e.target.value)}></input>;
}

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  disabled: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  onValueChange: PropTypes.func
}

Input.defaultProps = {
  type: "number",
  disabled: false,
  min: 0,
  onValueChange: () => { }
}

export default Input;