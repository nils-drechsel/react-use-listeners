import { ObservedMap } from "../interfaces/ObservedMap";
import { AnyIdListenerCallback, IdListenerCallback, ListenerEvent, UnsubscribeCallback } from "../Listeners";




export class ObservedMapMirrorImpl<CONTENT> implements ObservedMap<CONTENT> {

    private map: ObservedMap<CONTENT>;
    private observedIds: Set<string> = new Set();

    public size: number = 0;

    private unsubscribe: UnsubscribeCallback;

    constructor(map: ObservedMap<CONTENT>) {
        this.map = map;
        this.unsubscribe = this.map.addAnyIdListener((id, event) => {
            if (this.observedIds.has(id) && event === ListenerEvent.REMOVED) {
                this.observedIds.delete(id);
            }
        })
    }

    [Symbol.iterator](): IterableIterator<[string, CONTENT]> {
        throw new Error("Method not implemented.");
    }
    
    entries(): IterableIterator<[string, CONTENT]> {
        throw new Error("Method not implemented.");
    }
    [Symbol.toStringTag]: string;

    addAnyIdListener(listener: AnyIdListenerCallback): UnsubscribeCallback {
        return this.map.addAnyIdListener((id: string, event: ListenerEvent) => {
            if (this.observedIds.has(id)) listener(id, event);
        });
    }
    addIdListener(id: string, listener: IdListenerCallback): UnsubscribeCallback {
        return this.map.addIdListener(id, (event: ListenerEvent) => {
            if (this.observedIds.has(id)) listener(event);
        });
    }
    get(id: string): CONTENT | undefined {
        if (!this.map.has(id)) return undefined;
        return this.map.get(id);
    }
    set(id: string, data: CONTENT): this {
        this.map.set(id, data);
        this.addObservedId(id);
        return this;
    }
    has(id: string): boolean {
        return this.observedIds.has(id) && this.map.has(id);
    }
    delete(id: string): boolean {
        if (!this.observedIds.has(id)) return false;
        const res = this.map.delete(id);
        this.observedIds.delete(id);
        return res;
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
    values(): IterableIterator<CONTENT> {
        const res = [];
        for (const key of this.observedIds) {
            const v = this.map.get(key);
            if (v !== undefined) res.push(v);
        }
        return res.values();
    }
    forEach(callback: (value: CONTENT, key: string, map: Map<string, CONTENT>) => void): void {
        Array.from(this.observedIds.values()).forEach(id => {
            const v = this.map.get(id);
            if (v === undefined) return;
            callback(v, id, new Map());
        })
    }
    awaitForEach(callback: (value: CONTENT, key: string) => Promise<void>): void {
        Promise.all(Array.from(this.observedIds.values()).map(async id => {
            const v = this.map.get(id);
            if (v === undefined) return;
            callback(v, id);
        }));
    }

    addObservedId(id: string) {
        this.observedIds.add(id);
        this.size = this.observedIds.size;
    }

    deleteObservedId(id: string) {
        this.observedIds.delete(id);
        this.size = this.observedIds.size;
    }

    destroy(): void {
        this.unsubscribe();
    }

}