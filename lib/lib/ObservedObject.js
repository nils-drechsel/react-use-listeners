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
const Listeners_1 = require("./Listeners");
class ObservedObject {
    constructor() {
        this.listeners = new Listeners_1.DataListeners;
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
//# sourceMappingURL=ObservedObject.js.map