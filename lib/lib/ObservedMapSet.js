"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservedMapSet = void 0;
const ObservedPlainMapMap_1 = require("./ObservedPlainMapMap");
class ObservedMapSet extends ObservedPlainMapMap_1.ObservedPlainMapMap {
    initSub(id, subId) {
        super.setSub(id, subId, {});
    }
}
exports.ObservedMapSet = ObservedMapSet;
//# sourceMappingURL=ObservedMapSet.js.map