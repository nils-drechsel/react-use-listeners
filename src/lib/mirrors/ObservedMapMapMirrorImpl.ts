import { ObservedMap } from "../interfaces/ObservedMap";
import { ObservedMapMap } from "../interfaces/ObservedMapMap";
import { ObservedMapMapMirror } from "../interfaces/ObservedMapMapMirror";
import { ListenerEvent, SubIdListenerCallback, UnsubscribeCallback } from "../Listeners";
import { ObservedMapImpl } from "../maps/ObservedMapImpl";

export class ObservedMapMapMirrorImpl<CONTENT> implements ObservedMapMapMirror<CONTENT> {
    private map: ObservedMapMap<CONTENT>;
    private observedIds: Map<string, Set<string>> = new Map();

    constructor(map: ObservedMapMap<CONTENT>) {
        this.map = map;
    }

    [Symbol.iterator](): IterableIterator<[string, CONTENT]> {
        throw new Error("Method not implemented.");
    }
    entries(): IterableIterator<[string, CONTENT]> {
        throw new Error("Method not implemented.");
    }
    [Symbol.toStringTag]: string;

    addSubIdListener(id: string, subId: string, listener: SubIdListenerCallback): UnsubscribeCallback {
        return this.map.addSubIdListener(id, subId, (id, subId, event) => {
            if (this.observedIds.has(id)) listener(id, subId, event);
        });
    }

    addAnySubIdListener(id: string, listener: SubIdListenerCallback): UnsubscribeCallback {
        return this.map.addAnySubIdListener(id, (id: string, subId: string, event: ListenerEvent) => {
            if (this.observedIds.has(id) && this.observedIds.get(id)!.has(subId)) listener(id, subId, event);
        });
    }

    addAnyListener(listener: SubIdListenerCallback): UnsubscribeCallback {
        return this.map.addAnyListener((id, subId, event) => {
            if (this.observedIds.has(id) && this.observedIds.get(id)!.has(subId)) listener(id, subId, event);
        });
    }

    private getSubValues(id: string): ObservedMap<CONTENT> {
        const res: ObservedMap<CONTENT> = new ObservedMapImpl();
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

    getSub(id: string, subId: string): CONTENT | undefined {
        if (!this.observedIds.has(id) || !this.observedIds.get(id)?.has(subId)) return undefined;
        return this.map.getSub(id, subId);
    }

    forEach(callback: (value: CONTENT, id: string, subId: string) => void) {
        this.map.forEach((value, id, subId) => {
            if (this.observedIds.has(id) && this.observedIds.get(id)!.has(subId)) callback(value, id, subId);
        });
    }

    forEachSub(id: string, callback: (value: CONTENT, key: string) => void): void {
        const values = this.getSubValues(id);
        values.forEach(callback);
    }
    awaitForEachSub(id: string, callback: (value: CONTENT, key: string) => Promise<void>): void {
        const values = this.getSubValues(id);
        values.awaitForEach(callback);
    }
    keys(): IterableIterator<string> {
        const keys: Array<string> = [];
        this.observedIds.forEach((_value, key) => {
            if (this.map.has(key)) keys.push(key);
        });
        return keys.values();
    }
    keysSub(id: string): IterableIterator<string> {
        const values = this.getSubValues(id);
        return values.keys();
    }
    valuesSub(id: string): IterableIterator<CONTENT> {
        const values = this.getSubValues(id);
        return values.values();
    }
    sizeSub(id: string): number {
        const values = this.getSubValues(id);
        return values.size();
    }
    setSub(id: string, subId: string, data: CONTENT): void {
        this.map.setSub(id, subId, data);
    }
    deleteSub(id: string, subId: string): void {
        if (!this.observedIds.has(id)) return;
        this.map.deleteSub(id, subId);
    }
    modifySub(id: string, subId: string, data?: Object): void {
        if (!this.observedIds.has(id)) return;
        this.map.modifySub(id, subId, data);
    }
    has(id: string): boolean {
        if (!this.observedIds.has(id) || !this.map.has(id)) return false;

        const subIds = this.map.getSubIds(id);
        const obsIds = this.observedIds.get(id)!;

        return Array.from(obsIds).some((observedId) => subIds.has(observedId));
    }

    getSubIds(id: string): Set<string> {
        if (!this.map.has(id) || !this.observedIds.has(id)) return new Set();

        const subIds = this.map.getSubIds(id)!;
        const obsIds = this.observedIds.get(id)!;
        return new Set([...subIds].filter((x) => obsIds.has(x)));
    }

    delete(id: string): void {
        if (!this.observedIds.has(id)) return;
        this.map.delete(id);
    }

    addObservedId(id: string, subId?: string): void {
        if (!this.observedIds.has(id)) this.observedIds.set(id, new Set());

        if (subId) this.observedIds.get(id)?.add(subId);
    }

    deleteObservedId(id: string, subId?: string): void {
        if (!this.observedIds.has(id)) return;
        if (!subId) this.observedIds.delete(id);
        else {
            const sub = this.observedIds.get(id)!;
            sub.delete(subId);
            if (sub.size === 0) this.deleteObservedId(id);
        }
    }

    getObservedIds(): Array<string> {
        return Array.from(this.observedIds.keys());
    }

    getObservedSubIds(id: string): Array<string> {
        if (!this.observedIds.has(id)) return [];
        return Array.from(this.observedIds.get(id)!.values());
    }
}
