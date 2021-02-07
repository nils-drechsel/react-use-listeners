export declare class ObservedPredicateMap<KEY, MAP_VALUE, PREDICATE_VALUE> {
    onAdded: (ids: Array<MAP_VALUE>) => void;
    onRemoved: (ids: Array<MAP_VALUE>) => void;
    map: Map<KEY, MAP_VALUE>;
    constructor(onAdded: (ids: Array<MAP_VALUE>) => void, onRemoved: (ids: Array<MAP_VALUE>) => void);
    refresh(data: Map<KEY, PREDICATE_VALUE>, createValue?: (value: PREDICATE_VALUE) => MAP_VALUE, addPredicate?: (value: PREDICATE_VALUE) => boolean, removePredicate?: (mapValue: MAP_VALUE, predicateValue: PREDICATE_VALUE) => boolean): void;
    values(): IterableIterator<MAP_VALUE>;
    keys(): IterableIterator<KEY>;
    forEach(callbackfn: (value: MAP_VALUE, key: KEY, map: Map<KEY, MAP_VALUE>) => void): void;
}
export declare class ObservedPredicateStringMap<MAP_VALUE, PREDICATE_VALUE> extends ObservedPredicateMap<string, MAP_VALUE, PREDICATE_VALUE> {
}
