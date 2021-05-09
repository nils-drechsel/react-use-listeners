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
exports.ObservedMapMapImpl = void 0;
const Listeners_1 = require("../Listeners");
class ObservedMapMapImpl {
    constructor(autoRemoveIds = true) {
        this.map = new Map();
        this.subIdListeners = new Listeners_1.SubIdListeners();
        this.anySubIdListeners = new Listeners_1.AnySubIdListeners();
        this.anyListeners = new Listeners_1.AnyListeners();
        this.size = 0;
        this.autoRemoveIds = autoRemoveIds;
    }
    getMap(id) {
        return this.map.get(id);
    }
    addSubIdListener(id, subId, listener) {
        const unsubscribe = this.subIdListeners.addListener(id, subId, listener);
        if (this.map.has(id)) {
            const sub = this.map.get(id);
            if (sub.has(subId))
                listener(id, subId, Listeners_1.ListenerEvent.ADDED);
        }
        return unsubscribe;
    }
    addAnySubIdListener(id, listener) {
        const unsubscribe = this.anySubIdListeners.addListener(id, listener);
        if (this.map.has(id)) {
            this.map.get(id).forEach((_value, subId) => listener(id, subId, Listeners_1.ListenerEvent.ADDED));
        }
        return unsubscribe;
    }
    addAnyListener(listener) {
        const unsubscribe = this.anyListeners.addListener(listener);
        this.map.forEach((subMap, id) => {
            subMap.forEach((_value, subId) => listener(id, subId, Listeners_1.ListenerEvent.ADDED));
        });
        return unsubscribe;
    }
    has(id) {
        return this.map.has(id);
    }
    hasSub(id, subId) {
        if (!this.map.has(id))
            return false;
        return this.map.get(id).has(subId);
    }
    getSub(id, subId) {
        if (!this.has(id))
            return undefined;
        return this.map.get(id).get(subId);
    }
    getSubIds(id) {
        if (!this.has(id))
            return new Set();
        return new Set(this.map.get(id).keys());
    }
    forEach(callback) {
        this.map.forEach((map, id) => {
            map.forEach((value, subId) => {
                callback(value, id, subId);
            });
        });
    }
    forEachSub(id, callback) {
        if (!this.has(id))
            return;
        this.map.get(id).forEach((value, key) => callback(value, key));
    }
    awaitForEachSub(id, callback) {
        if (!this.has(id))
            return;
        Promise.all(Array.from(this.map.get(id)).map(([key, value]) => __awaiter(this, void 0, void 0, function* () {
            yield callback(value, key);
        })));
    }
    keys() {
        return this.map.keys();
    }
    keysSub(id) {
        if (!this.has(id)) {
            return [].values();
        }
        return this.map.get(id).keys();
    }
    valuesSub(id) {
        if (!this.has(id)) {
            return [].values();
        }
        return this.map.get(id).values();
    }
    sizeSub(id) {
        if (!this.has(id))
            return 0;
        return this.map.get(id).size;
    }
    updateSize() {
        this.size = this.map.size;
    }
    notify(id, subId, event) {
        this.subIdListeners.notify(id, subId, event);
        this.anySubIdListeners.notify(id, subId, event);
        this.anyListeners.notify(id, subId, event);
    }
    setSub(id, subId, data) {
        if (!this.has(id)) {
            this.map.set(id, new Map());
        }
        const map = this.map.get(id);
        const idExisted = map.has(subId);
        map.set(subId, data);
        if (idExisted) {
            this.notify(id, subId, Listeners_1.ListenerEvent.MODIFIED);
        }
        else {
            this.notify(id, subId, Listeners_1.ListenerEvent.ADDED);
        }
        this.updateSize();
        return this;
    }
    delete(id) {
        if (!this.has(id))
            return;
        const items = this.map.get(id);
        items.forEach((_item, subId) => this.deleteSub(id, subId));
        this.map.delete(id);
    }
    deleteSub(id, subId) {
        if (!this.has(id))
            return;
        const map = this.map.get(id);
        if (!map.has(subId))
            return;
        map.delete(subId);
        this.updateSize();
        if (this.autoRemoveIds && map.size === 0) {
            this.delete(id);
        }
        this.notify(id, subId, Listeners_1.ListenerEvent.REMOVED);
        return;
    }
    modifySub(id, subId, data) {
        const map = this.map.get(id);
        if (!map || !map.has(subId)) {
            return;
        }
        if (data) {
            map.set(subId, Object.assign({}, map.get(id), data));
        }
        this.notify(id, subId, Listeners_1.ListenerEvent.MODIFIED);
    }
}
exports.ObservedMapMapImpl = ObservedMapMapImpl;
//# sourceMappingURL=ObservedMapMapImpl.js.map