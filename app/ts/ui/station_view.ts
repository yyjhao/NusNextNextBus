import React = require("react");
import TypedReact = require("typed-react");
var r = React.DOM;

import Api = require("../api");
import GeoService = require("../geo_service");
import Loading = require("./loading");
import StationList = require("./station_list");
import HashService = require("../hash_service");

interface P {
    api: Api;
    geoService: GeoService;
    hashService: HashService;
}

interface S {
    stationsInfo?: Api.StationInfo[];
    displayBuses?: { [s: string]: boolean };
    longitude?: number;
    latitude?: number;
    hasFailed?: boolean;
}

interface GeoPoint {
    longitude: number;
    latitude: number;
}

function dist(p1: GeoPoint, p2: GeoPoint) {
    var R = 6371000; // metres
    var l1 = p1.latitude / 180 * Math.PI;
    var l2 = p2.latitude / 180 * Math.PI;
    var dl = (p2.latitude - p1.latitude) / 180 * Math.PI;
    var dd = (p2.longitude - p1.longitude) / 180 * Math.PI;

    var a = Math.sin(dl/2) * Math.sin(dl/2) +
            Math.cos(l1) * Math.cos(l2) *
            Math.sin(dd/2) * Math.sin(dd/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return d;
}

class StationView extends TypedReact.Component<P, S> {
    getInitialState() {
        return {
            longitude: 0,
            latitude: 0,
            hasFailed: false,
            displayBuses: {}
        };
    }

    componentWillMount() {
        this.props.api.bindFailures(this._onNetworkFailure)
        this.props.api.getStops(this._storeStops);
        this.props.geoService.bind(this._updateLocation);
        this.props.hashService.bind(this._updateDisplayBuses);
    }

    render(): React.ReactElement<any> {
        if (this.state.stationsInfo &&
            (this.state.longitude || this.state.latitude)
        ) {
            var stations = this.state.stationsInfo.map((station) => {
                return {
                    id: station.id,
                    name: station.name,
                    distance: dist(station, <any>(this.state))
                };
            });
            stations.sort(function(s1, s2) {
                return s1.distance - s2.distance;
            });
            var displayBuses = this.state.displayBuses;
            if (this.props.hashService.shouldDisplayClosest()) {
                var additional: { [s: string]: { value: boolean } } = {};
                additional[stations[0].id] = {
                    value: true
                };
                displayBuses = Object.create(displayBuses, additional);
            }
            return r.div({},
                React.createElement(StationList, {
                    stations: stations,
                    displayBuses: displayBuses,
                    onItemClicked: this._onItemClicked,
                    api: this.props.api
                }),
                this.state.hasFailed ? this._renderNetworkError() : null
            );
        } else if (this.state.hasFailed) {
            return this._renderNetworkError();
        } else {
            return r.div({
                className: "loading-screen"
            },
                React.createElement(Loading)
            );
        }
    }

    private _renderNetworkError() {
        return r.div({
            className: "network-issue"
        },
            r.div({
                className: "network-issue-inner"
            },
                "There are some problems with your network, try ",
                r.a({
                    href: "#",
                    onClick: this._refresh
                },
                    "refreshing"
                ),
                "?"
            )
        );
    }

    private _storeStops = (stations: Api.StationInfo[]) => {
        this.setState(<any>{
            stationsInfo: stations
        });
    };

    private _updateLocation = (longitude: number, latitude: number) => {
        this.setState({
            longitude: longitude,
            latitude: latitude
        });
    };

    private _updateDisplayBuses = () => {
        var mapping: { [s: string]: boolean } = {};
        this.props.hashService.additionalStationDisplay().forEach(function(station) {
            mapping[station] = true;
        });
        this.setState(<any>{
            displayBuses: mapping
        });
    };

    private _onItemClicked = (id: string, isFirst: boolean) => {
        if (isFirst) {
            if (this.state.displayBuses[id]) {
                if (this.props.hashService.shouldDisplayClosest()) {
                    this.props.hashService.toggleShouldDisplayClosest();
                }
                this.props.hashService.toggleDisplay(id);
            } else {
                this.props.hashService.toggleShouldDisplayClosest();
            }
        } else {
            this.props.hashService.toggleDisplay(id);
        }
    };

    private _onNetworkFailure = () => {
        this.setState({
            hasFailed: true
        });
    }

    private _refresh(event: React.MouseEvent) {
        event.preventDefault();
        window.location = window.location;
    }
}

export = TypedReact.createClass(StationView);
