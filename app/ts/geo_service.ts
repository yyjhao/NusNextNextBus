class GeoService {
    private _listeners: GeoService.Callback[];

    constructor() {
        this._listeners = [];
    }

    bind(callback: GeoService.Callback) {
        this._listeners.push(callback);
    }

    run() {
        this._retrieve();
        setInterval(this._retrieve, 10000);
    }

    private _retrieve = () => {
        navigator.geolocation.getCurrentPosition(this._geoCallback);
    }

    private _geoCallback = (position: any) => {
        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;
        this._listeners.forEach(function(listener) {
            listener(longitude, latitude);
        });
    }
}

module GeoService {
    export interface Callback {
        (longitude: number, latitude: number): void;
    }
}

export = GeoService
