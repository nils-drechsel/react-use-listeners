export interface UnsubscribeCallback {
    (): void;
}
export declare class Listeners<T> {
    listenerCount: number;
    callbacks: Map<number, T>;
    createId(): number;
    removeListener(id: number): void;
    addListener(callback: T): UnsubscribeCallback;
    getCallbacks(): Array<T>;
    forEach(callbackfn: (value: T, key: number, map: Map<number, T>) => void): void;
}
export interface ListenerCallback<T> {
    (data: T): void;
}
export declare class DataListeners<T> extends Listeners<ListenerCallback<T>> {
}
