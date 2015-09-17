import React = require("react");
import TypedReact = require("typed-react");

var r = React.DOM;

class Loading extends TypedReact.Component<{}, {}> {
    render() {
        return r.div({
            className: "loading-spinner"
        },
            r.div({ className: "rect1" }),
            r.div({ className: "rect2" }),
            r.div({ className: "rect3" }),
            r.div({ className: "rect4" }),
            r.div({ className: "rect5" })
        );
    }
}

export = TypedReact.createClass(Loading);
