


export class MapObserver<KEY, MAP_VALUE, PREDICATE_VALUE> {

    onAdded: (ids: Set<KEY>) => void;
    onRemoved: (ids: Set<KEY>) => void;

    map: Map<KEY, MAP_VALUE> = new Map();


    constructor(onAdded: (ids: Set<KEY>) => void, onRemoved: (ids: Set<KEY>) => void) {
        this.onAdded = onAdded;
        this.onRemoved = onRemoved;
    }

    refresh(data: Map<KEY, PREDICATE_VALUE>, createValue?: (value: PREDICATE_VALUE) => MAP_VALUE, addPredicate?: (value: PREDICATE_VALUE) => boolean, removePredicate?: (mapValue: MAP_VALUE, predicateValue: PREDICATE_VALUE) => boolean) {
        const newIds: Set<KEY> = new Set();
        const obsoleteIds: Set<KEY> = new Set();

        data.forEach((value, key) => {
            if (!this.map.has(key)) {
                if (!addPredicate || addPredicate(value)) {
                    if (!createValue) {
                        this.map.set(key, value as any as MAP_VALUE);
                    } else {
                        this.map.set(key, createValue(value));
                    }
                    newIds.add(key);
                }
            } else {
                if (!removePredicate || removePredicate(this.map.get(key)!, value)) {
                    this.map.delete(key);
                    obsoleteIds.add(key);
                }
            }
        });
            
        this.map.forEach((_value, key) => {
            if (!data.has(key)) {
                    this.map.delete(key);
                    obsoleteIds.add(key);
            } else {

            }
        })

        if (newIds.size > 0) this.onAdded(newIds);

        if (obsoleteIds.size > 0) this.onRemoved(obsoleteIds);
    }

    values(): IterableIterator<MAP_VALUE> { 
        return this.map.values();
    }

    keys(): IterableIterator<KEY> {
        return this.map.keys();
    }

    forEach(callbackfn: (value: MAP_VALUE, key: KEY, map: Map<KEY, MAP_VALUE>) => void) {
        this.map.forEach(callbackfn);
    }

}


export class StringMapObserver<MAP_VALUE, PREDICATE_VALUE> extends MapObserver<string, MAP_VALUE, PREDICATE_VALUE> {
    
}