import { AppContext } from './../context/AppContext';
import { useContext, useEffect } from "react";
import "./TimersView.scss";
import WorkoutDisplay from '../components/generic/WorkoutDisplay/WorkoutDispaly';
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";
import Countdown from "../components/timers/Countdown";
import Stopwatch from "../components/timers/Stopwatch";

const App = () => {

  const {
    StopwatchTimer,
    CountDownTimer,
    IntervalTabata,
    XYTimer,
    popQueue,
    setWorkoutStart,
    setCurrentTimer,
    workoutStart,
    setWorkoutEditMode,
    currentTimer,
    currentWorkout
  } = useContext(AppContext);

  useEffect(() => {
    setWorkoutEditMode(false);
    setWorkoutStart(false);
  }, [setWorkoutEditMode, setWorkoutStart])

  useEffect(() => {
    const PrepareTimer = (Timer, TimerComponent, state) => {
      Timer.deserialize(state.config);
      Timer.onFinished = () => { popQueue(); }
      setCurrentTimer(TimerComponent);
      Timer.start();
    }
    if (currentWorkout) switch (currentWorkout.type) {
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
    }
  }, [workoutStart, currentWorkout]);
  return (
    <div className="grid typescale-md-major-third grid-col-span-12">
      <WorkoutDisplay />
      { <>
        {currentTimer}
      </>}
    </div>
  );
}

export default App;
