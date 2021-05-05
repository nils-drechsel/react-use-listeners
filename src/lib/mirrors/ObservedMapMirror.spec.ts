import { expect } from "chai";
import "mocha";
import { ObservedMap } from "../interfaces/ObservedMap";
import { ObservedMapMirror } from "../interfaces/ObservedMapMirror";
import { ObservedMapImpl } from "../maps/ObservedMapImpl";
import { ObservedMapMirrorImpl } from "./ObservedMapMirrorImpl";

describe("ObservedMapMirror", () => {
    it("id listeners", () => {
        const map: ObservedMap<string> = new ObservedMapImpl();
        const mirror: ObservedMapMirror<string> = new ObservedMapMirrorImpl(map);
        let test = 0;

        const unsubscribe = mirror.addIdListener("test0", () => {
            test = test + 1;
        });

        map.set("test0", "text0");
        expect(test).to.equal(0);

        mirror.addObservedId("test0");
        map.modify("test0");
        expect(test).to.equal(1);

        mirror.delete("test0");
        expect(test).to.equal(2);

        mirror.deleteObservedId("test0");

        mirror.set("test0", "text1");
        expect(test).to.equal(2);

        unsubscribe();

        mirror.delete("test0");
        expect(test).to.equal(2);

        mirror.addObservedId("test0");

        map.set("test0", "text2");
        expect(mirror.has("test0")).to.be.true;

        mirror.deleteObservedId("test0");
        expect(mirror.has("test0")).to.be.false;
    });

    it("any id listeners", () => {
        const map: ObservedMap<string> = new ObservedMapImpl();
        const mirror: ObservedMapMirror<string> = new ObservedMapMirrorImpl(map);
        let test = 0;

        const unsubscribe = mirror.addAnyIdListener(() => {
            test = test + 1;
        });

        map.set("test0", "text0");
        expect(test).to.equal(0);

        mirror.addObservedId("test0");
        map.modify("test0");
        expect(test).to.equal(1);

        mirror.delete("test0");
        expect(test).to.equal(2);

        mirror.deleteObservedId("test0");

        mirror.set("test0", "text1");
        expect(test).to.equal(2);

        unsubscribe();

        mirror.delete("test0");
        expect(test).to.equal(2);

        mirror.addObservedId("test0");

        map.set("test0", "text2");
        expect(mirror.has("test0")).to.be.true;

        mirror.deleteObservedId("test0");
        expect(mirror.has("test0")).to.be.false;
    });
});
