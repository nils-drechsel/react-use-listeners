import { ObservedMap } from "../interfaces/ObservedMap";
import { IdListenerCallback, ListenerEvent, UnsubscribeCallback } from "../Listeners";

export class ObservedMapMirrorImpl<T> implements ObservedMap<T> {
    private map: ObservedMap<T>;
    observedIds: Set<string> = new Set();

    constructor(map: ObservedMap<T>) {
        this.map = map;
    }

    size(): number {
        return Array.from(this.values()).length;
    }

    addAnyIdListener(listener: IdListenerCallback): UnsubscribeCallback {
        return this.map.addAnyIdListener((id: string, event: ListenerEvent) => {
            if (this.observedIds.has(id)) listener(id, event);
        });
    }
    addIdListener(id: string, listener: IdListenerCallback): UnsubscribeCallback {
        return this.map.addIdListener(id, (id: string, event: ListenerEvent) => {
            if (this.observedIds.has(id)) listener(id, event);
        });
    }
    get(id: string): T | undefined {
        if (!this.map.has(id)) return undefined;
        return this.map.get(id);
    }
    set(id: string, data: T): this {
        this.map.set(id, data);
        return this;
    }
    has(id: string): boolean {
        return this.observedIds.has(id) && this.map.has(id);
    }
    delete(id: string): void {
        if (!this.observedIds.has(id)) return;
        this.map.delete(id);
    }
    modify(id: string, data?: Object): void {
        if (!this.observedIds.has(id)) return;
        this.map.modify(id, data);
    }
    clear(): void {
        this.observedIds.clear();
    }
    keys(): IterableIterator<string> {
        return this.observedIds.values();
    }
    values(): IterableIterator<T> {
        const res = [];
        for (const key of this.observedIds) {
            const v = this.map.get(key);
            if (v !== undefined) res.push(v);
        }
        return res.values();
    }
    forEach(callback: (value: T, key: string, map: Map<string, T>) => void): void {
        Array.from(this.observedIds.values()).forEach((id) => {
            const v = this.map.get(id);
            if (v === undefined) return;
            callback(v, id, new Map());
        });
    }
    awaitForEach(callback: (value: T, key: string) => Promise<void>): void {
        Promise.all(
            Array.from(this.observedIds.values()).map(async (id) => {
                const v = this.map.get(id);
                if (v === undefined) return;
                callback(v, id);
            })
        );
    }

    addObservedId(id: string) {
        this.observedIds.add(id);
    }

    deleteObservedId(id: string) {
        this.observedIds.delete(id);
    }

    destroy(): void {}
}
