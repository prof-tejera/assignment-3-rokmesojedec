
import "./TimersView.scss";
import Button from "../components/generic/Button/Button";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import WorkoutDisplay from "../components/generic/WorkoutDisplay/WorkoutDispaly";
import MatIcon from "../components/generic/MatIcon";
import ReactTooltip from "react-tooltip";

const WorkoutView = () => {

  const { timers, timerIndex, setTimerIndex, setWorkoutEditMode, setWorkoutStart, setStartNextTimer } = useContext(AppContext);
  const CurrentTimer = timers.filter((timers, index) => index === timerIndex)[0].C;

  ReactTooltip.rebuild();

  useEffect(() => {
    setWorkoutEditMode(true);
    setWorkoutStart(false);
    setStartNextTimer(false);
  }, [setStartNextTimer, setWorkoutStart, setWorkoutEditMode]);

  useEffect(() => {
    if (CurrentTimer === null) setStartNextTimer(false);
  }, [CurrentTimer, setStartNextTimer]);

  return (
    <div className="grid typescale-md-major-third grid-col-span-12">

      <div className="col-span-12 buttons m-t-2">
        {timers.map((timer, index) => (
          <Button onButtonClick={() => { setTimerIndex(index) }}
            className={["weight-500 p-x-3 p-y-1 bold",
              index === timerIndex ? "selected text-dark" : ""].join(" ")}
            key={index}
          >{timer.title}</Button>
        ))}
      </div>
      {CurrentTimer}
      <div className="col-span-12 buttons m-t-1">
        <Link to="/" className="m-r-2">
          <MatIcon>timer</MatIcon> Start Workout
        </Link>
      </div>
      <WorkoutDisplay />
    </div>
  );
}

export default WorkoutView;
