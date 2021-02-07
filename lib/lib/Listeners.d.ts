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
export interface IdListenerCallback {
    (event: ListenerEvent): void;
}
export declare class IdListeners {
    root: Map<string, IdContainer>;
    constructor();
    getOrCreateRoot(rootId: string): IdContainer;
    getOrCreateIdListeners(container: IdContainer, id: string): Listeners<(event: ListenerEvent) => void>;
    makePath(...rootIds: string[]): string;
    addListener(listener: AnyIdListenerCallback, ...rootIds: string[]): () => void;
    addIdListener(id: string, listener: IdListenerCallback, ...rootIds: string[]): () => void;
    removeRootIfPossible(container: IdContainer): void;
    addId(id: string, ...rootIds: string[]): void;
    removeId(id: string, ...rootIds: string[]): void;
    modifyId(id: string, ...rootIds: string[]): void;
}
export declare class ObservedMap<T> extends Map<string, T> {
    arrayListeners: DataListeners<Array<T>>;
    idListeners: IdListeners;
    addArrayListener(listener: DataListenerCallback<Array<T>>): UnsubscribeCallback;
    addAnyIdListener(listener: AnyIdListenerCallback): () => void;
    addIdListener(id: string, listener: IdListenerCallback): () => void;
    private notifyArrayListeners;
    private getArray;
    set(id: string, data: T): this;
    delete(id: string): boolean;
    modify(id: string, data?: Object): void;
    clear(): void;
}
export declare class ObservedObject<T> {
    listeners: DataListeners<T | undefined>;
    obj: T | null;
    constructor();
    get(): Promise<T>;
    set(obj: T): void;
    fail(): void;
}
export {};
