import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Menu, MenuRequest } from '@app/_models';
import { ENDPOINTS } from '../_constants/endpoints'; // TODO: User @

@Injectable({ providedIn: 'root' })
export class MenuService {
    private currentMenuSubject: BehaviorSubject<Menu>;
    public currentMenu: Observable<Menu>;

    constructor(private http: HttpClient) {
        this.currentMenuSubject = new BehaviorSubject<Menu>(JSON.parse(localStorage.getItem('currentMenu')));
        this.currentMenu = this.currentMenuSubject.asObservable();
    }

    public get currentMenuValue(): Menu {
        return this.currentMenuSubject.getValue();
    }

    getMenu(userID: string, key: string, companyID: string) {
        let menuRequest = new MenuRequest();
        menuRequest.CompanyID = companyID;
        menuRequest.Key = key;
        menuRequest.UserID = userID;
        let menuRequestString = JSON.stringify(menuRequest);
        //JSON.parse(menuRequestString)
        return this.http.post<any>(ENDPOINTS.menu, 
        {"CompanyID": companyID, "Key": key, "UserID": userID})
            .pipe(map(menu => {
                if (menu) {
                    localStorage.setItem('currentMenu', JSON.stringify(menu));
                    this.currentMenuSubject.next(menu);
                }

                return menu;
            }));
    }

    clearMenu() {
        localStorage.removeItem('currentMenu');
        this.currentMenuSubject.next(null);
    }
}