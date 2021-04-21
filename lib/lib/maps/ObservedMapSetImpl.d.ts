import { PlainContent } from "../interfaces/ObservedPlainMapMap";
import { ObservedPlainMapMapImpl } from "./ObservedPlainMapMapImpl";
export declare class ObservedMapSetImpl extends ObservedPlainMapMapImpl<PlainContent> {
    initSub(id: string, subId: string): void;
}
