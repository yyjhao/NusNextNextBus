import React = require("react");
import TypedReact = require("typed-react");

var r = React.DOM;

import Api = require("../api");
import StationItem = require("./station_item");

interface DisplayedStationInfo {
    id: string;
    name: string;
    distance: number;
}

interface P {
    stations: DisplayedStationInfo[];
    displayBuses: { [s: string]: boolean };
    onItemClicked: (id: string, isFirst: boolean) => void;
    api: Api;
}

function distanceDisplay(distance: number): string {
    return distance + "m";
}

class StationList extends TypedReact.Component<P, {}> {
    private interval: number;

    render() {
        return r.ul({
            className: "station-list"
        },
            this.props.stations.map((station) => {
                return r.li({
                    key: station.id
                },
                    React.createElement(StationItem, {
                        station: station,
                        displayBuses: this.props.displayBuses[station.id],
                        api: this.props.api,
                        onHeaderClicked: () => {
                            this.props.onItemClicked(
                                station.id,
                                station.id === this.props.stations[0].id
                            );
                        }
                    })
                );
            })
        );
    }
}

export = TypedReact.createClass(StationList);
