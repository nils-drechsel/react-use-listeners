import { ObservedMapMap } from "./ObservedMapMap";
export interface PlainContent {
}
export declare class ObservedPlainMapMap<CONTENT> extends ObservedMapMap<PlainContent, CONTENT> {
    init(id: string): void;
}
