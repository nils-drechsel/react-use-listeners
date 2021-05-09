import { ObservedMapMap } from "../interfaces/ObservedMapMap";
import {
    AnySubIdListeners,
    SubIdListeners,
    SubIdListenerCallback,
    UnsubscribeCallback,
    AnyListeners,
    ListenerEvent,
} from "../Listeners";

export class ObservedMapMapImpl<T> implements ObservedMapMap<T> {
    map: Map<string, Map<string, T>> = new Map();

    subIdListeners: SubIdListeners = new SubIdListeners();
    anySubIdListeners: AnySubIdListeners = new AnySubIdListeners();
    anyListeners: AnyListeners = new AnyListeners();

    autoRemoveIds: boolean;

    public size: number = 0;

    constructor(autoRemoveIds: boolean = true) {
        this.autoRemoveIds = autoRemoveIds;
    }

    getMap(id: string): Map<string, T> | undefined {
        return this.map.get(id);
    }

    addSubIdListener(id: string, subId: string, listener: SubIdListenerCallback): UnsubscribeCallback {
        const unsubscribe = this.subIdListeners.addListener(id, subId, listener);
        if (this.map.has(id)) {
            const sub = this.map.get(id)!;
            if (sub.has(subId)) listener(id, subId, ListenerEvent.ADDED);
        }
        return unsubscribe;
    }

    addAnySubIdListener(id: string, listener: SubIdListenerCallback): UnsubscribeCallback {
        const unsubscribe = this.anySubIdListeners.addListener(id, listener);
        if (this.map.has(id)) {
            this.map.get(id)!.forEach((_value, subId) => listener(id, subId, ListenerEvent.ADDED));
        }
        return unsubscribe;
    }

    addAnyListener(listener: SubIdListenerCallback): UnsubscribeCallback {
        const unsubscribe = this.anyListeners.addListener(listener);
        this.map.forEach((subMap, id) => {
            subMap.forEach((_value, subId) => listener(id, subId, ListenerEvent.ADDED));
        });
        return unsubscribe;
    }

    has(id: string) {
        return this.map.has(id);
    }

    hasSub(id: string, subId: string) {
        if (!this.map.has(id)) return false;
        return this.map.get(id)!.has(subId);
    }

    getSub(id: string, subId: string): T | undefined {
        if (!this.has(id)) return undefined;
        return this.map.get(id)!.get(subId);
    }

    getSubIds(id: string): Set<string> {
        if (!this.has(id)) return new Set();
        return new Set(this.map.get(id)!.keys());
    }

    forEach(callback: (value: T, id: string, subId: string) => void) {
        this.map.forEach((map, id) => {
            map.forEach((value, subId) => {
                callback(value, id, subId);
            });
        });
    }

    forEachSub(id: string, callback: (value: T, key: string) => void) {
        if (!this.has(id)) return;
        this.map.get(id)!.forEach((value: T, key: string) => callback(value, key));
    }

    awaitForEachSub(id: string, callback: (value: T, key: string) => Promise<void>) {
        if (!this.has(id)) return;
        Promise.all(
            Array.from(this.map.get(id)!).map(async ([key, value]) => {
                await callback(value, key);
            })
        );
    }

    keys() {
        return this.map.keys();
    }

    keysSub(id: string): IterableIterator<string> {
        if (!this.has(id)) {
            return [].values() as IterableIterator<string>;
        }
        return this.map.get(id)!.keys();
    }

    valuesSub(id: string): IterableIterator<T> {
        if (!this.has(id)) {
            return [].values();
        }
        return this.map.get(id)!.values();
    }

    sizeSub(id: string): number {
        if (!this.has(id)) return 0;
        return this.map.get(id)!.size;
    }

    private updateSize(): void {
        this.size = this.map.size;
    }

    private notify(id: string, subId: string, event: ListenerEvent): void {
        this.subIdListeners.notify(id, subId, event);
        this.anySubIdListeners.notify(id, subId, event);
        this.anyListeners.notify(id, subId, event);
    }

    setSub(id: string, subId: string, data: T) {
        if (!this.has(id)) {
            this.map.set(id, new Map());
        }

        const map = this.map.get(id)!;

        const idExisted = map.has(subId);

        map.set(subId, data);

        if (idExisted) {
            this.notify(id, subId, ListenerEvent.MODIFIED);
        } else {
            this.notify(id, subId, ListenerEvent.ADDED);
        }

        this.updateSize();

        return this;
    }

    delete(id: string): void {
        if (!this.has(id)) return;

        const items = this.map.get(id)!;

        items.forEach((_item, subId) => this.deleteSub(id, subId));

        this.map.delete(id);
    }

    deleteSub(id: string, subId: string) {
        if (!this.has(id)) return;
        const map = this.map.get(id)!;
        if (!map.has(subId)) return;
        map.delete(subId);

        this.updateSize();

        if (this.autoRemoveIds && map.size === 0) {
            this.delete(id);
        }

        this.notify(id, subId, ListenerEvent.REMOVED);

        return;
    }

    modifySub(id: string, subId: string, data?: Object) {
        const map = this.map.get(id)!;

        if (!map || !map.has(subId)) {
            return;
        }

        if (data) {
            map.set(subId, Object.assign({}, map.get(id), data));
        }

        this.notify(id, subId, ListenerEvent.MODIFIED);
    }
}
