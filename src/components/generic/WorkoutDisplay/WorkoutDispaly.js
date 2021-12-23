import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../context/AppContext";
import Button from "./../Button/Button";
import MatIcon from "./../MatIcon";
import ProgressBar from "../ProgressBar/ProgressBar";

import "./WorkoutDisplay.scss";

const WorkoutDisplay = () => {
  const [timeString, setTimeString] = useState("");
  const { workoutQueue, deleteWorkout, workoutStart, queueDuration, WorkoutTimer, runAgain, setWorkoutStart } = useContext(AppContext);
  const [progress, setProgress] = useState(10000);

  useEffect(() => {
    WorkoutTimer.deserialize(queueDuration);
    setTimeString(WorkoutTimer.toString());
  }, [queueDuration, WorkoutTimer])

  useEffect(() => {
    if (workoutStart) WorkoutTimer.start(false);
    else WorkoutTimer.clear(false);
  }, [workoutStart, WorkoutTimer]);

  useEffect(() => {
    // Add state tick update and complet events to CountDownTimer object
    WorkoutTimer.pushIntervalFunction((WorkoutTimer) => { setTimeString(WorkoutTimer.toString()); setProgress(WorkoutTimer.percentComplete) });
    return () => {
      // stop and remove intervals on unmount
      WorkoutTimer.clear(false);
      WorkoutTimer.clean();
    }
  }, [WorkoutTimer]);

  return (
    <>
      {workoutQueue.length > 0 && (<>
        <ProgressBar progress={progress}></ProgressBar>
        <div className="workout-display">
          <div className="text-center m-r-3">
            <div className="bold">Workout</div>
            {timeString}
          </div>
          <Button onButtonClick={() => {
            runAgain(); if (workoutStart) setWorkoutStart(true);
          }} className="m-r-3 p-1">
            <MatIcon>restart_alt</MatIcon> Reset
          </Button>
          {workoutQueue.map((workout, index) => {
            return (
              <div key={index} className={["workout", index === 0 ? "current" : "other"].join(" ")}>
                {!workoutStart && (
                  <Button
                    onButtonClick={() => {
                      deleteWorkout(index);
                    }}
                  >
                    <MatIcon>close</MatIcon>
                  </Button>
                )}
                <h6>{workout.type}</h6> {workout.timeString}
              </div>
            );
          })}
        </div>
      </>
      )
      }
    </>
  );
};

WorkoutDisplay.propTypes = {};

WorkoutDisplay.defaultProps = {};

export default WorkoutDisplay;
