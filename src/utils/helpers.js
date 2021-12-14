// Add helpers here. This is usually code that is just JS and not React code. Example: write a function that
// calculates number of minutes when passed in seconds. Things of this nature that you don't want to copy/paste
// everywhere.

import MatIcon from "./../components/generic/MatIcon";
import Button from "./../components/generic/Button/Button";
import { useEffect, useRef, useState } from 'react';

export const PlayPauseButton = (paused, start, pause) => {
    if (!paused) {
        return <Button onButtonClick={start} tooltip="Start">
            <MatIcon>play_arrow</MatIcon>
        </Button>;
    }
    return <Button onButtonClick={pause} tooltip="Stop">
        <MatIcon>pause</MatIcon>
    </Button>
}

export const ButtonsPanel = (paused, start, pause, reset, fastForward, toggleEdit, editMode, workoutStart) => {
    return <div className="buttons-panel">
        {PlayPauseButton(paused, start, pause)}
        <Button onButtonClick={reset} tooltip="Reset" ><MatIcon>restart_alt</MatIcon></Button>
        <Button onButtonClick={fastForward} tooltip="Finish" >
            <MatIcon>fast_forward</MatIcon>
        </Button>
        {workoutStart && <Button onButtonClick={toggleEdit} tooltip={editMode ? "Exit Edit" : "Edit"}>
            <MatIcon>{editMode ? "edit_off" : "edit"}</MatIcon>
        </Button>}
    </div>
}

export const WorkoutPanel = (workoutEditMode, addWorkout, value, isValid) => {
    return (workoutEditMode && (<div className="text-center m-t-1">
        <Button disabled={!isValid} tooltip={isValid ? "Enter numerical values for times and rounds" : null} className='p-1 bold' onButtonClick={() => {
            addWorkout({ type: value.type, config: value.timer.serialize() });
        }}><MatIcon>fitness_center</MatIcon> Add Workout</Button></div>))
};

export const CongratsPanel = (show, startFunc) => {
    if (show)
        return <div className="congrats">
            Well done! 💪
            <Button onButtonClick={startFunc} className="m-l-2 p-1">
                <MatIcon>restart_alt</MatIcon> Run Again
            </Button>
        </div>
    return;
}

// Copied from lecture
export const usePrevious = value => {
    const ref = useRef(value);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
};

// Copied from lecture
export const usePersistedState = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Read initial value from local storage or fallback to the given initial value
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    const setValue = value => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log(error);
        }
    };

    return [storedValue, setValue];
};