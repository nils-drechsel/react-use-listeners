"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservedPlainMapMapMirrorImpl = void 0;
const ObservedMapMapMirrorImpl_1 = require("./ObservedMapMapMirrorImpl");
class ObservedPlainMapMapMirrorImpl extends ObservedMapMapMirrorImpl_1.ObservedMapMapMirrorImpl {
    init(id) {
        if (this.has(id))
            return;
        this.set(id, {});
    }
}
exports.ObservedPlainMapMapMirrorImpl = ObservedPlainMapMapMirrorImpl;
//# sourceMappingURL=ObservedPlainMapMapMirrorImpl.js.map