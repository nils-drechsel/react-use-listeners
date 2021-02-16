import { AnyIdListenerCallback, DataListenerCallback, DataListeners, IdListenerCallback, IdListeners } from "./Listeners";
export declare class ObservedMap<T> extends Map<string, T> {
    arrayListeners: DataListeners<Array<T>>;
    idListeners: IdListeners;
    throwErrors: boolean;
    constructor(throwErrors?: boolean);
    addArrayListener(listener: DataListenerCallback<Array<T>>): import("./Listeners").UnsubscribeCallback;
    addAnyIdListener(listener: AnyIdListenerCallback): () => void;
    addIdListener(id: string, listener: IdListenerCallback): () => void;
    private notifyArrayListeners;
    private getArray;
    set(id: string, data: T): this;
    delete(id: string): boolean;
    modify(id: string, data?: Object): void;
    clear(): void;
}
