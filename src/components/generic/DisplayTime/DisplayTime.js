import { useState, useEffect } from 'react';
import './DisplayTime.scss';
import TimeComponent from '../TimeComponent/TimeComponent';
import PropTypes from 'prop-types';
import { Timer } from '../../../classes/Timer';

const DisplayTime = function (props) {

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);

  useEffect(() => {
    if (props.timer) {
      const timerTick = (timer) => {
        setHours(timer.currentHours);
        setMinutes(timer.currentMinutes);
        setSeconds(timer.currentSeconds);
        setMilliseconds(timer.currentMilliseconds);
      };
      props.timer.pushIntervalFunction(timerTick);
      timerTick(props.timer);
    }
    return () => {
      if (props.triggerOnFinishedOnUnmount) {
        props.timer.clear(false);
        props.timer.clean();
      }
    };
  }, [props.timer, props.triggerOnFinishedOnUnmount]); 

  const { className, readOnly, showComponents } = props;

  // Timer class also support Years, Months, Days but these time units aren't appropriate for timer use
  const components = []

  if (showComponents.hours) components.push({ label: "h", prependZero: true, name: "hours", update: setHours, value: hours });
  if (showComponents.minutes) components.push({ label: "m", prependZero: true, name: "minutes", update: setMinutes, value: minutes });
  if (showComponents.seconds) components.push({ label: "s", prependZero: true, name: "seconds", update: setSeconds, value: seconds });
  if (showComponents.milliseconds) components.push({ label: "ms", prependZero: false, name: "milliseconds", update: setMilliseconds, value: milliseconds });

  return <div className={['time-components', className].join(" ")}>
    {components.map((component, i) =>
      <TimeComponent value={component.value}
        key={component.label}
        label={component.label}
        prependZero={component.prependZero}
        readOnly={readOnly}
        showColon={i !== 0}
        onValueChange={e => {
          props.timer[component.name] = e;
          component.update(e);
        }}></TimeComponent>)}
  </div>;
}

DisplayTime.propTypes = {
  timer: PropTypes.instanceOf(Timer),
  className: PropTypes.string,
  readOnly: PropTypes.bool,
  showComponents: PropTypes.object,
  triggerOnFinishedOnUnmount: PropTypes.bool
}

DisplayTime.defaultProps = {
  timer: new Timer(0),
  className: null,
  readOnly: true,
  showComponents: {
    hours: true,
    minutes: true,
    seconds: true,
    milliseconds: true
  },
  triggerOnFinishedOnUnmount: true
}

export default DisplayTime;