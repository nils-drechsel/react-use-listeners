import { PlainContent } from "../interfaces/ObservedPlainMapMap";
import { ObservedPlainMapMapMirror } from "../interfaces/ObservedPlainMapMapMirror";
import { ObservedMapMapMirrorImpl } from "./ObservedMapMapMirrorImpl";

export class ObservedPlainMapMapMirrorImpl<T> extends ObservedMapMapMirrorImpl<PlainContent, T> implements ObservedPlainMapMapMirror<T> {

    init(id: string) {
        if (this.has(id)) return;
        this.set(id, {});
    }

}