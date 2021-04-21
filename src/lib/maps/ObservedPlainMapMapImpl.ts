import { PlainContent } from "../interfaces/ObservedPlainMapMap";
import { ObservedMapMapImpl } from "./ObservedMapMapImpl";


export class ObservedPlainMapMapImpl<CONTENT> extends ObservedMapMapImpl<PlainContent, CONTENT> {


    init(id: string) {
        if (this.has(id)) return;
        super.set(id, {});
    }


}