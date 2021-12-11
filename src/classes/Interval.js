import { Timer } from "./Timer";

export class Interval {
    constructor({
        timers = [],
        rounds = 1,
        completedRounds = 0,
        serializedState = null
    } = {}) {
        if (serializedState) {
            this.deserialize(serializedState);
        }
        else {
            this.timers = timers;
            this._rounds = rounds;
        }
        this._totalTime = null;
        this._roundTime = null;
        this._completedRounds = completedRounds;
        this._currentTimerIndex = 0;
        this.intializeTimers();
    }

    deserialize(state) {
        this.clear(false);
        let { rounds, timers } = state;
        this._rounds = rounds;
        this.timers = [...timers.map(timerState => new Timer({ serializedState: timerState }))];
    }

    serialize() {
        return {
            rounds: this.rounds,
            timers: [...this.timers.map(timer => timer.serialize() )]
        }
    }

    resetTime() {
        this._rounds = 0;
        for (let timer of this.timers) {
            timer.initializeTime(true, true);
            timer.refresh();
        }
    }

    intializeTimers() {
        for (let i = 0; i < this.timers.length; i++) {
            let timer = this.timers[i];
            let isLastTimer = this.timers.length - 1 === i;
            timer.onFinished = () => {
                this._currentTimerIndex = (isLastTimer) ? 0 : i + 1;
                if (isLastTimer) {
                    this._completedRounds++;
                    if (this._completedRounds < this.rounds)
                        this.timers.forEach(timer => timer.reset());
                }
                if (this._completedRounds < this.rounds)
                    this.timers[this._currentTimerIndex].start();
                else if (this.onFinished && typeof this.onFinished === "function") {
                    this.onFinished();
                }
            }
        }
    }

    get totalTime() {
        if (!this._totalTime) this._totalTime = this.roundTime * this.rounds;
        return this._totalTime;
    }

    get currentTime() {
        return (this.currentRound - 1) * this.roundTime + this.currentRoundTime;
    }

    get percentComplete() {
        return Math.floor((10000 * this.currentTime / this.totalTime));
    }

    get roundTime() {
        if (!this._roundTime) {
            this._roundTime = this.timers.reduce((prev, curr) => {
                return prev + curr.totalTime;
            }, 0);
        }
        return this._roundTime;
    }

    get currentRoundTime() {
        return this.timers.reduce((prev, curr) => {
            return prev + curr;
        }, 0)
    }

    get roundPercentage() {
        return Math.floor((10000 *
            this.currentRoundTime / this.roundTime));
    }

    get rounds() { return this._rounds; }
    set rounds(value) { this._rounds = value; this._totalTime = null; this.reset() }

    get currentTimer() {
        const { _currentTimerIndex: index, timers } = this;
        if (timers.length > 0 && index < timers.length) return timers[index];
        return null;
    }

    get currentRound() {
        return this.rounds - this._completedRounds;
    }

    start(initializeTime = true) {
        if (this.currentRound === 0) {
            this._completedRounds = 0;
            this.timers.forEach(timer => timer.reset());
        }
        if (this.currentTimer) this.currentTimer.start(initializeTime);
    }

    clear(triggerOnFinished = true) {
        this.timers.forEach(timer => timer.clear(triggerOnFinished));
    }

    reset() {
        this.timers.forEach(timer => {
            timer.clear(false);
            timer.reset();
        })
        this._totalTime = null;
        this._roundTime = null;
        this._completedRounds = 0;
        this._currentTimerIndex = 0;
    }

    clean() {
        this.timers.forEach(timer => {
            timer.clean();
        });
    }

    finishCurrent() {
        if (this.currentRound === 0) this.reset();
        else if (this.currentTimer) this.currentTimer.finishRound();
    }

}