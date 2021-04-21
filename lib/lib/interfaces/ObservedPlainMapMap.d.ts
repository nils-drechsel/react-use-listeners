import { ObservedMapMap } from "./ObservedMapMap";
export interface PlainContent {
}
export interface ObservedPlainMapMap<SUB_CONTENT> extends ObservedMapMap<PlainContent, SUB_CONTENT> {
    init(id: string): void;
}
