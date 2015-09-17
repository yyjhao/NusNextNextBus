import React = require("react");
import TypedReact = require("typed-react");

var r = React.DOM;

import BusesView = require("./buses_view");
import Api = require("../api");

import injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

interface DisplayedStationInfo {
    id: string;
    name: string;
    distance: number;
}

interface P {
    station: DisplayedStationInfo;
    displayBuses: boolean;
    onHeaderClicked: () => void;
    api: Api;
}

function distanceDisplay(distance: number): string {
    return Math.floor(distance) + "m";
}

class StationItem extends TypedReact.Component<P, {}> {
    render() {
        return r.div({
            className: "station-wrap"
        },
                r.div({
                    className: "station-item",
                    onTouchTap: this.props.onHeaderClicked
                },
                    r.div({
                        className: "station-name"
                    }, this.props.station.name),
                    r.div({
                        className: "station-distance"
                    }, distanceDisplay(this.props.station.distance)),
                    r.div({
                        className: "arrow"
                    }, r.div({
                        className: "arrow-inner" + (this.props.displayBuses ? " arrow-up" : "")
                    }, "▼"))
                ),
                React.createElement(BusesView, {
                    stopId: this.props.station.id,
                    api: this.props.api,
                    loadBuses: this.props.displayBuses
                })
        );
    }
}

export = TypedReact.createClass(StationItem);
