import { MenuResponseObject } from './menuResponseObject'
import { MenuResponseObjectMod } from './menuResponseObjectMod'

export class Menu {
    responseCode: string;
    responseMessage: String;
    responseObject: MenuResponseObject[];
    responseObjectMod: MenuResponseObjectMod[];
}
