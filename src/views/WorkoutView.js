
import "./TimersView.scss";
import Button from "../components/generic/Button/Button";
import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";
import WorkoutDisplay from "../components/generic/WorkoutDisplay/WorkoutDispaly";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";
import Countdown from "../components/timers/Countdown";
import Stopwatch from "../components/timers/Stopwatch";

const WorkoutView = () => {

  const { timers, timerIndex, setTimerIndex, setWorkoutEditMode, workoutStart, currentWorkout,
    StopwatchTimer, CountDownTimer, XYTimer, popQueue, currentTimer, setCurrentTimer } = useContext(AppContext);
  const CurrentTimer = timers.filter((timers, index) => index === timerIndex)[0].C;

  useEffect(() => {
    setWorkoutEditMode(true);
  }, [setWorkoutEditMode])

  useEffect(()=>{
    StopwatchTimer.clear();
    CountDownTimer.clear();
  },[CountDownTimer])

  useEffect(() => {
    console.log("current & start effect");
    const PrepareTimer = (Timer, TimerComponent, state) => {
      Timer.deserialize(state.config);
      Timer.onFinished = () => { popQueue(); }
      setCurrentTimer(TimerComponent);
      Timer.start();
    }
    if (workoutStart && currentWorkout) switch (currentWorkout.type) {
      case "stopwatch":
        PrepareTimer(StopwatchTimer, <Stopwatch />, currentWorkout);
        break;
      case "tabata":
        break;
      case "countdown":
        PrepareTimer(CountDownTimer, <Countdown />, currentWorkout);
        break;
      case "xy":
        break;
      default:
        break;
    }
  }, [workoutStart, currentWorkout]);


  return (
    <div className="grid typescale-md-major-third grid-col-span-12">
      <WorkoutDisplay />
      {!workoutStart && <>
        <div className="col-span-12 buttons m-t-4">
          {timers.map((timer, index) => (
            <Button onButtonClick={() => { setTimerIndex(index) }}
              className={["weight-500 p-x-3 p-y-1 bold",
                index === timerIndex ? "selected text-dark" : ""].join(" ")}
              key={index}
            >{timer.title}</Button>
          ))}
        </div>
        {CurrentTimer}</>}
      {workoutStart && <>
        hello workout
        {currentTimer}
      </>}
    </div>
  );
}

export default WorkoutView;
