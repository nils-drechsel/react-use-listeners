import { AnyIdListenerCallback, IdListenerCallback, UnsubscribeCallback } from "../Listeners";
export interface ObservedMap<T> extends Map<string, T> {
    addAnyIdListener(listener: AnyIdListenerCallback): UnsubscribeCallback;
    addIdListener(id: string, listener: IdListenerCallback): UnsubscribeCallback;
    get(id: string): T | undefined;
    set(id: string, data: T): this;
    has(id: string): boolean;
    delete(id: string): boolean;
    modify(id: string, data?: Object): void;
    clear(): void;
    keys(): IterableIterator<string>;
    values(): IterableIterator<T>;
    size: number;
    forEach(callback: (value: T, key: string, map: Map<string, T>) => void): void;
    awaitForEach(callback: (value: T, key: string) => Promise<void>): void;
}
