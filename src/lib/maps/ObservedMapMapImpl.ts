import { ObservedMapMap } from "../interfaces/ObservedMapMap";
import {
    AnyIdListenerCallback, AnySubIdListenerCallback, IdListenerCallback, IdListeners, UnsubscribeCallback
} from "../Listeners";

interface MapMapContent<CONTENT, SUB_CONTENT> {
    content: CONTENT
    map: Map<string, SUB_CONTENT> 
}

export class ObservedMapMapImpl<CONTENT, SUB_CONTENT> implements ObservedMapMap<CONTENT, SUB_CONTENT> {

    rootMap: Map<string, MapMapContent<CONTENT, SUB_CONTENT>> = new Map();

    idListeners: IdListeners = new IdListeners();

    throwErrors: boolean;

    public size: number = 0;

    constructor(throwErrors: boolean = false) {
        this.throwErrors = throwErrors;
    }

    [Symbol.iterator](): IterableIterator<[string, CONTENT]> {
        throw new Error("Method not implemented.");
    }
    entries(): IterableIterator<[string, CONTENT]> {
        throw new Error("Method not implemented.");
    }

    [Symbol.toStringTag]: string;

    addAnyListener(listener: AnySubIdListenerCallback): UnsubscribeCallback {
        return this.idListeners.addAnyListener((event, id, subId) => {
            listener(id, subId, event);
        })
    }

    addAnyIdListener(listener: AnyIdListenerCallback): UnsubscribeCallback {
        return this.idListeners.addListener(listener);
    }

    addIdListener(id: string, listener: IdListenerCallback): UnsubscribeCallback {
        return this.idListeners.addIdListener(id, listener);
    }

    addAnySubIdListener(id: string, listener: AnyIdListenerCallback): UnsubscribeCallback {
        return this.idListeners.addListener(listener, id);
    }

    addSubIdListener(id: string, subId: string, listener: IdListenerCallback): UnsubscribeCallback {
        return this.idListeners.addIdListener(subId, listener, id);
    }    

    has(id: string) {
        return this.rootMap.has(id);
    }

    hasSub(id: string, subId: string) {
        if (!this.rootMap.has(id)) return false;
        return this.rootMap.get(id)!.map.has(subId);
    }

    get(id: string): CONTENT | undefined {
        if (!this.has(id)) return undefined;
        return this.rootMap.get(id)!.content;
    }

    getMap(id: string): Map<string, SUB_CONTENT> | undefined {
        if (!this.has(id)) return undefined;
        return this.rootMap.get(id)!.map;
    }

    getSub(id: string, subId: string): SUB_CONTENT | undefined {
        if (!this.has(id)) return undefined;
        return this.rootMap.get(id)!.map.get(subId);
    }    

    forEach(callback: (value: CONTENT, key: string, map: Map<string, CONTENT>) => void) {
        this.rootMap.forEach((value: MapMapContent<CONTENT, SUB_CONTENT>, key: string) => callback(value.content, key, new Map()));
    }

    awaitForEach(callback: (value: CONTENT, key: string) => Promise<void>) {
        Promise.all(
            Array.from(this.rootMap).map(async ([key, value]) => {
                await callback(value.content, key);
            })
        );
    }    

    forEachSub(id: string, callback: (value: SUB_CONTENT, key: string) => void) {
        if (!this.has(id)) return;
        this.rootMap.get(id)!.map.forEach((value: SUB_CONTENT, key: string) => callback(value, key));
    }

    awaitForEachSub(id: string, callback: (value: SUB_CONTENT, key: string) => Promise<void>) {
        if (!this.has(id)) return;
        Promise.all(
            Array.from(this.getMap(id)!).map(async ([key, value]) => {
                await callback(value, key);
            })
        );
    }    

    keys() {
        return this.rootMap.keys();
    }

    keysSub(id: string): IterableIterator<string> {
        if (!this.has(id)) {
            if (this.throwErrors) {
                throw new Error("ObservedMapMap has no id: " + id + " while performing keySub");
            } else {
                return [].values() as IterableIterator<string>;
            }
        }
        return this.rootMap.get(id)!.map.keys();
    }

    values(): IterableIterator<CONTENT> {
        return Array.from(this.rootMap.values()).map(value => value.content).values();
    }

    valuesSub(id: string): IterableIterator<SUB_CONTENT> {
        if (!this.has(id)) {
            if (this.throwErrors) {
                throw new Error("ObservedMapMap has no id: " + id + " while performing valuesSub");
            } else {
                return [].values();
            }
        }
        return this.rootMap.get(id)!.map.values();
    }

    sizeSub(id: string): number {
        if (!this.has(id)) return 0;
        return this.rootMap.get(id)!.map.size;
    }

    private updateSize(): void {
        this.size = this.rootMap.size;
    }


    set(id: string, data: CONTENT) {
        const idExisted = this.has(id);

        if (idExisted) {
            const obj = this.rootMap.get(id)!;
            obj.map.forEach((_value, subId) => this.idListeners.removeId(subId, id));
        }

        this.rootMap.set(id, { content: data, map: new Map() });

        if (idExisted) {
            this.idListeners.modifyId(id);
        } else {
            this.idListeners.addId(id);
        }

        this.updateSize();

        return this;

    }

    setSub(id: string, subId: string, data: SUB_CONTENT) {
        if (!this.has(id)) {
            if (this.throwErrors) {
                throw new Error("ObservedMapMap has no id: " + id + " while subsetting: " + subId);
            } else {
                return;
            }
        }

        const map = this.rootMap.get(id)!.map;

        const idExisted = map.has(subId);

        map.set(subId, data);

        if (idExisted) {
            this.idListeners.modifyId(subId, id);
        } else {
            this.idListeners.addId(subId, id);
        }

        this.updateSize();

        return this;

    }


    delete(id: string) {
        if (!this.has(id)) return false;
        this.rootMap.delete(id);
        this.idListeners.removeId(id);

        this.updateSize();

        return true;
    }

    deleteSub(id: string, subId: string) {
        if (!this.has(id)) return false;
        const map = this.rootMap.get(id)!.map;
        if (!map.has(subId)) return false;
        map.delete(id);
        this.idListeners.removeId(subId, id);

        this.updateSize();
        
        return true;
    }


    modify(id: string, data?: Object) {
        if (!this.has(id)) {
            if (this.throwErrors) {
                throw new Error("ObservedMapMap has no id: " + id + " while modifying");
            } else {
                return;
            }
        }

        if (data) {
            this.rootMap.get(id)!.content = Object.assign({}, this.get(id), data);
        }

        this.idListeners.modifyId(id);
    }

    modifySub(id: string, subId: string, data?: Object) {
        if (!this.has(id)) {
            if (this.throwErrors) {
                throw new Error("ObservedMapMap has no id: " + id + " while modifying");
            } else {
                return;
            }
        }

        const map = this.rootMap.get(id)!.map;

        if (!map.has(subId)) {
            if (this.throwErrors) {
                throw new Error("ObservedMapMap has no id: " + id + " while modifying: " + subId);
            } else {
                return;
            }
        }

        if (data) {
            map.set(subId, Object.assign({}, map.get(id), data));
        }

        this.idListeners.modifyId(subId, id);
    }    

    clear() {
        const keys = Array.from(this.rootMap.keys());
        keys.forEach(id => {
            this.clearSub(id);
            this.idListeners.removeId(id);
        });

        this.rootMap.clear();

        this.updateSize();

    }

    clearSub(id: string) {
        if (!this.has(id)) return;

        const map = this.rootMap.get(id)!.map;

        const keys = Array.from(map.keys());
        map.clear();
        keys.forEach(subId => this.idListeners.removeId(subId, id));

        this.updateSize();
        
    }


    
    
}