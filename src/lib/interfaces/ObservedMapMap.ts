import { SubIdListenerCallback, UnsubscribeCallback } from "../Listeners";

export interface ObservedMapMap<CONTENT> {
    addSubIdListener(id: string, subId: string, listener: SubIdListenerCallback): UnsubscribeCallback;
    addAnySubIdListener(id: string, listener: SubIdListenerCallback): UnsubscribeCallback;
    addAnyListener(listener: SubIdListenerCallback): UnsubscribeCallback;
    has(id: string): boolean;
    hasSub(id: string, subId: string): boolean;
    getSub(id: string, subId: string): CONTENT | undefined;
    getSubIds(id: string): Set<string>;
    forEachSub(id: string, callback: (value: CONTENT, key: string) => void): void;
    awaitForEachSub(id: string, callback: (value: CONTENT, key: string) => Promise<void>): void;
    keys(): IterableIterator<string>;
    keysSub(id: string): IterableIterator<string>;
    valuesSub(id: string): IterableIterator<CONTENT>;
    sizeSub(id: string): number;
    setSub(id: string, subId: string, data: CONTENT): void;
    delete(id: string): void;
    deleteSub(id: string, subId: string): void;
    modifySub(id: string, subId: string, data?: Object): void;
}
