import { ObservedMap } from "../interfaces/ObservedMap";
import { AnyIdListenerCallback, DataListenerCallback, DataListeners, IdListenerCallback, IdListeners } from "../Listeners";
export declare class ObservedMapImpl<T> extends Map<string, T> implements ObservedMap<T> {
    arrayListeners: DataListeners<Array<T>>;
    idListeners: IdListeners;
    throwErrors: boolean;
    constructor(throwErrors?: boolean);
    awaitForEach(callback: (value: T, key: string) => Promise<void>): void;
    addArrayListener(listener: DataListenerCallback<Array<T>>): import("../Listeners").UnsubscribeCallback;
    addAnyIdListener(listener: AnyIdListenerCallback): () => void;
    addIdListener(id: string, listener: IdListenerCallback): () => void;
    private notifyArrayListeners;
    private getArray;
    set(id: string, data: T): this;
    delete(id: string): boolean;
    modify(id: string, data?: Object): void;
    clear(): void;
}
