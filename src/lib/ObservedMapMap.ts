import {
    AnyIdListenerCallback, IdListenerCallback, IdListeners
} from "./Listeners";

interface MapMapContent<CONTENT, SUB_CONTENT> {
    content: CONTENT
    map: Map<string, SUB_CONTENT> 
}

export class ObservedMapMap<CONTENT, SUB_CONTENT> {

    rootMap: Map<string, MapMapContent<CONTENT, SUB_CONTENT>> = new Map();

    idListeners: IdListeners = new IdListeners();

    throwErrors: boolean;

    constructor(throwErrors: boolean = false) {
        this.throwErrors = throwErrors;
    }

    addAnyIdListener(listener: AnyIdListenerCallback) {
        return this.idListeners.addListener(listener);
    }

    addIdListener(id: string, listener: IdListenerCallback) {
        return this.idListeners.addIdListener(id, listener);
    }

    addAnySubIdListener(id: string, listener: AnyIdListenerCallback) {
        return this.idListeners.addListener(listener, id);
    }

    addSubIdListener(id: string, subId: string, listener: IdListenerCallback) {
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

    getSub(id: string, subId: string): SUB_CONTENT | undefined {
        if (!this.has(id)) return undefined;
        return this.rootMap.get(id)!.map.get(subId);
    }    

    forEach(callback: (value: CONTENT, key: string) => void) {
        this.rootMap.forEach((value: MapMapContent<CONTENT, SUB_CONTENT>, key: string) => callback(value.content, key));
    }

    forEachSub(id: string, callback: (value: SUB_CONTENT, key: string) => void) {
        if (!this.has(id)) return;
        this.rootMap.get(id)!.map.forEach((value: SUB_CONTENT, key: string) => callback(value, key));
    }

    keys() {
        return this.rootMap.keys();
    }

    keysSub(id: string) {
        if (!this.has(id)) {
            if (this.throwErrors) {
                throw new Error("ObservedMapMap has no id: " + id + " while performing keySub");
            } else {
                return [];
            }
        }
        return this.rootMap.get(id)!.map.keys();
    }

    values() {
        return Array.from(this.rootMap.values()).map(value => value.content);
    }

    valuesSub(id: string) {
        if (!this.has(id)) {
            if (this.throwErrors) {
                throw new Error("ObservedMapMap has no id: " + id + " while performing valuesSub");
            } else {
                return [];
            }
        }
        return this.rootMap.get(id)!.map.values();
    }

    size(): number {
        return this.rootMap.size;
    }

    sizeSub(id: string): number {
        if (!this.has(id)) return 0;
        return this.rootMap.get(id)!.map.size;
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

        return this;

    }


    delete(id: string) {
        if (!this.has(id)) return false;
        this.rootMap.delete(id);
        this.idListeners.removeId(id);

        return true;
    }

    deleteSub(id: string, subId: string) {
        if (!this.has(id)) return false;
        const map = this.rootMap.get(id)!.map;
        if (!map.has(subId)) return false;
        map.delete(id);
        this.idListeners.removeId(subId, id);

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
    }

    clearSub(id: string) {
        if (!this.has(id)) return;

        const map = this.rootMap.get(id)!.map;

        const keys = Array.from(map.keys());
        map.clear();
        keys.forEach(subId => this.idListeners.removeId(subId, id));
    }

    
    
}