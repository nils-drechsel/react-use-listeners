"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const ObservedMapImpl_1 = require("../maps/ObservedMapImpl");
const ObservedMapMirrorImpl_1 = require("./ObservedMapMirrorImpl");
describe("ObservedMapMirror", () => {
    it("id listeners", () => {
        const map = new ObservedMapImpl_1.ObservedMapImpl();
        const mirror = new ObservedMapMirrorImpl_1.ObservedMapMirrorImpl(map);
        let test = 0;
        const unsubscribe = mirror.addIdListener("test0", () => {
            test = test + 1;
        });
        map.set("test0", "text0");
        chai_1.expect(test).to.equal(0);
        mirror.addObservedId("test0");
        map.modify("test0");
        chai_1.expect(test).to.equal(1);
        mirror.delete("test0");
        chai_1.expect(test).to.equal(2);
        mirror.deleteObservedId("test0");
        mirror.set("test0", "text1");
        chai_1.expect(test).to.equal(2);
        unsubscribe();
        mirror.delete("test0");
        chai_1.expect(test).to.equal(2);
        mirror.addObservedId("test0");
        map.set("test0", "text2");
        chai_1.expect(mirror.has("test0")).to.be.true;
        mirror.deleteObservedId("test0");
        chai_1.expect(mirror.has("test0")).to.be.false;
    });
    it("any id listeners", () => {
        const map = new ObservedMapImpl_1.ObservedMapImpl();
        const mirror = new ObservedMapMirrorImpl_1.ObservedMapMirrorImpl(map);
        let test = 0;
        const unsubscribe = mirror.addAnyIdListener(() => {
            test = test + 1;
        });
        map.set("test0", "text0");
        chai_1.expect(test).to.equal(0);
        mirror.addObservedId("test0");
        map.modify("test0");
        chai_1.expect(test).to.equal(1);
        mirror.delete("test0");
        chai_1.expect(test).to.equal(2);
        mirror.deleteObservedId("test0");
        mirror.set("test0", "text1");
        chai_1.expect(test).to.equal(2);
        unsubscribe();
        mirror.delete("test0");
        chai_1.expect(test).to.equal(2);
        mirror.addObservedId("test0");
        map.set("test0", "text2");
        chai_1.expect(mirror.has("test0")).to.be.true;
        mirror.deleteObservedId("test0");
        chai_1.expect(mirror.has("test0")).to.be.false;
    });
});
//# sourceMappingURL=ObservedMapMirror.spec.js.map