"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdListeners = exports.DataListeners = exports.Listeners = exports.ListenerEvent = void 0;
var ListenerEvent;
(function (ListenerEvent) {
    ListenerEvent[ListenerEvent["ADDED"] = 0] = "ADDED";
    ListenerEvent[ListenerEvent["REMOVED"] = 1] = "REMOVED";
    ListenerEvent[ListenerEvent["MODIFIED"] = 2] = "MODIFIED";
})(ListenerEvent = exports.ListenerEvent || (exports.ListenerEvent = {}));
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
    size() {
        return this.callbacks.size;
    }
}
exports.Listeners = Listeners;
class DataListeners extends Listeners {
}
exports.DataListeners = DataListeners;
class IdListeners {
    constructor() {
        this.root = new Map();
        this.anyListeners = new Listeners();
    }
    getOrCreateRoot(rootId) {
        if (!this.root.has(rootId)) {
            this.root.set(rootId, { rootId, ids: new Set(), listeners: new Listeners(), idListeners: new Map() });
        }
        return this.root.get(rootId);
    }
    getOrCreateIdListeners(container, id) {
        if (!container.idListeners.has(id)) {
            container.idListeners.set(id, new Listeners());
        }
        return container.idListeners.get(id);
    }
    makePath(...rootIds) {
        if (rootIds.length === 0)
            return "/";
        else
            return rootIds.join("/");
    }
    addAnyListener(listener) {
        return this.anyListeners.addListener(listener);
    }
    addListener(listener, ...rootIds) {
        const rootId = this.makePath(...rootIds);
        const container = this.getOrCreateRoot(rootId);
        const unsubscribe = container.listeners.addListener(listener);
        container.ids.forEach(ids => {
            listener(ids, ListenerEvent.ADDED);
        });
        return () => {
            unsubscribe();
            if (container.listeners.size() === 0 && container.ids.size === 0) {
                this.root.delete(rootId);
            }
        };
    }
    addIdListener(id, listener, ...rootIds) {
        const rootId = this.makePath(...rootIds);
        const container = this.getOrCreateRoot(rootId);
        const idListeners = this.getOrCreateIdListeners(container, id);
        const unsubscribe = idListeners.addListener(listener);
        if (container.ids.has(id)) {
            listener(ListenerEvent.ADDED);
        }
        return () => {
            unsubscribe();
            if (idListeners.size() === 0)
                container.idListeners.delete(id);
            this.removeRootIfPossible(container);
        };
    }
    removeRootIfPossible(container) {
        if (container.listeners.size() === 0 && container.idListeners.size === 0 && container.ids.size === 0) {
            this.root.delete(container.rootId);
        }
    }
    addId(id, ...rootIds) {
        const rootId = this.makePath(...rootIds);
        const container = this.getOrCreateRoot(rootId);
        if (container.ids.has(id)) {
            container.listeners.forEach(listener => listener(id, ListenerEvent.MODIFIED));
            this.anyListeners.getCallbacks().forEach(listener => listener(ListenerEvent.MODIFIED, ...rootIds, id));
        }
        else {
            container.ids.add(id);
            container.listeners.forEach(listener => listener(id, ListenerEvent.ADDED));
            if (container.idListeners.has(id)) {
                container.idListeners.get(id).forEach(listener => listener(ListenerEvent.ADDED));
            }
            this.anyListeners.getCallbacks().forEach(listener => listener(ListenerEvent.ADDED, ...rootIds, id));
        }
    }
    removeId(id, ...rootIds) {
        const rootId = this.makePath(...rootIds);
        if (!this.root.has(rootId))
            return;
        const container = this.root.get(rootId);
        if (!container.ids.has(id))
            return;
        container.ids.delete(id);
        container.listeners.forEach(listener => listener(id, ListenerEvent.REMOVED));
        if (container.idListeners.has(id)) {
            container.idListeners.get(id).forEach(listener => listener(ListenerEvent.REMOVED));
        }
        this.anyListeners.getCallbacks().forEach(listener => listener(ListenerEvent.REMOVED, ...rootIds, id));
        this.removeRootIfPossible(container);
    }
    modifyId(id, ...rootIds) {
        const rootId = this.makePath(...rootIds);
        if (!this.root.has(rootId))
            return;
        const container = this.root.get(rootId);
        if (!container.ids.has(id))
            return;
        container.listeners.forEach(listener => listener(id, ListenerEvent.MODIFIED));
        if (container.idListeners.has(id)) {
            container.idListeners.get(id).forEach(listener => listener(ListenerEvent.MODIFIED));
        }
        this.anyListeners.getCallbacks().forEach(listener => listener(ListenerEvent.MODIFIED, ...rootIds, id));
    }
}
exports.IdListeners = IdListeners;
//# sourceMappingURL=Listeners.js.map