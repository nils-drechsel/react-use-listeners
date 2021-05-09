import { expect } from "chai";
import "mocha";
import { ObservedMapMapImpl } from "./ObservedMapMapImpl";

describe("ObservedMapMap", () => {
    it("sub id listeners", () => {
        const map: ObservedMapMapImpl<string> = new ObservedMapMapImpl();
        let test = 0;
        const unsubscribe = map.addSubIdListener("test0", "testSub1", () => {
            test = test + 1;
        });

        map.setSub("test0", "testSub0", "something0");
        map.setSub("test0", "testSub1", "something1");
        expect(test).to.equal(1);

        map.deleteSub("test0", "testSub0");
        map.deleteSub("test0", "testSub1");
        expect(test).to.equal(2);

        expect(map.map.has("test0")).to.be.false;

        unsubscribe();
        map.setSub("test1", "testSub2", "something2");
        expect(test).to.equal(2);

        map.addSubIdListener("test1", "testSub2", () => {
            test = test + 1;
        });
        expect(test).to.equal(3);
    });

    it("any sub id listeners", () => {
        const map: ObservedMapMapImpl<string> = new ObservedMapMapImpl();
        let test = 0;
        const unsubscribe = map.addAnySubIdListener("test1", () => {
            test = test + 1;
        });

        map.setSub("test0", "testSub0", "something0");
        map.setSub("test1", "testSub1", "something1");
        expect(test).to.equal(1);

        map.deleteSub("test0", "testSub0");
        map.deleteSub("test1", "testSub1");
        expect(test).to.equal(2);

        expect(map.hasSub("test0", "testSub0")).to.be.false;
        expect(map.hasSub("test1", "testSub1")).to.be.false;

        unsubscribe();
        map.setSub("test1", "testSub2", "something2");
        expect(test).to.equal(2);

        map.addAnySubIdListener("test1", () => {
            test = test + 1;
        });
        expect(test).to.equal(3);
    });

    it("any id listeners", () => {
        const map: ObservedMapMapImpl<string> = new ObservedMapMapImpl();
        let test = 0;
        const unsubscribe = map.addAnyListener(() => {
            test = test + 1;
        });

        map.setSub("test0", "testSub0", "something0");
        map.setSub("test1", "testSub1", "something1");
        expect(test).to.equal(2);

        map.deleteSub("test0", "testSub0");
        map.deleteSub("test1", "testSub1");
        expect(test).to.equal(4);

        expect(map.map.has("test0")).to.be.false;
        expect(map.map.has("test1")).to.be.false;

        unsubscribe();
        map.setSub("test1", "testSub2", "something2");
        expect(test).to.equal(4);

        map.addAnyListener(() => {
            test = test + 1;
        });
        expect(test).to.equal(5);
    });

    it("basic functionality", () => {
        const map: ObservedMapMapImpl<string> = new ObservedMapMapImpl();

        map.setSub("test0", "sub0", "text0");
        expect(map.has("test0")).to.be.true;
        expect(map.hasSub("test0", "sub0")).to.be.true;

        map.setSub("test0", "sub1", "text1");
        expect(map.has("test0")).to.be.true;
        expect(map.hasSub("test0", "sub1")).to.be.true;

        map.deleteSub("test0", "sub0");
        expect(map.has("test0")).to.be.true;
        expect(map.hasSub("test0", "sub0")).to.be.false;

        map.deleteSub("test0", "sub1");
        expect(map.has("test0")).to.be.false;
        expect(map.hasSub("test0", "sub0")).to.be.false;

        map.setSub("test0", "sub0", "text0");
        map.setSub("test0", "sub1", "text1");
        map.delete("test0");
        expect(map.has("test0")).to.be.false;
        expect(map.hasSub("test0", "sub0")).to.be.false;
        expect(map.hasSub("test0", "sub1")).to.be.false;
    });
});
