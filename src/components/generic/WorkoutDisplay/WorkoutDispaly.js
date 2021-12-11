import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import Button from '../Button/Button';
import PropTypes from 'prop-types';

import './WorkoutDisplay.scss';


const WorkoutDisplay = (props) => {
    const { workoutQueue, toggleWorkout } = useContext(AppContext);
  
    return <>
        <div className="workout-display">
            {workoutQueue.map((workout, index) => {
                return <div key={index}><span>{workout.type}</span> {index} {workout.config.seconds}s</div>
            })}
        </div>
        <Button onButtonClick={toggleWorkout}>Start Workout</Button>
    </>;
}

WorkoutDisplay.propTypes = {

}

WorkoutDisplay.defaultProps = {

}

export default WorkoutDisplay;