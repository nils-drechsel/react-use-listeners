import { ObservedMap } from "../interfaces/ObservedMap";
import { IdListenerCallback, UnsubscribeCallback } from "../Listeners";
export declare class ObservedMapMirrorImpl<T> implements ObservedMap<T> {
    private map;
    observedIds: Set<string>;
    constructor(map: ObservedMap<T>);
    size(): number;
    addAnyIdListener(listener: IdListenerCallback): UnsubscribeCallback;
    addIdListener(id: string, listener: IdListenerCallback): UnsubscribeCallback;
    get(id: string): T | undefined;
    set(id: string, data: T): this;
    has(id: string): boolean;
    delete(id: string): void;
    modify(id: string, data?: Object): void;
    clear(): void;
    keys(): IterableIterator<string>;
    values(): IterableIterator<T>;
    forEach(callback: (value: T, key: string, map: Map<string, T>) => void): void;
    awaitForEach(callback: (value: T, key: string) => Promise<void>): void;
    addObservedId(id: string): void;
    deleteObservedId(id: string): void;
    destroy(): void;
}
