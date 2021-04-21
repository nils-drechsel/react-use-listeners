"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservedMapSetImpl = void 0;
const ObservedPlainMapMapImpl_1 = require("./ObservedPlainMapMapImpl");
class ObservedMapSetImpl extends ObservedPlainMapMapImpl_1.ObservedPlainMapMapImpl {
    initSub(id, subId) {
        super.setSub(id, subId, {});
    }
}
exports.ObservedMapSetImpl = ObservedMapSetImpl;
//# sourceMappingURL=ObservedMapSetImpl.js.map