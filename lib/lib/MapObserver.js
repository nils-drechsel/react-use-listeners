"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MapObserver {
    constructor(onAdded, onRemoved) {
        this.map = new Map();
        this.onAdded = onAdded;
        this.onRemoved = onRemoved;
    }
    refresh(data, createValue, addPredicate, removePredicate) {
        const newValues = [];
        const obsoleteValues = [];
        data.forEach((value, key) => {
            if (!this.map.has(key)) {
                if (!addPredicate || addPredicate(value)) {
                    if (!createValue) {
                        const v = value;
                        this.map.set(key, v);
                        newValues.push(v);
                    }
                    else {
                        const v = createValue(value);
                        this.map.set(key, v);
                        newValues.push(v);
                    }
                }
            }
            else {
                if (!removePredicate || removePredicate(this.map.get(key), value)) {
                    const v = this.map.get(key);
                    this.map.delete(key);
                    obsoleteValues.push(v);
                }
            }
        });
        this.map.forEach((_value, key) => {
            if (!data.has(key)) {
                const v = this.map.get(key);
                this.map.delete(key);
                obsoleteValues.push(v);
            }
            else {
            }
        });
        if (newValues.length > 0)
            this.onAdded(newValues);
        if (obsoleteValues.length > 0)
            this.onRemoved(obsoleteValues);
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