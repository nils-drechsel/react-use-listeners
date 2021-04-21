import { ObservedMap } from "./ObservedMap";
export interface ObservedMapMirror<T> extends ObservedMap<T> {
    addObservedId(id: string): void;
    deleteObservedId(id: string): void;
    destroy(): void;
}
