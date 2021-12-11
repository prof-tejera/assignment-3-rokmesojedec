import { Component } from 'react';
import Input from './../Input/Input.js';
import PropTypes from 'prop-types';

import './TimeComponent.scss';

class TimeComponent extends Component {
    render() {

        const { prependZero, value, label, className,
            showColon, readOnly, onValueChange } = this.props;

        // Create CSS class string from array
        const classList = ['time-component',
            className,
            showColon ? "colon" : "no-colon",
            readOnly ? "readonly-mode" : "input-mode"]
            .filter(x => typeof x === 'string' && x.length > 0)
            .join(" ");

        let TimeDisplay = null;
        if (readOnly)
            /* Static - non-editable part of component. Only shows when readOnly is set to true*/
            TimeDisplay = <div>
                {prependZero && value < 10 && <span className='timer-font zero'>0</span>}
                <span className={'timer-font' + (value === 0 ? ' zero' : '')}>{value}</span></div>;
        else
            /* Editable part of component, shown when readOnly is false */
            TimeDisplay = <div><Input value={value} title={label} onValueChange={e => onValueChange(e)}></Input></div>;

        return <div className={classList}>
            {TimeDisplay}
            {label && <div className="label">{label}</div>}
        </div>;
    }
}

TimeComponent.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    prependZero: PropTypes.bool,
    label: PropTypes.string,
    className: PropTypes.string,
    showColon: PropTypes.bool,
    readOnly: PropTypes.bool,
    onValueChange: PropTypes.func
}

TimeComponent.defaultProps = {
    value: 0,
    prependZero: false,
    label: null,
    className: null,
    showColon: false,
    readOnly: true,
    onValueChange: () => { }
}

export default TimeComponent;