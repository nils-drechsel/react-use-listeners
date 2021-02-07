
export interface UnsubscribeCallback {
    (): void;
}

export enum ListenerEvent {
    ADDED,
    REMOVED,
    MODIFIED,
}


export class Listeners<T> {

    listenerCount = 0;
    callbacks: Map<number, T> = new Map();

    createId() {
        return this.listenerCount++;
    }

    removeListener (id: number) {
        this.callbacks.delete(id);
    }

    addListener(callback: T): UnsubscribeCallback {
        const id = this.createId();
        this.callbacks.set(id, callback);

        const returnRemoveCallback = () => this.removeListener(id);
        return returnRemoveCallback.bind(this);
    }

    getCallbacks(): Array<T> {
        return Array.from(this.callbacks.values());
    }

    forEach(callbackfn: (value: T, key: number, map: Map<number, T>) => void) {
        this.callbacks.forEach(callbackfn);
    }

    size(): number {
        return this.callbacks.size;
    }


}

export interface DataListenerCallback<T> {
    (data: T): void
}

export class DataListeners<T> extends Listeners<DataListenerCallback<T>> {

}

interface IdContainer {
    rootId: string;
    ids: Set<string>;
    listeners: Listeners<(id: string, event: ListenerEvent) => void>;
    idListeners: Map<string, Listeners<(event: ListenerEvent) => void>>;
}

export interface AnyIdListenerCallback {
    (id:string, event: ListenerEvent): void
}

export interface IdListenerCallback {
    (event: ListenerEvent): void
}


export class IdListeners {

    root: Map<string, IdContainer> = new Map();

    constructor() {
    }

    getOrCreateRoot(rootId: string) {
        if (!this.root.has(rootId)) {
            this.root.set(rootId, {rootId, ids: new Set(), listeners: new Listeners(), idListeners: new Map()});
        }
        return this.root.get(rootId)!;
    }

    getOrCreateIdListeners(container: IdContainer, id: string) {
        if (!container.idListeners.has(id)) {
            container.idListeners.set(id, new Listeners());
        }
        return container.idListeners.get(id)!;
    }

    makePath(...rootIds: string[]): string {
        if (rootIds.length === 0) return "/";
        else return rootIds.join("/");
    }

    addListener(listener: AnyIdListenerCallback, ...rootIds: string[]) {

        const rootId = this.makePath(...rootIds);
        const container = this.getOrCreateRoot(rootId);

        const unsubscribe = container.listeners.addListener(listener);

        container.ids.forEach(ids => {
            listener(ids, ListenerEvent.ADDED);
        })

        return () => {
            unsubscribe();
            if (container.listeners.size() === 0 && container.ids.size === 0) {
                this.root.delete(rootId);
            }
        }
    }

    addIdListener(id: string, listener: IdListenerCallback, ...rootIds: string[]) {

        const rootId = this.makePath(...rootIds);
        const container = this.getOrCreateRoot(rootId);

        const idListeners = this.getOrCreateIdListeners(container, id);

        const unsubscribe = idListeners.addListener(listener);

        if (container.ids.has(id)) {
            listener(ListenerEvent.ADDED);
        }

        return () => {
            unsubscribe();
            if (idListeners.size() === 0) container.idListeners.delete(id);
            this.removeRootIfPossible(container);
        }
    }

    removeRootIfPossible(container: IdContainer){
        if (container.listeners.size() === 0 && container.idListeners.size === 0 && container.ids.size === 0) {
            this.root.delete(container. rootId);
        }
    }


    addId(id: string, ...rootIds: string[]) {
        const rootId = this.makePath(...rootIds);
        const container = this.getOrCreateRoot(rootId);

        if (container.ids.has(id)) {
            container.listeners.forEach(listener => listener(id, ListenerEvent.MODIFIED));
        } else {
            container.ids.add(id);
            container.listeners.forEach(listener => listener(id, ListenerEvent.ADDED));
            if (container.idListeners.has(id)) {
                container.idListeners.get(id)!.forEach(listener => listener(ListenerEvent.ADDED));
            }

        }
        
    }

    removeId(id: string, ...rootIds: string[]) {
        const rootId = this.makePath(...rootIds);
        if (!this.root.has(rootId)) return;
        const container = this.root.get(rootId)!;

        if (!container.ids.has(id)) return;

        container.ids.delete(id);

        container.listeners.forEach(listener => listener(id, ListenerEvent.REMOVED));
        if (container.idListeners.has(id)) {
                container.idListeners.get(id)!.forEach(listener => listener(ListenerEvent.REMOVED));
        }

        this.removeRootIfPossible(container);      
        
    }    

    modifyId(id: string, ...rootIds: string[]) {
        const rootId = this.makePath(...rootIds);
        if (!this.root.has(rootId)) return;
        const container = this.root.get(rootId)!;

        if (!container.ids.has(id)) return;

        container.listeners.forEach(listener => listener(id, ListenerEvent.MODIFIED));
        if (container.idListeners.has(id)) {
                container.idListeners.get(id)!.forEach(listener => listener(ListenerEvent.MODIFIED));
        }
    }

}


export class ObservedMap<T> extends Map<string, T> {

    arrayListeners: DataListeners<Array<T>> = new DataListeners();
    idListeners: IdListeners = new IdListeners();

    addArrayListener(listener: DataListenerCallback<Array<T>>) {
        const unsubscribe = this.arrayListeners.addListener(listener);
        const array = this.getArray();
        listener(array);
        return unsubscribe;
    }

    addAnyIdListener(listener: AnyIdListenerCallback) {
        return this.idListeners.addListener(listener);
    }

    addIdListener(id: string, listener: IdListenerCallback) {
        return this.idListeners.addIdListener(id, listener);
    }


    private notifyArrayListeners() {
        const array = this.getArray();
        this.arrayListeners.forEach(listener => listener(array));
    }

    private getArray(): Array<T> {
        return Array.from(this.values());
    }

    set(id: string, data: T) {
        const idExisted = this.has(id);
        super.set(id, data);

        if (idExisted) {
            this.idListeners.modifyId(id);
        } else {
            this.idListeners.addId(id);
        }

        this.notifyArrayListeners();

        return this;

    }

    delete(id: string) {
        if (!this.has(id)) false;
        super.delete(id);
        this.idListeners.removeId(id);

        this.notifyArrayListeners();
        return true;
    }

    modify(id: string, data?: Object) {
        if (!this.has(id)) return;

        if (data) {
            super.set(id, Object.assign({}, this.get(id), data));
        }

        this.idListeners.modifyId(id);

        this.notifyArrayListeners();
    }

    clear() {
        const keys = Array.from(this.keys());
        super.clear();
        keys.forEach(id => this.idListeners.removeId(id));

        this.notifyArrayListeners();
    }

    
    
}



export class ObservedObject<T> {

    listeners: DataListeners<T | undefined> = new DataListeners;

    obj: T | null = null;

    constructor() {

    }

    async get(): Promise<T> {
        if (this.obj !== null && this.obj !== undefined) return this.obj;

        return new Promise((resolve, reject) => {

            const unsubscribe = this.listeners.addListener((obj: T | undefined) => {
                unsubscribe();
                if (obj === undefined) {
                    reject();
                } else {
                    resolve(obj);
                }

            })

        });
    }

    set(obj: T) {
        this.obj = obj;
        this.listeners.forEach(listener => listener(this.obj!));

    }

    fail() {
        this.listeners.forEach(listener => listener(undefined));
    }




}