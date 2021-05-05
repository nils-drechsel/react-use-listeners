import { ObservedMapMap } from "./ObservedMapMap";
export interface ObservedMapMapMirror<CONTENT> extends ObservedMapMap<CONTENT> {
    addObservedId(id: string, subId: string): void;
    deleteObservedId(id: string, subId: string): void;
    getObservedIds(): Array<string>;
    getObservedSubIds(id: string): Array<string>;
}
