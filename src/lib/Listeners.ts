export interface UnsubscribeCallback {
    (): void;
}

export enum ListenerEvent {
    ADDED,
    REMOVED,
    MODIFIED,
}

export interface IdListenerCallback {
    (id: string, event: ListenerEvent): void;
}

export interface SubIdListenerCallback {
    (id: string, subId: string, event: ListenerEvent): void;
}

export class Unsubscribers<T> {
    items: Map<number, T> = new Map();
    cnt = 0;

    add(item: T): UnsubscribeCallback {
        const id = this.cnt++;
        this.items.set(id, item);
        return () => {
            this.items.delete(id);
        };
    }

    forEach(callback: (item: T) => void): void {
        this.items.forEach((item) => callback(item));
    }

    isEmpty(): boolean {
        return this.items.size === 0;
    }
}

export class AnyIdListeners {
    listeners: Unsubscribers<IdListenerCallback> = new Unsubscribers();
    cnt = 0;

    addListener(listener: IdListenerCallback): UnsubscribeCallback {
        return this.listeners.add(listener);
    }

    notify(id: string, event: ListenerEvent) {
        this.listeners.forEach((listener) => listener(id, event));
    }

    add(id: string): void {
        this.notify(id, ListenerEvent.ADDED);
    }

    modify(id: string): void {
        this.notify(id, ListenerEvent.MODIFIED);
    }

    delete(id: string): void {
        this.notify(id, ListenerEvent.REMOVED);
    }

    isEmpty(): boolean {
        return this.listeners.isEmpty();
    }
}

export class IdListeners {
    listeners: Map<string, Unsubscribers<IdListenerCallback>> = new Map();

    addListener(id: string, listener: IdListenerCallback): UnsubscribeCallback {
        if (!this.listeners.has(id)) {
            this.listeners.set(id, new Unsubscribers());
        }
        const listeners = this.listeners.get(id)!;
        const unsubscribe = listeners.add(listener);

        return () => {
            unsubscribe();
            const map = this.listeners.get(id);
            if (map && map.isEmpty()) this.listeners.delete(id);
        };
    }

    notify(id: string, event: ListenerEvent) {
        if (!this.listeners.has(id)) return;
        this.listeners.get(id)!.forEach((listener) => listener(id, event));
    }

    add(id: string): void {
        this.notify(id, ListenerEvent.ADDED);
    }

    modify(id: string): void {
        this.notify(id, ListenerEvent.MODIFIED);
    }

    delete(id: string): void {
        this.notify(id, ListenerEvent.REMOVED);
    }

    isEmpty(): boolean {
        return this.listeners.size === 0;
    }

    isEmptyId(id: string): boolean {
        return !this.listeners.has(id);
    }
}

export class SubIdListeners {
    listeners: Map<string, Map<string, Unsubscribers<SubIdListenerCallback>>> = new Map();

    addListener(id: string, subId: string, listener: SubIdListenerCallback): UnsubscribeCallback {
        if (!this.listeners.has(id)) {
            this.listeners.set(id, new Map());
        }

        const subListeners = this.listeners.get(id)!;

        if (!subListeners.has(subId)) {
            subListeners.set(subId, new Unsubscribers());
        }

        const listeners = subListeners.get(subId)!;

        const unsubscribe = listeners.add(listener);

        return () => {
            unsubscribe();
            const map = this.listeners.get(id);
            if (!map) return;
            if (map.get(subId)!.isEmpty()) map.delete(id);
            if (map.size === 0) this.listeners.delete(id);
        };
    }

    notify(id: string, subId: string, event: ListenerEvent) {
        if (!this.listeners.has(id)) return;
        const subListeners = this.listeners.get(id)!;
        if (!subListeners.has(subId)) return;
        subListeners.get(subId)!.forEach((listener) => listener(id, subId, event));
    }

    add(id: string, subId: string): void {
        this.notify(id, subId, ListenerEvent.ADDED);
    }

    modify(id: string, subId: string): void {
        this.notify(id, subId, ListenerEvent.MODIFIED);
    }

    delete(id: string, subId: string): void {
        this.notify(id, subId, ListenerEvent.REMOVED);
    }

    isEmpty(): boolean {
        return this.listeners.size === 0;
    }

    isEmptyId(id: string): boolean {
        return !this.listeners.has(id);
    }

    isEmptySubId(id: string, subId: string): boolean {
        return !this.listeners.has(id) || !this.listeners.get(id)!.has(subId);
    }
}

export class AnySubIdListeners {
    listeners: Map<string, Unsubscribers<SubIdListenerCallback>> = new Map();

    addListener(id: string, listener: SubIdListenerCallback): UnsubscribeCallback {
        if (!this.listeners.has(id)) {
            this.listeners.set(id, new Unsubscribers());
        }

        const listeners = this.listeners.get(id)!;

        const unsubscribe = listeners.add(listener);

        return () => {
            unsubscribe();
            const map = this.listeners.get(id);
            if (map && map.isEmpty()) this.listeners.delete(id);
        };
    }

    notify(id: string, subId: string, event: ListenerEvent) {
        if (!this.listeners.has(id)) return;
        this.listeners.get(id)!.forEach((listener) => listener(id, subId, event));
    }

    add(id: string, subId: string): void {
        this.notify(id, subId, ListenerEvent.ADDED);
    }

    modify(id: string, subId: string): void {
        this.notify(id, subId, ListenerEvent.MODIFIED);
    }

    delete(id: string, subId: string): void {
        this.notify(id, subId, ListenerEvent.REMOVED);
    }

    isEmpty(): boolean {
        return this.listeners.size === 0;
    }

    isEmptyId(id: string): boolean {
        return !this.listeners.has(id);
    }
}

export class AnyListeners {
    listeners: Unsubscribers<SubIdListenerCallback> = new Unsubscribers();

    addListener(listener: SubIdListenerCallback): UnsubscribeCallback {
        const unsubscribe = this.listeners.add(listener);

        return () => {
            unsubscribe();
        };
    }

    notify(id: string, subId: string, event: ListenerEvent) {
        this.listeners.forEach((listener) => listener(id, subId, event));
    }

    add(id: string, subId: string): void {
        this.notify(id, subId, ListenerEvent.ADDED);
    }

    modify(id: string, subId: string): void {
        this.notify(id, subId, ListenerEvent.MODIFIED);
    }

    delete(id: string, subId: string): void {
        this.notify(id, subId, ListenerEvent.REMOVED);
    }

    isEmpty(): boolean {
        return this.listeners.isEmpty();
    }
}
