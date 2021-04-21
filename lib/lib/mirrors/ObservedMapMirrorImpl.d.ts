import { ObservedMap } from "../interfaces/ObservedMap";
import { AnyIdListenerCallback, IdListenerCallback, UnsubscribeCallback } from "../Listeners";
export declare class ObservedMapMirrorImpl<CONTENT> implements ObservedMap<CONTENT> {
    private map;
    private observedIds;
    size: number;
    private unsubscribe;
    constructor(map: ObservedMap<CONTENT>);
    [Symbol.iterator](): IterableIterator<[string, CONTENT]>;
    entries(): IterableIterator<[string, CONTENT]>;
    [Symbol.toStringTag]: string;
    addAnyIdListener(listener: AnyIdListenerCallback): UnsubscribeCallback;
    addIdListener(id: string, listener: IdListenerCallback): UnsubscribeCallback;
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
    addObservedId(id: string): void;
    deleteObservedId(id: string): void;
    destroy(): void;
}
