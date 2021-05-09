"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const ObservedMapImpl_1 = require("./ObservedMapImpl");
describe("ObservedMap", () => {
    it("id listeners", () => {
        const map = new ObservedMapImpl_1.ObservedMapImpl();
        let test = 0;
        const unsubscribe = map.addIdListener("testId", () => {
            test = test + 1;
        });
        map.set("testId", "something");
        chai_1.expect(test).to.equal(1);
        unsubscribe();
        map.set("testId", "something else");
        chai_1.expect(test).to.equal(1);
        const unsubscribe2 = map.addIdListener("testId", () => {
            test = test + 1;
        });
        chai_1.expect(test).to.equal(2);
        unsubscribe2();
    });
    it("any id listeners", () => {
        const map = new ObservedMapImpl_1.ObservedMapImpl();
        let test = new Map();
        const unsubscribe = map.addAnyIdListener((id, _event) => {
            test.set(id, test.get(id) ? test.get(id) + 1 : 1);
        });
        map.set("test0", "something0");
        chai_1.expect(test.get("test0")).to.equal(1);
        map.set("test0", "something1");
        chai_1.expect(test.get("test0")).to.equal(2);
        map.modify("test0", "something2");
        chai_1.expect(test.get("test0")).to.equal(3);
        map.delete("test0");
        chai_1.expect(test.get("test0")).to.equal(4);
        map.set("test1", "something3");
        chai_1.expect(test.get("test1")).to.equal(1);
        unsubscribe();
        map.delete("test1");
        chai_1.expect(test.get("test1")).to.equal(1);
    });
    it("basic functionality", () => {
        const map = new ObservedMapImpl_1.ObservedMapImpl();
        map.set("test0", "text0");
        chai_1.expect(map.has("test0")).to.be.true;
        map.delete("test0");
        chai_1.expect(map.has("test0")).to.be.false;
    });
});
//# sourceMappingURL=ObservedMap.spec.js.map