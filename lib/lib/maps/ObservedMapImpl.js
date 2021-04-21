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
class ObservedMapImpl extends Map {
    constructor(throwErrors = false) {
        super();
        this.arrayListeners = new Listeners_1.DataListeners();
        this.idListeners = new Listeners_1.IdListeners();
        this.throwErrors = throwErrors;
    }
    awaitForEach(callback) {
        Promise.all(Array.from(this).map(([key, value]) => __awaiter(this, void 0, void 0, function* () {
            yield callback(value, key);
        })));
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
            return false;
        super.delete(id);
        this.idListeners.removeId(id);
        this.notifyArrayListeners();
        return true;
    }
    modify(id, data) {
        if (!this.has(id)) {
            if (this.throwErrors) {
                throw new Error("ObservedMap has no id: " + id + " while modifying");
            }
            else {
                return;
            }
        }
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
exports.ObservedMapImpl = ObservedMapImpl;
//# sourceMappingURL=ObservedMapImpl.js.map