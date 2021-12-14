import { useContext, useEffect, useState } from 'react';
import Panel from "./../generic/Panel/Panel";
import DisplayTime from "./../generic/DisplayTime/DisplayTime";
import ProgressCircle from "./../generic/ProgressCircle/ProgressCircle";
import { AppContext } from '../../context/AppContext';
import { CongratsPanel, ButtonsPanel, WorkoutPanel } from '../../utils/helpers';
import ReactTooltip from 'react-tooltip';

const Countdown = () => {

  const { CountDownTimer, isDone, setDone, workoutEditMode, addWorkout, setIsValidInput,
     workoutStart, startNextTimer, currentTimer, isValidInput,  setWorkoutStart } = useContext(AppContext);

  const [editMode, setEditMode] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(10000);

  const start = () => {  setWorkoutStart(true); setDone(false); CountDownTimer.start(false); setPaused(true); setEditMode(false); }
  const pause = () => {  CountDownTimer.clear(false); setPaused(false); }
  const reset = () => { CountDownTimer.reset(); setProgress(CountDownTimer.percentComplete); }
  const toggleEditMode = () => { pause(); reset(); setEditMode(!editMode); }
  const fastForward = () => { CountDownTimer.finishRound(); setProgress(CountDownTimer.percentComplete); start(); }
  const runAgain = () => { reset(); setDone(false); }
  const readOnlyMode = workoutStart ? true : workoutEditMode === false ? !editMode : !workoutEditMode;

  useEffect(() => {
    // Add state tick update and complet events to CountDownTimer object
    CountDownTimer.pushIntervalFunction((CountDownTimer) => { setProgress(CountDownTimer.percentComplete); });

    setProgress(CountDownTimer.percentComplete);

    // Needed to keep tooltips after component mount/unmount
    ReactTooltip.rebuild();

    return () => {
      // stop and remove intervals on unmount
      CountDownTimer.clear(false);
      CountDownTimer.clean();
    }
  }, [CountDownTimer, setDone]);

  // reset time to zero when adding timers in workout mode
  useEffect(() => {
    if (workoutEditMode) {
      CountDownTimer.initializeTime(true, true);
      CountDownTimer.refresh();
      setIsValidInput(false);
    }
  }, [workoutEditMode, CountDownTimer, setIsValidInput])

  useEffect(() => {
    if (startNextTimer) { CountDownTimer.start(false); setPaused(true); }
  }, [startNextTimer, currentTimer, CountDownTimer])

  return <Panel>
    <ProgressCircle progress={workoutEditMode ? 0 : progress} thickness="sm" size="lg" className="timer" >
      <div><DisplayTime timer={CountDownTimer}
        readOnly={readOnlyMode} className="panel-morph p-2"></DisplayTime>
        {WorkoutPanel(workoutEditMode, addWorkout, {
          type: "countdown",
          timer: CountDownTimer
        }, isValidInput)}
      </div>
    </ProgressCircle>
    {!isDone && !workoutEditMode && ButtonsPanel(paused, start, pause, reset, fastForward, toggleEditMode, editMode)}

    {!workoutEditMode && CongratsPanel(isDone, runAgain)}

  </Panel>;
}

export default Countdown;
