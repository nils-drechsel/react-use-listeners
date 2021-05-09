import { expect } from "chai";
import "mocha";
import { ObservedMap } from "../interfaces/ObservedMap";
import { ObservedMapImpl } from "./ObservedMapImpl";

describe("ObservedMap", () => {
    it("id listeners", () => {
        const map: ObservedMap<string> = new ObservedMapImpl();
        let test = 0;
        const unsubscribe = map.addIdListener("testId", () => {
            test = test + 1;
        });
        map.set("testId", "something");
        expect(test).to.equal(1);

        unsubscribe();
        map.set("testId", "something else");
        expect(test).to.equal(1);

        const unsubscribe2 = map.addIdListener("testId", () => {
            test = test + 1;
        });
        expect(test).to.equal(2);
        unsubscribe2();
    });

    it("any id listeners", () => {
        const map: ObservedMap<string> = new ObservedMapImpl();
        let test = new Map();
        const unsubscribe = map.addAnyIdListener((id, _event) => {
            test.set(id, test.get(id) ? test.get(id) + 1 : 1);
        });

        map.set("test0", "something0");
        expect(test.get("test0")).to.equal(1);

        map.set("test0", "something1");
        expect(test.get("test0")).to.equal(2);

        map.modify("test0", "something2");
        expect(test.get("test0")).to.equal(3);

        map.delete("test0");
        expect(test.get("test0")).to.equal(4);

        map.set("test1", "something3");
        expect(test.get("test1")).to.equal(1);

        unsubscribe();

        map.delete("test1");
        expect(test.get("test1")).to.equal(1);
    });

    it("basic functionality", () => {
        const map: ObservedMap<string> = new ObservedMapImpl();

        map.set("test0", "text0");
        expect(map.has("test0")).to.be.true;

        map.delete("test0");
        expect(map.has("test0")).to.be.false;
    });
});
