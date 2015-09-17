import BusesView = require("./ui/buses_view");
import React = require("react");
import Api = require("./api");

var r = React.DOM;

var api = new Api();

React.render(r.ul({
        className: "stations"
    },
    r.li({},
        r.h2({}, "COM 2"),
        React.createElement(BusesView, {
            api: api,
            stopId: "COM2",
            loadBuses: true,
            autoHeight: true
        })
    ),
    r.li({},
        r.h2({}, "Central Library"),
        React.createElement(BusesView, {
            api: api,
            stopId: "CENLIB",
            loadBuses: true,
            autoHeight: true
        })
    ),
    r.li({},
        r.h2({}, "Computer Center"),
        React.createElement(BusesView, {
            api: api,
            stopId: "COMCEN",
            loadBuses: true,
            autoHeight: true
        })
    )
), document.querySelector(".main-container"));
