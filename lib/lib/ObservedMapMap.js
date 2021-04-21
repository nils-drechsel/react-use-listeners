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
exports.ObservedMapMap = void 0;
const Listeners_1 = require("./Listeners");
class ObservedMapMap {
    constructor(throwErrors = false) {
        this.rootMap = new Map();
        this.idListeners = new Listeners_1.IdListeners();
        this.throwErrors = throwErrors;
    }
    addAnyIdListener(listener) {
        return this.idListeners.addListener(listener);
    }
    addIdListener(id, listener) {
        return this.idListeners.addIdListener(id, listener);
    }
    addAnySubIdListener(id, listener) {
        return this.idListeners.addListener(listener, id);
    }
    addSubIdListener(id, subId, listener) {
        return this.idListeners.addIdListener(subId, listener, id);
    }
    has(id) {
        return this.rootMap.has(id);
    }
    hasSub(id, subId) {
        if (!this.rootMap.has(id))
            return false;
        return this.rootMap.get(id).map.has(subId);
    }
    get(id) {
        if (!this.has(id))
            return undefined;
        return this.rootMap.get(id).content;
    }
    getMap(id) {
        if (!this.has(id))
            return undefined;
        return this.rootMap.get(id).map;
    }
    getSub(id, subId) {
        if (!this.has(id))
            return undefined;
        return this.rootMap.get(id).map.get(subId);
    }
    forEach(callback) {
        this.rootMap.forEach((value, key) => callback(value.content, key));
    }
    awaitForEach(callback) {
        Promise.all(Array.from(this.rootMap).map(([key, value]) => __awaiter(this, void 0, void 0, function* () {
            yield callback(value.content, key);
        })));
    }
    forEachSub(id, callback) {
        if (!this.has(id))
            return;
        this.rootMap.get(id).map.forEach((value, key) => callback(value, key));
    }
    awaitForEachSub(id, callback) {
        if (!this.has(id))
            return;
        Promise.all(Array.from(this.getMap(id)).map(([key, value]) => __awaiter(this, void 0, void 0, function* () {
            yield callback(value, key);
        })));
    }
    keys() {
        return this.rootMap.keys();
    }
    keysSub(id) {
        if (!this.has(id)) {
            if (this.throwErrors) {
                throw new Error("ObservedMapMap has no id: " + id + " while performing keySub");
            }
            else {
                return [];
            }
        }
        return this.rootMap.get(id).map.keys();
    }
    values() {
        return Array.from(this.rootMap.values()).map(value => value.content);
    }
    valuesSub(id) {
        if (!this.has(id)) {
            if (this.throwErrors) {
                throw new Error("ObservedMapMap has no id: " + id + " while performing valuesSub");
            }
            else {
                return [];
            }
        }
        return this.rootMap.get(id).map.values();
    }
    size() {
        return this.rootMap.size;
    }
    sizeSub(id) {
        if (!this.has(id))
            return 0;
        return this.rootMap.get(id).map.size;
    }
    set(id, data) {
        const idExisted = this.has(id);
        if (idExisted) {
            const obj = this.rootMap.get(id);
            obj.map.forEach((_value, subId) => this.idListeners.removeId(subId, id));
        }
        this.rootMap.set(id, { content: data, map: new Map() });
        if (idExisted) {
            this.idListeners.modifyId(id);
        }
        else {
            this.idListeners.addId(id);
        }
        return this;
    }
    setSub(id, subId, data) {
        if (!this.has(id)) {
            if (this.throwErrors) {
                throw new Error("ObservedMapMap has no id: " + id + " while subsetting: " + subId);
            }
            else {
                return;
            }
        }
        const map = this.rootMap.get(id).map;
        const idExisted = map.has(subId);
        map.set(subId, data);
        if (idExisted) {
            this.idListeners.modifyId(subId, id);
        }
        else {
            this.idListeners.addId(subId, id);
        }
        return this;
    }
    delete(id) {
        if (!this.has(id))
            return false;
        this.rootMap.delete(id);
        this.idListeners.removeId(id);
        return true;
    }
    deleteSub(id, subId) {
        if (!this.has(id))
            return false;
        const map = this.rootMap.get(id).map;
        if (!map.has(subId))
            return false;
        map.delete(id);
        this.idListeners.removeId(subId, id);
        return true;
    }
    modify(id, data) {
        if (!this.has(id)) {
            if (this.throwErrors) {
                throw new Error("ObservedMapMap has no id: " + id + " while modifying");
            }
            else {
                return;
            }
        }
        if (data) {
            this.rootMap.get(id).content = Object.assign({}, this.get(id), data);
        }
        this.idListeners.modifyId(id);
    }
    modifySub(id, subId, data) {
        if (!this.has(id)) {
            if (this.throwErrors) {
                throw new Error("ObservedMapMap has no id: " + id + " while modifying");
            }
            else {
                return;
            }
        }
        const map = this.rootMap.get(id).map;
        if (!map.has(subId)) {
            if (this.throwErrors) {
                throw new Error("ObservedMapMap has no id: " + id + " while modifying: " + subId);
            }
            else {
                return;
            }
        }
        if (data) {
            map.set(subId, Object.assign({}, map.get(id), data));
        }
        this.idListeners.modifyId(subId, id);
    }
    clear() {
        const keys = Array.from(this.rootMap.keys());
        keys.forEach(id => {
            this.clearSub(id);
            this.idListeners.removeId(id);
        });
        this.rootMap.clear();
    }
    clearSub(id) {
        if (!this.has(id))
            return;
        const map = this.rootMap.get(id).map;
        const keys = Array.from(map.keys());
        map.clear();
        keys.forEach(subId => this.idListeners.removeId(subId, id));
    }
}
exports.ObservedMapMap = ObservedMapMap;
//# sourceMappingURL=ObservedMapMap.js.map