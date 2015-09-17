import React = require("react");
import TypedReact = require("typed-react");
var r = React.DOM;

import Api = require("../api");
import BusList = require("./bus_list");
import Loading = require("./loading");

interface P {
    stopId: string;
    api: Api;
    loadBuses: boolean;
    autoHeight: boolean;
}

interface S {
    buses: Api.BusInfo[];
}

class BusesView extends TypedReact.Component<P, S> {
    private _discardResult: boolean;
    private _timer: number;

    getInitialState() {
        return <S>{
            buses: null
        };
    }

    componentWillMount() {
        if (this.props.loadBuses) {
            this._discardResult = false;
            this._initRequest();
        } else {
            this._discardResult = true;
        }
    }

    componentWillUnmount() {
        this._discardResult = true;
        clearTimeout(this._timer);
    }

    componentWillReceiveProps(nextProps: P) {
        if (nextProps.loadBuses && !this.props.loadBuses) {
            this._discardResult = false;
            this._initRequest();
        } else if (!nextProps.loadBuses && this.props.loadBuses) {
            this._discardResult = true;
            clearTimeout(this._timer);
        }
    }

    render() {
        var inner: React.ReactElement<any>;
        if (!this.state.buses) {
            inner = r.div({
                className: "loading-row"
            },
                React.createElement(Loading, {})
            );
        } else {
            inner = React.createElement(BusList, {
                buses: this.state.buses
            });
        }
        var height = 0;
        if (this.props.loadBuses) {
            if (this.state.buses) {
                height = 70 * this.state.buses.length + 10;
            } else {
                height = 70;
            }
        }
        return r.div({
            className: "buses-view",
            style: {
                height: this.props.autoHeight ? "auto" : height + "px"
            }
        }, inner);
    }

    private _initRequest = () => {
        this.props.api.getBuses(this.props.stopId, this._updateBuses);
    }

    private _updateBuses = (buses: Api.BusInfo[]) => {
        if (!this._discardResult) {
            this.setState({
                buses: buses
            });
            clearTimeout(this._timer);
            this._timer = setTimeout(this._initRequest, 15 * 1000);
        }
    };
}

export = TypedReact.createClass(BusesView);
