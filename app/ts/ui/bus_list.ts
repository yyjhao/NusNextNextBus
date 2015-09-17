import React = require("react");
import TypedReact = require("typed-react");
var r = React.DOM;

import Api = require("../api");
import BusItem = require("./bus_item");

interface P {
    buses: Api.BusInfo[];
}

class BusList extends TypedReact.Component<P, {}> {
    render() {
        return r.ul({
            className: "bus-list"
        },
            this.props.buses.map(function(bus) {
                return r.li({
                    key: bus.busName
                }, React.createElement(BusItem, bus));
            })
        );
    }
}

export = TypedReact.createClass(BusList);
