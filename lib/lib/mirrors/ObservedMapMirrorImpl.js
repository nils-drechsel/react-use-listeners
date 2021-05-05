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
exports.ObservedMapMirrorImpl = void 0;
class ObservedMapMirrorImpl {
    constructor(map) {
        this.observedIds = new Set();
        this.map = map;
    }
    size() {
        return Array.from(this.values()).length;
    }
    addAnyIdListener(listener) {
        return this.map.addAnyIdListener((id, event) => {
            if (this.observedIds.has(id))
                listener(id, event);
        });
    }
    addIdListener(id, listener) {
        return this.map.addIdListener(id, (id, event) => {
            if (this.observedIds.has(id))
                listener(id, event);
        });
    }
    get(id) {
        if (!this.map.has(id))
            return undefined;
        return this.map.get(id);
    }
    set(id, data) {
        this.map.set(id, data);
        return this;
    }
    has(id) {
        return this.observedIds.has(id) && this.map.has(id);
    }
    delete(id) {
        if (!this.observedIds.has(id))
            return;
        this.map.delete(id);
    }
    modify(id, data) {
        if (!this.observedIds.has(id))
            return;
        this.map.modify(id, data);
    }
    clear() {
        this.observedIds.clear();
    }
    keys() {
        return this.observedIds.values();
    }
    values() {
        const res = [];
        for (const key of this.observedIds) {
            const v = this.map.get(key);
            if (v !== undefined)
                res.push(v);
        }
        return res.values();
    }
    forEach(callback) {
        Array.from(this.observedIds.values()).forEach((id) => {
            const v = this.map.get(id);
            if (v === undefined)
                return;
            callback(v, id, new Map());
        });
    }
    awaitForEach(callback) {
        Promise.all(Array.from(this.observedIds.values()).map((id) => __awaiter(this, void 0, void 0, function* () {
            const v = this.map.get(id);
            if (v === undefined)
                return;
            callback(v, id);
        })));
    }
    addObservedId(id) {
        this.observedIds.add(id);
    }
    deleteObservedId(id) {
        this.observedIds.delete(id);
    }
    destroy() { }
}
exports.ObservedMapMirrorImpl = ObservedMapMirrorImpl;
//# sourceMappingURL=ObservedMapMirrorImpl.js.map