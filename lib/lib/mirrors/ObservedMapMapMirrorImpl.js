"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservedMapMapMirrorImpl = void 0;
const ObservedMapImpl_1 = require("../maps/ObservedMapImpl");
class ObservedMapMapMirrorImpl {
    constructor(map) {
        this.observedIds = new Map();
        this.map = map;
    }
    [Symbol.iterator]() {
        throw new Error("Method not implemented.");
    }
    entries() {
        throw new Error("Method not implemented.");
    }
    addSubIdListener(id, subId, listener) {
        return this.map.addSubIdListener(id, subId, (id, subId, event) => {
            if (this.observedIds.has(id))
                listener(id, subId, event);
        });
    }
    addAnySubIdListener(id, listener) {
        return this.map.addAnySubIdListener(id, (id, subId, event) => {
            if (this.observedIds.has(id) && this.observedIds.get(id).has(subId))
                listener(id, subId, event);
        });
    }
    addAnyListener(listener) {
        return this.map.addAnyListener((id, subId, event) => {
            if (this.observedIds.has(id) && this.observedIds.get(id).has(subId))
                listener(id, subId, event);
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
    getSub(id, subId) {
        var _a;
        if (!this.observedIds.has(id) || !((_a = this.observedIds.get(id)) === null || _a === void 0 ? void 0 : _a.has(subId)))
            return undefined;
        return this.map.getSub(id, subId);
    }
    forEach(callback) {
        this.map.forEach((value, id, subId) => {
            if (this.observedIds.has(id) && this.observedIds.get(id).has(subId))
                callback(value, id, subId);
        });
    }
    forEachSub(id, callback) {
        const values = this.getSubValues(id);
        values.forEach(callback);
    }
    awaitForEachSub(id, callback) {
        const values = this.getSubValues(id);
        values.awaitForEach(callback);
    }
    keys() {
        const keys = [];
        this.observedIds.forEach((_value, key) => {
            if (this.map.has(key))
                keys.push(key);
        });
        return keys.values();
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
        return values.size();
    }
    setSub(id, subId, data) {
        this.map.setSub(id, subId, data);
    }
    deleteSub(id, subId) {
        if (!this.observedIds.has(id))
            return;
        this.map.deleteSub(id, subId);
    }
    modifySub(id, subId, data) {
        if (!this.observedIds.has(id))
            return;
        this.map.modifySub(id, subId, data);
    }
    has(id) {
        if (!this.observedIds.has(id) || !this.map.has(id))
            return false;
        const subIds = this.map.getSubIds(id);
        const obsIds = this.observedIds.get(id);
        return Array.from(obsIds).some((observedId) => subIds.has(observedId));
    }
    getSubIds(id) {
        if (!this.map.has(id) || !this.observedIds.has(id))
            return new Set();
        const subIds = this.map.getSubIds(id);
        const obsIds = this.observedIds.get(id);
        return new Set([...subIds].filter((x) => obsIds.has(x)));
    }
    delete(id) {
        if (!this.observedIds.has(id))
            return;
        this.map.delete(id);
    }
    addObservedId(id, subId) {
        var _a;
        if (!this.observedIds.has(id))
            this.observedIds.set(id, new Set());
        if (subId)
            (_a = this.observedIds.get(id)) === null || _a === void 0 ? void 0 : _a.add(subId);
    }
    deleteObservedId(id, subId) {
        if (!this.observedIds.has(id))
            return;
        if (!subId)
            this.observedIds.delete(id);
        else {
            const sub = this.observedIds.get(id);
            sub.delete(subId);
            if (sub.size === 0)
                this.deleteObservedId(id);
        }
    }
    getObservedIds() {
        return Array.from(this.observedIds.keys());
    }
    getObservedSubIds(id) {
        if (!this.observedIds.has(id))
            return [];
        return Array.from(this.observedIds.get(id).values());
    }
}
exports.ObservedMapMapMirrorImpl = ObservedMapMapMirrorImpl;
//# sourceMappingURL=ObservedMapMapMirrorImpl.js.map