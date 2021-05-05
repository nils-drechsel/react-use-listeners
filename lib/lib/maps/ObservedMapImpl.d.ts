import { ObservedMap } from "../interfaces/ObservedMap";
import { AnyIdListeners, IdListenerCallback, IdListeners } from "../Listeners";
export declare class ObservedMapImpl<T> implements ObservedMap<T> {
    idListeners: IdListeners;
    anyIdListeners: AnyIdListeners;
    private map;
    constructor();
    get(id: string): T | undefined;
    has(id: string): boolean;
    keys(): IterableIterator<string>;
    values(): IterableIterator<T>;
    size(): number;
    forEach(callback: (value: T, key: string) => void): void;
    awaitForEach(callback: (value: T, key: string) => Promise<void>): void;
    addAnyIdListener(listener: IdListenerCallback): import("../Listeners").UnsubscribeCallback;
    addIdListener(id: string, listener: IdListenerCallback): import("../Listeners").UnsubscribeCallback;
    private notify;
    set(id: string, data: T): this;
    delete(id: string): void;
    modify(id: string, data?: Object): void;
}
