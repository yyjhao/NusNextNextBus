import StationView = require("./ui/station_view");
import React = require("react");
import Api = require("./api");
import GeoService = require("./geo_service");
import HashService = require("./hash_service");

var api = new Api();
var geoService = new GeoService();
var hashService = new HashService();

React.render(React.createElement(StationView, {
    api: api,
    geoService: geoService,
    hashService: hashService
}), document.querySelector(".main-container"));

geoService.run();
