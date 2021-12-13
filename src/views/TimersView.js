import { AppContext } from './../context/AppContext';
import { useContext, useEffect, useRef } from "react";
import "./TimersView.scss";
import WorkoutDisplay from '../components/generic/WorkoutDisplay/WorkoutDispaly';
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";
import Countdown from "../components/timers/Countdown";
import Stopwatch from "../components/timers/Stopwatch";

import ReactTooltip from 'react-tooltip';

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
    setStartNextTimer
  } = useContext(AppContext);

  useEffect(() => {
    setWorkoutEditMode(false);
    setWorkoutStart(false);
  }, [setWorkoutEditMode, setWorkoutStart])

  const popQueueRef = useRef(popQueue);

  useEffect(() => {
    ReactTooltip.rebuild();
    const PrepareTimer = (Timer, TimerComponent, state) => {
      Timer.deserialize(state.config);
      Timer.onFinished = () => { popQueueRef.current(); setStartNextTimer(true); }
      setCurrentTimer(TimerComponent);
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
      setStartNextTimer(false);
    }
  }, [currentWorkout, setStartNextTimer, CountDownTimer, IntervalTabata, StopwatchTimer, XYTimer, setCurrentTimer]);

  return (
    <div className="grid typescale-md-major-third grid-col-span-12">
      <WorkoutDisplay />
      {<>
        {currentTimer}
      </>}
    </div>
  );
}

export default App;
