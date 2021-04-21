import { ObservedMapMap } from "./ObservedMapMap";
export interface ObservedMapMapMirror<CONTENT, SUB_CONTENT> extends ObservedMapMap<CONTENT, SUB_CONTENT> {
    addObservedId(id: string, subId: string): void;
    deleteObservedId(id: string, subId: string): void;
}
