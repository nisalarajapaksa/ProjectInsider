import { menuResponseObject } from './menuResponseObject'
import { menuResponseObjectMod } from './menuResponseObjectMod'

export class Menu {
    responseCode: string;
    responseMessage: String;
    responseObject: menuResponseObject[];
    responseObjectMod: menuResponseObjectMod[];
}
