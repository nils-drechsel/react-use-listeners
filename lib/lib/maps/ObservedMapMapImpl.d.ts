import { ObservedMapMap } from "../interfaces/ObservedMapMap";
import { AnyIdListenerCallback, AnySubIdListenerCallback, IdListenerCallback, IdListeners, UnsubscribeCallback } from "../Listeners";
interface MapMapContent<CONTENT, SUB_CONTENT> {
    content: CONTENT;
    map: Map<string, SUB_CONTENT>;
}
export declare class ObservedMapMapImpl<CONTENT, SUB_CONTENT> implements ObservedMapMap<CONTENT, SUB_CONTENT> {
    rootMap: Map<string, MapMapContent<CONTENT, SUB_CONTENT>>;
    idListeners: IdListeners;
    throwErrors: boolean;
    size: number;
    constructor(throwErrors?: boolean);
    [Symbol.iterator](): IterableIterator<[string, CONTENT]>;
    entries(): IterableIterator<[string, CONTENT]>;
    [Symbol.toStringTag]: string;
    addAnyListener(listener: AnySubIdListenerCallback): UnsubscribeCallback;
    addAnyIdListener(listener: AnyIdListenerCallback): UnsubscribeCallback;
    addIdListener(id: string, listener: IdListenerCallback): UnsubscribeCallback;
    addAnySubIdListener(id: string, listener: AnyIdListenerCallback): UnsubscribeCallback;
    addSubIdListener(id: string, subId: string, listener: IdListenerCallback): UnsubscribeCallback;
    has(id: string): boolean;
    hasSub(id: string, subId: string): boolean;
    get(id: string): CONTENT | undefined;
    getMap(id: string): Map<string, SUB_CONTENT> | undefined;
    getSub(id: string, subId: string): SUB_CONTENT | undefined;
    forEach(callback: (value: CONTENT, key: string, map: Map<string, CONTENT>) => void): void;
    awaitForEach(callback: (value: CONTENT, key: string) => Promise<void>): void;
    forEachSub(id: string, callback: (value: SUB_CONTENT, key: string) => void): void;
    awaitForEachSub(id: string, callback: (value: SUB_CONTENT, key: string) => Promise<void>): void;
    keys(): IterableIterator<string>;
    keysSub(id: string): IterableIterator<string>;
    values(): IterableIterator<CONTENT>;
    valuesSub(id: string): IterableIterator<SUB_CONTENT>;
    sizeSub(id: string): number;
    private updateSize;
    set(id: string, data: CONTENT): this;
    setSub(id: string, subId: string, data: SUB_CONTENT): this | undefined;
    delete(id: string): boolean;
    deleteSub(id: string, subId: string): boolean;
    modify(id: string, data?: Object): void;
    modifySub(id: string, subId: string, data?: Object): void;
    clear(): void;
    clearSub(id: string): void;
}
export {};
