import { Component } from 'react';
import PropTypes from 'prop-types';

import './ProgressBar.scss';

class ProgressBar extends Component {
    render() {
        const { progress, position, className, background } = this.props;
        return <div className={['ProgressBar', className, position].join(" ")}>
            <div className={['progress', "progress-" + progress, background].join(" ")}></div>
        </div>;
    }
}

ProgressBar.propTypes = {
    progress: PropTypes.number,
    position: PropTypes.oneOf(["bottom", "top", "left", "right", null]),
    className: PropTypes.string,
    background: PropTypes.string
}

ProgressBar.defaultProps = {
    progress: 0,
    position: null,
    className: null,
    background: "gradient-primary-light-danger"
}

export default ProgressBar;