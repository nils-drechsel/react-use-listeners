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
exports.ObservedMapMapMirrorImpl = void 0;
const ObservedMapImpl_1 = require("../maps/ObservedMapImpl");
class ObservedMapMapMirrorImpl {
    constructor(map) {
        this.observedIds = new Map();
        this.size = 0;
        this.map = map;
    }
    [Symbol.iterator]() {
        throw new Error("Method not implemented.");
    }
    entries() {
        throw new Error("Method not implemented.");
    }
    addAnyListener(listener) {
        return this.map.addAnyListener((id, subId, event) => {
            var _a;
            if (this.observedIds.has(id) && ((_a = this.observedIds.get(id)) === null || _a === void 0 ? void 0 : _a.has(subId)))
                listener(id, subId, event);
        });
    }
    addAnySubIdListener(id, listener) {
        return this.map.addAnySubIdListener(id, (subId, event) => {
            if (this.observedIds.has(id))
                listener(subId, event);
        });
    }
    addSubIdListener(id, subId, listener) {
        return this.map.addSubIdListener(id, subId, (event) => {
            if (this.observedIds.has(id))
                listener(event);
        });
    }
    getSubValues(id) {
        const res = new ObservedMapImpl_1.ObservedMapImpl();
        if (!this.observedIds.has(id))
            return res;
        for (const key of this.observedIds.get(id)) {
            const content = this.map.getSub(id, key);
            if (content !== undefined)
                res.set(key, content);
        }
        return res;
    }
    hasSub(id, subId) {
        var _a;
        return this.observedIds.has(id) && !!((_a = this.observedIds.get(id)) === null || _a === void 0 ? void 0 : _a.has(subId)) && this.map.hasSub(id, subId);
    }
    getMap(id) {
        return this.getSubValues(id);
    }
    getSub(id, subId) {
        var _a;
        if (!this.observedIds.has(id) || !((_a = this.observedIds.get(id)) === null || _a === void 0 ? void 0 : _a.has(subId)))
            return undefined;
        return this.map.getSub(id, subId);
    }
    forEachSub(id, callback) {
        const values = this.getSubValues(id);
        values.forEach(callback);
    }
    awaitForEachSub(id, callback) {
        const values = this.getSubValues(id);
        values.awaitForEach(callback);
    }
    keysSub(id) {
        const values = this.getSubValues(id);
        return values.keys();
    }
    valuesSub(id) {
        const values = this.getSubValues(id);
        return values.values();
    }
    sizeSub(id) {
        const values = this.getSubValues(id);
        return values.size;
    }
    setSub(id, subId, data) {
        this.map.setSub(id, subId, data);
        this.addObservedId(id, subId);
    }
    deleteSub(id, subId) {
        if (!this.observedIds.has(id))
            return;
        this.map.deleteSub(id, subId);
        this.deleteObservedId(id, subId);
    }
    modifySub(id, subId, data) {
        if (!this.observedIds.has(id))
            return;
        this.map.modifySub(id, subId, data);
    }
    clearSub(id) {
        var _a;
        if (!this.observedIds.has(id))
            return;
        this.map.clearSub(id);
        (_a = this.observedIds.get(id)) === null || _a === void 0 ? void 0 : _a.clear();
    }
    addAnyIdListener(listener) {
        return this.map.addAnyIdListener((id, event) => {
            if (this.observedIds.has(id))
                listener(id, event);
        });
    }
    addIdListener(id, listener) {
        return this.map.addIdListener(id, (event) => {
            if (this.observedIds.has(id))
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
        this.addObservedId(id);
        return this;
    }
    has(id) {
        return this.observedIds.has(id) && this.map.has(id);
    }
    delete(id) {
        if (!this.observedIds.has(id))
            return false;
        const res = this.map.delete(id);
        this.observedIds.delete(id);
        return res;
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
        return this.observedIds.keys();
    }
    values() {
        const res = [];
        for (const key of this.observedIds.keys()) {
            const v = this.map.get(key);
            if (v !== undefined)
                res.push(v);
        }
        return res.values();
    }
    forEach(callback) {
        Array.from(this.observedIds.keys()).forEach(id => {
            const v = this.map.get(id);
            if (v === undefined)
                return;
            callback(v, id, new Map());
        });
    }
    awaitForEach(callback) {
        Promise.all(Array.from(this.observedIds.keys()).map((id) => __awaiter(this, void 0, void 0, function* () {
            const v = this.map.get(id);
            if (v === undefined)
                return;
            callback(v, id);
        })));
    }
    addObservedId(id, subId) {
        var _a;
        if (!this.observedIds.has(id))
            this.observedIds.set(id, new Set());
        if (subId)
            (_a = this.observedIds.get(id)) === null || _a === void 0 ? void 0 : _a.add(subId);
    }
    deleteObservedId(id, subId) {
        var _a;
        if (!this.observedIds.has(id))
            return;
        if (!subId)
            this.observedIds.delete(id);
        else
            (_a = this.observedIds.get(id)) === null || _a === void 0 ? void 0 : _a.delete(subId);
    }
}
exports.ObservedMapMapMirrorImpl = ObservedMapMapMirrorImpl;
//# sourceMappingURL=ObservedMapMapMirrorImpl.js.map