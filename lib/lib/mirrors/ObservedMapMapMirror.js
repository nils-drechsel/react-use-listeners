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
exports.ObservedMapMapMirror = void 0;
class ObservedMapMapMirror {
    constructor(map) {
        this.observedKeys = new Set();
        this.size = 0;
        this.map = map;
    }
    [Symbol.iterator]() {
        throw new Error("Method not implemented.");
    }
    entries() {
        throw new Error("Method not implemented.");
    }
    addAnySubIdListener(id, listener) {
        this.map.addAnySubIdListener(id, (subId, event) => {
            if (this.observedKeys.has(id))
                listener(subId, event);
        });
    }
    addSubIdListener(id, subId, listener) {
        this.map.addSubIdListener(id, subId, (event) => {
            if (this.observedKeys.has(id))
                listener(event);
        });
    }
    hasSub(id, subId) {
        return this.observedKeys.has(id) && this.map.hasSub(id, subId);
    }
    getMap(id) {
        if (!this.observedKeys.has(id))
            return undefined;
        return this.map.getMap(id);
    }
    getSub(id, subId) {
        if (!this.observedKeys.has(id))
            return undefined;
        return this.map.getSub(id, subId);
    }
    forEachSub(id, callback) {
        if (!this.observedKeys.has(id))
            return;
        this.map.forEachSub(id, callback);
    }
    awaitForEachSub(id, callback) {
        if (!this.observedKeys.has(id))
            return;
        this.map.awaitForEachSub(id, callback);
    }
    keysSub(id) {
        if (!this.observedKeys.has(id))
            return [].values();
        return this.map.keysSub(id);
    }
    valuesSub(id) {
        if (!this.observedKeys.has(id))
            return [].values();
        return this.map.valuesSub(id);
    }
    sizeSub(id) {
        if (!this.observedKeys.has(id))
            return 0;
        return this.map.sizeSub(id);
    }
    setSub(id, subId, data) {
        this.map.setSub(id, subId, data);
        this.addObservedKey(id);
    }
    deleteSub(id, subId) {
        if (!this.observedKeys.has(id))
            return;
        this.map.deleteSub(id, subId);
    }
    modifySub(id, subId, data) {
        if (!this.observedKeys.has(id))
            return;
        this.map.modifySub(id, subId, data);
    }
    clearSub(id) {
        if (!this.observedKeys.has(id))
            return;
        this.map.clearSub(id);
    }
    addAnyIdListener(listener) {
        this.map.addAnyIdListener((id, event) => {
            if (this.observedKeys.has(id))
                listener(id, event);
        });
    }
    addIdListener(id, listener) {
        this.map.addIdListener(id, (event) => {
            if (this.observedKeys.has(id))
                listener(event);
        });
    }
    get(id) {
        if (!this.map.has(id))
            return undefined;
        return this.map.get(id);
    }
    set(id, data) {
        this.map.set(id, data);
        this.addObservedKey(id);
        return this;
    }
    has(id) {
        return this.observedKeys.has(id) && this.map.has(id);
    }
    delete(id) {
        if (!this.observedKeys.has(id))
            return false;
        const res = this.map.delete(id);
        this.observedKeys.delete(id);
        return res;
    }
    modify(id, data) {
        if (!this.observedKeys.has(id))
            return;
        this.map.modify(id, data);
    }
    clear() {
        this.observedKeys.clear();
    }
    keys() {
        return this.observedKeys.values();
    }
    values() {
        const res = [];
        for (const key of this.observedKeys) {
            const v = this.map.get(key);
            if (v !== undefined)
                res.push(v);
        }
        return res.values();
    }
    forEach(callback) {
        Array.from(this.observedKeys.values()).forEach(id => {
            const v = this.map.get(id);
            if (v === undefined)
                return;
            callback(v, id, new Map());
        });
    }
    awaitForEach(callback) {
        Promise.all(Array.from(this.observedKeys.values()).map((id) => __awaiter(this, void 0, void 0, function* () {
            const v = this.map.get(id);
            if (v === undefined)
                return;
            callback(v, id);
        })));
    }
    addObservedKey(key) {
        this.observedKeys.add(key);
        this.size = this.observedKeys.size;
    }
    deleteObservedKey(key) {
        this.observedKeys.delete(key);
        this.size = this.observedKeys.size;
    }
}
exports.ObservedMapMapMirror = ObservedMapMapMirror;
//# sourceMappingURL=ObservedMapMapMirror.js.map