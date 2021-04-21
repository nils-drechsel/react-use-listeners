import { PlainContent } from "../interfaces/ObservedPlainMapMap";
import { ObservedPlainMapMapImpl } from "./ObservedPlainMapMapImpl";


export class ObservedMapSetImpl extends ObservedPlainMapMapImpl<PlainContent> {

    initSub(id: string, subId: string) {
        super.setSub(id, subId, {});
    }

}