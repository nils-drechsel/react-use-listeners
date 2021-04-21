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
exports.ObservedMapMirror = void 0;
class ObservedMapMirror {
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
exports.ObservedMapMirror = ObservedMapMirror;
//# sourceMappingURL=ObservedMapMirror.js.map