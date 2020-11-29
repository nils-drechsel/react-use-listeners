"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MapObserver {
    constructor(onAdded, onRemoved) {
        this.map = new Map();
        this.onAdded = onAdded;
        this.onRemoved = onRemoved;
    }
    refresh(data, createValue, addPredicate, removePredicate) {
        const newIds = new Set();
        const obsoleteIds = new Set();
        data.forEach((value, key) => {
            if (!this.map.has(key)) {
                if (!addPredicate || addPredicate(value)) {
                    if (!createValue) {
                        this.map.set(key, value);
                    }
                    else {
                        this.map.set(key, createValue(value));
                    }
                    newIds.add(key);
                }
            }
            else {
                if (!removePredicate || removePredicate(this.map.get(key), value)) {
                    this.map.delete(key);
                    obsoleteIds.add(key);
                }
            }
        });
        this.map.forEach((_value, key) => {
            if (!data.has(key)) {
                this.map.delete(key);
                obsoleteIds.add(key);
            }
            else {
            }
        });
        if (newIds.size > 0)
            this.onAdded(newIds);
        if (obsoleteIds.size > 0)
            this.onRemoved(obsoleteIds);
    }
    values() {
        return this.map.values();
    }
    keys() {
        return this.map.keys();
    }
    forEach(callbackfn) {
        this.map.forEach(callbackfn);
    }
}
exports.MapObserver = MapObserver;
class StringMapObserver extends MapObserver {
}
exports.StringMapObserver = StringMapObserver;
//# sourceMappingURL=MapObserver.js.map