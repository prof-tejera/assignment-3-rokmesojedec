import { useContext, useState, useEffect } from "react";
import Panel from "./../generic/Panel/Panel";
import DisplayTime from "./../generic/DisplayTime/DisplayTime";
import ProgressCircle from "./../generic/ProgressCircle/ProgressCircle";
import TimeComponent from "../generic/TimeComponent/TimeComponent";
import { ButtonsPanel, CongratsPanel, WorkoutPanel } from '../../utils/helpers';
import { AppContext } from "../../context/AppContext";
import ReactTooltip from 'react-tooltip';

const XY = () => {

  const { XYTimer, isDone, setDone, workoutEditMode, addWorkout, isValidInput, setIsValidInput,
    workoutStart, startNextTimer, currentTimer, setWorkoutStart } = useContext(AppContext);

  const [editMode, setEditMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [roundProgress, setRoundProgress] = useState(0);
  const [round, setRound] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {

    const setTimerState = (XYTimer) => {
      setProgress(XYTimer.percentComplete);
      setRoundProgress(XYTimer.roundPercentComplete);
      setRound(XYTimer.currentRound);
    };

    XYTimer.pushIntervalFunction(setTimerState);

    setTimerState(XYTimer);

    // Needed to keep tooltips after component mount/unmount
    ReactTooltip.rebuild();

    return () => {
      // stop and remove intervals on unmount
      XYTimer.clear(false);
      XYTimer.clean();
    }
  }, [XYTimer, setDone]);

  // reset time to zero when adding timers in workout mode
  useEffect(() => {
    if (!workoutStart && workoutEditMode) {
      XYTimer.initializeTime(true, true);
      XYTimer.refresh();
      setIsValidInput(false);
    }
  }, [workoutEditMode, XYTimer, setIsValidInput, workoutStart])

  const start = () => { setWorkoutStart(true); XYTimer.start(false); setPaused(true); setEditMode(false); setDone(false); }
  const pause = () => { setWorkoutStart(false); XYTimer.clear(false); setPaused(false); }
  const reset = () => { XYTimer.reset(); setProgress(XYTimer.percentComplete); }
  const toggleEditMode = () => { pause(); reset(); setEditMode(!editMode); }
  const fastForward = () => { XYTimer.finishRound(); setProgress(XYTimer.percentComplete); XYTimer.start(false); }
  const updateRound = (value) => { XYTimer.rounds = value; setRound(XYTimer.currentRound); }
  const runAgain = () => { reset(); setDone(false); }

  const readOnlyMode = workoutStart ? true : workoutEditMode === false ? !editMode : !workoutEditMode;

  useEffect(() => {
    if (startNextTimer) { XYTimer.start(false); setPaused(true); }
  }, [startNextTimer, currentTimer, XYTimer])

  return <Panel>
    <ProgressCircle progress={workoutEditMode ? 0 : progress} className="timer" size="xl" thickness="sm">
      <div>
        <ProgressCircle progress={workoutEditMode ? 0 : roundProgress} className="tiny-timer" size="sm" thickness="sm">
          <TimeComponent value={round} label="round" readOnly={readOnlyMode}
            onValueChange={(e) => { updateRound(e); setIsValidInput(XYTimer.isValidInput()) }}
          ></TimeComponent>
        </ProgressCircle>
        <DisplayTime className="m-t-1" timer={XYTimer} readOnly={readOnlyMode}></DisplayTime>
        {WorkoutPanel(workoutEditMode, addWorkout, {
          type: "xy",
          timer: XYTimer
        }, isValidInput)}
      </div>
    </ProgressCircle>
    {!isDone && !workoutEditMode && ButtonsPanel(paused, start, pause, reset, fastForward, toggleEditMode, editMode)}
    {!workoutEditMode && CongratsPanel(isDone, runAgain)}
  </Panel>;
}

export default XY;
