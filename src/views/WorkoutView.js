
import "./TimersView.scss";
import Button from "../components/generic/Button/Button";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import WorkoutDisplay from "../components/generic/WorkoutDisplay/WorkoutDispaly";


const WorkoutView = () => {

  const { timers, timerIndex, setTimerIndex, setWorkoutEditMode, setWorkoutStart } = useContext(AppContext);
  const CurrentTimer = timers.filter((timers, index) => index === timerIndex)[0].C;

  useEffect(() => {
    setWorkoutEditMode(true);
    setWorkoutStart(false);
  }, [setWorkoutEditMode, setWorkoutStart])

  return (
    <div className="grid typescale-md-major-third grid-col-span-12">
      <div className="col-span-12 buttons m-t-4">
        {timers.map((timer, index) => (
          <Button onButtonClick={() => { setTimerIndex(index) }}
            className={["weight-500 p-x-3 p-y-1 bold",
              index === timerIndex ? "selected text-dark" : ""].join(" ")}
            key={index}
          >{timer.title}</Button>
        ))}
      </div>
      {CurrentTimer}
      <WorkoutDisplay />
    </div>
  );
}

export default WorkoutView;
