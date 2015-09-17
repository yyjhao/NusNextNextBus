import ajax = require("./ajax");

class Api {
    private _failureCallback = () => {return};

    constructor() {
        this._failureCallback = null;
    }

    bindFailures(callback: () => void) {
        this._failureCallback = callback;
    }

    getBuses(stopId: string, success: (info: Api.BusInfo[]) => void, failure = () => {return}) {
        ajax.get("/api/buses?busstopname=" + stopId + "&cache=" + Math.random(),
                function(response) {
                    var jsonResult = JSON.parse(response);
                    success(jsonResult.ShuttleServiceResult.shuttles.map(function(bus: any) {
                        return {
                            busName: bus.name,
                            arrivalTime: parseTime(bus.arrivalTime),
                            nextArrivalTime: parseTime(bus.nextArrivalTime)
                        };
                    }));;
                }, (xhr) => {
                    console.log(xhr);
                    failure();
                    this._failureCallback();
                });
    }

    getStops(success: (info: Api.StationInfo[]) => void, failure = () => {return}) {
        ajax.get("/api/stops",
                function(response) {
                    var jsonResult = JSON.parse(response);
                    success(jsonResult.BusStopsResult.busstops.map(function(stop: any) {
                        return {
                            id: stop.name,
                            name: stop.caption,
                            longitude: stop.longitude,
                            latitude: stop.latitude
                        };
                    }));
                }, (xhr) => {
                    console.log(xhr);
                    failure();
                    this._failureCallback();
                });
    }
}

function parseTime(timeString: string) {
    if (timeString === "-") {
        return -1;
    } else if (timeString === "N.A") {
        return 0/0;
    } else if (timeString === "Arr") {
        return 0;
    } else {
        return parseInt(timeString, 10) * 60;
    }
}

module Api {
    export interface BusInfo {
        busName: string;
        arrivalTime: number;
        nextArrivalTime: number
    }

    export interface StationInfo {
        id: string;
        name: string;
        longitude: number;
        latitude: number;
    }
}

export = Api
