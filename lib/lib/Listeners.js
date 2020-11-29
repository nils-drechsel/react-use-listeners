"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Listeners {
    constructor() {
        this.listenerCount = 0;
        this.callbacks = new Map();
    }
    createId() {
        return this.listenerCount++;
    }
    removeListener(id) {
        this.callbacks.delete(id);
    }
    addListener(callback) {
        const id = this.createId();
        this.callbacks.set(id, callback);
        const returnRemoveCallback = () => this.removeListener(id);
        return returnRemoveCallback.bind(this);
    }
    getCallbacks() {
        return Array.from(this.callbacks.values());
    }
    forEach(callbackfn) {
        this.callbacks.forEach(callbackfn);
    }
}
exports.Listeners = Listeners;
class DataListeners extends Listeners {
}
exports.DataListeners = DataListeners;
//# sourceMappingURL=Listeners.js.map