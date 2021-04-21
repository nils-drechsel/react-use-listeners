"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservedPlainMapMap = void 0;
const ObservedMapMap_1 = require("./ObservedMapMap");
class ObservedPlainMapMap extends ObservedMapMap_1.ObservedMapMap {
    init(id) {
        if (this.has(id))
            return;
        super.set(id, {});
    }
}
exports.ObservedPlainMapMap = ObservedPlainMapMap;
//# sourceMappingURL=ObservedPlainMapMap.js.map