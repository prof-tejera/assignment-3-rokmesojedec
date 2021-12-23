import { useContext, useState, useEffect } from "react";
import Panel from "./../generic/Panel/Panel";
import ProgressCircle from "./../generic/ProgressCircle/ProgressCircle";
import TimeComponent from "../generic/TimeComponent/TimeComponent";
import { ButtonsPanel, CongratsPanel, WorkoutPanel } from '../../utils/helpers';
import DisplayTime from "../generic/DisplayTime/DisplayTime";
import "./Tabata.scss";
import { AppContext } from "../../context/AppContext";
import ReactTooltip from 'react-tooltip';

const Tabata = () => {

  const {
    IntervalTabata, setDone, isDone, workoutEditMode,
    addWorkout, startNextTimer, currentTimer,
    workoutStart, isValidInput, setIsValidInput, setWorkoutStart
  } = useContext(AppContext);

  const [TabataTimerA, TabataTimerB] = IntervalTabata.timers;
  const [progressTabataTimerA, setProgressTabataTimerA] = useState(0);
  const [progressTabataTimerB, setProgressTabataTimerB] = useState(0);
  const [progressRound, setRoundProgress] = useState(0);
  const [currentRound, setRound] = useState(0);
  const [currentProgress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const updateInterval = () => {
    setRoundProgress(IntervalTabata.roundPercentage);
    setRound(IntervalTabata.currentRound);
    setProgress(IntervalTabata.percentComplete);
  }

  useEffect(() => {

    let updateInterval = () => {
      setRoundProgress(IntervalTabata.roundPercentage);
      setRound(IntervalTabata.currentRound);
      setProgress(IntervalTabata.percentComplete);
    }

    // push interval functions for workout timer
    TabataTimerA.pushIntervalFunction((timer) => {
      setProgressTabataTimerA(timer.percentComplete);
      updateInterval();
    })

    // push interval functions for rest timer
    TabataTimerB.pushIntervalFunction((timer) => {
      setProgressTabataTimerB(timer.percentComplete);
      updateInterval();
    });

    updateInterval();
    setProgressTabataTimerA(TabataTimerA.percentComplete);
    setProgressTabataTimerB(TabataTimerB.percentComplete);

    // Needed to keep tooltips after component mount/unmount
    ReactTooltip.rebuild();

    return () => {
      // stop and remove intervals on unmount
      IntervalTabata.clear(false);
      IntervalTabata.clean();
    }
  }, [IntervalTabata, TabataTimerA, TabataTimerB, setDone]);

  const start = () => { setWorkoutStart(true); IntervalTabata.start(false); setPaused(true); setEditMode(false); setDone(false); };
  const pause = () => { setWorkoutStart(false); IntervalTabata.clear(false); setPaused(false); };
  const reset = () => { IntervalTabata.reset(); if(paused) IntervalTabata.start(); updateInterval(); };
  const fastForward = () => { IntervalTabata.finish(); if(IntervalTabata.onStart) IntervalTabata.onStart() }
  const toggleEditMode = () => { pause(); IntervalTabata.reset(); setEditMode(!editMode); };
  const updateRound = (value) => { IntervalTabata.rounds = value; updateInterval(); }
  const runAgain = () => { reset(); setDone(false); }

  const readOnlyMode = workoutStart ? true : workoutEditMode === false ? !editMode : !workoutEditMode;

  const showComponents = {
    hours: false,
    minutes: true,
    seconds: true,
    milliseconds: false
  }

  // reset time to zero when adding timers in workout mode
  useEffect(() => {
    if (!workoutStart && workoutEditMode) {
      IntervalTabata.resetTime();
      setRound(1);
      setIsValidInput(false);
    }
  }, [workoutEditMode, IntervalTabata, setIsValidInput, workoutStart])

  useEffect(() => {
    if (startNextTimer) { IntervalTabata.start(false); setPaused(true); }
  }, [startNextTimer, currentTimer, IntervalTabata])

  return <Panel>
    <ProgressCircle progress={workoutEditMode ? 0 : currentProgress} size="xl" thickness="sm" className="timer">
      <div className="tabata">
        <div>
          <ProgressCircle progress={workoutEditMode ? 0 : progressRound} size="sm" thickness="sm" className="tiny-timer">
            <TimeComponent label="round"
              prependZero={true}
              value={currentRound}
              readOnly={readOnlyMode}
              onValueChange={e => { updateRound(e); setIsValidInput(IntervalTabata.isValidInput()) }}></TimeComponent>
          </ProgressCircle>
        </div>
        <div className="tabata-progress-panel">
          <ProgressCircle progress={workoutEditMode ? 0 : progressTabataTimerA} size="sm" thickness="sm" className="tiny-timer">
            <div className="tabata-progress-wrapper">
              <span className="tabata-label">work</span>
              <DisplayTime timer={TabataTimerA} className="small p-t-0" readOnly={readOnlyMode} showComponents={showComponents}
                triggerOnFinishedOnUnmount={false}
              ></DisplayTime>
            </div>
          </ProgressCircle>
          <ProgressCircle progress={workoutEditMode ? 0 : progressTabataTimerB} size="sm" thickness="sm" className="tiny-timer">
            <div className="tabata-progress-wrapper">
              <span className="tabata-label">rest</span>
              <DisplayTime timer={TabataTimerB} className="small p-t-0" readOnly={readOnlyMode}
                showComponents={showComponents}
                triggerOnFinishedOnUnmount={false}
              ></DisplayTime>
            </div>
          </ProgressCircle>
        </div>
        {WorkoutPanel(workoutEditMode, addWorkout, {
          type: "tabata",
          timer: IntervalTabata
        }, isValidInput)}
      </div>
    </ProgressCircle>
    {!isDone && !workoutEditMode && ButtonsPanel(paused, start, pause, reset, fastForward, toggleEditMode, editMode)}
    {!workoutEditMode && CongratsPanel(isDone, runAgain)}
  </Panel>;
}

export default Tabata; 