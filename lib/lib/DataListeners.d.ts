import { UnsubscribeCallback } from "./Listeners";
export declare class Listeners<T> {
    listenerCount: number;
    callbacks: Map<number, T>;
    createId(): number;
    removeListener(id: number): void;
    addListener(callback: T): UnsubscribeCallback;
    getCallbacks(): Array<T>;
    forEach(callbackfn: (value: T, key: number, map: Map<number, T>) => void): void;
    size(): number;
}
export interface DataListenerCallback<T> {
    (data: T): void;
}
export declare class DataListeners<T> extends Listeners<DataListenerCallback<T>> {
}
