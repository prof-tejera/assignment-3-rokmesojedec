import './Button.scss';
import PropTypes from 'prop-types';

const Button = (props) => {
  const { disabled, onButtonClick, children, tooltip, className } = props;
  return <button
    data-tip={tooltip}
    className={['app-button round-button', className].join(" ")}
    disabled={disabled}
    onClick={e => onButtonClick(e.target.value)}>
    {children}
  </button>;
}

export default Button;

Button.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  tooltip: PropTypes.string,
  onButtonClick: PropTypes.func
}

Button.defaultProps = {
  children: "Button",
  disabled: false,
  className: "",
  tooltip: null,
  onButtonClick: () => { }
}