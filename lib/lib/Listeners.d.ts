export interface UnsubscribeCallback {
    (): void;
}
export declare enum ListenerEvent {
    ADDED = 0,
    REMOVED = 1,
    MODIFIED = 2
}
export interface IdListenerCallback {
    (id: string, event: ListenerEvent): void;
}
export interface SubIdListenerCallback {
    (id: string, subId: string, event: ListenerEvent): void;
}
export declare class Unsubscribers<T> {
    items: Map<number, T>;
    cnt: number;
    add(item: T): UnsubscribeCallback;
    forEach(callback: (item: T) => void): void;
    isEmpty(): boolean;
}
export declare class AnyIdListeners {
    listeners: Unsubscribers<IdListenerCallback>;
    cnt: number;
    addListener(listener: IdListenerCallback): UnsubscribeCallback;
    notify(id: string, event: ListenerEvent): void;
    add(id: string): void;
    modify(id: string): void;
    delete(id: string): void;
    isEmpty(): boolean;
}
export declare class IdListeners {
    listeners: Map<string, Unsubscribers<IdListenerCallback>>;
    addListener(id: string, listener: IdListenerCallback): UnsubscribeCallback;
    notify(id: string, event: ListenerEvent): void;
    add(id: string): void;
    modify(id: string): void;
    delete(id: string): void;
    isEmpty(): boolean;
    isEmptyId(id: string): boolean;
}
export declare class SubIdListeners {
    listeners: Map<string, Map<string, Unsubscribers<SubIdListenerCallback>>>;
    addListener(id: string, subId: string, listener: SubIdListenerCallback): UnsubscribeCallback;
    notify(id: string, subId: string, event: ListenerEvent): void;
    add(id: string, subId: string): void;
    modify(id: string, subId: string): void;
    delete(id: string, subId: string): void;
    isEmpty(): boolean;
    isEmptyId(id: string): boolean;
    isEmptySubId(id: string, subId: string): boolean;
}
export declare class AnySubIdListeners {
    listeners: Map<string, Unsubscribers<SubIdListenerCallback>>;
    addListener(id: string, listener: SubIdListenerCallback): UnsubscribeCallback;
    notify(id: string, subId: string, event: ListenerEvent): void;
    add(id: string, subId: string): void;
    modify(id: string, subId: string): void;
    delete(id: string, subId: string): void;
    isEmpty(): boolean;
    isEmptyId(id: string): boolean;
}
export declare class AnyListeners {
    listeners: Unsubscribers<SubIdListenerCallback>;
    addListener(listener: SubIdListenerCallback): UnsubscribeCallback;
    notify(id: string, subId: string, event: ListenerEvent): void;
    add(id: string, subId: string): void;
    modify(id: string, subId: string): void;
    delete(id: string, subId: string): void;
    isEmpty(): boolean;
}
