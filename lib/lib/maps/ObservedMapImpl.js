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
exports.ObservedMapImpl = void 0;
const Listeners_1 = require("../Listeners");
class ObservedMapImpl {
    constructor() {
        this.idListeners = new Listeners_1.IdListeners();
        this.anyIdListeners = new Listeners_1.AnyIdListeners();
        this.map = new Map();
    }
    get(id) {
        return this.map.get(id);
    }
    has(id) {
        return this.map.has(id);
    }
    keys() {
        return this.map.keys();
    }
    values() {
        return this.map.values();
    }
    size() {
        return this.map.size;
    }
    forEach(callback) {
        return this.map.forEach(callback);
    }
    awaitForEach(callback) {
        Promise.all(Array.from(this.map).map(([key, value]) => __awaiter(this, void 0, void 0, function* () {
            yield callback(value, key);
        })));
    }
    addAnyIdListener(listener) {
        const unsubscribe = this.anyIdListeners.addListener(listener);
        this.map.forEach((_value, id) => listener(id, Listeners_1.ListenerEvent.ADDED));
        return unsubscribe;
    }
    addIdListener(id, listener) {
        const unsubscribe = this.idListeners.addListener(id, listener);
        if (this.map.has(id))
            listener(id, Listeners_1.ListenerEvent.ADDED);
        return unsubscribe;
    }
    notify(id, event) {
        this.idListeners.notify(id, event);
        this.anyIdListeners.notify(id, event);
    }
    set(id, data) {
        const idExisted = this.map.has(id);
        this.map.set(id, data);
        if (idExisted) {
            this.notify(id, Listeners_1.ListenerEvent.MODIFIED);
        }
        else {
            this.notify(id, Listeners_1.ListenerEvent.ADDED);
        }
        return this;
    }
    delete(id) {
        if (!this.map.has(id))
            return;
        this.map.delete(id);
        this.notify(id, Listeners_1.ListenerEvent.REMOVED);
    }
    modify(id, data) {
        if (!this.map.has(id)) {
            return;
        }
        if (data) {
            this.map.set(id, Object.assign({}, this.map.get(id), data));
        }
        this.notify(id, Listeners_1.ListenerEvent.MODIFIED);
    }
}
exports.ObservedMapImpl = ObservedMapImpl;
//# sourceMappingURL=ObservedMapImpl.js.map