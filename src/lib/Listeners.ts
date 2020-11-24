
export interface UnsubscribeCallback {
    (): void;
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

}

