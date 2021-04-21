import { AnyIdListenerCallback, AnySubIdListenerCallback, IdListenerCallback, UnsubscribeCallback } from "../Listeners";
import { ObservedMap } from "./ObservedMap";
export interface ObservedMapMap<CONTENT, SUB_CONTENT> extends ObservedMap<CONTENT> {
    addAnyListener(listener: AnySubIdListenerCallback): UnsubscribeCallback;
    addAnySubIdListener(id: string, listener: AnyIdListenerCallback): UnsubscribeCallback;
    addSubIdListener(id: string, subId: string, listener: IdListenerCallback): UnsubscribeCallback;
    hasSub(id: string, subId: string): boolean;
    getMap(id: string): Map<string, SUB_CONTENT> | undefined;
    getSub(id: string, subId: string): SUB_CONTENT | undefined;
    forEachSub(id: string, callback: (value: SUB_CONTENT, key: string) => void): void;
    awaitForEachSub(id: string, callback: (value: SUB_CONTENT, key: string) => Promise<void>): void;
    keysSub(id: string): IterableIterator<string>;
    valuesSub(id: string): IterableIterator<SUB_CONTENT>;
    sizeSub(id: string): number;
    setSub(id: string, subId: string, data: SUB_CONTENT): void;
    deleteSub(id: string, subId: string): void;
    modifySub(id: string, subId: string, data?: Object): void;
    clearSub(id: string): void;
}
