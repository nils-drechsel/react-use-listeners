import { ObservedMap } from "../interfaces/ObservedMap";
import { AnyIdListenerCallback, IdListenerCallback } from "../Listeners";
export declare class ObservedMapMirror<CONTENT> implements ObservedMap<CONTENT> {
    private map;
    private observedKeys;
    size: number;
    constructor(map: ObservedMap<CONTENT>);
    [Symbol.iterator](): IterableIterator<[string, CONTENT]>;
    entries(): IterableIterator<[string, CONTENT]>;
    [Symbol.toStringTag]: string;
    addAnyIdListener(listener: AnyIdListenerCallback): void;
    addIdListener(id: string, listener: IdListenerCallback): void;
    get(id: string): CONTENT | undefined;
    set(id: string, data: CONTENT): this;
    has(id: string): boolean;
    delete(id: string): boolean;
    modify(id: string, data?: Object): void;
    clear(): void;
    keys(): IterableIterator<string>;
    values(): IterableIterator<CONTENT>;
    forEach(callback: (value: CONTENT, key: string, map: Map<string, CONTENT>) => void): void;
    awaitForEach(callback: (value: CONTENT, key: string) => Promise<void>): void;
    addObservedKey(key: string): void;
    deleteObservedKey(key: string): void;
}
