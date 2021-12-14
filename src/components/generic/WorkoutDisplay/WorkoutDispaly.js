import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../context/AppContext";
import { Timer } from "../../../classes/Timer";
import Button from "./../Button/Button";
import MatIcon from "./../MatIcon";
import ProgressBar from "../ProgressBar/ProgressBar";

import "./WorkoutDisplay.scss";

const WorkoutTimer = new Timer();

const WorkoutDisplay = () => {
  const [timeString, setTimeString] = useState("");
  const { workoutQueue, deleteWorkout, workoutStart, queueDuration } = useContext(AppContext);
  const [progress, setProgress] = useState(10000);

  useEffect(() => {
    WorkoutTimer.deserialize(queueDuration);
    setTimeString(WorkoutTimer.toString());
  }, [queueDuration])

  useEffect(() => {
    if (workoutStart) WorkoutTimer.start(false);
    else WorkoutTimer.clear(false);
  }, [workoutStart]);

  useEffect(() => {
    // Add state tick update and complet events to CountDownTimer object
    WorkoutTimer.pushIntervalFunction((WorkoutTimer) => { setTimeString(WorkoutTimer.toString()); setProgress(WorkoutTimer.percentComplete) });
    return () => {
      // stop and remove intervals on unmount
      WorkoutTimer.clear(false);
      WorkoutTimer.clean();
    }
  }, []);

  return (
    <>
      {workoutQueue.length > 0 && (<>
        <ProgressBar progress={progress}></ProgressBar>
        <div className="workout-display">
          <div className="text-center m-r-3">
            <div className="bold">Workout</div>
            {timeString}
          </div>
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
      )}
    </>
  );
};

WorkoutDisplay.propTypes = {};

WorkoutDisplay.defaultProps = {};

export default WorkoutDisplay;
