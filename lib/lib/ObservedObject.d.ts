import { DataListeners } from "./Listeners";
export declare class ObservedObject<T> {
    listeners: DataListeners<T | undefined>;
    obj: T | null;
    constructor();
    get(): Promise<T>;
    set(obj: T): void;
    fail(): void;
}
