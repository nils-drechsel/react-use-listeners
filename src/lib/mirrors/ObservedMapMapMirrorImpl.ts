import { ObservedMap } from "../interfaces/ObservedMap";
import { ObservedMapMap } from "../interfaces/ObservedMapMap";
import { AnyIdListenerCallback, AnySubIdListenerCallback, IdListenerCallback, ListenerEvent, UnsubscribeCallback } from "../Listeners";
import { ObservedMapImpl } from "../maps/ObservedMapImpl";




export class ObservedMapMapMirrorImpl<CONTENT, SUB_CONTENT> implements ObservedMapMap<CONTENT, SUB_CONTENT> {

    private map: ObservedMapMap<CONTENT, SUB_CONTENT>;
    private observedIds: Map<string, Set<string>> = new Map();

    public size: number = 0;

    constructor(map: ObservedMapMap<CONTENT, SUB_CONTENT>) {
        this.map = map;
    }
    
    [Symbol.iterator](): IterableIterator<[string, CONTENT]> {
        throw new Error("Method not implemented.");
    }
    entries(): IterableIterator<[string, CONTENT]> {
        throw new Error("Method not implemented.");
    }
    [Symbol.toStringTag]: string;

    addAnyListener(listener: AnySubIdListenerCallback): UnsubscribeCallback {
        return this.map.addAnyListener((id: string, subId: string, event: ListenerEvent) => {
            if (this.observedIds.has(id) && this.observedIds.get(id)?.has(subId)) listener(id, subId, event);
        });
    }    

    addAnySubIdListener(id: string, listener: AnyIdListenerCallback): UnsubscribeCallback {
        return this.map.addAnySubIdListener(id, (subId: string, event: ListenerEvent) => {
            if (this.observedIds.has(id)) listener(subId, event);
        });
    }
    addSubIdListener(id: string, subId: string, listener: IdListenerCallback): UnsubscribeCallback {
        return this.map.addSubIdListener(id, subId, (event: ListenerEvent) => {
            if (this.observedIds.has(id)) listener(event);
        });
    }


    private getSubValues(id: string): ObservedMap<SUB_CONTENT> {
        const res: ObservedMap<SUB_CONTENT> = new ObservedMapImpl();
        if (!this.observedIds.has(id)) return res;
        for (const key of this.observedIds.get(id)!) {
            const content = this.map.getSub(id, key);
            if (content !== undefined) res.set(key, content);
        }
        return res;

    }


    hasSub(id: string, subId: string): boolean {
        return this.observedIds.has(id) && !!this.observedIds.get(id)?.has(subId) && this.map.hasSub(id, subId);
    }
    getMap(id: string): Map<string, SUB_CONTENT> | undefined {
        return this.getSubValues(id);
    }
    getSub(id: string, subId: string): SUB_CONTENT | undefined {
        if (!this.observedIds.has(id) || !this.observedIds.get(id)?.has(subId)) return undefined;
        return this.map.getSub(id, subId);
    }
    forEachSub(id: string, callback: (value: SUB_CONTENT, key: string) => void): void {
        const values = this.getSubValues(id);
        values.forEach(callback);
    }
    awaitForEachSub(id: string, callback: (value: SUB_CONTENT, key: string) => Promise<void>): void {
        const values = this.getSubValues(id);
        values.awaitForEach(callback);
    }
    keysSub(id: string): IterableIterator<string> {
        const values = this.getSubValues(id);
        return values.keys();
    }
    valuesSub(id: string): IterableIterator<SUB_CONTENT> {
        const values = this.getSubValues(id);
        return values.values();
    }
    sizeSub(id: string): number {
        const values = this.getSubValues(id);
        return values.size;
    }
    setSub(id: string, subId: string, data: SUB_CONTENT): void {
        this.map.setSub(id, subId, data);
        this.addObservedId(id, subId);
    }
    deleteSub(id: string, subId: string): void {
        if (!this.observedIds.has(id)) return;
        this.map.deleteSub(id, subId);
        this.deleteObservedId(id, subId);
    }
    modifySub(id: string, subId: string, data?: Object): void {
        if (!this.observedIds.has(id)) return;
        this.map.modifySub(id, subId, data);
    }
    clearSub(id: string): void {
        if (!this.observedIds.has(id)) return;
        this.map.clearSub(id);
        this.observedIds.get(id)?.clear();
    }
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
        return this.observedIds.keys();
    }
    values(): IterableIterator<CONTENT> {
        const res = [];
        for (const key of this.observedIds.keys()) {
            const v = this.map.get(key);
            if (v !== undefined) res.push(v);
        }
        return res.values();
    }
    forEach(callback: (value: CONTENT, key: string, map: Map<string, CONTENT>) => void): void {
        Array.from(this.observedIds.keys()).forEach(id => {
            const v = this.map.get(id);
            if (v === undefined) return;
            callback(v, id, new Map());
        })
    }
    awaitForEach(callback: (value: CONTENT, key: string) => Promise<void>): void {
        Promise.all(Array.from(this.observedIds.keys()).map(async id => {
            const v = this.map.get(id);
            if (v === undefined) return;
            callback(v, id);
        }));
    }

    addObservedId(id: string, subId?: string): void {
        if (!this.observedIds.has(id)) this.observedIds.set(id, new Set());

        if (subId) this.observedIds.get(id)?.add(subId);
    }

    deleteObservedId(id: string, subId?: string): void {
        if (!this.observedIds.has(id)) return;
        if (!subId) this.observedIds.delete(id);
        else this.observedIds.get(id)?.delete(subId);

    }


}