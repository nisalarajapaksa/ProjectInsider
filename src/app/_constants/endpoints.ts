import { environment } from '@environments/environment';

export class ENDPOINTS {

    public static readonly apiURL: string = `${environment.apiUrl}/${environment.apiVersion}/Services/`;
    public static readonly apiServices: string = ENDPOINTS.apiURL + '/Services/';

    public static readonly login: string = ENDPOINTS.apiServices + 'PIC.Services/PIController.svc/BMValidateUser';

}