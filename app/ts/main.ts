import StationView = require("./ui/station_view");
import React = require("react");
import Api = require("./api");
import GeoService = require("./geo_service");
import HashService = require("./hash_service");

// React.render(React.createElement(BusList, {
//     buses: [
//         {
//             busName: "meh",
//             direction: "there",
//             arrivalTime: 10,
//             nextArrivalTime: 20
//         },
//         {
//             busName: "meh",
//             direction: "there",
//             arrivalTime: -1,
//             nextArrivalTime: -1
//         }
//     ]
// }), document.querySelector(".main-container"));

var api = new Api();
var geoService = new GeoService();
var hashService = new HashService();

React.render(React.createElement(StationView, {
    api: api,
    geoService: geoService,
    hashService: hashService
}), document.querySelector(".main-container"));

geoService.run();
