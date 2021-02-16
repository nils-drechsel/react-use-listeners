import { AnyIdListenerCallback, IdListenerCallback, IdListeners } from "./Listeners";
interface MapMapContent<CONTENT, SUB_CONTENT> {
    content: CONTENT;
    map: Map<string, SUB_CONTENT>;
}
export declare class ObservedMapMap<CONTENT, SUB_CONTENT> {
    rootMap: Map<string, MapMapContent<CONTENT, SUB_CONTENT>>;
    idListeners: IdListeners;
    throwErrors: boolean;
    constructor(throwErrors?: boolean);
    addAnyIdListener(listener: AnyIdListenerCallback): () => void;
    addIdListener(id: string, listener: IdListenerCallback): () => void;
    addAnySubIdListener(id: string, listener: AnyIdListenerCallback): () => void;
    addSubIdListener(id: string, subId: string, listener: IdListenerCallback): () => void;
    has(id: string): boolean;
    hasSub(id: string, subId: string): boolean;
    get(id: string): CONTENT | undefined;
    getSub(id: string, subId: string): SUB_CONTENT | undefined;
    forEach(callback: (value: CONTENT, key: string) => void): void;
    forEachSub(id: string, callback: (value: SUB_CONTENT, key: string) => void): void;
    keys(): IterableIterator<string>;
    keysSub(id: string): IterableIterator<string> | never[];
    values(): CONTENT[];
    valuesSub(id: string): never[] | IterableIterator<SUB_CONTENT>;
    size(): number;
    sizeSub(id: string): number;
    set(id: string, data: CONTENT): this;
    setSub(id: string, subId: string, data: SUB_CONTENT): this | undefined;
    delete(id: string): boolean;
    deleteSub(id: string, subId: string): boolean;
    modify(id: string, data?: Object): void;
    modifySub(id: string, subId: string, data?: Object): void;
    clear(): void;
    clearSub(id: string): void;
}
export {};
