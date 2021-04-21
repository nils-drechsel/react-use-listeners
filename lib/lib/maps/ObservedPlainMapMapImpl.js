"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservedPlainMapMapImpl = void 0;
const ObservedMapMapImpl_1 = require("./ObservedMapMapImpl");
class ObservedPlainMapMapImpl extends ObservedMapMapImpl_1.ObservedMapMapImpl {
    init(id) {
        if (this.has(id))
            return;
        super.set(id, {});
    }
}
exports.ObservedPlainMapMapImpl = ObservedPlainMapMapImpl;
//# sourceMappingURL=ObservedPlainMapMapImpl.js.map