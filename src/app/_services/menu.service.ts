import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Menu, MenuRequest } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class MenuService {
    private currentMenuSubject: BehaviorSubject<Menu>;
    public currentMenu: Observable<Menu>;

    constructor(private http: HttpClient) {
        this.currentMenuSubject = new BehaviorSubject<Menu>(JSON.parse(localStorage.getItem('currentMenu')));
        this.currentMenu = this.currentMenuSubject.asObservable();
    }

    public get currentMenuValue(): Menu {
        return this.currentMenuSubject.value;
    }

    GetMenu(userID: string, key: string, companyID: string) {
        console.log("BEFOR...");
        let menuRequest = new MenuRequest();
        menuRequest.CompanyID = companyID;
        menuRequest.Key = key;
        menuRequest.UserID = userID;
        let menuRequestString = JSON.stringify(menuRequest);
        return this.http.post<any>(`http://35.200.254.194/PIC.V2/Services/PIC.Services/PIController.svc/BMGetUserMenuModules2`, 
        JSON.parse(menuRequestString))
            .pipe(map(menu => {
                console.log("POST IN...");
                if (menu) {
                    console.log("Menu IN...");
                    console.log(menu);
                    localStorage.setItem('currentMenu', JSON.stringify(menu));
                    this.currentMenuSubject.next(menu);
                }

                return menu;
            }));
    }

    ClearMenu() {
        localStorage.removeItem('currentMenu');
        this.currentMenuSubject.next(null);
    }
}