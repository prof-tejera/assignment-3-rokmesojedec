import { useContext, useEffect, useState } from "react";
import Panel from "./../generic/Panel/Panel";
import DisplayTime from "./../generic/DisplayTime/DisplayTime";
import ProgressCircle from "./../generic/ProgressCircle/ProgressCircle";
import { ButtonsPanel, CongratsPanel, WorkoutPanel } from '../../utils/helpers';
import { AppContext } from "../../context/AppContext";
import ReactTooltip from 'react-tooltip';

const Stopwatch = () => {

  const { StopwatchTimer, setDone, isDone, workoutEditMode, 
          isValidInput, setIsValidInput, addWorkout, workoutStart, 
          startNextTimer, currentTimer, setWorkoutStart } = useContext(AppContext);

  const [editMode, setEditMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // Add state tick update and complet events to timer object
    StopwatchTimer.pushIntervalFunction((StopwatchTimer) => { setProgress(StopwatchTimer.percentComplete); })

    setProgress(StopwatchTimer.percentComplete);

    // Needed to keep tooltips after component mount/unmount
    ReactTooltip.rebuild();

    return () => {
      // stop and remove intervals on unmount
      StopwatchTimer.clear(false);
      StopwatchTimer.clean();
    }
  }, [StopwatchTimer, setDone]);

  // reset time to zero when adding timers in workout mode
  useEffect(() => {
    if (!workoutStart && workoutEditMode) {
      StopwatchTimer.initializeTime(true, true);
      StopwatchTimer.refresh();
      setIsValidInput(false);
    }
  }, [workoutEditMode, StopwatchTimer, setIsValidInput, workoutStart])

  const start = () => { setWorkoutStart(true); StopwatchTimer.start(false); setPaused(true); setEditMode(false); setDone(false); }
  const pause = () => { setWorkoutStart(false); StopwatchTimer.clear(false); setPaused(false); }
  const reset = () => { StopwatchTimer.reset(); setProgress(StopwatchTimer.percentComplete); }
  const toggleEditMode = () => { pause(); fastForward(); setDone(false); setEditMode(!editMode); pause(); if (editMode) { reset(); } }
  const fastForward = () => { StopwatchTimer.onFinished(); if(StopwatchTimer.onStart) StopwatchTimer.onStart(); setWorkoutStart(true); }
  const runAgain = () => { reset(); setDone(false); }
  const readOnlyMode = workoutStart ? true : workoutEditMode === false ? !editMode : !workoutEditMode;

  useEffect(() => {
    if (startNextTimer) { StopwatchTimer.start(false); setPaused(true); }
  }, [startNextTimer, currentTimer, StopwatchTimer, setIsValidInput])

  return <Panel>
    <ProgressCircle progress={workoutEditMode ? 0 : progress} thickness="sm" className="timer">
      <div>
        <DisplayTime timer={StopwatchTimer} readOnly={readOnlyMode} className="panel-morph p-2"></DisplayTime>
        {WorkoutPanel(workoutEditMode, addWorkout, {
          type: "stopwatch",
          timer: StopwatchTimer
        }, isValidInput)}
      </div>
    </ProgressCircle>
    {!isDone && !workoutEditMode && ButtonsPanel(paused, start, pause, reset, fastForward, toggleEditMode, editMode)}

    {!workoutEditMode && CongratsPanel(isDone, runAgain)}
  </Panel>;
}

export default Stopwatch;
