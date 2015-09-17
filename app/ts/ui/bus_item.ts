import React = require("react");
import TypedReact = require("typed-react");

var r = React.DOM;

interface P {
    busName: string;
    arrivalTime: number;
    nextArrivalTime: number;
}

interface S {
    countDownTime: number;
}

function timeDisplayString(seconds: number): string {
    if (isNaN(seconds)) {
        return "N/A";
    } else if (seconds < 0) {
        return "-";
    } else if (seconds === 0) {
        return "arriving";
    } else {
        var minutes = Math.floor(seconds / 60);
        var secs = seconds % 60;
        var secDisplay = secs + "";
        if (secs < 10) {
            if (secs === 0) {
                secDisplay = "00";
            }
            secDisplay = "0" + secs;
        }
        return minutes + ":" + secDisplay;
    }
}

class BusItem extends TypedReact.Component<P, S> {
    private _timer: number;

    getInitialState() {
        return {
            countDownTime: 0
        };
    }

    componentWillMount() {
        this.state.countDownTime = this.props.arrivalTime;
        this._startTimer();
    }

    componentWillUnmount() {
        this._endTimer();
    }

    componentWillReceiveProps(nextProps: P) {
        if (isNaN(nextProps.arrivalTime) ||
            nextProps.arrivalTime - 60 >= this.state.countDownTime ||
            nextProps.arrivalTime < this.state.countDownTime
        ) {
            this.state.countDownTime = nextProps.arrivalTime;
        }
    }

    render() {
        return r.div({
            className: "bus-item"
        },
            r.div({
                className: "bus-name"
            }, this.props.busName),
            r.div({
                className: "bus-timings"
            },
                r.div({
                    className: "timing-row"
                },
                    r.div({
                        className: "timing-text"
                    }, "Next Bus:"),
                    r.div({
                        className: "bus-timing"
                    }, timeDisplayString(this.state.countDownTime))
                ),
                r.div({
                    className: "timing-row"
                },
                    r.div({
                        className: "timing-text"
                    }, "Next next bus:"),
                    r.div({
                        className: "bus-timing"
                    }, timeDisplayString(this.props.nextArrivalTime))
                )
            )
        )
    }

    private _startTimer() {
        this._timer = setInterval(this._countDown, 1000);
    }

    private _endTimer() {
        clearInterval(this._timer);
    }

    private _countDown = () => {
        if (this.state.countDownTime && this.state.countDownTime > 1) {
            this.setState({
                countDownTime: this.state.countDownTime - 1
            });
        }
    }
}

export = TypedReact.createClass(BusItem);
