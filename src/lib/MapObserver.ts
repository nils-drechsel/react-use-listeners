


export class MapObserver<KEY, MAP_VALUE, PREDICATE_VALUE> {

    onAdded: (ids: Array<MAP_VALUE>) => void;
    onRemoved: (ids: Array<MAP_VALUE>) => void;

    map: Map<KEY, MAP_VALUE> = new Map();


    constructor(onAdded: (ids: Array<MAP_VALUE>) => void, onRemoved: (ids: Array<MAP_VALUE>) => void) {
        this.onAdded = onAdded;
        this.onRemoved = onRemoved;
    }

    refresh(data: Map<KEY, PREDICATE_VALUE>, createValue?: (value: PREDICATE_VALUE) => MAP_VALUE, addPredicate?: (value: PREDICATE_VALUE) => boolean, removePredicate?: (mapValue: MAP_VALUE, predicateValue: PREDICATE_VALUE) => boolean) {
        const newValues: Array<MAP_VALUE> = [];
        const obsoleteValues: Array<MAP_VALUE> = [];

        data.forEach((value, key) => {
            if (!this.map.has(key)) {
                if (!addPredicate || addPredicate(value)) {
                    if (!createValue) {
                        const v = value as any as MAP_VALUE;
                        this.map.set(key, v);
                        newValues.push(v);
                    } else {
                        const v = createValue(value);
                        this.map.set(key, v);
                        newValues.push(v);
                    }
                }
            } else {
                if (!removePredicate || removePredicate(this.map.get(key)!, value)) {
                    const v = this.map.get(key)!;
                    this.map.delete(key);
                    obsoleteValues.push(v);
                }
            }
        });
            
        this.map.forEach((_value, key) => {
            if (!data.has(key)) {
                    const v = this.map.get(key)!;
                    this.map.delete(key);
                    obsoleteValues.push(v);
            } else {

            }
        })

        if (newValues.length > 0) this.onAdded(newValues);

        if (obsoleteValues.length > 0) this.onRemoved(obsoleteValues);
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