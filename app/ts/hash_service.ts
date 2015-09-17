class HashParser {
    private listeners: (() => void)[];

    constructor() {
        this.listeners = [];
        window.onhashchange = this._hashChange;
    }

    bind(callback: () => void) {
        this.listeners.push(callback);
        callback();
    }

    shouldDisplayClosest() {
        return location.hash.split("#").indexOf("noclosest") === -1;
    }

    additionalStationDisplay() {
        return location.hash.split("#").filter(function(cmp) {
            return cmp.length >= 1 && cmp !== "noclosest";
        });
    }

    toggleDisplay(id: string) {
        var currentDisplay = location.hash.split("#");
        var index = currentDisplay.indexOf(id);
        if (index === -1) {
            currentDisplay.push(id);
        } else {
            currentDisplay.splice(index, 1);
        }
        location.hash = currentDisplay.join("#");
    }

    toggleShouldDisplayClosest() {
        if (this.shouldDisplayClosest()) {
            location.hash += "#noclosest";
        } else {
            var hashCmp = location.hash.split("#");
            hashCmp.splice(hashCmp.indexOf("noclosest"), 1);
            location.hash = hashCmp.join("#");
        }
    }

    private _hashChange = (event: Event) => {
        event.preventDefault();
        this.listeners.forEach(function(callback) {
            callback();
        });
    }
}

export = HashParser
