import { useContext, useEffect, useState } from 'react';
import Panel from "./../generic/Panel/Panel";
import DisplayTime from "./../generic/DisplayTime/DisplayTime";
import ProgressCircle from "./../generic/ProgressCircle/ProgressCircle";
import { AppContext } from '../../context/AppContext';
import { CongratsPanel, ButtonsPanel, WorkoutPanel } from '../../utils/helpers';
import ReactTooltip from 'react-tooltip';

const Countdown = () => {

  const { CountDownTimer, isDone, setDone, workoutEditMode, addWorkout, workoutStart, currentTimer } = useContext(AppContext);

  const [editMode, setEditMode] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(10000);

  const start = () => { setDone(false); CountDownTimer.start(false); setPaused(true); setEditMode(false); }
  const pause = () => { CountDownTimer.clear(false); setPaused(false); }
  const reset = () => { CountDownTimer.reset(); setProgress(CountDownTimer.percentComplete); }
  const toggleEditMode = () => { pause(); reset(); setEditMode(!editMode); }
  const fastForward = () => { CountDownTimer.finishRound(); setProgress(CountDownTimer.percentComplete); start(); setDone(true) }
  const runAgain = () => { reset(); setDone(false); }
  const readOnlyMode = workoutStart ? true : workoutEditMode === false ? !editMode : !workoutEditMode;

  useEffect(() => {
    // Add state tick update and complet events to CountDownTimer object
    CountDownTimer.pushIntervalFunction((CountDownTimer) => { setProgress(CountDownTimer.percentComplete); });

    if (!workoutStart)
      CountDownTimer.onFinished = () => { setPaused(false); if (CountDownTimer.isTimerComplete) setDone(true); };
    else {
      CountDownTimer.clear(false); setPaused(false); setEditMode(false);
    }

    setProgress(CountDownTimer.percentComplete);

    // Needed to keep tooltips after component mount/unmount
    ReactTooltip.rebuild();

    return () => {
      // stop and remove intervals on unmount
      CountDownTimer.clear(false);
      CountDownTimer.clean();
    }
  }, [CountDownTimer, setDone, workoutStart]);

  // reset time to zero when adding timers in workout mode
  useEffect(() => {
    if (!workoutStart && workoutEditMode) {
      CountDownTimer.initializeTime(true, true);
      CountDownTimer.refresh();
    }
  }, [workoutEditMode, CountDownTimer, workoutStart])

  // useEffect(() => {
  //   if (workoutStart) { start(); }
  // }, [workoutStart, currentTimer])

  return <Panel>
    <ProgressCircle progress={workoutEditMode && !workoutStart ? 0 : progress} thickness="sm" size="lg" className="timer" >
      <div><DisplayTime timer={CountDownTimer}
        readOnly={readOnlyMode} className="panel-morph p-2"></DisplayTime></div>
    </ProgressCircle>
    {!isDone && !workoutEditMode && ButtonsPanel(paused, start, pause, reset, fastForward, toggleEditMode, editMode)}
    {WorkoutPanel(workoutEditMode, addWorkout, {
      type: "countdown",
      timer: CountDownTimer
    })}
    {!workoutEditMode && CongratsPanel(isDone, runAgain)}

  </Panel>;
}

export default Countdown;
