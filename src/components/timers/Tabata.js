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

  const { IntervalTabata, setDone, isDone, workoutEditMode, addWorkout, workoutStart } = useContext(AppContext);
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

    // set Pause state when interval object is done
    if (!workoutStart)
      IntervalTabata.onFinished = () => {
        setPaused(false); setRound(IntervalTabata.currentRound);
        setDone(true);
      };
    else {
      IntervalTabata.start();
    }

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
  }, [IntervalTabata, TabataTimerA, TabataTimerB, setDone, workoutStart]);

  const start = () => { IntervalTabata.start(false); setPaused(true); setEditMode(false); setDone(false); };
  const pause = () => { IntervalTabata.clear(false); setPaused(false); };
  const reset = () => { pause(); IntervalTabata.reset(); updateInterval(); };
  const fastForward = () => { IntervalTabata.finishCurrent(); if (!paused) pause(); }
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
    }
  }, [workoutEditMode, IntervalTabata, workoutStart])

  return <Panel>
    <ProgressCircle progress={!workoutStart && workoutEditMode ? 0 : currentProgress} size="xl" thickness="sm" className="timer">
      <div className="tabata">
        <div>
          <ProgressCircle progress={!workoutStart && workoutEditMode ? 0 : progressRound} size="sm" thickness="sm" className="tiny-timer">
            <TimeComponent label="round"
              prependZero={true}
              value={currentRound}
              readOnly={readOnlyMode}
              onValueChange={e => { updateRound(e); }}></TimeComponent>
          </ProgressCircle>
        </div>
        <div className="tabata-progress-panel">
          <ProgressCircle progress={!workoutStart && workoutEditMode ? 0 : progressTabataTimerA} size="sm" thickness="sm" className="tiny-timer">
            <div className="tabata-progress-wrapper">
              <span className="tabata-label">work</span>
              <DisplayTime timer={TabataTimerA} className="small p-t-0" readOnly={readOnlyMode} showComponents={showComponents}
                triggerOnFinishedOnUnmount={false}
              ></DisplayTime>
            </div>
          </ProgressCircle>
          <ProgressCircle progress={!workoutStart && workoutEditMode ? 0 : progressTabataTimerB} size="sm" thickness="sm" className="tiny-timer">
            <div className="tabata-progress-wrapper">
              <span className="tabata-label">rest</span>
              <DisplayTime timer={TabataTimerB} className="small p-t-0" readOnly={readOnlyMode}
                showComponents={showComponents}
                triggerOnFinishedOnUnmount={false}
              ></DisplayTime>
            </div>
          </ProgressCircle>
        </div>
      </div>
    </ProgressCircle>
    {!isDone && !workoutEditMode && ButtonsPanel(paused, start, pause, reset, fastForward, toggleEditMode, editMode)}
    {WorkoutPanel(workoutEditMode, addWorkout, {
      type: "tabata",
      timer: IntervalTabata
    })}
    {!workoutEditMode && CongratsPanel(isDone, runAgain)}
  </Panel>;
}

export default Tabata; 