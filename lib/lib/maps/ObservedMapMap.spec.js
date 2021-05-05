"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const ObservedMapMapImpl_1 = require("./ObservedMapMapImpl");
describe("ObservedMapMap", () => {
    it("sub id listeners", () => {
        const map = new ObservedMapMapImpl_1.ObservedMapMapImpl();
        let test = 0;
        const unsubscribe = map.addSubIdListener("test0", "testSub1", () => {
            test = test + 1;
        });
        map.setSub("test0", "testSub0", "something0");
        map.setSub("test0", "testSub1", "something1");
        chai_1.expect(test).to.equal(1);
        map.deleteSub("test0", "testSub0");
        map.deleteSub("test0", "testSub1");
        chai_1.expect(test).to.equal(2);
        chai_1.expect(map.map.has("test0")).to.be.false;
        unsubscribe();
        map.setSub("test1", "testSub2", "something2");
        chai_1.expect(test).to.equal(2);
        map.addSubIdListener("test1", "testSub2", () => {
            test = test + 1;
        });
        chai_1.expect(test).to.equal(3);
    });
    it("any sub id listeners", () => {
        const map = new ObservedMapMapImpl_1.ObservedMapMapImpl();
        let test = 0;
        const unsubscribe = map.addAnySubIdListener("test1", () => {
            test = test + 1;
        });
        map.setSub("test0", "testSub0", "something0");
        map.setSub("test1", "testSub1", "something1");
        chai_1.expect(test).to.equal(1);
        map.deleteSub("test0", "testSub0");
        map.deleteSub("test1", "testSub1");
        chai_1.expect(test).to.equal(2);
        chai_1.expect(map.hasSub("test0", "testSub0")).to.be.false;
        chai_1.expect(map.hasSub("test1", "testSub1")).to.be.false;
        unsubscribe();
        map.setSub("test1", "testSub2", "something2");
        chai_1.expect(test).to.equal(2);
        map.addAnySubIdListener("test1", () => {
            test = test + 1;
        });
        chai_1.expect(test).to.equal(3);
    });
    it("any id listeners", () => {
        const map = new ObservedMapMapImpl_1.ObservedMapMapImpl();
        let test = 0;
        const unsubscribe = map.addAnyListener(() => {
            test = test + 1;
        });
        map.setSub("test0", "testSub0", "something0");
        map.setSub("test1", "testSub1", "something1");
        chai_1.expect(test).to.equal(2);
        map.deleteSub("test0", "testSub0");
        map.deleteSub("test1", "testSub1");
        chai_1.expect(test).to.equal(4);
        chai_1.expect(map.map.has("test0")).to.be.false;
        chai_1.expect(map.map.has("test1")).to.be.false;
        unsubscribe();
        map.setSub("test1", "testSub2", "something2");
        chai_1.expect(test).to.equal(4);
        map.addAnyListener(() => {
            test = test + 1;
        });
        chai_1.expect(test).to.equal(5);
    });
});
//# sourceMappingURL=ObservedMapMap.spec.js.map