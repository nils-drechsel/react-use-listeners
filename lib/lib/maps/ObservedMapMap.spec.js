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
    it("basic functionality", () => {
        const map = new ObservedMapMapImpl_1.ObservedMapMapImpl();
        map.setSub("test0", "sub0", "text0");
        chai_1.expect(map.has("test0")).to.be.true;
        chai_1.expect(map.hasSub("test0", "sub0")).to.be.true;
        map.setSub("test0", "sub1", "text1");
        chai_1.expect(map.has("test0")).to.be.true;
        chai_1.expect(map.hasSub("test0", "sub1")).to.be.true;
        map.deleteSub("test0", "sub0");
        chai_1.expect(map.has("test0")).to.be.true;
        chai_1.expect(map.hasSub("test0", "sub0")).to.be.false;
        map.deleteSub("test0", "sub1");
        chai_1.expect(map.has("test0")).to.be.false;
        chai_1.expect(map.hasSub("test0", "sub0")).to.be.false;
        map.setSub("test0", "sub0", "text0");
        map.setSub("test0", "sub1", "text1");
        map.delete("test0");
        chai_1.expect(map.has("test0")).to.be.false;
        chai_1.expect(map.hasSub("test0", "sub0")).to.be.false;
        chai_1.expect(map.hasSub("test0", "sub1")).to.be.false;
    });
});
//# sourceMappingURL=ObservedMapMap.spec.js.map