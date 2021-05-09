"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyListeners = exports.AnySubIdListeners = exports.SubIdListeners = exports.IdListeners = exports.AnyIdListeners = exports.Unsubscribers = exports.ListenerEvent = void 0;
var ListenerEvent;
(function (ListenerEvent) {
    ListenerEvent[ListenerEvent["ADDED"] = 0] = "ADDED";
    ListenerEvent[ListenerEvent["REMOVED"] = 1] = "REMOVED";
    ListenerEvent[ListenerEvent["MODIFIED"] = 2] = "MODIFIED";
})(ListenerEvent = exports.ListenerEvent || (exports.ListenerEvent = {}));
class Unsubscribers {
    constructor() {
        this.items = new Map();
        this.cnt = 0;
    }
    add(item) {
        const id = this.cnt++;
        this.items.set(id, item);
        return () => {
            this.items.delete(id);
        };
    }
    forEach(callback) {
        this.items.forEach((item) => callback(item));
    }
    isEmpty() {
        return this.items.size === 0;
    }
}
exports.Unsubscribers = Unsubscribers;
class AnyIdListeners {
    constructor() {
        this.listeners = new Unsubscribers();
        this.cnt = 0;
    }
    addListener(listener) {
        return this.listeners.add(listener);
    }
    notify(id, event) {
        this.listeners.forEach((listener) => listener(id, event));
    }
    add(id) {
        this.notify(id, ListenerEvent.ADDED);
    }
    modify(id) {
        this.notify(id, ListenerEvent.MODIFIED);
    }
    delete(id) {
        this.notify(id, ListenerEvent.REMOVED);
    }
    isEmpty() {
        return this.listeners.isEmpty();
    }
}
exports.AnyIdListeners = AnyIdListeners;
class IdListeners {
    constructor() {
        this.listeners = new Map();
    }
    addListener(id, listener) {
        if (!this.listeners.has(id)) {
            this.listeners.set(id, new Unsubscribers());
        }
        const listeners = this.listeners.get(id);
        const unsubscribe = listeners.add(listener);
        return () => {
            unsubscribe();
            const map = this.listeners.get(id);
            if (map && map.isEmpty())
                this.listeners.delete(id);
        };
    }
    notify(id, event) {
        if (!this.listeners.has(id))
            return;
        this.listeners.get(id).forEach((listener) => listener(id, event));
    }
    add(id) {
        this.notify(id, ListenerEvent.ADDED);
    }
    modify(id) {
        this.notify(id, ListenerEvent.MODIFIED);
    }
    delete(id) {
        this.notify(id, ListenerEvent.REMOVED);
    }
    isEmpty() {
        return this.listeners.size === 0;
    }
    isEmptyId(id) {
        return !this.listeners.has(id);
    }
}
exports.IdListeners = IdListeners;
class SubIdListeners {
    constructor() {
        this.listeners = new Map();
    }
    addListener(id, subId, listener) {
        if (!this.listeners.has(id)) {
            this.listeners.set(id, new Map());
        }
        const subListeners = this.listeners.get(id);
        if (!subListeners.has(subId)) {
            subListeners.set(subId, new Unsubscribers());
        }
        const listeners = subListeners.get(subId);
        const unsubscribe = listeners.add(listener);
        return () => {
            unsubscribe();
            const map = this.listeners.get(id);
            if (!map)
                return;
            if (map.get(subId).isEmpty())
                map.delete(id);
            if (map.size === 0)
                this.listeners.delete(id);
        };
    }
    notify(id, subId, event) {
        if (!this.listeners.has(id))
            return;
        const subListeners = this.listeners.get(id);
        if (!subListeners.has(subId))
            return;
        subListeners.get(subId).forEach((listener) => listener(id, subId, event));
    }
    add(id, subId) {
        this.notify(id, subId, ListenerEvent.ADDED);
    }
    modify(id, subId) {
        this.notify(id, subId, ListenerEvent.MODIFIED);
    }
    delete(id, subId) {
        this.notify(id, subId, ListenerEvent.REMOVED);
    }
    isEmpty() {
        return this.listeners.size === 0;
    }
    isEmptyId(id) {
        return !this.listeners.has(id);
    }
    isEmptySubId(id, subId) {
        return !this.listeners.has(id) || !this.listeners.get(id).has(subId);
    }
}
exports.SubIdListeners = SubIdListeners;
class AnySubIdListeners {
    constructor() {
        this.listeners = new Map();
    }
    addListener(id, listener) {
        if (!this.listeners.has(id)) {
            this.listeners.set(id, new Unsubscribers());
        }
        const listeners = this.listeners.get(id);
        const unsubscribe = listeners.add(listener);
        return () => {
            unsubscribe();
            const map = this.listeners.get(id);
            if (map && map.isEmpty())
                this.listeners.delete(id);
        };
    }
    notify(id, subId, event) {
        if (!this.listeners.has(id))
            return;
        this.listeners.get(id).forEach((listener) => listener(id, subId, event));
    }
    add(id, subId) {
        this.notify(id, subId, ListenerEvent.ADDED);
    }
    modify(id, subId) {
        this.notify(id, subId, ListenerEvent.MODIFIED);
    }
    delete(id, subId) {
        this.notify(id, subId, ListenerEvent.REMOVED);
    }
    isEmpty() {
        return this.listeners.size === 0;
    }
    isEmptyId(id) {
        return !this.listeners.has(id);
    }
}
exports.AnySubIdListeners = AnySubIdListeners;
class AnyListeners {
    constructor() {
        this.listeners = new Unsubscribers();
    }
    addListener(listener) {
        const unsubscribe = this.listeners.add(listener);
        return () => {
            unsubscribe();
        };
    }
    notify(id, subId, event) {
        this.listeners.forEach((listener) => listener(id, subId, event));
    }
    add(id, subId) {
        this.notify(id, subId, ListenerEvent.ADDED);
    }
    modify(id, subId) {
        this.notify(id, subId, ListenerEvent.MODIFIED);
    }
    delete(id, subId) {
        this.notify(id, subId, ListenerEvent.REMOVED);
    }
    isEmpty() {
        return this.listeners.isEmpty();
    }
}
exports.AnyListeners = AnyListeners;
//# sourceMappingURL=Listeners.js.map