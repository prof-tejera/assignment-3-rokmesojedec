import { AppContext } from "./../context/AppContext";
import { useContext, useEffect } from "react";
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
    setWorkoutStart,
    setCurrentTimer,
    setWorkoutEditMode,
    currentTimer,
    currentWorkout,
    setStartNextTimer,
    isLastTimer,
    runAgain,
    workoutQueue
  } = useContext(AppContext);

  useEffect(() => {
    setWorkoutEditMode(false);
    setWorkoutStart(false);
  }, [setWorkoutEditMode, setWorkoutStart]);

  useEffect(() => {
    if (currentTimer === null) setWorkoutStart(false);
  }, [currentTimer, setWorkoutStart])

  useEffect(() => {
    ReactTooltip.rebuild();

    const PrepareTimer = (Timer, TimerComponent, state) => {
      Timer.deserialize(state.config);
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
    setCurrentTimer,
    isLastTimer,
    workoutQueue
  ]);

  return (
    <div className="grid typescale-md-major-third grid-col-span-12">
      <WorkoutDisplay />
      {currentTimer}
      {isLastTimer && currentTimer === null && <>
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
