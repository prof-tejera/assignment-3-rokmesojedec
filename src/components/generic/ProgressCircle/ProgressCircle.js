import { Component } from 'react';
import PropTypes from 'prop-types';
import './ProgressCircle.scss';

class ProgressCircle extends Component {
    render() {
        const { progress, className,  children, size, thickness } = this.props;
        return <div className={[`size-${size}`, `thickness-${thickness}`, 'ProgressCircle', className].join(" ")}>
            <div className={['overlay', "progress-" + progress].join(" ")}>
                <div className={['InnerCircle'].join(" ")}>
                    {children}
                </div>
            </div>
        </div>;
    }
}

ProgressCircle.propTypes = {
    progress: PropTypes.number,
    className: PropTypes.string,
    thickness: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "xxl"]),
    size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "xxl"])
}

ProgressCircle.defaultProps = {
    progress: 0,
    className: null,
    thickness: "sm",
    size: "lg"
}

export default ProgressCircle;