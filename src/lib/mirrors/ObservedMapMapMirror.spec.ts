import { expect } from "chai";
import "mocha";
import { ObservedMapMap } from "../interfaces/ObservedMapMap";
import { ObservedMapMapMirror } from "../interfaces/ObservedMapMapMirror";
import { ObservedMapMapImpl } from "../maps/ObservedMapMapImpl";
import { ObservedMapMapMirrorImpl } from "./ObservedMapMapMirrorImpl";

describe("ObservedMapMapMirror", () => {
    it("sub id listeners", () => {
        const map: ObservedMapMap<string> = new ObservedMapMapImpl();
        const mirror: ObservedMapMapMirror<string> = new ObservedMapMapMirrorImpl(map);
        let test = 0;

        const unsubscribe = mirror.addSubIdListener("test0", "sub0", () => {
            test = test + 1;
        });

        map.setSub("test0", "sub0", "text0");
        expect(test).to.equal(0);

        mirror.addObservedId("test0", "sub0");
        map.modifySub("test0", "sub0");
        expect(test).to.equal(1);

        mirror.deleteSub("test0", "sub0");
        expect(test).to.equal(2);

        mirror.deleteObservedId("test0", "sub0");

        mirror.setSub("test0", "sub0", "text1");
        expect(test).to.equal(2);

        unsubscribe();

        mirror.delete("test0");
        expect(test).to.equal(2);

        mirror.addObservedId("test0", "sub1");

        map.setSub("test0", "sub1", "text2");
        expect(mirror.hasSub("test0", "sub1")).to.be.true;

        mirror.deleteObservedId("test0", "sub1");
        expect(mirror.hasSub("test0", "sub1")).to.be.false;
    });

    it("any sub id listeners", () => {
        const map: ObservedMapMap<string> = new ObservedMapMapImpl();
        const mirror: ObservedMapMapMirror<string> = new ObservedMapMapMirrorImpl(map);
        let test = 0;

        const unsubscribe = mirror.addAnySubIdListener("test0", () => {
            test = test + 1;
        });

        map.setSub("test0", "sub0", "text0");
        expect(test).to.equal(0);

        mirror.addObservedId("test0", "sub0");
        map.modifySub("test0", "sub0");
        expect(test).to.equal(1);

        map.setSub("test0", "sub1", "text3");
        expect(test).to.equal(1);

        mirror.deleteSub("test0", "sub0");
        expect(test).to.equal(2);

        mirror.addObservedId("test0", "sub1");
        mirror.deleteSub("test0", "sub1");
        expect(test).to.equal(3);

        mirror.deleteObservedId("test0", "sub0");
        mirror.deleteObservedId("test0", "sub1");

        mirror.setSub("test0", "sub0", "text1");
        expect(test).to.equal(3);

        unsubscribe();

        mirror.delete("test0");
        expect(test).to.equal(3);

        mirror.addObservedId("test0", "sub1");

        map.setSub("test0", "sub1", "text2");
        expect(mirror.hasSub("test0", "sub1")).to.be.true;

        mirror.deleteObservedId("test0", "sub1");
        expect(mirror.hasSub("test0", "sub1")).to.be.false;
    });

    it("any listeners", () => {
        const map: ObservedMapMap<string> = new ObservedMapMapImpl();
        const mirror: ObservedMapMapMirror<string> = new ObservedMapMapMirrorImpl(map);
        let test = 0;

        const unsubscribe = mirror.addAnyListener(() => {
            test = test + 1;
        });

        map.setSub("test0", "sub0", "text0");
        expect(test).to.equal(0);

        mirror.addObservedId("test0", "sub0");
        map.modifySub("test0", "sub0");
        expect(test).to.equal(1);

        map.setSub("test0", "sub1", "text3");
        expect(test).to.equal(1);

        mirror.deleteSub("test0", "sub0");
        expect(test).to.equal(2);

        mirror.addObservedId("test0", "sub1");
        mirror.deleteSub("test0", "sub1");
        expect(test).to.equal(3);

        mirror.deleteObservedId("test0", "sub0");
        mirror.deleteObservedId("test0", "sub1");

        mirror.setSub("test0", "sub0", "text1");
        expect(test).to.equal(3);

        unsubscribe();

        mirror.delete("test0");
        expect(test).to.equal(3);

        mirror.addObservedId("test0", "sub1");

        map.setSub("test0", "sub1", "text2");
        expect(mirror.hasSub("test0", "sub1")).to.be.true;

        mirror.deleteObservedId("test0", "sub1");
        expect(mirror.hasSub("test0", "sub1")).to.be.false;
    });
});
