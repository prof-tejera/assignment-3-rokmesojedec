import React, { useEffect, useState } from 'react';
import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";
import { usePersistedState } from '../utils/helpers';
import { Timer } from '../classes/Timer';
import { Interval } from '../classes/Interval';
import ReactTooltip from 'react-tooltip';

export const AppContext = React.createContext({});

const CountDownTimer = new Timer({
    minutes: 0,
    seconds: 10,
    tickSize: Timer.TIME_ENUM.MILLISECOND * 52,
});

const XYTimer = new Timer({
    seconds: 20,
});

const StopwatchTimer = new Timer({
    countdownMode: false,
    seconds: 30
});

const IntervalTabata = new Interval({
    timers: [
        new Timer({ seconds: 5 }),
        new Timer({ seconds: 5 })],
    rounds: 3
});

const AppProvider = ({ children }) => {

    const [timerIndex, setTimerIndex] = usePersistedState("selectedTimer", 0);
    const [isDone, setDone] = useState(false);
    const [workoutEditMode, setWorkoutEditMode] = useState(false);
    const [workoutQueue, setWorkoutQueue] = useState([]);
    const [currentWorkout, setCurrentWorkout] = useState(null);
    const [workoutStart, setWorkoutStart] = useState(false);
    const [currentTimer, setCurrentTimer] = useState(null);
    const [startNextTimer, setStartNextTimer] = useState(false);
    const [isValidInput, setIsValidInput] = useState(false);
    const [isLastTimer, setIsLastTimer] = useState(false);
    const [queueBackup, setQueueBackup] = useState([]);

    const addWorkout = workout => {
        let newQueue = [...workoutQueue, workout];
        setWorkoutQueue(newQueue);
        if (newQueue.length) setCurrentWorkout(newQueue[0]);
        else setCurrentWorkout(null);

        if (newQueue.length === 1) setIsLastTimer(true);
        else setIsLastTimer(false);
    }

    useEffect(() => {
        // Needed to keep tooltips after component mount/unmount
        ReactTooltip.rebuild();
    }, [isDone])

    const timers = [
        { title: "Stopwatch", C: <Stopwatch title={"Stopwatch"} /> },
        { title: "Countdown", C: <Countdown title={"Countdown"} /> },
        { title: "XY", C: <XY title={"XY"} /> },
        { title: "Tabata", C: <Tabata title={"Tabata"} /> },
    ];

    const toggleWorkout = () => {
        setWorkoutStart(!workoutStart);
    }

    const popQueue = () => {
        workoutQueue.shift();
        let newQueue = [...workoutQueue];
        setWorkoutQueue(newQueue);
        if (newQueue.length) {
            setCurrentWorkout(newQueue[0]);
            setIsLastTimer(false);
        }
        else {
            setCurrentWorkout(null);
        }
        if (newQueue.length <= 1) setIsLastTimer(true);
        ReactTooltip.rebuild();
    }

    const deleteWorkout = index => {
        if(index > -1 && index < workoutQueue.length){
            workoutQueue.splice(index,1);
            setWorkoutQueue([...workoutQueue]);

            if(index === 0 && workoutQueue.length)
                setCurrentWorkout(workoutQueue[0]);

            if(workoutQueue.length === 0)
                setCurrentWorkout(null);

            if (workoutQueue.length === 1) setIsLastTimer(true);
        }
    }

    const backupQueue = ()=>{
        setQueueBackup([...workoutQueue]);
    }

    const runAgain= ()=>{
        setWorkoutStart(false);
        setWorkoutQueue([...queueBackup]);
        if(queueBackup.length) setCurrentWorkout(queueBackup[0]);
        if(queueBackup.length <= 1) setIsLastTimer(true);
        else setIsLastTimer(false); 
        setQueueBackup([]);
    }

    return <AppContext.Provider
        value={{
            timers,
            timerIndex,
            setTimerIndex,
            CountDownTimer,
            XYTimer,
            StopwatchTimer,
            IntervalTabata,
            isDone,
            setDone,
            workoutEditMode,
            addWorkout,
            workoutQueue,
            setWorkoutEditMode,
            workoutStart,
            toggleWorkout,
            currentWorkout,
            popQueue,
            currentTimer,
            setCurrentTimer,
            setWorkoutStart,
            setStartNextTimer,
            startNextTimer,
            deleteWorkout,
            isValidInput, 
            setIsValidInput,
            isLastTimer,
            backupQueue,
            runAgain
        }}>
        {children}
    </AppContext.Provider>
}

export default AppProvider;