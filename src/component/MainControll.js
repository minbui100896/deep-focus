import React from 'react';
import ReactDOM from 'react-dom';
import './../css/styles.css';
import { _25, _05, _15, handleOnKeyDown, handleOnSpaceDown } from './helpers';
import EventListener from 'react-event-listener';
import { Card, CardBody } from 'reactstrap';
import AlarmClock from '../sound/alarm-clock-5s.mp3';
import ClockTicking from '../sound/clock-ticking.mp3'
import { Howl, Howler } from 'howler';
import { colorStyle } from './../css/ConditionStyle';
import LocalStorageUtils from './localStorageUtils';
import { seo } from './seo';


class MainControll extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            interval: null,
            step: 0,
            phase: '',
            timeRemaining: this.getTimeRemaining(_25),
            isRunning: false,
            mode: 'focus',
            finishPhase: false,
            continousFocusAmount: 0
        };

        this.handleStartTimer = this.handleStartTimer.bind(this);
        this.handleStopTimer = this.handleStopTimer.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.displayTime = this.displayTime.bind(this);
        this.getTimeRemaining = this.getTimeRemaining.bind(this);
        this.handleOnKeyDown = handleOnKeyDown.bind(this);
        this.handleOnSpaceDown = handleOnSpaceDown.bind(this);
    }


    componentDidMount() {
        this.updateBrowserTab()
    }

    updateBrowserTab() {
        let label = this.state.mode == 'focus' ? "Working time!" : "Breaking time!"
        let title = `${this.state.timeRemaining.minutes}:${this.state.timeRemaining.seconds} - ${label}`
        let color = 'black'
        if (this.state.isRunning) {
            if (this.state.mode == 'focus') {
                color = 'red'
            } else {
                color = 'green'
            }
        }
        let attributes = {
            title: title,
            metaDescription: 'With some meta description',
            iconColor: color
        }
        console.log(attributes)
        seo(attributes)
    }

    handleStartTimer() {
        this.playSound(ClockTicking)
        if (!this.state.interval) {
            // Update the class of the timer to add styles depending on which step it is on
            this.setState({ phase: this.state.step % 2 === 0 ? 'active' : 'rest' });
            this.startTimer();
            this.updateBrowserTab()
        }
    }

    handleStopTimer() {
        if (this.state.interval) {
            console.log('stopping...');

            clearInterval(this.state.interval);
            this.setState({
                interval: null,
                phase: '',
                isRunning: false
            }, () => {
                this.updateBrowserTab()
            });
           
        }
       
    }

    startTimer() {
        this.displayTime();
        // display initial time without delay
        this.setState({
            // run every second
            interval: setInterval(this.displayTime, 1000),
            isRunning: true,
            finishPhase: false,
        });
    }

    displayTime() {
        console.log(this.state.timeRemaining.total)
        if (this.state.timeRemaining.total > 0) {
            // get & set time remaining every 1 second
            let timeRemaining = this.getTimeRemaining(
                this.state.timeRemaining.total - 1000
            );
            this.setState({ timeRemaining });
            this.updateBrowserTab()
        } else {
            let isEndSecOfAPhase = !this.state.finishPhase
            if (isEndSecOfAPhase) {
                this.alarmFinishPhase()
                clearInterval(this.state.interval);
                this.setState({
                    finishPhase: true,
                    isRunning: false,
                    interval: null
                })
                // this.resetTimeRemaining()
                if (this.state.mode == 'focus') {
                    this.state.continousFocusAmount = this.state.continousFocusAmount + 1
                }
                this.gotoNextPhase()
            }

        }
    }

    resetTimeRemaining() {
        if (this.state.mode == 'focus') {
            this.setState({
                timeRemaining: this.getTimeRemaining(_25),
            })
        } else if (this.state.mode == 'shortBreak') {
            this.setState({
                timeRemaining: this.getTimeRemaining(_05),
            })
        } else {
            this.setState({
                timeRemaining: this.getTimeRemaining(_15),
            })
        }
    }

    gotoNextPhase() {
        if (this.state.mode == 'focus') {
            if (this.state.continousFocusAmount >= 3) {
                this.setState({
                    mode: 'longBreak',
                    timeRemaining: this.getTimeRemaining(_15),
                    continousFocusAmount: 0
                })
            } else {
                this.setState({
                    mode: 'shortBreak',
                    timeRemaining: this.getTimeRemaining(_05)
                })
            }

        } else if (this.state.mode == 'shortBreak') {
            this.setState({
                mode: 'focus',
                timeRemaining: this.getTimeRemaining(_25),
            })
        } else {
            this.setState({
                mode: 'focus',
                timeRemaining: this.getTimeRemaining(_25),
            })
        }
        this.updateBrowserTab()
    }

    getTimeRemaining(timeInMilliSecs) {
        // return a string value of the time remaining
        const total = timeInMilliSecs,
            minutes = Math.floor(total / 1000 / 60 % 60),
            seconds = Math.floor(total / 1000 % 60) < 10
                ? '0' + Math.floor(total / 1000 % 60)
                : Math.floor(total / 1000 % 60);

        return { total, minutes, seconds };
    }

    alarmFinishPhase() {
        this.playSound(AlarmClock)
    }

    getModeButtonStyle(mode) {
        if (mode == this.state.mode) {
            return colorStyle[`${this.state.mode}`]['mode-button']
        } else {
            return {}
        }

    }

    getControlButtonStyle() {
        return colorStyle[`${this.state.mode}`]['control-button']
    }

    handleChangeMode(e, mode) {
        e.preventDefault()
        this.setState({
            finishPhase: false
        })
        this.handleStopTimer();
        if (mode == 'focus') {
            this.handleOpenFocusMode()
        } else if (mode == 'shortBreak') {
            this.handleOpenShortBreakMode()
        } else {
            this.handleOpenLongBreakMode()
        }
        this.updateBrowserTab()
    }

    handleOpenFocusMode() {
        this.setState({
            mode: 'focus',
            timeRemaining: this.getTimeRemaining(_25)
        })
    }

    handleOpenShortBreakMode() {
        this.setState({
            mode: 'shortBreak',
            timeRemaining: this.getTimeRemaining(_05)
        })
    }

    handleOpenLongBreakMode() {
        this.setState({
            mode: 'longBreak',
            timeRemaining: this.getTimeRemaining(_15)
        })
    }

    playSound(src) {
        var sound = new Howl({ src });
        sound.play();
    }


    render() {
        return (
            <div className='active' style={colorStyle[`${this.state.mode}`]['background']}>
                <Card className="main-card" style={colorStyle[`${this.state.mode}`]['main-card']}>
                    <CardBody>
                        <div className='mode'>
                            <button className='mode-button' style={this.getModeButtonStyle('focus')} onClick={e => this.handleChangeMode(e, 'focus')}>Focus</button>
                            <button className='mode-button' style={this.getModeButtonStyle('shortBreak')} onClick={e => this.handleChangeMode(e, 'shortBreak')}>Short Break</button>
                            <button className='mode-button' style={this.getModeButtonStyle('longBreak')} onClick={e => this.handleChangeMode(e, 'longBreak')}>Long Break</button>
                        </div>
                        <div className="timer">
                            <span className="time">{`${this.state.timeRemaining.minutes}:${this.state.timeRemaining.seconds}`}</span>
                            <div>
                                {this.state.isRunning ?
                                    <button style={this.getControlButtonStyle()} className='control-button' onClick={this.handleStopTimer}>stop</button> :
                                    <button style={this.getControlButtonStyle()} className='control-button' onClick={this.handleStartTimer}>start</button>}
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <EventListener target={window} onKeyDown={this.handleOnKeyDown} />
            </div>

        );
    }
}
export default MainControll
