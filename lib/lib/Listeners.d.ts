export interface UnsubscribeCallback {
    (): void;
}
export declare enum ListenerEvent {
    ADDED = 0,
    REMOVED = 1,
    MODIFIED = 2
}
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
interface IdContainer {
    rootId: string;
    ids: Set<string>;
    listeners: Listeners<(id: string, event: ListenerEvent) => void>;
    idListeners: Map<string, Listeners<(event: ListenerEvent) => void>>;
}
export interface AnyIdListenerCallback {
    (id: string, event: ListenerEvent): void;
}
export interface AnyListenerCallback {
    (event: ListenerEvent, ...ids: string[]): void;
}
export interface AnySubIdListenerCallback {
    (id: string, subId: string, event: ListenerEvent): void;
}
export interface IdListenerCallback {
    (event: ListenerEvent): void;
}
export declare class IdListeners {
    root: Map<string, IdContainer>;
    anyListeners: Listeners<(event: ListenerEvent, ...ids: string[]) => void>;
    constructor();
    getOrCreateRoot(rootId: string): IdContainer;
    getOrCreateIdListeners(container: IdContainer, id: string): Listeners<(event: ListenerEvent) => void>;
    makePath(...rootIds: string[]): string;
    addAnyListener(listener: AnyListenerCallback): UnsubscribeCallback;
    addListener(listener: AnyIdListenerCallback, ...rootIds: string[]): () => void;
    addIdListener(id: string, listener: IdListenerCallback, ...rootIds: string[]): () => void;
    removeRootIfPossible(container: IdContainer): void;
    addId(id: string, ...rootIds: string[]): void;
    removeId(id: string, ...rootIds: string[]): void;
    modifyId(id: string, ...rootIds: string[]): void;
}
export {};
