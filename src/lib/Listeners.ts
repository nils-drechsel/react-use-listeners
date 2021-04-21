
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

export interface AnyListenerCallback {
    (event: ListenerEvent, ...ids: string[]): void
}

export interface AnySubIdListenerCallback {
    (id: string, subId: string, event: ListenerEvent): void
}

export interface IdListenerCallback {
    (event: ListenerEvent): void
}


export class IdListeners {

    root: Map<string, IdContainer> = new Map();
    anyListeners: Listeners<(event: ListenerEvent, ...ids: string[]) => void> = new Listeners();


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

    addAnyListener(listener: AnyListenerCallback) {
        return this.anyListeners.addListener(listener);
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
            this.anyListeners.getCallbacks().forEach(listener => listener(ListenerEvent.MODIFIED, ...rootIds, id));
        } else {
            container.ids.add(id);
            container.listeners.forEach(listener => listener(id, ListenerEvent.ADDED));
            if (container.idListeners.has(id)) {
                container.idListeners.get(id)!.forEach(listener => listener(ListenerEvent.ADDED));
            }
            this.anyListeners.getCallbacks().forEach(listener => listener(ListenerEvent.ADDED, ...rootIds, id));
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
        this.anyListeners.getCallbacks().forEach(listener => listener(ListenerEvent.REMOVED, ...rootIds, id));

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
        this.anyListeners.getCallbacks().forEach(listener => listener(ListenerEvent.MODIFIED, ...rootIds, id));
    }

}
