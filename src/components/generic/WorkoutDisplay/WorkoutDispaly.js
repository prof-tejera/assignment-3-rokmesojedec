import { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import { Timer } from "../../../classes/Timer";
import Button from "./../Button/Button";
import MatIcon from "./../MatIcon";

import "./WorkoutDisplay.scss";

const DurationString = (state) => {
  if (state && state.type)
    switch (state.type) {
      case "stopwatch":
      case "countdown":
        return new Timer({ serializedState: state.config }).toString();
      case "xy":
        let stateCopy = { ...state.config };
        stateCopy.rounds = 1;
        let { rounds } = state.config;

        for (const [key, value] of Object.entries(stateCopy)) {
          if (key !== "rounds") stateCopy[key] = value * rounds;
        }
        return new Timer({ serializedState: stateCopy }).toString();
      case "tabata":
        const { timers } = state.config;
        const intervalTime = {
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        };
        for (let timer of timers) {
          for (const [key, value] of Object.entries(timer)) {
            if (key !== "rounds" && value) intervalTime[key] += value;
          }
        }

        for (const [key] of Object.entries(intervalTime)) {
          intervalTime[key] *= state.config.rounds;
        }

        return new Timer({ serializedState: intervalTime }).toString();
      default:
        return {};
    }
  return "";
};

const WorkoutDisplay = () => {
  const { workoutQueue, deleteWorkout, workoutStart } = useContext(AppContext);
  return (
    <>
      {workoutQueue.length > 0 && (
        <div className="workout-display">
          {workoutQueue.map((workout, index) => {
            return (
              <div key={index} className="workout">
                {!workoutStart && (
                  <Button
                    onButtonClick={() => {
                      deleteWorkout(index);
                    }}
                  >
                    <MatIcon>close</MatIcon>
                  </Button>
                )}
                <h6>{workout.type}</h6> {DurationString(workout)}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

WorkoutDisplay.propTypes = {};

WorkoutDisplay.defaultProps = {};

export default WorkoutDisplay;
