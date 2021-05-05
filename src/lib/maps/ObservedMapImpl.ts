import { ObservedMap } from "../interfaces/ObservedMap";
import { AnyIdListeners, IdListenerCallback, IdListeners, ListenerEvent } from "../Listeners";

export class ObservedMapImpl<T> implements ObservedMap<T> {
    idListeners: IdListeners = new IdListeners();
    anyIdListeners: AnyIdListeners = new AnyIdListeners();

    private map: Map<string, T> = new Map();

    constructor() {}

    get(id: string): T | undefined {
        return this.map.get(id);
    }

    has(id: string): boolean {
        return this.map.has(id);
    }

    keys(): IterableIterator<string> {
        return this.map.keys();
    }

    values(): IterableIterator<T> {
        return this.map.values();
    }

    size(): number {
        return this.map.size;
    }

    forEach(callback: (value: T, key: string) => void): void {
        return this.map.forEach(callback);
    }

    awaitForEach(callback: (value: T, key: string) => Promise<void>): void {
        Promise.all(
            Array.from(this.map).map(async ([key, value]) => {
                await callback(value, key);
            })
        );
    }

    addAnyIdListener(listener: IdListenerCallback) {
        const unsubscribe = this.anyIdListeners.addListener(listener);
        this.map.forEach((_value, id) => listener(id, ListenerEvent.ADDED));
        return unsubscribe;
    }

    addIdListener(id: string, listener: IdListenerCallback) {
        const unsubscribe = this.idListeners.addListener(id, listener);
        if (this.map.has(id)) listener(id, ListenerEvent.ADDED);
        return unsubscribe;
    }

    private notify(id: string, event: ListenerEvent) {
        this.idListeners.notify(id, event);
        this.anyIdListeners.notify(id, event);
    }

    set(id: string, data: T) {
        const idExisted = this.map.has(id);
        this.map.set(id, data);

        if (idExisted) {
            this.notify(id, ListenerEvent.MODIFIED);
        } else {
            this.notify(id, ListenerEvent.ADDED);
        }

        return this;
    }

    delete(id: string): void {
        if (!this.map.has(id)) return;
        this.map.delete(id);
        this.notify(id, ListenerEvent.REMOVED);
    }

    modify(id: string, data?: Object) {
        if (!this.map.has(id)) {
            return;
        }

        if (data) {
            this.map.set(id, Object.assign({}, this.map.get(id), data));
        }

        this.notify(id, ListenerEvent.MODIFIED);
    }
}
