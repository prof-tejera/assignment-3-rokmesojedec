import { useContext, useEffect, useState } from "react";
import Panel from "./../generic/Panel/Panel";
import DisplayTime from "./../generic/DisplayTime/DisplayTime";
import ProgressCircle from "./../generic/ProgressCircle/ProgressCircle";
import { ButtonsPanel, CongratsPanel, WorkoutPanel } from '../../utils/helpers';
import { AppContext } from "../../context/AppContext";
import ReactTooltip from 'react-tooltip';

const Stopwatch = () => {

  const { StopwatchTimer, setDone, isDone, workoutEditMode, addWorkout, workoutStart, currentWorkout } = useContext(AppContext);
  const [editMode, setEditMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // Add state tick update and complet events to timer object
    StopwatchTimer.pushIntervalFunction((StopwatchTimer) => { setProgress(StopwatchTimer.percentComplete); })
    if (!workoutStart)
      StopwatchTimer.onFinished = () => { setPaused(false); if (StopwatchTimer.isTimerComplete) setDone(true); };

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
    if (workoutEditMode) {
      StopwatchTimer.initializeTime(true, true);
      StopwatchTimer.refresh();
    }
  }, [workoutEditMode, StopwatchTimer, workoutStart])

  const start = () => { StopwatchTimer.start(false); setPaused(true); setEditMode(false); setDone(false); }
  const pause = () => { StopwatchTimer.clear(); setPaused(false); }
  const reset = () => { StopwatchTimer.reset(); setProgress(StopwatchTimer.percentComplete); }
  const toggleEditMode = () => { pause(); fastForward(); setDone(false); setEditMode(!editMode); pause(); if (editMode) { reset(); } }
  const fastForward = () => { StopwatchTimer.finishRound(); setProgress(StopwatchTimer.percentComplete); start(); setPaused(false); setDone(true); }
  const runAgain = () => { reset(); setDone(false); }
  const readOnlyMode = workoutStart ? true : workoutEditMode === false ? !editMode : !workoutEditMode;

  useEffect(() => {
    if (workoutStart) { start(); }
  }, [workoutStart, currentWorkout, start])

  return <Panel>
    <ProgressCircle progress={!workoutStart && workoutEditMode ? 0 : progress} thickness="sm" className="timer">
      <div>
        <DisplayTime timer={StopwatchTimer} readOnly={readOnlyMode} className="panel-morph p-2"></DisplayTime>
      </div>
    </ProgressCircle>
    {!isDone && !workoutEditMode && ButtonsPanel(paused, start, pause, reset, fastForward, toggleEditMode, editMode, workoutStart)}
    {!workoutStart && WorkoutPanel(workoutEditMode, addWorkout, {
      type: "stopwatch",
      timer: StopwatchTimer
    })}
    {!workoutEditMode && CongratsPanel(isDone, runAgain)}
  </Panel>;
}

export default Stopwatch;
