"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        }
        else {
            container.ids.add(id);
            container.listeners.forEach(listener => listener(id, ListenerEvent.ADDED));
            if (container.idListeners.has(id)) {
                container.idListeners.get(id).forEach(listener => listener(ListenerEvent.ADDED));
            }
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
    }
}
exports.IdListeners = IdListeners;
class ObservedMap extends Map {
    constructor() {
        super(...arguments);
        this.arrayListeners = new DataListeners();
        this.idListeners = new IdListeners();
    }
    addArrayListener(listener) {
        const unsubscribe = this.arrayListeners.addListener(listener);
        const array = this.getArray();
        listener(array);
        return unsubscribe;
    }
    addAnyIdListener(listener) {
        return this.idListeners.addListener(listener);
    }
    addIdListener(id, listener) {
        return this.idListeners.addIdListener(id, listener);
    }
    notifyArrayListeners() {
        const array = this.getArray();
        this.arrayListeners.forEach(listener => listener(array));
    }
    getArray() {
        return Array.from(this.values());
    }
    set(id, data) {
        const idExisted = this.has(id);
        super.set(id, data);
        if (idExisted) {
            this.idListeners.modifyId(id);
        }
        else {
            this.idListeners.addId(id);
        }
        this.notifyArrayListeners();
        return this;
    }
    delete(id) {
        if (!this.has(id))
            false;
        super.delete(id);
        this.idListeners.removeId(id);
        this.notifyArrayListeners();
        return true;
    }
    modify(id, data) {
        if (!this.has(id))
            return;
        if (data) {
            super.set(id, Object.assign({}, this.get(id), data));
        }
        this.idListeners.modifyId(id);
        this.notifyArrayListeners();
    }
    clear() {
        const keys = Array.from(this.keys());
        super.clear();
        keys.forEach(id => this.idListeners.removeId(id));
        this.notifyArrayListeners();
    }
}
exports.ObservedMap = ObservedMap;
class ObservedObject {
    constructor() {
        this.listeners = new DataListeners;
        this.obj = null;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.obj !== null && this.obj !== undefined)
                return this.obj;
            return new Promise((resolve, reject) => {
                const unsubscribe = this.listeners.addListener((obj) => {
                    unsubscribe();
                    if (obj === undefined) {
                        reject();
                    }
                    else {
                        resolve(obj);
                    }
                });
            });
        });
    }
    set(obj) {
        this.obj = obj;
        this.listeners.forEach(listener => listener(this.obj));
    }
    fail() {
        this.listeners.forEach(listener => listener(undefined));
    }
}
exports.ObservedObject = ObservedObject;
//# sourceMappingURL=Listeners.js.map