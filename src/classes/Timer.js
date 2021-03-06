const MILLISECOND = 1;
const SECOND = 1000 * MILLISECOND;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = 24 * HOUR;
const YEAR = 365 * DAY;
const MONTH = YEAR / 12;

// Time Enums in milliseconds
export const TIME_ENUM = {
  MILLISECOND: MILLISECOND,
  SECOND: SECOND,
  MINUTE: MINUTE,
  HOUR: HOUR,
  DAY: DAY,
  YEAR: YEAR,
  MONTH: MONTH,
};

// Creates Timer Object
export class Timer {
  constructor({
    years = 0,
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
    rounds = 1,
    tickSize = MILLISECOND * 52, // sets the amount increased/decreased on each tick
    countdownMode = true, // when set to true, we count down to passed time values
    // and when countdownMode is true, we count up to the passed value
    intervalFunctions = [], // functions which are executed during each tick of the timer,
    onFinished = null,
    onStart = null,
    onReset = null,
    stopWatchMode = false,
    serializedState = null,
  } = {}) {
    if (serializedState) {
      this.deserialize(serializedState);
    } else {
      this._years = years;
      this._months = months;
      this._days = days;
      this._hours = hours;
      this._minutes = minutes;
      this._seconds = seconds;
      this._milliseconds = milliseconds;
      this._rounds = this._currentRound = rounds;
    }
    this._roundsCompleted = 0;
    this.tickSize = tickSize;
    this.countdownInterval = null;
    this.intervalFunctions = [...intervalFunctions];
    this.countdownMode = countdownMode;
    this.onFinished = onFinished;
    this.onStart = onStart;
    this.onReset = onReset;
    this.stopWatchMode = stopWatchMode;
    this._isRunning = false;
    this._isDone = false;

    // defines getters and setters for time components
    [
      "years",
      "months",
      "days",
      "hours",
      "minutes",
      "seconds",
      "milliseconds",
    ].forEach((prop) => {
      Object.defineProperty(this, prop, {
        get: function () {
          return this[`_${prop}`];
        },
        set: function (value) {
          this[`_${prop}`] = parseInt(value);
          this.initializeTime(this.stopWatchMode || this.countdownMode);
        },
      });
    });
    this.initializeTime(this.countdownMode);
  }

  deserialize(serializedState, setCurrentTime = false) 
  {
    if (setCurrentTime) {
      this._currentTime = 0;
      let millisecondsTotal = 0;
      if (serializedState.milliseconds)
        millisecondsTotal += serializedState.milliseconds;
      if (serializedState.seconds)
        millisecondsTotal += serializedState.seconds * SECOND;
      if (serializedState.minutes)
        millisecondsTotal += serializedState.minutes * MINUTE;
      if (serializedState.hours)
        millisecondsTotal += serializedState.hour * HOUR;
      if (serializedState.days)
        millisecondsTotal += serializedState.days * DAY;
      if (serializedState.months)
        millisecondsTotal += serializedState.months * MONTH;
      if (serializedState.years)
        millisecondsTotal += serializedState.years * YEAR;
      this._currentTime = millisecondsTotal;
    } else {
      this._years = 0;
      this._months = 0;
      this._days = 0;
      this._hours = 0;
      this._minutes = 0;
      this._seconds = 0;
      this._milliseconds = 0;
      for (let timeUnit of [
        "years",
        "months",
        "days",
        "hours",
        "minutes",
        "seconds",
        "milliseconds",
      ]) {
        if (serializedState[timeUnit]) {
          this["_" + timeUnit] = serializedState[timeUnit];
        }
      }
    }

    if (serializedState.rounds)
      this._rounds = this._currentRound = serializedState.rounds;
    else this._rounds = this._currentRound = 1;

    if (!setCurrentTime) this.initializeTime(this.countdownMode);
    this.refresh();
  }

  serialize() {
    return {
      milliseconds: this.milliseconds,
      minutes: this.minutes,
      seconds: this.seconds,
      hours: this.hours,
      rounds: this.rounds,
    };
  }

  initializeTime(resetToCurrentTime = true, intitalizeToZero) {
    // Converts all time components to milliseconds;

    let millisecondsTotal = 0;

    if (!intitalizeToZero)
      millisecondsTotal +=
        this._milliseconds +
        this._seconds * SECOND +
        this._minutes * MINUTE +
        this._hours * HOUR +
        this._days * DAY +
        this._months * MONTH +
        this._years * YEAR;
    else {
      this._years = 0;
      this._months = 0;
      this._days = 0;
      this._hours = 0;
      this._minutes = 0;
      this._seconds = 0;
      this._milliseconds = 0;
      this._rounds = 1;
    }

    if (this.countdownMode || resetToCurrentTime) {
      // Counting down from Start Time to 0
      this._currentTime = millisecondsTotal;
    } else {
      // Counting up form 0 to End Time
      this._currentTime = 0;
    }

    this._currentRound = this.rounds;
    this._roundsCompleted = 0;
    this._totalTime = millisecondsTotal * this.rounds;
    this._roundTime = millisecondsTotal;
  }

  tick() {
    // increases or decreases time on each tick
    if (this.countdownMode) {
      // COUNTING DOWN
      this._currentTime -= this.tickSize;
      if (this._currentTime <= 0) {
        if (this._currentRound > 0) this._currentRound--;
        if (this._currentRound > 0) {
          this._currentTime = this._roundTime - this._currentTime;
        } else {
          this._roundsCompleted++;
          this._currentTime = 0;
        }
      }
    } else {
      // CONTING UP
      this._currentTime += this.tickSize;
      if (this._currentTime >= this._roundTime) {
        if (this._currentRound > 0) this._currentRound--;
        if (this._currentRound > 0) {
          this._currentTime = this._currentTime - this._roundTime;
        } else {
          this._roundsCompleted++;
          this._currentTime = this._roundTime;
        }
      }
    }
  }

  start(initializeTime = true, triggerOnStart = true) {
    if (this.countdownInterval === null) {
      if (this.onStart && triggerOnStart) this.onStart(this);
      this._isDone = false;
      if (initializeTime || this.isTimerComplete)
        this.initializeTime(this.countdownMode);
      this._isRunning = true;
      this.countdownInterval = setInterval(() => {
        this.tick();
        this.refresh();
        if (this.isTimerComplete) this.clear();
      }, this.tickSize);
    }
  }

  refresh() {
    if (this.intervalFunctions)
      this.intervalFunctions.forEach((func) => {
        func(this);
      });
  }

  clean() {
    this.intervalFunctions.length = 0;
  }

  clear(triggerOnFinished = true) {
    clearInterval(this.countdownInterval);
    this._isRunning = false;
    this.countdownInterval = null;
    if (
      triggerOnFinished &&
      this.onFinished &&
      typeof this.onFinished === "function"
    ) {
      this.onFinished();
    }
  }

  reset(triggerOnReset = true) {
    if(this.onReset && triggerOnReset) this.onReset(this);
    this.initializeTime(this.countdownMode);
    this.intervalFunctions.forEach((func) => {
      func(this);
    });
  }

  finishRound() {
    if (!this.isTimerComplete) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
      if (this.countdownMode) {
        // COUNTING DOWN
        this._currentTime = 0;
      } else {
        // COUNTING UP
        this._currentTime = this._roundTime;
      }

      this.intervalFunctions.forEach((func) => {
        func(this);
      });
      if (this.onFinished && typeof this.onFinished === "function") {
        this.onFinished();
      }
    }
  }

  pushIntervalFunction(intervalFunction) {
    this.intervalFunctions.push(intervalFunction);
  }

  valueOf() {
    return this._currentTime;
  }

  get rounds() {
    return this._rounds;
  }

  set rounds(value) {
    if (isNaN(value) || value < 0) value = 0;
    this._rounds = parseInt(value);
    this.initializeTime();
  }

  get isRunning() {
    return this._isRunning;
  }

  get roundPercentComplete() {
    return Math.floor(10000 * (this._currentTime / this._roundTime));
  }

  get percentComplete() {
    return Math.floor(
      (10000 * this.timeElapsed) / this._totalTime
    );
  }

  get timeElapsed(){
    let rounds;
    if (this.countdownMode) {
      if (this._currentRound - 1 < 0) return 0;
      rounds = this._currentRound - 1;
    } else rounds = this._roundsCompleted;
    return rounds * this._roundTime + this._currentTime;
  }

  get minutePercentComplete() {
    return Math.floor((10000 * (this._currentTime % MINUTE)) / MINUTE);
  }

  get currentRound() {
    return this._currentRound;
  }

  get currentYears() {
    return Math.floor(this._currentTime / YEAR);
  }

  get currentMonths() {
    return Math.floor((this._currentTime % YEAR) / MONTH);
  }

  get currentDays() {
    return Math.floor((this._currentTime % MONTH) / DAY);
  }

  get currentHours() {
    return Math.floor((this._currentTime % DAY) / HOUR);
  }

  get currentMinutes() {
    return Math.floor((this._currentTime % HOUR) / MINUTE);
  }

  get currentSeconds() {
    return Math.floor((this._currentTime % MINUTE) / SECOND);
  }

  get currentMilliseconds() {
    return Math.floor((this._currentTime % SECOND) / MILLISECOND);
  }

  get isRoundComplete() {
    if (this.countdownMode) return this._currentTime === 0;
    return this._currentTime === this._roundTime;
  }

  get totalTime() {
    return this._totalTime;
  }

  get isTimerComplete() {
    // stopwatch has no end time
    if (this.stopWatchMode) return false;
    // tells weather times is finished
    if (this.countdownMode)
      return this._currentRound === 0 && this._currentTime === 0;
    return this._currentRound === 0 && this._currentTime === this._roundTime;
  }

  get isTimerNotComplete() {
    return !this.isTimerComplete;
  }

  destroy() {
    clearInterval(this.countdownInterval);
    this.intervalFunctions = null;
  }

  static get TIME_ENUM() {
    return TIME_ENUM;
  }

  toString() {
    let timeString = [];
    if (this.currentYears) timeString.push(`${this.currentDays}y`);
    if (this.currentMonths) timeString.push(`${this.currentDays}m`);
    if (this.currentDays) timeString.push(`${this.currentDays}d`);
    if (this.currentHours) timeString.push(`${this.currentHours}h`);
    if (this.currentMinutes) timeString.push(`${this.currentMinutes}m`);
    if (this.currentSeconds) timeString.push(`${this.currentSeconds}s`);
    if (this.currentMilliseconds)
      timeString.push(`${this.currentMilliseconds}ms`);
    return timeString.join(" ");
  }

  isValidInput() {
    return (
      !(
        isNaN(this.milliseconds) ||
        isNaN(this.seconds) ||
        isNaN(this.minutes) ||
        isNaN(this.hours)
      ) &&
      !(
        this.hours === 0 &&
        this.minutes === 0 &&
        this.seconds === 0 &&
        this.milliseconds === 0
      ) &&
      this.rounds !== 0 &&
      !isNaN(this.rounds)
    );
  }
}
