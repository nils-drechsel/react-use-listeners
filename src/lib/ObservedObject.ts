import { DataListeners } from "./Listeners";

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