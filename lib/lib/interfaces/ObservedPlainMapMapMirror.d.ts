import { ObservedMapMapMirror } from "./ObservedMapMapMirror";
import { ObservedPlainMapMap, PlainContent } from "./ObservedPlainMapMap";
export interface ObservedPlainMapMapMirror<T> extends ObservedPlainMapMap<T>, ObservedMapMapMirror<PlainContent, T> {
}
