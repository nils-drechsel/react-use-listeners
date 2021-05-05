import { IdListenerCallback, UnsubscribeCallback } from "../Listeners";

export interface ObservedMap<T> {
    addAnyIdListener(listener: IdListenerCallback): UnsubscribeCallback;
    addIdListener(id: string, listener: IdListenerCallback): UnsubscribeCallback;
    get(id: string): T | undefined;
    set(id: string, data: T): this;
    has(id: string): boolean;
    delete(id: string): void;
    modify(id: string, data?: Object): void;
    keys(): IterableIterator<string>;
    values(): IterableIterator<T>;
    size(): number;
    forEach(callback: (value: T, key: string) => void): void;
    awaitForEach(callback: (value: T, key: string) => Promise<void>): void;
}
