import { AnyIdListenerCallback, DataListenerCallback, DataListeners, IdListenerCallback, IdListeners } from "./Listeners";

export class ObservedMap<T> extends Map<string, T> {

    arrayListeners: DataListeners<Array<T>> = new DataListeners();
    idListeners: IdListeners = new IdListeners();
    throwErrors: boolean;

    constructor(throwErrors: boolean = false) {
        super();
        this.throwErrors = throwErrors;
    }

    addArrayListener(listener: DataListenerCallback<Array<T>>) {
        const unsubscribe = this.arrayListeners.addListener(listener);
        const array = this.getArray();
        listener(array);
        return unsubscribe;
    }

    addAnyIdListener(listener: AnyIdListenerCallback) {
        return this.idListeners.addListener(listener);
    }

    addIdListener(id: string, listener: IdListenerCallback) {
        return this.idListeners.addIdListener(id, listener);
    }


    private notifyArrayListeners() {
        const array = this.getArray();
        this.arrayListeners.forEach(listener => listener(array));
    }

    private getArray(): Array<T> {
        return Array.from(this.values());
    }

    set(id: string, data: T) {
        const idExisted = this.has(id);
        super.set(id, data);

        if (idExisted) {
            this.idListeners.modifyId(id);
        } else {
            this.idListeners.addId(id);
        }

        this.notifyArrayListeners();

        return this;

    }

    delete(id: string) {
        if (!this.has(id)) return false;
        super.delete(id);
        this.idListeners.removeId(id);

        this.notifyArrayListeners();
        return true;
    }

    modify(id: string, data?: Object) {
        if (!this.has(id)) {
            if (this.throwErrors) {
                throw new Error("ObservedMap has no id: " + id + " while modifying");
            } else {
                return;
            }
        }

        if (data) {
            super.set(id, Object.assign({}, this.get(id), data));
        }

        this.idListeners.modifyId(id);

        this.notifyArrayListeners();
    }

    clear() {
        const keys = Array.from(this.keys());
        super.clear();
        keys.forEach(id => this.idListeners.removeId(id));

        this.notifyArrayListeners();
    }

    
    
}