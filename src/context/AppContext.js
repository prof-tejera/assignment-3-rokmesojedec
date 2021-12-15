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

const WorkoutTimer = new Timer();

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
    const [triggerPopQueue, setTriggerPopQueue] = useState(0);
    const [queueDuration, setQueueDuration] = useState({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });

    const addWorkout = workout => {
        workout.timeString = new Timer({ serializedState: GetSerializedTimerFromState(workout) }).toString();
        let newQueue = [...workoutQueue, workout];
        setQueueDuration(CalculateQueueDuration(newQueue));
        setQueueBackup([...workoutQueue, workout]);
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

    // Sums up times from all workouts in a queue. Creates serialized timer state
    const CalculateQueueDuration = queue => {
        const intervalTime = {
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
        };
        queue.forEach(workout => {
            const config = GetSerializedTimerFromState(workout);
            ["hours", "minutes", "seconds", "milliseconds"].forEach(timeUnit => {
                if (config[timeUnit] && config[timeUnit] > 0) intervalTime[timeUnit] += config[timeUnit];
            })
        })
        return intervalTime;
    }

    // Calculates time string from serialized timer config
    const GetSerializedTimerFromState = (state) => {
        if (state && state.type)
            switch (state.type) {
                case "stopwatch":
                case "countdown":
                    return state.config;

                case "xy":
                    let stateCopy = { ...state.config };
                    stateCopy.rounds = 1;
                    let { rounds } = state.config;
                    for (const [key, value] of Object.entries(stateCopy)) {
                        if (key !== "rounds") stateCopy[key] = value * rounds;
                    }
                    return stateCopy;
                case "tabata":
                    const { timers } = state.config;
                    const intervalTime = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
                    for (let timer of timers) {
                        for (const [key, value] of Object.entries(timer)) {
                            if (key !== "rounds" && value) intervalTime[key] += value;
                        }
                    }
                    for (const [key] of Object.entries(intervalTime)) {
                        intervalTime[key] *= state.config.rounds;
                    }
                    return intervalTime;
                default:
                    return { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
            }
        return { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    };

    // Remove Workout From Queue - updates queue object and updates current timer
    const popQueue = () => {
        workoutQueue.shift();
        let newQueue = [...workoutQueue];
        setWorkoutQueue(newQueue);
        if (newQueue.length) {
            setCurrentWorkout(newQueue[0]);
        }
        else { setCurrentWorkout(null); }
        if (newQueue.length <= 1) setIsLastTimer(true);
        else setIsLastTimer(false);
        ReactTooltip.rebuild();
    }

    const GetQueueDuration = ()=>{
        setQueueDuration(CalculateQueueDuration(workoutQueue));
    }

    // Removes workout at index from queue. Triggers updates
    const deleteWorkout = index => {
        if (index > -1 && index < workoutQueue.length) {
            workoutQueue.splice(index, 1);
            setWorkoutQueue([...workoutQueue]);
            setQueueBackup([...workoutQueue]);
            setQueueDuration(CalculateQueueDuration(workoutQueue));
            if (index === 0 && workoutQueue.length) setCurrentWorkout(workoutQueue[0]);
            if (workoutQueue.length === 0) setCurrentWorkout(null);
            if (workoutQueue.length === 1) setIsLastTimer(true);
            if (workoutQueue.length === 0) setIsLastTimer(false);
            setWorkoutStart(false);
        }
    }

    // Restart Queue from backup
    const runAgain = () => {
        setWorkoutStart(false);
        let newQueue = [...queueBackup];
        setQueueDuration(CalculateQueueDuration(newQueue));
        setWorkoutQueue(newQueue);
        if (newQueue.length) setCurrentWorkout(newQueue[0]);
        if (newQueue.length <= 1) setIsLastTimer(true);
        else setIsLastTimer(false);
    }

    // Redefine onFinished events for timers
    [CountDownTimer, StopwatchTimer, XYTimer, IntervalTabata].forEach(timer => {
        timer.onStart = timer => { 
            WorkoutTimer.deserialize(CalculateQueueDuration(workoutQueue), true);
        }
        timer.onReset = timer => { 
            WorkoutTimer.deserialize(CalculateQueueDuration(workoutQueue), true);
        }
        timer.onFinished = () => {
            if (!workoutEditMode) {
                popQueue();
                setStartNextTimer(!isLastTimer);
            }
        }
    });

    return <AppContext.Provider
        value={{
            timers,
            timerIndex,
            setTimerIndex,
            CountDownTimer,
            XYTimer,
            StopwatchTimer,
            IntervalTabata,
            WorkoutTimer,
            isDone,
            setDone,
            workoutEditMode,
            addWorkout,
            workoutQueue,
            setWorkoutEditMode,
            workoutStart,
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
            runAgain,
            triggerPopQueue,
            setTriggerPopQueue,
            queueDuration,
            GetQueueDuration
        }}>
        {children}
    </AppContext.Provider>
}

export default AppProvider;