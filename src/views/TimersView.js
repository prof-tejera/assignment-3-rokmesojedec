import { AppContext } from "./../context/AppContext";
import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CongratsPanel } from "./../utils/helpers";
import "./TimersView.scss";
import WorkoutDisplay from "../components/generic/WorkoutDisplay/WorkoutDispaly";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";
import Countdown from "../components/timers/Countdown";
import Stopwatch from "../components/timers/Stopwatch";

import ReactTooltip from "react-tooltip";

const App = () => {
  const {
    StopwatchTimer,
    CountDownTimer,
    IntervalTabata,
    XYTimer,
    popQueue,
    setWorkoutStart,
    setCurrentTimer,
    setWorkoutEditMode,
    currentTimer,
    currentWorkout,
    setStartNextTimer,
    isLastTimer,
    runAgain,
    backupQueue,
    workoutStart
  } = useContext(AppContext);

  useEffect(() => {
    setWorkoutEditMode(false);
    setWorkoutStart(false);
  }, [setWorkoutEditMode, setWorkoutStart]);


  const backup = useRef(backupQueue);

  useEffect(()=>{
    if(workoutStart) backup.current();
  }, [workoutStart])

  const popQueueRef = useRef(popQueue);

  useEffect(() => {
    ReactTooltip.rebuild();

    const PrepareTimer = (Timer, TimerComponent, state) => {
      Timer.deserialize(state.config);
      Timer.onFinished = () => {
        popQueueRef.current();
        setStartNextTimer(true);
      };
      setCurrentTimer(TimerComponent);
    };

    if (currentWorkout)
      switch (currentWorkout.type) {
        case "stopwatch":
          PrepareTimer(StopwatchTimer, <Stopwatch />, currentWorkout);
          break;
        case "tabata":
          PrepareTimer(IntervalTabata, <Tabata />, currentWorkout);
          break;
        case "countdown":
          PrepareTimer(CountDownTimer, <Countdown />, currentWorkout);
          break;
        case "xy":
          PrepareTimer(XYTimer, <XY />, currentWorkout);
          break;
        default:
          break;
      }
    else {
      setCurrentTimer(null);
      setStartNextTimer(false);
    }
  }, [
    currentWorkout,
    setStartNextTimer,
    CountDownTimer,
    IntervalTabata,
    StopwatchTimer,
    XYTimer,
    setCurrentTimer
  ]);

  return (
    <div className="grid typescale-md-major-third grid-col-span-12">
      <WorkoutDisplay />
      {currentTimer}
      { isLastTimer && currentTimer === null && <>
        {CongratsPanel(true, runAgain)}
      </>}
      {!isLastTimer && !currentTimer && (
        <div className="text-center m-t-5">
          The workout queue is empty! 
          <p className="m-t-2">Get started by <Link to="/add">adding some workouts </Link></p>
        </div>
      )}
    </div>
  );
};

export default App;
